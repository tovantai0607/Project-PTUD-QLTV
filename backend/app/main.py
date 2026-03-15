from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.database import engine, Base
from app.routers import readers, books  # MỚI THÊM: import books
from app.models import reader, book # MỚI THÊM: import book model để SQLAlchemy tạo bảng

Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Hệ thống quản lý thư viện",
    description="API Module Quản lý độc giả & Quản lý sách",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(readers.router, prefix="/api")
app.include_router(books.router, prefix="/api") # MỚI THÊM: Đăng ký API sách

@app.get("/")
def root():
    return {"message": "Library API", "docs": "/docs"}