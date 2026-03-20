# BÁO CÁO ĐỒ ÁN WEB QUẢN LÝ THƯ VIỆN

## 1. Thông tin nhóm thực hiện

| STT | Họ và tên | MSSV | Vai trò/Nhiệm vụ |
|---|---|---|---|
| 1 |  |  |  |
| 2 |  |  |  |
| 3 |  |  |  |
| 4 |  |  |  |

## 2. Giới thiệu đề tài

Đề tài xây dựng một hệ thống web quản lý thư viện nhằm hỗ trợ các nghiệp vụ cơ bản trong thư viện như quản lý độc giả, quản lý đầu sách, theo dõi mượn trả sách, quản lý nhân viên và thống kê tình hình sử dụng sách. Hệ thống được phát triển theo mô hình tách riêng frontend và backend để thuận tiện cho việc phân chia công việc theo nhóm cũng như mở rộng về sau.

Sau khi rà soát và hoàn thiện lại mã nguồn trong repository, hệ thống hiện có thể vận hành được theo luồng cơ bản: tạo chuyên ngành, thêm sách, thêm độc giả, tạo phiếu mượn, trả sách, quản lý nhân viên và xem báo cáo thống kê. Phần mềm phù hợp với phạm vi một đồ án môn học hoặc một mô hình quản lý thư viện quy mô nhỏ.

## 3. Link GitHub repo

Repository: https://github.com/tovantai0607/Project-PTUD-QLTV

Nhánh chính dùng để tổng hợp sản phẩm là `master`.

## 4. Kiến trúc và các công nghệ sử dụng

### 4.1. Kiến trúc tổng quát

Hệ thống được tổ chức theo mô hình client-server:

- Frontend chịu trách nhiệm hiển thị giao diện và gửi yêu cầu lên API.
- Backend cung cấp REST API cho các nghiệp vụ chính.
- Cơ sở dữ liệu dùng SQLite để lưu dữ liệu của hệ thống.

Các phân hệ chính trong mã nguồn gồm:

- Quản lý độc giả
- Quản lý sách và chuyên ngành
- Mượn trả sách
- Quản lý nhân viên
- Báo cáo, thống kê

### 4.2. Công nghệ frontend

- React 18
- React Router DOM
- Axios
- Vite
- JavaScript JSX

Frontend được đặt trong thư mục `frontend/`, dùng React Router để điều hướng giữa các màn hình và Axios để gọi API. Sau khi hoàn thiện, toàn bộ frontend đã được chuẩn hóa để gọi API qua cùng một lớp `api.js`, giúp dễ bảo trì hơn.

### 4.3. Công nghệ backend

- FastAPI
- SQLAlchemy
- Pydantic
- Uvicorn
- Python

Backend được đặt trong thư mục `backend/`, chia theo các lớp `models`, `schemas`, `routers`. Cách tổ chức này giúp mã nguồn rõ ràng, dễ mở rộng và thuận lợi cho việc làm việc nhóm.

### 4.4. Cơ sở dữ liệu và kiểm thử

- SQLite dùng làm hệ quản trị dữ liệu nhẹ, dễ triển khai
- Pytest và FastAPI TestClient dùng để kiểm thử API
- Git và GitHub dùng để quản lý mã nguồn và phối hợp làm việc nhóm

Trong quá trình hoàn thiện, hệ thống kiểm thử backend đã được tách sang cơ sở dữ liệu riêng cho test để tránh ảnh hưởng dữ liệu thật. Kết quả kiểm thử hiện tại là:

- `16` test backend đạt
- Frontend build production thành công bằng Vite
- Smoke test thành công trên các luồng chính của hệ thống

## 5. Chức năng đã hoàn thành

### 5.1. Quản lý độc giả

Phân hệ độc giả cho phép thực hiện đầy đủ các thao tác CRUD:

- Xem danh sách độc giả
- Tìm kiếm theo tên hoặc lớp
- Thêm độc giả mới
- Cập nhật thông tin độc giả
- Xóa độc giả

