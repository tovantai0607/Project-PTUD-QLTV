from datetime import date, datetime
from typing import Optional

from pydantic import BaseModel, Field, ConfigDict


class ReaderBase(BaseModel):
    full_name: str = Field(..., min_length=1, description="Họ tên")
    class_name: str = Field(..., min_length=1, description="Lớp")
    date_of_birth: date = Field(..., description="Ngày sinh")
    gender: str = Field(..., description="Giới tính: Nam, Nữ, Khác")


class ReaderCreate(ReaderBase):
    pass


class ReaderUpdate(ReaderBase):
    full_name: Optional[str] = Field(None, min_length=1)
    class_name: Optional[str] = Field(None, min_length=1)
    date_of_birth: Optional[date] = None
    gender: Optional[str] = None


class ReaderResponse(ReaderBase):
    model_config = ConfigDict(from_attributes=True)
    id: int
    created_at: Optional[datetime] = None
