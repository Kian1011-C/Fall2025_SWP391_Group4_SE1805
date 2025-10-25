API hiện có (nhóm theo controller). Mỗi dòng ghi: METHOD PATH — Chức năng. Không dùng dấu chấm đầu dòng.

AuthController (/api/auth)
POST /api/auth/login — Đăng nhập, trả JWT và thông tin phiên (Public)
POST /api/auth/logout — Đăng xuất, vô hiệu phiên hiện tại (Đã đăng nhập)
POST /api/auth/register — Đăng ký tài khoản mới (Public)
GET /api/auth/me — Lấy thông tin người dùng hiện tại từ token (Đã đăng nhập)
GET /api/auth/check — Kiểm tra hiệu lực token/trạng thái đăng nhập (Đã đăng nhập)

AdminController (/api/admin)
GET /api/admin/users — Danh sách người dùng (Admin)
GET /api/admin/users/{userId} — Chi tiết người dùng (Admin)
POST /api/admin/users — Tạo người dùng (Admin)
GET /api/admin/users/{userId}/vehicles — Danh sách xe của người dùng (Admin)
GET /api/admin/statistics — Thống kê tổng quan cho admin (Admin)

BatteryController (/api/batteries)
GET /api/batteries/{id}/status — Trạng thái pin theo id (Admin, Staff)
GET /api/batteries/{id}/history — Lịch sử sử dụng/đổi pin theo id (Admin, Staff)
POST /api/batteries/swap/initiate — Tìm pin mới tốt nhất tại trạm (slot FULL, pin AVAILABLE), gợi ý vị trí lấy (Driver)
POST /api/batteries/swap/{swapId}/confirm — Xác nhận hoàn tất swap, cập nhật pin/slot/xe (Staff/Admin hoặc hệ thống)
GET /api/batteries/{id}/health — Chỉ số sức khỏe (SOH) của pin (Admin, Staff)
POST /api/batteries/{id}/maintenance/schedule — Lập lịch/báo bảo trì cho pin (Staff/Admin)
GET /api/batteries/station/{stationId} — Danh sách pin tại một trạm (Staff/Admin)
GET /api/batteries/swap/active — Thông tin swap đang mở/đang xử lý (Driver/Staff)
GET /api/batteries/vehicle/{vehicleId} — Pin hiện tại của xe (Driver/Staff)
GET /api/batteries/{id} — Chi tiết pin (Admin, Staff)
PUT /api/batteries/{id} — Cập nhật thông tin pin (Admin)
DELETE /api/batteries/{id} — Xóa/loại pin (Admin)
GET /api/batteries/statistics — Thống kê liên quan tới pin (Admin)
PUT /api/batteries/bulk — Cập nhật nhiều pin hàng loạt (Admin)

ContractController (/api/contracts)
POST /api/contracts — Tạo hợp đồng mới (hiện đang mock) (Admin)
GET /api/contracts/user/{userId} — Danh sách hợp đồng của người dùng (Admin/Driver tự xem)
PUT /api/contracts/{contractId} — Cập nhật hợp đồng (Admin)
POST /api/contracts/{contractId}/terminate — Chấm dứt hợp đồng (Admin)
GET /api/contracts/{contractId} — Chi tiết hợp đồng (Admin)
GET /api/contracts/{contractId}/usage — Sử dụng theo hợp đồng (quãng đường, lượt đổi) (Admin)
POST /api/contracts/{contractId}/renew — Gia hạn hợp đồng (Admin)
GET /api/contracts/plans — Danh sách gói/plan dịch vụ (Public/Admin)
POST /api/contracts/{contractId}/billing — Tính/cập nhật hóa đơn của hợp đồng (Admin)
GET /api/contracts/billing-report/{monthYear} — Báo cáo hóa đơn theo tháng-năm (Admin)
POST /api/contracts/auto-reset-month — Reset/chốt kỳ tính cước tháng (Admin)
GET /api/contracts/vehicle/{vehicleId}/plan — Thông tin gói/plan của xe (Admin/Driver)

DriverController (/api/driver)
GET /api/driver/towers?stationId= — Danh sách trụ của trạm kèm số ô khả dụng (Driver)
GET /api/driver/slots?towerId= — Danh sách ô trong trụ kèm thông tin pin trong mỗi ô (Driver)
GET /api/driver/slot/empty?towerId= — Lấy một ô trống trong trụ (Driver)

PageController (điều hướng view)
GET / — Trang index
GET /login — Trang đăng nhập
GET /home?id= — Trang chủ theo vai trò (Driver/Staff/Admin)
GET /driver/home — View trang chủ tài xế
GET /driver/stations — View chọn trạm (có bind userId, vehicleId)
GET /driver/towers — View danh sách trụ
GET /driver/slots — View danh sách ô
GET /driver/battery — View chi tiết pin chọn đổi
GET /driver/swap — View quy trình đổi pin

