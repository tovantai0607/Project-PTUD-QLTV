from pydantic import BaseModel, ConfigDict
from typing import List, Optional

# --- CATEGORY SCHEMAS ---
class CategoryBase(BaseModel):
    name: str
    description: Optional[str] = None

class CategoryCreate(CategoryBase):
    pass

class CategoryOut(CategoryBase):
    model_config = ConfigDict(from_attributes=True)
    id: int

# --- BOOK COPY SCHEMAS ---
class BookCopyOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: int
    book_id: int
    copy_code: str
    status: str
    import_date: str

# --- BOOK SCHEMAS ---
class BookBase(BaseModel):
    title: str
    publisher: str
    pages: int
    size: str
    author: str
    total_quantity: int
    category_id: int

class BookCreate(BookBase):
    pass

class BookUpdate(BaseModel):
    title: Optional[str] = None
    publisher: Optional[str] = None
    pages: Optional[int] = None
    size: Optional[str] = None
    author: Optional[str] = None
    category_id: Optional[int] = None

class BookOut(BookBase):
    model_config = ConfigDict(from_attributes=True)
    id: int
    category: CategoryOut
    copies: List[BookCopyOut] = []
