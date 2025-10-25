# Tài liệu API Hệ thống Đổi Pin EV - Sắp xếp theo Role# Tài liệu API Hệ thống Đổi Pin EV# EV Battery Swap System - API Documentation



Dưới đây là danh sách các API đã được triển khai trong dự án, được nhóm theo vai trò người dùng với thứ tự ưu tiên: Driver, Staff, Admin.



---Dưới đây là danh sách các API đã được triển khai trong dự án, cùng với chức năng và đối tượng sử dụng.## APIs đã được thêm vào dự án Spring Boot



## I. API dành cho Driver



Các API này phục vụ cho tài xế sử dụng ứng dụng di động hoặc web.### 1. AuthController - Quản lý xác thực### 1. Battery Management API (`/api/batteries`)



### 1. Tìm kiếm và Giao dịch tại Trạm

- `GET /api/stations`: Tìm và xem danh sách các trạm đổi pin.

- `GET /api/driver/towers`: Lấy danh sách các trụ (tower) trong một trạm.- `POST /api/auth/login`#### Endpoints:

- `GET /api/driver/slots`: Lấy danh sách các ô (slot) và thông tin pin trong một trụ.

- `GET /api/driver/slot/empty`: Tìm một ô trống để trả pin cũ.  - Chức năng: Xử lý đăng nhập cho người dùng (Admin, Staff, Driver).- `GET /api/batteries` - Lấy tất cả pin

- `POST /api/batteries/swap/initiate`: Khởi tạo một yêu cầu đổi pin mới.

- `POST /api/batteries/swap/{swapId}/confirm`: Xác nhận đã đổi pin thành công.  - Đối tượng: Mọi người dùng (Admin, Staff, Driver).- `GET /api/batteries/{id}` - Lấy pin theo ID



### 2. Quản lý Thông tin Cá nhân và Xe- `GET /api/batteries/status/{status}` - Lấy pin theo trạng thái

- `GET /api/users/{id}`: Lấy thông tin tổng quan cho trang chủ (dashboard).

- `GET /api/users/{userId}/profile`: Xem và quản lý hồ sơ cá nhân.- `POST /api/auth/logout`- `POST /api/batteries` - Tạo pin mới

- `GET /api/users/{userId}/vehicles`: Xem danh sách xe và thông tin pin hiện tại.

- `GET /api/batteries/vehicle/{vehicleId}`: Lấy thông tin pin của một xe cụ thể.  - Chức năng: Xử lý đăng xuất.- `PUT /api/batteries/{id}` - Cập nhật thông tin pin



### 3. Quản lý Hợp đồng và Thanh toán  - Đối tượng: Mọi người dùng đã đăng nhập.- `DELETE /api/batteries/{id}` - Xóa pin

- `GET /api/contracts/user/{userId}`: Xem các hợp đồng thuê pin của mình.

- `GET /api/contracts/plans`: Xem các gói cước thuê pin hiện có.- `GET /api/batteries/statistics` - Thống kê pin theo trạng thái

- `GET /api/contracts/vehicle/{vehicleId}/plan`: Xem gói cước đang áp dụng cho xe.

- `GET /api/payments/user/{userId}/history`: Xem lịch sử thanh toán.- `GET /api/auth/me`

- `POST /api/payments/process`: Thực hiện thanh toán mới.

- `GET /api/payments/current-bill-status/user/{userId}`: Xem trạng thái hóa đơn và mức sử dụng hiện tại.  - Chức năng: Lấy thông tin người dùng hiện tại (dữ liệu giả lập).#### Example Request:

