from datetime import date
from typing import List

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session, selectinload

from app.database import get_db
from app.models.book import Category, Book, BookCopy
from app.schemas.book import CategoryCreate, CategoryOut, BookCreate, BookOut, BookUpdate

router = APIRouter(tags=["Quản lý sách"])


def get_book_query(db: Session):
    return db.query(Book).options(selectinload(Book.category), selectinload(Book.copies))


@router.post("/categories", response_model=CategoryOut, status_code=status.HTTP_201_CREATED)
def create_category(category: CategoryCreate, db: Session = Depends(get_db)):
    existing_category = db.query(Category).filter(Category.name == category.name.strip()).first()
    if existing_category:
        raise HTTPException(status_code=400, detail="Chuyên ngành đã tồn tại")

    db_category = Category(**category.model_dump())
    db.add(db_category)
    db.commit()
    db.refresh(db_category)
    return db_category


@router.get("/categories", response_model=List[CategoryOut])
def get_categories(db: Session = Depends(get_db)):
    return db.query(Category).order_by(Category.name.asc()).all()


@router.post("/books", response_model=BookOut, status_code=status.HTTP_201_CREATED)
def create_book(book: BookCreate, db: Session = Depends(get_db)):
    db_category = db.query(Category).filter(Category.id == book.category_id).first()
    if not db_category:
        raise HTTPException(status_code=404, detail="Không tìm thấy chuyên ngành")

    db_book = Book(**book.model_dump())
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
    return get_book_query(db).filter(Book.id == db_book.id).first()


@router.get("/books", response_model=List[BookOut])
def get_books(db: Session = Depends(get_db)):
    return get_book_query(db).order_by(Book.id.desc()).all()


@router.get("/books/{book_id}", response_model=BookOut)
def get_book(book_id: int, db: Session = Depends(get_db)):
    db_book = get_book_query(db).filter(Book.id == book_id).first()
    if not db_book:
        raise HTTPException(status_code=404, detail="Không tìm thấy sách")
    return db_book


@router.put("/books/{book_id}", response_model=BookOut)
def update_book(book_id: int, book_update: BookUpdate, db: Session = Depends(get_db)):
    db_book = db.query(Book).filter(Book.id == book_id).first()
    if not db_book:
        raise HTTPException(status_code=404, detail="Không tìm thấy sách")

    update_data = book_update.model_dump(exclude_unset=True)
    if "category_id" in update_data:
        db_category = db.query(Category).filter(Category.id == update_data["category_id"]).first()
        if not db_category:
            raise HTTPException(status_code=404, detail="Không tìm thấy chuyên ngành")

    for key, value in update_data.items():
        setattr(db_book, key, value)

    db.commit()
    return get_book_query(db).filter(Book.id == book_id).first()


@router.delete("/books/{book_id}")
def delete_book(book_id: int, db: Session = Depends(get_db)):
    db_book = db.query(Book).filter(Book.id == book_id).first()
    if not db_book:
        raise HTTPException(status_code=404, detail="Không tìm thấy sách")

    db.delete(db_book)
    db.commit()
    return {"message": "Đã xóa sách và các bản sao thành công"}