Dữ liệu độc giả hiện lưu các trường chính như họ tên, lớp, ngày sinh, giới tính và thời điểm tạo.

### 5.2. Quản lý sách

Phân hệ sách đã hỗ trợ:

- Tạo chuyên ngành/danh mục sách
- Thêm đầu sách mới
- Tự động sinh các bản sao sách theo số lượng nhập
- Xem danh sách đầu sách
- Xem chi tiết sách
- Cập nhật thông tin sách
- Xóa sách cùng các bản sao liên quan

Việc bổ sung API lấy chi tiết sách và chức năng tạo chuyên ngành trực tiếp trên giao diện giúp luồng sử dụng hoàn chỉnh hơn so với phiên bản ban đầu.

### 5.3. Mượn trả sách

Phân hệ mượn trả hiện đã xử lý được các nghiệp vụ cốt lõi:

- Chỉ cho phép mượn các bản sao còn sẵn
- Mỗi độc giả chỉ có một phiếu mượn đang hoạt động tại một thời điểm
- Tự động cập nhật trạng thái bản sao khi mượn và khi trả
- Tự động gán hạn trả mặc định sau 7 ngày
- Hiển thị danh sách phiếu mượn đang hoạt động

Giao diện mượn trả đã được đồng bộ với backend, chuyển từ nhập tay mã số sang chọn độc giả và chọn bản sao sách đang có sẵn, giúp thao tác thực tế và ít sai sót hơn.

### 5.4. Quản lý nhân viên

Phân hệ admin hiện đã có các chức năng cơ bản:

- Thêm tài khoản nhân viên
- Xem danh sách nhân viên đã tạo
- Phân vai trò cơ bản giữa `admin` và `librarian`

Đây là nền tảng để mở rộng thành phân quyền người dùng ở các phiên bản sau.

### 5.5. Báo cáo và thống kê

Hệ thống hiện có hai nhóm báo cáo chính:

- Thống kê các sách được mượn nhiều nhất
- Liệt kê các phiếu mượn chưa trả hoặc quá hạn

Các báo cáo này hiện lấy dữ liệu thật từ cơ sở dữ liệu thay vì dữ liệu mẫu. Đây là điểm cải thiện quan trọng vì giúp phần admin có giá trị sử dụng thực tế.

## 6. Kết quả hoàn thành so với yêu cầu đề bài

### Tự đánh giá mức độ hoàn thành: **8/10**

Lý do đánh giá:

- Hệ thống đã hoàn thiện được các module chính của một website quản lý thư viện ở mức cơ bản đến khá tốt.
- Frontend và backend đã được nối đồng bộ, có thể chạy được theo luồng nghiệp vụ chính.
- Có kiểm thử backend và kiểm tra build frontend.
- Cấu trúc project rõ ràng, phù hợp với bài tập lớn làm theo nhóm.

Tuy nhiên, sản phẩm vẫn chưa đạt mức hoàn chỉnh như một hệ thống triển khai thực tế vì còn thiếu một số phần nâng cao như xác thực đăng nhập, phân quyền chặt chẽ, báo cáo sâu hơn, migration cơ sở dữ liệu và kiểm thử frontend.

## 7. Tự đánh giá: làm được và chưa làm được

### 7.1. Những gì nhóm đã làm được

- Xây dựng được giao diện web đa trang cho hệ thống quản lý thư viện
- Xây dựng backend REST API bằng FastAPI
- Tổ chức cơ sở dữ liệu cho các đối tượng chính: độc giả, sách, bản sao sách, phiếu mượn, người dùng
- Hoàn thành các nghiệp vụ CRUD cho độc giả và sách
- Hoàn thành luồng mượn trả cơ bản và cập nhật trạng thái bản sao
- Tạo được trang quản lý nhân viên
- Tạo được trang báo cáo thống kê từ dữ liệu thật
- Viết test backend cho các phần chính
- Đồng bộ được frontend với backend để hệ thống chạy ổn định hơn

### 7.2. Những gì chưa làm được hoặc chưa hoàn thiện