- `GET /api/payments/monthly-usage-summary/{contractId}`: Xem tóm tắt sử dụng của một hợp đồng.

  - Đối tượng: Mọi người dùng đã đăng nhập.```javascript

### 4. Lịch sử và Thống kê

- `GET /api/users/{userId}/swaps`: Xem lịch sử các lần đổi pin của mình.// Lấy tất cả pin

- `GET /api/users/{userId}/statistics`: Xem thống kê sử dụng cá nhân (dữ liệu giả lập).

- `GET /api/auth/check`fetch('http://localhost:8080/api/batteries')

---

  - Chức năng: Kiểm tra trạng thái đăng nhập (dữ liệu giả lập).  .then(response => response.json())

## II. API dành cho Staff

  - Đối tượng: Mọi người dùng.  .then(data => console.log(data));

Các API này hỗ trợ nhân viên vận hành tại các trạm.



### 1. Quản lý Pin (BatteryController)

- `GET /api/batteries`: Lấy danh sách tất cả các pin, có thể lọc theo trạng thái, trạm.### 2. AdminController - Chức năng quản trị// Tạo pin mới

- `POST /api/batteries`: Tạo một pin mới trong hệ thống.

- `PUT /api/batteries/{id}`: Cập nhật thông tin một viên pin.fetch('http://localhost:8080/api/batteries', {

- `DELETE /api/batteries/{id}`: Xóa một viên pin khỏi hệ thống.

- `GET /api/batteries/{id}/history`: Xem lịch sử của một viên pin.- `GET /api/admin/users`  method: 'POST',



### 2. Quản lý Trạm (StationController)  - Chức năng: Lấy danh sách tất cả người dùng với các bộ lọc (theo vai trò, trạng thái, tìm kiếm) và phân trang.  headers: { 'Content-Type': 'application/json' },

- `GET /api/stations`: Xem danh sách tất cả các trạm.

- `GET /api/stations/{id}`: Xem thông tin chi tiết của một trạm.  - Đối tượng: Admin.  body: JSON.stringify({

- `GET /api/stations/stats`: Xem thống kê chung về các trạm.

    model: "Tesla Model S Battery",

### 3. Hỗ trợ Giao dịch và Người dùng

- `GET /api/users/{userId}/swaps`: Lấy lịch sử đổi pin của một người dùng.- `GET /api/admin/users/{userId}`    capacity: 100,

- `POST /api/swaps`: Tạo một bản ghi đổi pin thủ công.

- `POST /api/swaps/{swapId}/confirm`: Xác nhận hoàn thành một giao dịch đổi pin.  - Chức năng: Lấy thông tin chi tiết của một người dùng theo ID.    stateOfHealth: 95.5,

- `GET /api/users/{id}`: Xem thông tin tổng quan của người dùng.

- `GET /api/users/{userId}/profile`: Xem hồ sơ chi tiết của người dùng.  - Đối tượng: Admin.    status: "available",

- `GET /api/contracts/user/{userId}`: Xem danh sách hợp đồng của người dùng.

- `GET /api/payments/user/{userId}/history`: Xem lịch sử thanh toán của người dùng.    slotId: null



---- `POST /api/admin/users`  })



## III. API dành cho Admin  - Chức năng: Tạo một người dùng mới.});



Các API này cung cấp chức năng quản lý và giám sát toàn bộ hệ thống.  - Đối tượng: Admin.```



### 1. Quản lý Người dùng (AdminController)

- `GET /api/admin/users`: Lấy danh sách tất cả người dùng với bộ lọc và phân trang.

- `GET /api/admin/users/{userId}`: Lấy thông tin chi tiết của một người dùng.- `GET /api/admin/users/{userId}/vehicles`### 2. Station Management API (`/api/stations`)

- `POST /api/admin/users`: Tạo một người dùng mới (Staff hoặc Driver).

- `GET /api/admin/users/{userId}/vehicles`: Lấy danh sách xe của một tài xế.  - Chức năng: Lấy danh sách các phương tiện của một tài xế cụ thể.



### 2. Báo cáo và Thống kê (ReportController & AdminController)  - Đối tượng: Admin.#### Endpoints:

- `GET /api/reports/overview`: Lấy báo cáo tổng quan toàn hệ thống (doanh thu, người dùng, trạm, pin).

- `GET /api/reports/revenue`: Lấy báo cáo chi tiết về doanh thu.- `GET /api/stations` - Lấy tất cả trạm

- `GET /api/reports/usage`: Lấy báo cáo về tần suất sử dụng hệ thống.

- `GET /api/reports/customers`: Lấy báo cáo về khách hàng.- `GET /api/admin/statistics`- `GET /api/stations/{id}` - Lấy trạm theo ID

- `GET /api/admin/statistics`: Lấy thống kê nhanh cho dashboard (tổng tài xế, nhân viên).

  - Chức năng: Lấy các số liệu thống kê tổng quan cho trang dashboard của Admin (tổng số tài xế, nhân viên, v.v.).- `GET /api/stations/nearby?latitude={lat}&longitude={lng}&limit={limit}` - Tìm trạm gần nhất

### 3. Giám sát Giao dịch và Hợp đồng

