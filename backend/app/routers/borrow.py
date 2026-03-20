import datetime

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.book import Book, BookCopy
from app.models.borrow import BorrowRecord
from app.models.reader import Reader
from app.schemas.borrow import AvailableBookCopyResponse, BorrowedRecordResponse

router = APIRouter(prefix="/borrow-system", tags=["Mượn trả sách"])

AVAILABLE_STATUS = "Có sẵn"
BORROWING_STATUS = "Đang mượn"
RETURNED_STATUS = "Đã trả"
DEFAULT_BORROW_DAYS = 7


def normalize_due_date(record: BorrowRecord) -> datetime.date:
    return record.due_date or (record.borrow_date + datetime.timedelta(days=DEFAULT_BORROW_DAYS))


def serialize_borrow_record(record: BorrowRecord, reader_name: str, copy_code: str, book_title: str):
    return {
        "id": record.id,
        "reader_id": record.reader_id,
        "reader_name": reader_name,
        "book_copy_id": record.book_copy_id,
        "copy_code": copy_code,
        "book_title": book_title,
        "borrow_date": record.borrow_date,
        "due_date": normalize_due_date(record),
        "status": record.status,
    }


@router.get("/available-copies", response_model=list[AvailableBookCopyResponse])
def list_available_copies(db: Session = Depends(get_db)):
    rows = (
        db.query(BookCopy, Book)
        .join(Book, Book.id == BookCopy.book_id)
        .filter(BookCopy.status == AVAILABLE_STATUS)
        .order_by(Book.title.asc(), BookCopy.copy_code.asc())
        .all()
    )
    return [
        {
            "id": copy.id,
            "copy_code": copy.copy_code,
            "book_title": book.title,
        }
        for copy, book in rows
    ]


@router.post("/borrow")
def borrow_book(reader_id: int, book_copy_id: int, db: Session = Depends(get_db)):
    reader = db.query(Reader).filter(Reader.id == reader_id).first()
    if not reader:
        raise HTTPException(status_code=404, detail="Không tìm thấy độc giả")

    book_copy = db.query(BookCopy).filter(BookCopy.id == book_copy_id).first()
    if not book_copy:
        raise HTTPException(status_code=404, detail="Không tìm thấy bản sao sách")

    if book_copy.status != AVAILABLE_STATUS:
        raise HTTPException(status_code=400, detail="Bản sao sách này hiện không sẵn sàng để mượn")

    has_borrowed = db.query(BorrowRecord).filter(
        BorrowRecord.reader_id == reader_id,
        BorrowRecord.status == BORROWING_STATUS,
    ).first()

    if has_borrowed:
        raise HTTPException(status_code=400, detail="Độc giả này đang mượn sách, không thể mượn thêm")

    borrow_date = datetime.date.today()
    new_loan = BorrowRecord(
        reader_id=reader_id,
        book_copy_id=book_copy_id,
        borrow_date=borrow_date,
        due_date=borrow_date + datetime.timedelta(days=DEFAULT_BORROW_DAYS),
        status=BORROWING_STATUS,
    )
    db.add(new_loan)
    book_copy.status = BORROWING_STATUS
    db.commit()
    db.refresh(new_loan)
    return {"message": "Mượn sách thành công", "record_id": new_loan.id}


@router.post("/return/{record_id}")
def return_book(record_id: int, db: Session = Depends(get_db)):
    loan = db.query(BorrowRecord).filter(BorrowRecord.id == record_id).first()
    if not loan:
        raise HTTPException(status_code=404, detail="Không tìm thấy phiếu mượn")

    if loan.status == RETURNED_STATUS:
        raise HTTPException(status_code=400, detail="Phiếu mượn này đã được trả trước đó")

    book_copy = db.query(BookCopy).filter(BookCopy.id == loan.book_copy_id).first()
    if book_copy:
        book_copy.status = AVAILABLE_STATUS

    loan.status = RETURNED_STATUS
    loan.return_date = datetime.date.today()
    db.commit()
    return {"message": "Đã trả sách thành công"}


@router.get("/borrowed", response_model=list[BorrowedRecordResponse])
def list_borrowed(db: Session = Depends(get_db)):
    rows = (
        db.query(BorrowRecord, Reader.full_name, BookCopy.copy_code, Book.title)
        .join(Reader, Reader.id == BorrowRecord.reader_id)
        .join(BookCopy, BookCopy.id == BorrowRecord.book_copy_id)
        .join(Book, Book.id == BookCopy.book_id)
        .filter(BorrowRecord.status == BORROWING_STATUS)
        .order_by(BorrowRecord.borrow_date.desc(), BorrowRecord.id.desc())
        .all()
    )
    return [
        serialize_borrow_record(record, reader_name, copy_code, book_title)
        for record, reader_name, copy_code, book_title in rows
    ]
