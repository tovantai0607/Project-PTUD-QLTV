from sqlalchemy import Column, Integer, String, Boolean
from app.database import Base

#Tạo Model User
class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    username = Column(String(50), unique=True, index=True, nullable=False)
    hashed_password = Column(String(100), nullable=False)
    full_name = Column(String(100))
    role = Column(String(20), default="librarian")  # admin hoặc librarian
    is_active = Column(Boolean, default=True)