- `GET /api/swaps`: Lấy toàn bộ lịch sử đổi pin của hệ thống.  - Đối tượng: Admin.- `GET /api/stations/status/{status}` - Lấy trạm theo trạng thái

- `GET /api/contracts/billing-report/{monthYear}`: Lấy báo cáo hóa đơn của một tháng/năm cụ thể.

- `POST /api/contracts/{contractId}/billing`: Xử lý hóa đơn hàng tháng cho một hợp đồng.- `POST /api/stations` - Tạo trạm mới



### 4. Giám sát Trạm và Pin### 3. UserController - Quản lý thông tin người dùng (chủ yếu cho Driver)- `PUT /api/stations/{id}` - Cập nhật thông tin trạm

- `GET /api/stations/stats`: Lấy thống kê về các trạm (tổng số, trạng thái).

- `GET /api/batteries/{id}/history`: Lấy lịch sử đổi của một viên pin.- `DELETE /api/stations/{id}` - Xóa trạm (soft delete)



---- `GET /api/users/{id}`- `GET /api/stations/statistics` - Thống kê trạm



## IV. API Chung & Xác thực  - Chức năng: Lấy thông tin tổng quan cho trang chủ của người dùng (thông tin cá nhân, dashboard, danh sách xe).



- `POST /api/auth/login`: Đăng nhập vào hệ thống.  - Đối tượng: Driver, Staff.#### Example Request:

- `POST /api/auth/logout`: Đăng xuất khỏi hệ thống.

- `GET /api/auth/me`: Lấy thông tin người dùng đang đăng nhập.```javascript

- `GET /api/auth/check`: Kiểm tra trạng thái xác thực.

- `GET /api/users/{userId}/profile`// Tìm trạm gần nhất

  - Chức năng: Lấy thông tin hồ sơ chi tiết của người dùng.fetch('http://localhost:8080/api/stations/nearby?latitude=21.0285&longitude=105.8542&limit=5')

  - Đối tượng: Driver, Staff.  .then(response => response.json())

  .then(data => console.log(data));

- `GET /api/users/{userId}/vehicles````

  - Chức năng: Lấy danh sách các phương tiện (xe) cùng thông tin pin của người dùng.

  - Đối tượng: Driver.### 3. Swap Transaction API (`/api/swaps`)



- `GET /api/users/{userId}/statistics`#### Endpoints:

  - Chức năng: Lấy các thống kê sử dụng của tài xế (số lần đổi pin, quãng đường, v.v. - dữ liệu giả lập).- `GET /api/swaps` - Lấy tất cả giao dịch swap

  - Đối tượng: Driver.- `GET /api/swaps/{id}` - Lấy swap theo ID

- `GET /api/swaps/user/{userId}` - Lấy swap theo user ID

### 4. StationController - Quản lý trạm đổi pin- `GET /api/swaps/station/{stationId}` - Lấy swap theo station ID

- `POST /api/swaps` - Tạo swap mới

- `GET /api/stations`- `PUT /api/swaps/{id}/status` - Cập nhật trạng thái swap

  - Chức năng: Lấy danh sách tất cả các trạm đổi pin, có thể lọc theo trạng thái và tìm kiếm.- `PUT /api/swaps/{id}/complete` - Hoàn thành swap

  - Đối tượng: Driver, Staff, Admin.- `GET /api/swaps/statistics` - Thống kê swap

- `GET /api/swaps/recent?limit={limit}` - Lấy lịch sử swap gần đây

- `GET /api/stations/{id}`

  - Chức năng: Lấy thông tin chi tiết của một trạm cụ thể.#### Example Request:

  - Đối tượng: Driver, Staff, Admin.```javascript

// Tạo swap mới

- `GET /api/stations/stats`fetch('http://localhost:8080/api/swaps', {

  - Chức năng: Lấy thống kê về các trạm (tổng số trạm, số trạm hoạt động/bảo trì).  method: 'POST',

  - Đối tượng: Admin, Staff.  headers: { 'Content-Type': 'application/json' },

  body: JSON.stringify({

### 5. DriverController - Chức năng dành riêng cho tài xế tại trạm    contractId: 1,

    stationId: 1,

- `GET /api/driver/towers`    towerId: 1,

  - Chức năng: Lấy danh sách các trụ (tower) có trong một trạm.    staffId: 1,

  - Đối tượng: Driver.    oldBatteryId: 1,

    newBatteryId: 2,

- `GET /api/driver/slots`    odometerBefore: 15000,

  - Chức năng: Lấy danh sách các ô (slot) và thông tin pin bên trong của một trụ.    odometerAfter: 15000,

  - Đối tượng: Driver.    swapStatus: "IN_PROGRESS"

  })

- `GET /api/driver/slot/empty`});

  - Chức năng: Tìm một ô trống trong một trụ để tài xế có thể trả pin cũ vào.```

  - Đối tượng: Driver.