PaymentController (/api/payments)
POST /api/payments/process — Xử lý thanh toán một giao dịch (Driver)
GET /api/payments/user/{userId}/history — Lịch sử thanh toán của người dùng (Driver/Admin)
POST /api/payments/user/{userId}/auto-payment — Bật tự động trừ tiền (Driver)
DELETE /api/payments/user/{userId}/auto-payment — Hủy tự động trừ tiền (Driver)
POST /api/payments/{paymentId}/refund — Hoàn tiền giao dịch (Admin)
GET /api/payments/user/{userId}/methods — Danh sách phương thức thanh toán (Driver)
POST /api/payments/user/{userId}/methods — Thêm phương thức thanh toán (Driver)
DELETE /api/payments/user/{userId}/methods/{methodId} — Xóa phương thức thanh toán (Driver)
GET /api/payments/user/{userId}/balance — Số dư ví/tài khoản thanh toán (Driver)
POST /api/payments/user/{userId}/topup — Nạp tiền (Driver)
POST /api/payments/calculate-monthly-bill/{contractId} — Tính cước tháng (Admin)
POST /api/payments/process-monthly-payment/{contractId} — Thu cước tháng (Admin)
GET /api/payments/monthly-usage-summary/{contractId} — Tổng hợp sử dụng tháng (Admin)
GET /api/payments/current-bill-status/user/{userId} — Trạng thái hóa đơn hiện tại (Driver/Admin)

ReportController (/api/reports)
GET /api/reports/overview — Tổng quan báo cáo (Admin)
GET /api/reports/revenue — Báo cáo doanh thu (Admin)
GET /api/reports/usage — Báo cáo sử dụng/quãng đường/đổi pin (Admin)
GET /api/reports/customers — Báo cáo khách hàng (Admin)
POST /api/reports/export — Xuất báo cáo (Admin)

StationController (/api/stations)
GET /api/stations — Danh sách trạm (lọc theo status, search) (Driver/Staff/Admin)
GET /api/stations/{id} — Chi tiết trạm (Driver/Staff/Admin)
GET /api/stations/stats — Thống kê tổng hợp các trạm (Admin/Staff)

SwapController (/api)
GET /api/users/{userId}/swaps — Lịch sử đổi pin của người dùng (Driver tự xem, Admin)
GET /api/swaps — Danh sách tất cả swap (Admin)
POST /api/swaps — Tạo bản ghi swap mới (Driver/Staff/Admin)
POST /api/swaps/auto — Tạo swap tự động (hệ thống) (Admin/Staff)
POST /api/swaps/{swapId}/confirm — Hoàn tất swap: cập nhật pin vào xe, cập nhật trạng thái pin/slot, set COMPLETED (Staff/Admin)

UserController (/api/users)
GET /api/users/{id} — Dashboard người dùng: tổng lượt đổi, tổng quãng đường, danh sách xe, thông tin pin/hợp đồng (Driver)
GET /api/users/{userId}/profile — Hồ sơ người dùng (Driver)
GET /api/users/{userId}/vehicles — Danh sách xe của người dùng kèm pin đang gắn (Driver)
GET /api/users/{userId}/notifications — Danh sách thông báo (mock) (Driver)
GET /api/users/{userId}/statistics — Thống kê người dùng (mock) (Driver)
GET /api/users/{userId}/subscription — Gói đăng ký hiện tại (mock) (Driver)

Gợi ý nhanh
Lịch sử đổi pin của tài xế: GET /api/users/{userId}/swaps
Quy trình đổi pin FE: POST /api/batteries/swap/initiate → POST /api/swaps (tạo) → POST /api/swaps/{swapId}/confirm (hoàn tất)
Dashboard tài xế: GET /api/users/{userId}; chi phí/thanh toán: GET /api/contracts/user/{userId} hoặc các API trong /api/payments
### AuthController (`/api/auth`)
POST `/api/auth/login`: Xác thực thông tin đăng nhập (tên người dùng và mật khẩu) của người dùng. Nếu thành công, trả về một JSON Web Token (JWT) để sử dụng cho các yêu cầu tiếp theo.
**Đối tượng**: Public (Mọi người dùng)

POST `/api/auth/register`: Đăng ký một tài khoản người dùng mới. Yêu cầu thông tin người dùng trong body của request và lưu vào cơ sở dữ liệu.
**Đối tượng**: Public (Mọi người dùng)

### AdminController (`/api/admin`)
GET `/api/admin/dashboard`: Lấy dữ liệu tổng hợp cho trang tổng quan của quản trị viên, bao gồm các số liệu thống kê chính như tổng số người dùng, số trạm, số lần đổi pin, và doanh thu.
**Đối tượng**: Admin

### BatteryController (`/api`)
GET `/api/batteries`: Lấy danh sách tất cả các pin có trong hệ thống.
**Đối tượng**: Admin, Staff

