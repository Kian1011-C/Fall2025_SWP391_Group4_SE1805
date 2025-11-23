# EV Battery Swap System - API Documentation

## APIs đã được thêm vào dự án Spring Boot

### 1. Battery Management API (`/api/batteries`)

#### Endpoints:
- `GET /api/batteries` - Lấy tất cả pin
- `GET /api/batteries/{id}` - Lấy pin theo ID
- `GET /api/batteries/status/{status}` - Lấy pin theo trạng thái
- `POST /api/batteries` - Tạo pin mới
- `PUT /api/batteries/{id}` - Cập nhật thông tin pin
- `DELETE /api/batteries/{id}` - Xóa pin
- `GET /api/batteries/statistics` - Thống kê pin theo trạng thái

#### Example Request:
```javascript
// Lấy tất cả pin
fetch('http://localhost:8080/api/batteries')
  .then(response => response.json())
  .then(data => console.log(data));

// Tạo pin mới
fetch('http://localhost:8080/api/batteries', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    model: "Tesla Model S Battery",
    capacity: 100,
    stateOfHealth: 95.5,
    status: "available",
    slotId: null
  })
});
```

### 2. Station Management API (`/api/stations`)

#### Endpoints:
- `GET /api/stations` - Lấy tất cả trạm
- `GET /api/stations/{id}` - Lấy trạm theo ID
- `GET /api/stations/nearby?latitude={lat}&longitude={lng}&limit={limit}` - Tìm trạm gần nhất
- `GET /api/stations/status/{status}` - Lấy trạm theo trạng thái
- `POST /api/stations` - Tạo trạm mới
- `PUT /api/stations/{id}` - Cập nhật thông tin trạm
- `DELETE /api/stations/{id}` - Xóa trạm (soft delete)
- `GET /api/stations/statistics` - Thống kê trạm

#### Example Request:
```javascript
// Tìm trạm gần nhất
fetch('http://localhost:8080/api/stations/nearby?latitude=21.0285&longitude=105.8542&limit=5')
  .then(response => response.json())
  .then(data => console.log(data));
```

### 3. Swap Transaction API (`/api/swaps`)

#### Endpoints:
- `GET /api/swaps` - Lấy tất cả giao dịch swap
- `GET /api/swaps/{id}` - Lấy swap theo ID
- `GET /api/swaps/user/{userId}` - Lấy swap theo user ID
- `GET /api/swaps/station/{stationId}` - Lấy swap theo station ID
- `POST /api/swaps` - Tạo swap mới
- `PUT /api/swaps/{id}/status` - Cập nhật trạng thái swap
- `PUT /api/swaps/{id}/complete` - Hoàn thành swap
- `GET /api/swaps/statistics` - Thống kê swap
- `GET /api/swaps/recent?limit={limit}` - Lấy lịch sử swap gần đây

#### Example Request:
```javascript
// Tạo swap mới
fetch('http://localhost:8080/api/swaps', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    contractId: 1,
    stationId: 1,
    towerId: 1,
    staffId: 1,
    oldBatteryId: 1,
    newBatteryId: 2,
    odometerBefore: 15000,
    odometerAfter: 15000,
    swapStatus: "IN_PROGRESS"
  })
});
```

### 4. User Management API (`/api/users`)

#### Endpoints (đã có sẵn + cải thiện):
- `POST /api/users/login` - Đăng nhập
- `GET /api/users/{id}` - Lấy thông tin user và dashboard

### 5. Driver API (`/api/driver`)

#### Endpoints (đã có sẵn + cải thiện):
- `GET /api/driver/stations` - Lấy danh sách stations
- `GET /api/driver/towers?stationId={id}` - Lấy towers theo station
- `GET /api/driver/slots?towerId={id}` - Lấy slots theo tower
- `GET /api/driver/batteries?slotId={id}` - Lấy batteries theo slot
- `POST /api/driver/swap` - Tạo swap mới

## Kết nối với React Frontend

### Cấu hình CORS
- Đã cấu hình CORS cho phép kết nối từ `http://localhost:3000` và `http://localhost:5173`
- Tất cả API endpoints đã có `@CrossOrigin` annotation

### Response Format
Tất cả API trả về format chuẩn:
```json
{
  "success": true/false,
  "message": "Thông báo",
  "data": {}, // hoặc []
  "count": 10 // với danh sách
}
```

## Chạy dự án

### Backend (Spring Boot):
```bash
cd d:\filecrack\EvDrivers
mvn spring-boot:run
```
Server sẽ chạy tại: `http://localhost:8080`

### Frontend (React):
```bash
cd d:\filecrack\SWP
npm run dev
```
Server sẽ chạy tại: `http://localhost:3000`

### Database
- Đang sử dụng SQL Server
- Kết nối qua `hsf302.fa25.s3.utils.ConnectDB`
- Database: `ev_battery_swap`

## Các cải tiến đã thực hiện:

1. ✅ **Thêm CORS support** cho tất cả APIs
2. ✅ **Mở rộng BatteryDao** với đầy đủ CRUD operations
3. ✅ **Mở rộng StationDao** với tìm kiếm gần nhất, thống kê
4. ✅ **Mở rộng SwapDao** với quản lý giao dịch đầy đủ
5. ✅ **Thêm Station model** với latitude/longitude
6. ✅ **Cấu hình WebConfig** cho CORS toàn cục
7. ✅ **Response format chuẩn** cho tất cả APIs
8. ✅ **Error handling** cho tất cả endpoints

## Testing APIs

Bạn có thể test các APIs bằng:
- **Postman**
- **curl**
- **React frontend** 
- **Browser** (cho GET requests)

Example test với curl:
```bash
curl -X GET http://localhost:8080/api/batteries
curl -X GET http://localhost:8080/api/stations
curl -X GET http://localhost:8080/api/swaps/recent?limit=5
```