### 4. User Management API (`/api/users`)

### 6. BatteryController - Quản lý pin

#### Endpoints (đã có sẵn + cải thiện):

- `GET /api/batteries`- `POST /api/users/login` - Đăng nhập

  - Chức năng: Lấy danh sách tất cả các pin, có thể lọc theo trạng thái, trạm. Dành cho quản lý.- `GET /api/users/{id}` - Lấy thông tin user và dashboard

  - Đối tượng: Staff, Admin.

### 5. Driver API (`/api/driver`)

- `POST /api/batteries`

  - Chức năng: Tạo một pin mới trong hệ thống.#### Endpoints (đã có sẵn + cải thiện):

  - Đối tượng: Staff.- `GET /api/driver/stations` - Lấy danh sách stations

- `GET /api/driver/towers?stationId={id}` - Lấy towers theo station

- `PUT /api/batteries/{id}`- `GET /api/driver/slots?towerId={id}` - Lấy slots theo tower

  - Chức năng: Cập nhật thông tin một viên pin.- `GET /api/driver/batteries?slotId={id}` - Lấy batteries theo slot

  - Đối tượng: Staff.- `POST /api/driver/swap` - Tạo swap mới



- `DELETE /api/batteries/{id}`## Kết nối với React Frontend

  - Chức năng: Xóa một viên pin khỏi hệ thống.

  - Đối tượng: Staff.### Cấu hình CORS

- Đã cấu hình CORS cho phép kết nối từ `http://localhost:3000` và `http://localhost:5173`

- `GET /api/batteries/{id}/status`- Tất cả API endpoints đã có `@CrossOrigin` annotation

  - Chức năng: Lấy trạng thái chi tiết của một viên pin.

  - Đối tượng: Driver, Staff.### Response Format

Tất cả API trả về format chuẩn:

- `GET /api/batteries/{id}/history````json

  - Chức năng: Lấy lịch sử đổi của một viên pin.{

  - Đối tượng: Staff, Admin.  "success": true/false,

  "message": "Thông báo",

- `POST /api/batteries/swap/initiate`  "data": {}, // hoặc []

  - Chức năng: Khởi tạo một giao dịch đổi pin mới cho tài xế.  "count": 10 // với danh sách

  - Đối tượng: Driver.}

```

- `POST /api/batteries/swap/{swapId}/confirm`

  - Chức năng: Xác nhận hoàn tất một giao dịch đổi pin.## Chạy dự án

  - Đối tượng: Driver (hoặc hệ thống tự động).

### Backend (Spring Boot):

- `GET /api/batteries/station/{stationId}````bash

  - Chức năng: Lấy danh sách pin có tại một trạm cụ thể.cd d:\filecrack\EvDrivers

  - Đối tượng: Driver, Staff.mvn spring-boot:run

```

- `GET /api/batteries/vehicle/{vehicleId}`Server sẽ chạy tại: `http://localhost:8080`

  - Chức năng: Lấy thông tin pin hiện tại của một chiếc xe.

  - Đối tượng: Driver.### Frontend (React):

```bash

### 7. SwapController - Quản lý giao dịch đổi pincd d:\filecrack\SWP

npm run dev

- `GET /api/users/{userId}/swaps````

  - Chức năng: Lấy lịch sử các lần đổi pin của một người dùng.Server sẽ chạy tại: `http://localhost:3000`

  - Đối tượng: Driver, Staff.

### Database

- `GET /api/swaps`- Đang sử dụng SQL Server

  - Chức năng: Lấy toàn bộ lịch sử đổi pin của hệ thống.- Kết nối qua `hsf302.fa25.s3.context.ConnectDB`

  - Đối tượng: Admin.- Database: `ev_battery_swap`



- `POST /api/swaps`## Các cải tiến đã thực hiện:

  - Chức năng: Tạo một bản ghi đổi pin mới (thường do tài xế hoặc nhân viên thực hiện thủ công).

  - Đối tượng: Driver, Staff.1. ✅ **Thêm CORS support** cho tất cả APIs