GET `/api/batteries/{id}`: Lấy thông tin chi tiết của một pin cụ thể dựa vào ID.
**Đối tượng**: Admin, Staff

GET `/api/batteries/search`: Tìm kiếm pin dựa trên các tiêu chí như trạng thái, dung lượng, v.v.
**Đối tượng**: Admin, Staff

POST `/api/batteries`: Tạo một bản ghi pin mới trong cơ sở dữ liệu.
**Đối tượng**: Admin

PUT `/api/batteries/{id}`: Cập nhật thông tin của một pin đã tồn tại.
**Đối tượng**: Admin

DELETE `/api/batteries/{id}`: Xóa một pin khỏi hệ thống.
**Đối tượng**: Admin

### ContractController (`/api/contracts`)
GET `/api/contracts`: Lấy danh sách tất cả các hợp đồng.
**Đối tượng**: Admin

GET `/api/contracts/{id}`: Lấy thông tin chi tiết của một hợp đồng cụ thể dựa vào ID.
**Đối tượng**: Admin, Driver (tự xem hợp đồng của mình)

POST `/api/contracts`: Tạo một hợp đồng mới.
**Đối tượng**: Admin

PUT `/api/contracts/{id}`: Cập nhật thông tin của một hợp đồng đã tồn tại.
**Đối tượng**: Admin

DELETE `/api/contracts/{id}`: Xóa một hợp đồng.
**Đối tượng**: Admin

### DriverController (`/api/drivers`)
GET `/api/drivers/{id}/dashboard`: Lấy dữ liệu tổng quan cho trang tổng quan của tài xế, bao gồm thông tin xe, các lần đổi pin gần đây và chi tiết hợp đồng.
**Đối tượng**: Driver

### PageController
GET `/`: Chuyển hướng người dùng đến trang tài liệu Swagger UI để xem và tương tác với các API.
**Đối tượng**: Public (Mọi người dùng)

### PaymentController (`/api`)
GET `/api/users/{userId}/payments`: Lấy lịch sử thanh toán của một người dùng cụ thể.
**Đối tượng**: Admin, Driver (tự xem)

POST `/api/payments/create-payment`: Tạo một yêu cầu thanh toán mới thông qua cổng thanh toán (ví dụ: VNPay) và trả về URL để người dùng thực hiện thanh toán.
**Đối tượng**: Driver

GET `/api/payments/vnpay-return`: Xử lý kết quả trả về từ cổng thanh toán sau khi người dùng hoàn tất (hoặc hủy) giao dịch, sau đó cập nhật trạng thái thanh toán trong hệ thống.
**Đối tượng**: Driver

### ReportController (`/api/reports`)
GET `/api/reports`: Lấy danh sách tất cả các báo cáo sự cố do người dùng gửi.
**Đối tượng**: Admin, Staff

POST `/api/reports`: Cho phép người dùng tạo và gửi một báo cáo sự cố mới.
**Đối tượng**: Driver

### StationController (`/api/stations`)
GET `/api/stations`: Lấy danh sách tất cả các trạm đổi pin.
**Đối tượng**: Admin, Staff, Driver

GET `/api/stations/{id}`: Lấy thông tin chi tiết của một trạm cụ thể dựa vào ID.
**Đối tượng**: Admin, Staff, Driver

GET `/api/stations/{id}/towers`: Lấy danh sách các tháp pin có sẵn tại một trạm cụ thể.
**Đối tượng**: Admin, Staff, Driver

POST `/api/stations`: Tạo một trạm đổi pin mới.
**Đối tượng**: Admin

PUT `/api/stations/{id}`: Cập nhật thông tin của một trạm đã tồn tại.
**Đối tượng**: Admin

DELETE `/api/stations/{id}`: Xóa một trạm khỏi hệ thống.
**Đối tượng**: Admin

### SwapController (`/api`)
GET `/api/users/{userId}/swaps`: Lấy lịch sử các lần đổi pin của một người dùng cụ thể.
**Đối tượng**: Admin, Driver (tự xem)

GET `/api/swaps`: Lấy danh sách tất cả các giao dịch đổi pin đã được thực hiện trên toàn hệ thống (chức năng dành cho quản trị viên).
**Đối tượng**: Admin

### UserController (`/api/users`)
GET `/api/users`: Lấy danh sách tất cả người dùng trong hệ thống.
**Đối tượng**: Admin

GET `/api/users/{id}`: Lấy thông tin chi tiết của một người dùng cụ thể dựa vào ID.
**Đối tượng**: Admin, Driver (tự xem thông tin của mình)

POST `/api/users`: Tạo một người dùng mới.
**Đối tượng**: Admin

PUT `/api/users/{id}`: Cập nhật thông tin của một người dùng đã tồn tại.
**Đối tượng**: Admin, Driver (tự cập nhật thông tin của mình)

DELETE `/api/users/{id}`: Xóa một người dùng khỏi hệ thống.
**Đối tượng**: Admin
