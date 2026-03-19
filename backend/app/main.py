from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.database import engine, Base
from app.routers import readers, books, borrow as borrow_router, admin
from app.models import reader, book, borrow as borrow_model

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
app.include_router(books.router, prefix="/api")
app.include_router(admin.router, prefix="/api")

@app.get("/")
def root():
    return {"message": "Library API", "docs": "/docs"}

app.include_router(borrow_router.router, prefix="/api")