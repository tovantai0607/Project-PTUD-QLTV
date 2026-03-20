from datetime import date

from pydantic import BaseModel


class AvailableBookCopyResponse(BaseModel):
    id: int
    copy_code: str
    book_title: str


class BorrowedRecordResponse(BaseModel):
    id: int
    reader_id: int
    reader_name: str
    book_copy_id: int
    copy_code: str
    book_title: str
    borrow_date: date
    due_date: date
    status: str
