from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.database import engine, Base, SessionLocal
from app.routers import readers, books, borrow as borrow_router, admin
from app.models import reader, book, borrow as borrow_model
from app.models.book import Category

Base.metadata.create_all(bind=engine)

# Khởi tạo sẵn một số chuyên ngành mặc định khi app khởi động
def initialize_default_categories():
    default_categories = [
        {"name": "Khoa học dữ liệu", "description": "Chuyên ngành dữ liệu, phân tích và học máy."},
        {"name": "Kỹ thuật phần mềm", "description": "Phát triển phần mềm, thiết kế hệ thống."},
        {"name": "Mạng máy tính", "description": "Hệ thống mạng và liên lạc dữ liệu."},
        {"name": "Trí tuệ nhân tạo", "description": "AI, máy học, xử lý ngôn ngữ tự nhiên."},
        {"name": "Cơ sở dữ liệu", "description": "Lưu trữ, truy vấn và quản lý dữ liệu."}
    ]
    db = SessionLocal()
    try:
        for cat in default_categories:
            existing = db.query(Category).filter(Category.name == cat["name"]).first()
            if not existing:
                db.add(Category(**cat))
        db.commit()
    finally:
        db.close()

initialize_default_categories()

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
app.include_router(books.router, prefix="/api")
app.include_router(admin.router, prefix="/api")

@app.get("/")
def root():
    return {"message": "Library API", "docs": "/docs"}

app.include_router(borrow_router.router, prefix="/api")