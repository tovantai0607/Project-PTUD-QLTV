from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.borrow import BorrowRecord
import datetime

router = APIRouter(prefix="/borrow-system", tags=["Mượn trả sách"])

@router.post("/borrow") # API mượn sách [cite: 113]
def borrow_book(reader_id: int, book_copy_id: int, db: Session = Depends(get_db)):
    # Kiểm tra quy tắc: mỗi độc giả chỉ được mượn 1 sách [cite: 107]
    has_borrowed = db.query(BorrowRecord).filter(
        BorrowRecord.reader_id == reader_id, 
        BorrowRecord.status == "Đang mượn"
    ).first()
    
    if has_borrowed:
        raise HTTPException(status_code=400, detail="Độc giả này đang mượn sách, không thể mượn thêm!") 

    new_loan = BorrowRecord(reader_id=reader_id, book_copy_id=book_copy_id)
    db.add(new_loan)
    db.commit()
    return {"message": "Mượn sách thành công"}

@router.post("/return/{record_id}") # API trả sách [cite: 114]
def return_book(record_id: int, db: Session = Depends(get_db)):
    loan = db.query(BorrowRecord).filter(BorrowRecord.id == record_id).first()
    if not loan:
        raise HTTPException(status_code=404, detail="Không tìm thấy phiếu mượn")
    
    loan.status = "Đã trả"
    loan.return_date = datetime.date.today()
    db.commit()
    return {"message": "Đã trả sách thành công"} 

@router.get("/borrowed") # API danh sách đang mượn [cite: 115]
def list_borrowed(db: Session = Depends(get_db)):
    return db.query(BorrowRecord).filter(BorrowRecord.status == "Đang mượn").all()