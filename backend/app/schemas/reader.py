from datetime import date, datetime
from typing import Optional, Any, Dict

from pydantic import BaseModel, Field, ConfigDict, model_validator


class ReaderBase(BaseModel):
    full_name: str = Field(..., min_length=1, description="Họ tên")
    class_name: str = Field(..., min_length=1, description="Lớp")
    date_of_birth: date = Field(..., description="Ngày sinh")
    gender: str = Field(..., description="Giới tính: Nam, Nữ, Khác")

    @model_validator(mode="before")
    def normalize_date_of_birth(cls, values: Any) -> Any:
        # Khi validate request payload: values là dict
        if isinstance(values, dict):
            dob = values.get("date_of_birth")
        else:
            # Khi validate response SQLAlchemy model (from_attributes=True): values là đối tượng model
            dob = getattr(values, "date_of_birth", None)

        if isinstance(dob, str):
            dob_str = dob.strip()
            if dob_str:
                # Chuẩn hóa sang YYYY-MM-DD bằng date.fromisoformat
                try:
                    parsed = date.fromisoformat(dob_str)
                    if isinstance(values, dict):
                        values["date_of_birth"] = parsed
                    else:
                        setattr(values, "date_of_birth", parsed)
                    return values
                except ValueError:
                    pass

                # Hỗ trợ MM/DD/YYYY và DD/MM/YYYY, thường nhập tay trên một số browser
                for fmt in ["%m/%d/%Y", "%d/%m/%Y"]:
                    try:
                        parsed = datetime.strptime(dob_str, fmt).date()
                        if isinstance(values, dict):
                            values["date_of_birth"] = parsed
                        else:
                            setattr(values, "date_of_birth", parsed)
                        return values
                    except ValueError:
                        continue

        return values


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
