from pydantic import BaseModel
from typing import List, Optional

# Tạo Schema cho User và Report
class UserBase(BaseModel):
    username: str
    full_name: Optional[str] = None
    role: str

class UserCreate(UserBase):
    password: str

class UserResponse(UserBase):
    id: int
    class Config:
        from_attributes = True

# Schema cho báo cáo
class TopBookReport(BaseModel):
    book_name: str
    borrow_count: int

class UnreturnedReaderReport(BaseModel):
    reader_name: str
    book_name: str
    days_overdue: int