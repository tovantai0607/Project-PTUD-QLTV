# Hệ thống quản lý thư viện - Project PTUD QLTV

Module **Quản lý độc giả (Thành viên 1)**: CRUD thẻ thư viện, API FastAPI, giao diện React.

## Cấu trúc

- `backend/` — FastAPI, SQLAlchemy, API `/api/readers`
- `frontend/` — React (Vite), trang danh sách độc giả, form thêm/sửa
- `docs/` — Prompt phân tích nghiệp vụ

## Chạy Backend

```bash
cd backend
pip install -r requirements.txt
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

API docs: http://127.0.0.1:8000/docs

## Chạy Frontend

```bash
cd frontend
npm install
npm run dev
```

Mở http://localhost:5173 (proxy `/api` sang backend 8000).

## Chạy test Backend

```bash
cd backend
set PYTHONPATH=.
pytest tests -v
```

## API Độc giả

| Method | Endpoint | Mô tả |
|--------|----------|--------|
| GET | /api/readers | Danh sách độc giả (query: search, skip, limit) |
| GET | /api/readers/{id} | Chi tiết độc giả |
| POST | /api/readers | Thêm độc giả |
| PUT | /api/readers/{id} | Sửa độc giả |
| DELETE | /api/readers/{id} | Xóa độc giả |

Body POST/PUT: `full_name`, `class_name`, `date_of_birth`, `gender`.
