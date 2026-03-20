import datetime

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import func
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.book import Book, BookCopy
from app.models.borrow import BorrowRecord
from app.models.reader import Reader
from app.models.user import User
from app.schemas.user import TopBookReport, UnreturnedReaderReport, UserCreate, UserResponse

router = APIRouter(prefix="/admin", tags=["admin"])


@router.get("/users", response_model=list[UserResponse])
def list_users(db: Session = Depends(get_db)):
    return db.query(User).order_by(User.id.desc()).all()


@router.post("/users", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
def create_user(payload: UserCreate, db: Session = Depends(get_db)):
    existing_user = db.query(User).filter(User.username == payload.username).first()
    if existing_user:
        raise HTTPException(status_code=400, detail="Tên đăng nhập đã tồn tại")

    user = User(
        username=payload.username,
        hashed_password=payload.password,
        full_name=payload.full_name,
        role=payload.role,
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    return user


@router.get("/reports/top-books", response_model=list[TopBookReport])
def get_top_books(db: Session = Depends(get_db)):
    rows = (
        db.query(
            Book.title.label("book_name"),
            func.count(BorrowRecord.id).label("borrow_count"),
        )
        .join(BookCopy, BookCopy.book_id == Book.id)
        .join(BorrowRecord, BorrowRecord.book_copy_id == BookCopy.id)
        .group_by(Book.id, Book.title)
        .order_by(func.count(BorrowRecord.id).desc(), Book.title.asc())
        .limit(10)
        .all()
    )
    return [{"book_name": row.book_name, "borrow_count": row.borrow_count} for row in rows]


@router.get("/reports/unreturned", response_model=list[UnreturnedReaderReport])
def get_unreturned(db: Session = Depends(get_db)):
    today = datetime.date.today()
    rows = (
        db.query(
            BorrowRecord,
            Reader.full_name.label("reader_name"),
            Book.title.label("book_name"),
            BookCopy.copy_code.label("copy_code"),
        )
        .join(Reader, Reader.id == BorrowRecord.reader_id)
        .join(BookCopy, BookCopy.id == BorrowRecord.book_copy_id)
        .join(Book, Book.id == BookCopy.book_id)
        .filter(BorrowRecord.status == "Đang mượn")
        .order_by(BorrowRecord.borrow_date.asc(), BorrowRecord.id.asc())
        .all()
    )

    reports = []
    for record, reader_name, book_name, copy_code in rows:
        due_date = record.due_date or (record.borrow_date + datetime.timedelta(days=7))
        days_overdue = max((today - due_date).days, 0)
        reports.append(
            {
                "reader_name": reader_name,
                "book_name": book_name,
                "copy_code": copy_code,
                "borrow_date": record.borrow_date,
                "due_date": due_date,
                "days_overdue": days_overdue,
            }
        )

    return reports
