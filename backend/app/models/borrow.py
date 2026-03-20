from sqlalchemy import Column, Integer, String, Date, ForeignKey
from app.database import Base
import datetime

class BorrowRecord(Base):
    __tablename__ = "borrow_records"

    id = Column(Integer, primary_key=True, index=True)
    reader_id = Column(Integer, ForeignKey("readers.id"))
    book_copy_id = Column(Integer, ForeignKey("book_copies.id"))
    borrow_date = Column(Date, default=datetime.date.today)
    due_date = Column(Date, nullable=True)
    return_date = Column(Date, nullable=True) # Để trống khi chưa trả
    status = Column(String, default="Đang mượn") # Trạng thái: Đang mượn / Đã trả
