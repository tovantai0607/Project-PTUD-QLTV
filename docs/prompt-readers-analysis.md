# Prompt AI phân tích nghiệp vụ - Module Quản lý độc giả

Dùng prompt sau với AI để phân tích và thiết kế DB/API cho module thẻ thư viện:

---

**Prompt:**

Phân tích chức năng quản lý thẻ thư viện (độc giả) gồm:

- Thêm độc giả
- Sửa thông tin độc giả
- Xóa độc giả
- Hiển thị danh sách độc giả

Thông tin thẻ thư viện gồm: Mã độc giả, họ tên, lớp, ngày sinh, giới tính.

Hãy cho tôi:

1. **Actor và use case:** Ai thực hiện các thao tác trên (ví dụ: thủ thư), và từng use case tương ứng.
2. **Thiết kế bảng database:** Bảng `readers` với tên cột (tiếng Anh), kiểu dữ liệu, ràng buộc (PK, NOT NULL...).
3. **API REST:** Danh sách endpoint (GET/POST/PUT/DELETE /readers) với mô tả request body và response mẫu (JSON).

Sau khi có kết quả, đối chiếu với đề bài và thiết kế chung của nhóm (bảng readers) rồi chỉnh sửa cho thống nhất.
