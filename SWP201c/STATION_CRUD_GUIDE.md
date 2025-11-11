# Hướng dẫn CRUD Quản lý Trạm (Station Management)

## Tổng quan

Đã thêm đầy đủ chức năng CRUD (Create, Read, Update, Delete) cho trang quản lý trạm ở Admin Dashboard.

## Các tính năng đã thêm

### 1. ✅ **Thêm Trạm Mới (Create)**
- Nút "➕ Thêm Trạm" ở góc phải header
- Hiển thị modal form với các trường:
  - Tên Trạm (bắt buộc)
  - Địa chỉ (bắt buộc)
  - Trạng thái (dropdown: active/maintenance/offline)
- Backend API: `POST /api/stations`
- Backend tự động tạo 1 tower và 8 slots cho trạm mới

### 2. ✅ **Xem Danh sách Trạm (Read)**
- Hiển thị table với các cột:
  - ID
  - Tên Trạm
  - Địa chỉ
  - Trạng thái (có màu badge)
  - Pin (Sẵn/Tổng)
  - Thao tác (Sửa/Xóa)
- Backend API: `GET /api/stations`
- Click vào row để xem chi tiết towers

### 3. ✅ **Sửa Trạm (Update)**
- Nút "✏️ Sửa" ở cột Thao tác
- Hiển thị modal form với dữ liệu hiện tại
- Cập nhật thông tin trạm
- Backend API: `PUT /api/stations/{stationId}`

### 4. ✅ **Xóa Trạm (Delete)**
- Nút "🗑️ Xóa" ở cột Thao tác
- Confirm dialog trước khi xóa
- Backend API: `DELETE /api/stations/{stationId}`
- Backend thực hiện soft delete (set status='maintenance')

## File đã sửa đổi

### 1. **stationService.js**
```javascript
// Thêm function xóa trạm
deleteStation: async (stationId) => {
    const response = await apiUtils.delete(ENDPOINTS.STATIONS.BY_ID(stationId));
    return response;
}
```

### 2. **index.jsx** (AdminStations)
- Thêm state: `isModalOpen`, `editingStation`
- Thêm handlers:
  - `handleAddStation()` - Mở modal để tạo mới
  - `handleEditStation(station)` - Mở modal để sửa
  - `handleDeleteStation(stationId)` - Xóa trạm
  - `handleSaveStation(formData, stationId)` - Lưu (create hoặc update)
- Pass props xuống StationListView
- Render StationFormModal

### 3. **StationListView.jsx**
- Thêm cột "Thao tác" vào table
- Thêm nút Sửa và Xóa cho mỗi row
- Props: `onEditStation`, `onDeleteStation`
- Click row vẫn navigate vào towers

### 4. **StationFormModal.jsx**
- Sửa `handleSubmit` để lấy đúng `stationId` từ backend
- Hỗ trợ cả `station.stationId` và `station.id`

### 5. **StationManagement.css**
- Thêm class `.station-add-btn` cho nút thêm trạm
- Style giống `.station-create-btn`

## Backend APIs được sử dụng

### 1. GET /api/stations
**Response:**
```json
{
  "success": true,
  "data": [
    {
      "stationId": 1,
      "id": 1,
      "name": "Trạm A",
      "location": "123 Đường ABC",
      "status": "active",
      "totalTowers": 2,
      "totalSlots": 16,
      "availableSlots": 8,
      "availableBatteries": 10,
      "totalBatteries": 15
    }
  ],
  "total": 10
}
```

### 2. POST /api/stations
**Request:**
```json
{
  "name": "Trạm Mới",
  "location": "456 Đường XYZ",
  "status": "active"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Station created successfully with 1 tower and 8 slots",
  "data": {
    "stationId": 11,
    "name": "Trạm Mới",
    "location": "456 Đường XYZ",
    "status": "active"
  }
}
```

### 3. PUT /api/stations/{stationId}
**Request:**
```json
{
  "name": "Trạm A (Updated)",
  "location": "123 Đường ABC (New)",
  "status": "maintenance"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Station updated successfully",
  "data": { /* updated station data */ }
}
```

