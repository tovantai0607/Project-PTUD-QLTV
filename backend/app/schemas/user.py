from datetime import date
from typing import Optional

from pydantic import BaseModel, ConfigDict

class UserBase(BaseModel):
    username: str
    full_name: Optional[str] = None
    role: str

class UserCreate(UserBase):
    password: str

class UserResponse(UserBase):
    model_config = ConfigDict(from_attributes=True)
    id: int
    is_active: bool

class TopBookReport(BaseModel):
    book_name: str
    borrow_count: int

class UnreturnedReaderReport(BaseModel):
    reader_name: str
    book_name: str
    copy_code: str
    borrow_date: date
    due_date: date
    days_overdue: int