2. ✅ **Mở rộng BatteryDao** với đầy đủ CRUD operations

- `POST /api/swaps/auto`3. ✅ **Mở rộng StationDao** với tìm kiếm gần nhất, thống kê

  - Chức năng: Tạo một bản ghi đổi pin tự động (thường do hệ thống tạo ra).4. ✅ **Mở rộng SwapDao** với quản lý giao dịch đầy đủ

  - Đối tượng: Hệ thống.5. ✅ **Thêm Station model** với latitude/longitude

6. ✅ **Cấu hình WebConfig** cho CORS toàn cục

- `POST /api/swaps/{swapId}/confirm`7. ✅ **Response format chuẩn** cho tất cả APIs

  - Chức năng: Xác nhận hoàn thành một giao dịch đổi pin và cập nhật trạng thái các đối tượng liên quan (pin, xe, slot).8. ✅ **Error handling** cho tất cả endpoints

  - Đối tượng: Hệ thống, Staff.

## Testing APIs

### 8. ContractController - Quản lý hợp đồng và gói cước

Bạn có thể test các APIs bằng:

- `GET /api/contracts/user/{userId}`- **Postman**

  - Chức năng: Lấy danh sách các hợp đồng của một người dùng.- **curl**

  - Đối tượng: Driver, Staff.- **React frontend** 

- **Browser** (cho GET requests)

- `GET /api/contracts/plans`

  - Chức năng: Lấy danh sách các gói dịch vụ (gói cước thuê pin) hiện có.Example test với curl:

  - Đối tượng: Driver, Staff.```bash

curl -X GET http://localhost:8080/api/batteries

- `GET /api/contracts/vehicle/{vehicleId}/plan`curl -X GET http://localhost:8080/api/stations

  - Chức năng: Lấy thông tin gói cước đang áp dụng cho một phương tiện cụ thể.curl -X GET http://localhost:8080/api/swaps/recent?limit=5

  - Đối tượng: Driver.```

- `POST /api/contracts/{contractId}/billing`
  - Chức năng: Xử lý hóa đơn hàng tháng cho một hợp đồng.
  - Đối tượng: Admin, Hệ thống.

- `GET /api/contracts/billing-report/{monthYear}`
  - Chức năng: Lấy báo cáo hóa đơn của một tháng/năm cụ thể.
  - Đối tượng: Admin.

### 9. PaymentController - Quản lý thanh toán

- `POST /api/payments/process`
  - Chức năng: Xử lý một giao dịch thanh toán mới.
  - Đối tượng: Driver, Hệ thống.

- `GET /api/payments/user/{userId}/history`
  - Chức năng: Lấy lịch sử thanh toán của một người dùng.
  - Đối tượng: Driver, Staff.

- `POST /api/payments/calculate-monthly-bill/{contractId}`
  - Chức năng: Tính toán hóa đơn hàng tháng cho một hợp đồng dựa trên mức sử dụng.
  - Đối tượng: Hệ thống, Admin.

- `POST /api/payments/process-monthly-payment/{contractId}`
  - Chức năng: Xử lý thanh toán cho hóa đơn hàng tháng và reset lại chu kỳ sử dụng.
  - Đối tượng: Hệ thống, Driver.

- `GET /api/payments/monthly-usage-summary/{contractId}`
  - Chức năng: Lấy tóm tắt sử dụng hàng tháng của một hợp đồng.
  - Đối tượng: Driver.

- `GET /api/payments/current-bill-status/user/{userId}`
  - Chức năng: Lấy trạng thái hóa đơn hiện tại cho tất cả các hợp đồng đang hoạt động của người dùng.
  - Đối tượng: Driver.

### 10. ReportController - Báo cáo và thống kê

- `GET /api/reports/overview`
  - Chức năng: Lấy báo cáo tổng quan toàn hệ thống (doanh thu, người dùng, trạm, pin, giao dịch).
  - Đối tượng: Admin.

- `GET /api/reports/revenue`
  - Chức năng: Lấy báo cáo chi tiết về doanh thu.
  - Đối tượng: Admin.

- `GET /api/reports/usage`
  - Chức năng: Lấy báo cáo về tần suất sử dụng hệ thống (số lần đổi pin).
  - Đối tượng: Admin.

- `GET /api/reports/customers`
  - Chức năng: Lấy báo cáo về khách hàng (tổng số, khách hàng mới, tỷ lệ giữ chân).
  - Đối tượng: Admin.