### 4. DELETE /api/stations/{stationId}
**Response:**
```json
{
  "success": true,
  "message": "Station deleted successfully"
}
```

**Note:** Backend thực hiện soft delete (set status='maintenance')

## Cách sử dụng

### Thêm trạm mới:
1. Click nút "➕ Thêm Trạm" ở header
2. Điền thông tin vào form
3. Click "Lưu"
4. Danh sách tự động refresh

### Sửa trạm:
1. Click nút "✏️ Sửa" ở row cần sửa
2. Cập nhật thông tin trong form
3. Click "Lưu"
4. Danh sách tự động refresh

### Xóa trạm:
1. Click nút "🗑️ Xóa" ở row cần xóa
2. Confirm trong dialog
3. Danh sách tự động refresh

### Xem chi tiết towers:
1. Click vào bất kỳ row nào (ngoài nút Sửa/Xóa)
2. Xem danh sách towers của trạm đó

## UI/UX Features

### 1. Button Styles
- **Thêm Trạm**: Màu xanh lá (#10b981) - góc phải header
- **Sửa**: Màu xanh dương (#3b82f6) - trong table
- **Xóa**: Màu đỏ (#ef4444) - trong table
- **Làm mới**: Màu xám - header

### 2. Modal Form
- Dark theme với backdrop blur
- Responsive
- Close khi click outside hoặc nút Hủy
- Validation: required cho name và location

### 3. Table Actions
- Buttons có hover effect
- Stop propagation để không trigger row click
- Icon + text cho rõ ràng

### 4. Confirmations
- Alert success/error sau mỗi action
- Confirm dialog trước khi xóa

## Testing Checklist

### Create (Thêm)
- [ ] Click nút "Thêm Trạm" mở modal
- [ ] Form validation hoạt động (required fields)
- [ ] Submit tạo trạm mới thành công
- [ ] Danh sách refresh sau khi tạo
- [ ] Backend tự tạo 1 tower + 8 slots

### Read (Xem)
- [ ] Hiển thị đúng danh sách trạm
- [ ] Hiển thị đúng thống kê (totalSlots, availableBatteries)
- [ ] Status badge có màu đúng
- [ ] Click row navigate vào towers

### Update (Sửa)
- [ ] Click nút Sửa mở modal với dữ liệu hiện tại
- [ ] Cập nhật thông tin thành công
- [ ] Danh sách refresh sau khi sửa

### Delete (Xóa)
- [ ] Click nút Xóa hiện confirm dialog
- [ ] Cancel không xóa
- [ ] OK xóa thành công
- [ ] Danh sách refresh sau khi xóa

## Known Issues & Future Improvements

### Current Limitations:
1. ⚠️ Backend chỉ soft delete (set status='maintenance')
2. ⚠️ Chưa có pagination cho danh sách dài
3. ⚠️ Chưa có search/filter

### Future Improvements:
1. 📝 Thêm pagination
2. 📝 Thêm search box
3. 📝 Thêm filter theo status
4. 📝 Bulk actions (xóa nhiều trạm)
5. 📝 Export danh sách ra Excel/CSV
6. 📝 Import trạm từ file
7. 📝 Drag & drop để sắp xếp
8. 📝 Map view để chọn location

## API Endpoints Summary

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/stations` | Lấy danh sách trạm |
| GET | `/api/stations/{id}` | Lấy chi tiết 1 trạm |
| POST | `/api/stations` | Tạo trạm mới |
| PUT | `/api/stations/{id}` | Cập nhật trạm |
| DELETE | `/api/stations/{id}` | Xóa trạm (soft delete) |
| GET | `/api/stations/stats` | Thống kê tổng quan |

## Backend Code Reference

Xem file `AdminController.java` và `StationDao.java` trong backend để hiểu rõ logic xử lý:

- `AdminController.java` lines 420-616: Station CRUD endpoints
- `StationDao.java`: Database operations cho Station

---

**Date:** November 10, 2025  
**Status:** ✅ Completed  
**Version:** 1.0
