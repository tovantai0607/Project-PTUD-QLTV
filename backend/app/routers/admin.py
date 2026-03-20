from typing import List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import func
from app.database import get_db
from app.models.user import User
from app.schemas.user import UserCreate, UserResponse
# Giả định đã có model Book và BorrowRecord từ các thành viên khác
#Tạo Router cho Thành viên 4

router = APIRouter(prefix="/admin", tags=["admin"])

@router.post("/users", response_model=UserResponse)
def create_user(payload: UserCreate, db: Session = Depends(get_db)):
    # Trong thực tế cần hash password ở đây
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

@router.get("/users", response_model=List[UserResponse])
def list_users(db: Session = Depends(get_db)):
    return db.query(User).all()

@router.get("/reports/top-books")
def get_top_books(db: Session = Depends(get_db)):
    # Logic: Join bảng Books và BorrowRecords để đếm (Thành viên 4 cần phối hợp với TV 2, 3)
    return [{"book_name": "Lập trình Python", "borrow_count": 50}]

@router.get("/reports/unreturned")
def get_unreturned(db: Session = Depends(get_db)):
    # Logic: Tìm các phiếu mượn chưa có ngày trả
    return [{"reader_name": "Nguyễn Văn A", "book_name": "Data Science", "days_overdue": 5}]