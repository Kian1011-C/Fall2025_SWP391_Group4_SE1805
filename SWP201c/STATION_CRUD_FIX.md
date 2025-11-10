# 🔧 Fix: Chức năng CRUD Không Hoạt Động

## ✅ Vấn đề đã sửa:

### **Nguyên nhân:** 
Backend sử dụng `/api/admin/stations` cho CRUD operations, không phải `/api/stations`.

- ❌ Trước: Frontend gọi `/api/stations` (chỉ có GET)
- ✅ Sau: Frontend gọi `/api/admin/stations` (có đủ POST, PUT, DELETE)

## 📝 Chi tiết thay đổi:

### 1. Backend Structure:

**StationController.java** (`/api/stations`):
- ✅ GET `/api/stations` - Lấy danh sách
- ✅ GET `/api/stations/{id}` - Lấy chi tiết
- ✅ GET `/api/stations/stats` - Thống kê
- ❌ POST, PUT, DELETE - **KHÔNG CÓ**

**AdminController.java** (`/api/admin/stations`):
- ✅ GET `/api/admin/stations` - Lấy danh sách
- ✅ GET `/api/admin/stations/{id}` - Lấy chi tiết
- ✅ **POST `/api/admin/stations`** - Tạo mới
- ✅ **PUT `/api/admin/stations/{id}`** - Cập nhật
- ✅ **DELETE `/api/admin/stations/{id}`** - Xóa

### 2. Frontend Fix (stationService.js):

```javascript
// ✅ ĐÚNG - Sử dụng /api/admin/stations
createStation: async (stationData) => {
    const response = await apiUtils.post('/api/admin/stations', stationData);
    return response;
}

updateStation: async (stationId, stationData) => {
    const response = await apiUtils.put(`/api/admin/stations/${stationId}`, stationData);
    return response;
}

deleteStation: async (stationId) => {
    const response = await apiUtils.delete(`/api/admin/stations/${stationId}`);
    return response;
}
```

### 3. Thêm Console Logs để Debug:

```javascript
// index.jsx - Thêm logs
handleSaveStation: async (formData, stationId) => {
    console.log('💾 Saving station:', { formData, stationId });
    // ... rest of code
}

handleDeleteStation: async (stationId) => {
    console.log('🗑️ Deleting station:', stationId);
    // ... rest of code
}
```

## 🧪 Cách test:

### 1. Mở Developer Console (F12)

### 2. Test Thêm Trạm:
```
1. Click "➕ Thêm Trạm"
2. Điền form
3. Click "Lưu"
4. Xem console:
   - "💾 Saving station:"
   - "Creating new station..."
   - "POST /api/admin/stations"
   - Response từ backend
```

### 3. Test Sửa Trạm:
```
1. Click "✏️ Sửa" ở row bất kỳ
2. Sửa thông tin
3. Click "Lưu"
4. Xem console:
   - "💾 Saving station:"
   - "Updating station..."
   - "PUT /api/admin/stations/{id}"
   - Response từ backend
```

### 4. Test Xóa Trạm:
```
1. Click "🗑️ Xóa" ở row bất kỳ
2. Confirm trong dialog
3. Xem console:
   - "🗑️ Deleting station:"
   - "DELETE /api/admin/stations/{id}"
   - Response từ backend
```

## 🚨 Kiểm tra lỗi thường gặp:

### Lỗi 1: 401 Unauthorized
**Nguyên nhân:** Chưa login hoặc session hết hạn
**Giải pháp:** Login lại với tài khoản Admin

### Lỗi 2: 403 Forbidden
**Nguyên nhân:** Tài khoản không có quyền Admin
**Giải pháp:** Đảm bảo login với role="Admin"

### Lỗi 3: 404 Not Found
**Nguyên nhân:** Backend chưa chạy hoặc endpoint sai
**Giải pháp:** 
- Kiểm tra backend đang chạy
- Kiểm tra URL: `http://localhost:8080/api/admin/stations`

### Lỗi 4: 500 Internal Server Error
**Nguyên nhân:** Lỗi trong database hoặc logic backend
**Giải pháp:** Xem backend logs để debug

### Lỗi 5: CORS Error
**Nguyên nhân:** Backend chưa config CORS
**Giải pháp:** Thêm CORS config trong Spring Boot

## 📋 Backend Requirements:

Đảm bảo backend đã có:

1. ✅ `AdminController.java` với `/api/admin` mapping
2. ✅ Station CRUD methods (POST, PUT, DELETE)
3. ✅ `StationDao.java` với các methods:
   - `createStationWithTower()`
   - `updateStation()`
   - `deleteStation()` (soft delete)
4. ✅ Authentication & Authorization middleware
5. ✅ CORS configuration

## 🎯 Expected Response Format:

### Create/Update Success:
```json
{
  "success": true,
  "message": "Station created/updated successfully",
  "data": {
    "stationId": 1,
    "name": "Trạm A",
    "location": "123 ABC",
    "status": "active"
  }
}
```

### Delete Success:
```json
{
  "success": true,
  "message": "Station deleted successfully"
}
```

### Error:
```json
{
  "success": false,
  "message": "Error message here"
}
```

## ✅ Checklist sau khi fix:

- [ ] Backend đang chạy
- [ ] Login với tài khoản Admin
- [ ] Console không có CORS error
- [ ] POST request đến `/api/admin/stations` thành công
- [ ] PUT request đến `/api/admin/stations/{id}` thành công
- [ ] DELETE request đến `/api/admin/stations/{id}` thành công
- [ ] Danh sách refresh sau mỗi action

---

**Date:** November 10, 2025  
**Issue:** CRUD không hoạt động do sai endpoint  
**Solution:** Đổi từ `/api/stations` sang `/api/admin/stations`  
**Status:** ✅ Fixed