- Chưa có chức năng đăng nhập và xác thực người dùng
- Chưa có phân quyền chi tiết theo tài khoản đăng nhập
- Chưa có migration quản lý thay đổi cấu trúc cơ sở dữ liệu
- Chưa có kiểm thử tự động cho frontend
- Báo cáo thống kê mới ở mức cơ bản, chưa có biểu đồ hoặc lọc nâng cao
- Giao diện vẫn còn đơn giản, thiên về tính chức năng hơn là tối ưu trải nghiệm người dùng
- Chưa triển khai lên server thật để dùng qua Internet

## 8. Quy trình làm việc của nhóm

Qua lịch sử GitHub, nhóm làm việc theo hướng chia module cho từng thành viên và dùng nhánh riêng trước khi gộp vào `master`. Đây là cách làm phù hợp với bài tập nhóm vì hạn chế xung đột mã nguồn và giúp mỗi thành viên phụ trách rõ một phần việc.

Quy trình nhóm có thể tóm tắt như sau:

1. Tạo repository chung trên GitHub để lưu trữ mã nguồn.
2. Xây dựng phần nền tảng ban đầu của dự án ở nhánh chính.
3. Chia công việc theo các phân hệ.
4. Mỗi thành viên phát triển trên một nhánh riêng.
5. Sau khi hoàn thành từng phần, nhóm merge vào `master`.
6. Kiểm tra lại việc tích hợp giữa các module frontend và backend.
7. Hoàn thiện sản phẩm tổng thể và chuẩn bị báo cáo.

Các dấu mốc thể hiện trên lịch sử Git:

- `feature/quan-ly-sach`: hoàn thành phần quản lý sách, merge vào `master` ngày **15/03/2026**
- `feature/muon-tra-sach`: hoàn thành phần mượn trả sách, merge vào `master` ngày **15/03/2026**
- `feature/admin`: bổ sung phần quản lý người dùng và báo cáo, merge vào `master` ngày **19/03/2026**

Từ cấu trúc mã nguồn và commit history có thể thấy nhóm phân chia tương đối rõ theo thành viên:

- Thành viên 1: quản lý độc giả
- Thành viên 2: quản lý sách
- Thành viên 3: mượn trả sách
- Thành viên 4: admin, quản lý người dùng và báo cáo

Việc tổ chức theo module như vậy giúp quá trình phát triển song song diễn ra thuận lợi, đồng thời dễ tổng hợp thành một sản phẩm chung ở cuối kỳ.

## 9. Đánh giá chung về sản phẩm

Nhìn chung, website quản lý thư viện đã đáp ứng khá tốt các yêu cầu cốt lõi của một bài tập lớn môn phát triển ứng dụng. Hệ thống có đầy đủ các thành phần quan trọng của một ứng dụng web hiện đại: giao diện người dùng, API backend, cơ sở dữ liệu, test và quản lý mã nguồn theo Git.

Điểm mạnh của đề tài là:

- Có phân chia module rõ ràng
- Có khả năng mở rộng
- Dễ chạy thử trong môi trường học tập
- Bao quát được nhiều nghiệp vụ thực tế của thư viện

Điểm cần cải thiện ở các phiên bản tiếp theo là tăng mức độ hoàn thiện về bảo mật, phân quyền, trải nghiệm người dùng và triển khai thực tế.

## 10. Kết luận

Đề tài web quản lý thư viện là một sản phẩm có tính ứng dụng, giúp nhóm vận dụng được kiến thức về frontend, backend, API, cơ sở dữ liệu và làm việc nhóm với GitHub. Sau khi hoàn thiện lại mã nguồn, hệ thống đã có thể vận hành theo các luồng nghiệp vụ chính và đủ cơ sở để trình bày, demo cũng như nộp báo cáo môn học.

Trong tương lai, nếu tiếp tục phát triển, hệ thống có thể mở rộng thêm các tính năng như đăng nhập, phân quyền chi tiết, biểu đồ thống kê, tìm kiếm nâng cao, lịch sử mượn trả và triển khai online để phục vụ sử dụng thực tế.
