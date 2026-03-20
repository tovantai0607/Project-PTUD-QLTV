# Hệ Thống Quản Lý Thư Viện - Project PTUD QLTV

Đây là đồ án web quản lý thư viện được xây dựng theo mô hình tách `frontend` và `backend`, hỗ trợ các nghiệp vụ chính của thư viện như quản lý độc giả, quản lý sách, mượn trả sách, quản lý nhân viên và xem báo cáo thống kê.

## Tính năng chính

- Quản lý độc giả: thêm, sửa, xóa, tìm kiếm và xem danh sách độc giả.
- Quản lý sách: tạo chuyên ngành, thêm đầu sách, sửa thông tin sách, xóa sách.
- Tự động tạo bản sao sách theo số lượng nhập.
- Mượn trả sách: chỉ cho mượn bản sao đang có sẵn, cập nhật trạng thái khi mượn/trả.
- Tự động gán hạn trả mặc định sau 7 ngày.
- Quản lý nhân viên thư viện với vai trò `admin` và `librarian`.
- Báo cáo thống kê sách mượn nhiều và danh sách phiếu mượn chưa trả/quá hạn.

## Công nghệ sử dụng

### Frontend

- React 18
- React Router DOM
- Axios
- Vite

### Backend

- FastAPI
- SQLAlchemy
- Pydantic
- Uvicorn
- SQLite
- Pytest

## Cấu trúc thư mục

```text
Project-PTUD-QLTV/
├── backend/
│   ├── app/
│   │   ├── models/
│   │   ├── routers/
│   │   ├── schemas/
│   │   ├── database.py
│   │   └── main.py
│   ├── tests/
│   ├── requirements.txt
│   └── pytest.ini
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   └── services/
│   ├── package.json
│   └── vite.config.js
├── docs/
├── BaoCao_QLTV.md
├── BaoCao_QLTV.docx
└── README.md
```

## Cách chạy dự án

### 1. Chạy backend

```bash
cd backend
pip install -r requirements.txt
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

Swagger docs:

- http://127.0.0.1:8000/docs

### 2. Chạy frontend

```bash
cd frontend
npm install
npm run dev
```

Mở trình duyệt tại:

- http://localhost:5173

Frontend đã được cấu hình proxy `/api` sang backend `http://127.0.0.1:8000`.

## Kiểm thử

### Chạy test backend

```bash
python -m pytest backend/tests -q -p no:cacheprovider
```

### Build frontend

```bash
cd frontend
npm run build
```

## Các API chính

### Độc giả

- `GET /api/readers`
- `GET /api/readers/{reader_id}`
- `POST /api/readers`
- `PUT /api/readers/{reader_id}`
- `DELETE /api/readers/{reader_id}`

### Sách và chuyên ngành

- `GET /api/categories`
- `POST /api/categories`
- `GET /api/books`
- `GET /api/books/{book_id}`
- `POST /api/books`
- `PUT /api/books/{book_id}`
- `DELETE /api/books/{book_id}`

### Mượn trả sách

- `GET /api/borrow-system/available-copies`
- `GET /api/borrow-system/borrowed`
- `POST /api/borrow-system/borrow`
- `POST /api/borrow-system/return/{record_id}`

### Quản trị

- `GET /api/admin/users`
- `POST /api/admin/users`
- `GET /api/admin/reports/top-books`
- `GET /api/admin/reports/unreturned`

## Luồng nghiệp vụ đã hoàn thiện

1. Tạo chuyên ngành sách.
2. Thêm đầu sách và tự sinh bản sao theo số lượng nhập.
3. Tạo độc giả.
4. Tạo phiếu mượn bằng cách chọn độc giả và bản sao sách còn sẵn.
5. Trả sách và cập nhật lại trạng thái bản sao.
6. Tạo nhân viên thư viện.
7. Xem báo cáo top sách mượn nhiều và danh sách phiếu chưa trả/quá hạn.

## Tổ chức làm việc nhóm

Repository sử dụng GitHub và chia theo các nhánh tính năng:

- `feature/quan-ly-sach`
- `feature/muon-tra-sach`
- `feature/admin`
- `master`

Phân chia module theo thành viên:

- Thành viên 1: quản lý độc giả
- Thành viên 2: quản lý sách
- Thành viên 3: mượn trả sách
- Thành viên 4: admin và báo cáo

## Báo cáo

Repository hiện có sẵn:

- [BaoCao_QLTV.md](./BaoCao_QLTV.md)
- [BaoCao_QLTV.docx](./BaoCao_QLTV.docx)

## Trạng thái hiện tại

- Backend test: `16 passed`
- Frontend build production: thành công
- Các luồng chính đã được smoke test sau khi đồng bộ lại frontend/backend

## Hướng phát triển thêm

- Bổ sung đăng nhập và xác thực người dùng
- Phân quyền chi tiết theo tài khoản
- Thêm migration cơ sở dữ liệu
- Viết test frontend
- Bổ sung biểu đồ và bộ lọc nâng cao cho phần báo cáo
