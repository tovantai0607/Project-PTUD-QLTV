from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from datetime import date

# Import từ các file book.py mình vừa tạo ở bước 1 và 2
from app.models.book import Category, Book, BookCopy
from app.schemas.book import CategoryCreate, CategoryOut, BookCreate, BookOut, BookUpdate
from app.database import get_db 

router = APIRouter(tags=["Quản lý Sách"])

@router.post("/categories", response_model=CategoryOut)
def create_category(category: CategoryCreate, db: Session = Depends(get_db)):
    db_category = Category(**category.dict())
    db.add(db_category)
    db.commit()
    db.refresh(db_category)
    return db_category

@router.get("/categories", response_model=List[CategoryOut])
def get_categories(db: Session = Depends(get_db)):
    return db.query(Category).all()

@router.post("/books", response_model=BookOut)
def create_book(book: BookCreate, db: Session = Depends(get_db)):
    db_category = db.query(Category).filter(Category.id == book.category_id).first()
    if not db_category:
        raise HTTPException(status_code=404, detail="Không tìm thấy chuyên ngành")

    db_book = Book(**book.dict())
    db.add(db_book)
    db.commit()
    db.refresh(db_book)

    today_str = date.today().strftime("%Y-%m-%d")
    for i in range(db_book.total_quantity):
        copy_code = f"B{db_book.id}-{i+1:02d}"
        new_copy = BookCopy(
            book_id=db_book.id,
            copy_code=copy_code,
            status="Có sẵn",
            import_date=today_str
        )
        db.add(new_copy)
    
    db.commit()
    db.refresh(db_book)
    return db_book

@router.get("/books", response_model=List[BookOut])
def get_books(db: Session = Depends(get_db)):
    return db.query(Book).all()

@router.put("/books/{book_id}", response_model=BookOut)
def update_book(book_id: int, book_update: BookUpdate, db: Session = Depends(get_db)):
    db_book = db.query(Book).filter(Book.id == book_id).first()
    if not db_book:
        raise HTTPException(status_code=404, detail="Không tìm thấy sách")
    
    update_data = book_update.dict(exclude_unset=True)
    for key, value in update_data.items():
        setattr(db_book, key, value)
        
    db.commit()
    db.refresh(db_book)
    return db_book

@router.delete("/books/{book_id}")
def delete_book(book_id: int, db: Session = Depends(get_db)):
    db_book = db.query(Book).filter(Book.id == book_id).first()
    if not db_book:
        raise HTTPException(status_code=404, detail="Không tìm thấy sách")
    
    db.delete(db_book)
    db.commit()
    return {"message": "Đã xóa sách và các bản sao thành công"}