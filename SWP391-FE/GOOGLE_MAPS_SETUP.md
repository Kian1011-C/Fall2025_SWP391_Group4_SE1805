# 🗺️ HƯỚNG DẪN CÀI ĐẶT GOOGLE MAPS

## ✅ Đã hoàn thành:
1. ✅ Cài đặt package `@react-google-maps/api`
2. ✅ Tạo component `StationsMapView` hiển thị bản đồ
3. ✅ Tích hợp vào trang StationsMap
4. ✅ Có 4 trạm mẫu ở Hà Nội

## 📋 Các tính năng:
- ✅ Hiển thị bản đồ Google Maps
- ✅ Hiển thị 4 trạm đổi pin trên bản đồ (marker màu xanh ⚡)
- ✅ Click vào marker để xem thông tin trạm
- ✅ Nút "Chỉ đường" - chỉ đường từ vị trí hiện tại đến trạm
- ✅ Nút "Sẵn sàng Đổi Pin" - chuyển đến trang đổi pin của trạm đó
- ✅ Hiển thị vị trí người dùng (chấm xanh dương)
- ✅ Danh sách trạm dạng thẻ bên dưới bản đồ

## 🔑 BƯỚC 1: Lấy Google Maps API Key

### Cách lấy API Key MIỄN PHÍ:

1. Truy cập: https://console.cloud.google.com/
2. Tạo project mới (hoặc chọn project có sẵn)
3. Vào **APIs & Services** → **Credentials**
4. Click **Create Credentials** → **API key**
5. Copy API key vừa tạo
6. Enable các API sau:
   - **Maps JavaScript API**
   - **Directions API**
   - **Geocoding API**

### Bảo mật API Key (Quan trọng!):

1. Click vào API key vừa tạo
2. Vào **Application restrictions**:
   - Chọn **HTTP referrers (web sites)**
   - Thêm: `http://localhost:*/*` và `https://yourdomain.com/*`
3. Vào **API restrictions**:
   - Chọn **Restrict key**
   - Chỉ chọn: Maps JavaScript API, Directions API, Geocoding API

**Lưu ý:** Google cho bạn **$200 credit miễn phí mỗi tháng**, đủ cho khoảng 28,000 lần load map.

## 🔑 BƯỚC 2: Cấu hình API Key

### Tạo file `.env` trong thư mục `SWP201c`:

```bash
# Copy file .env.example
cp .env.example .env
```

### Sửa file `.env`:

```env
# Google Maps API Key - THAY BẰNG KEY THẬT CỦA BẠN
VITE_GOOGLE_MAPS_API_KEY=AIzaSyBXpF9kXq3x3x3x3x3x3x3x3x3x3x3x3x3

# Debug mode
VITE_ENABLE_DEBUG=false
```

**⚠️ QUAN TRỌNG:**
- File `.env` đã được thêm vào `.gitignore` - KHÔNG commit lên Git
- Mỗi developer phải tự tạo file `.env` riêng

## 🚀 BƯỚC 3: Chạy ứng dụng

```bash
cd SWP201c
npm run dev
```

Truy cập: http://localhost:5173/driver/stations-map

## 🗺️ BƯỚC 4: Test các tính năng

### Test 1: Xem bản đồ
- ✅ Bản đồ hiển thị 4 trạm ở Hà Nội
- ✅ Marker xanh lá với icon ⚡

### Test 2: Click marker
- ✅ Hiển thị popup với thông tin trạm:
  - Tên trạm
  - Địa chỉ
  - Số slot còn trống
  - 2 nút: "Chỉ đường" và "Sẵn sàng Đổi Pin"

### Test 3: Chỉ đường
1. Cho phép trình duyệt truy cập vị trí
2. Click marker → Click "Chỉ đường"
3. ✅ Đường đi màu xanh dương hiển thị từ vị trí hiện tại đến trạm

### Test 4: Đổi pin
1. Click marker → Click "Sẵn sàng Đổi Pin"
2. ✅ Chuyển đến trang `/driver/swap-battery` với thông tin trạm đã chọn

## 📍 Dữ liệu 4 trạm mẫu:

```javascript
1. Trạm Cầu Giấy
   - Địa chỉ: 128 Xuân Thủy, Cầu Giấy, Hà Nội
   - Tọa độ: 21.0380, 105.7970
   - Slot: 8/12 còn trống

2. Trạm Hoàn Kiếm
   - Địa chỉ: 52 Lý Thường Kiệt, Hoàn Kiếm, Hà Nội
   - Tọa độ: 21.0245, 105.8412
   - Slot: 5/10 còn trống

3. Trạm Hai Bà Trưng
   - Địa chỉ: 200 Bà Triệu, Hai Bà Trưng, Hà Nội
   - Tọa độ: 21.0100, 105.8500
   - Slot: 10/15 còn trống

4. Trạm Đống Đa
   - Địa chỉ: 89 Láng Hạ, Đống Đa, Hà Nội
   - Tọa độ: 21.0200, 105.8100
   - Slot: 3/8 còn trống
```

## 🔄 Tích hợp với Backend

### Nếu backend có trả về latitude/longitude:

Component `StationsMapView` sẽ tự động sử dụng dữ liệu từ backend thay vì dữ liệu mẫu.

Backend cần trả về:
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "Trạm Cầu Giấy",
      "address": "128 Xuân Thủy, Cầu Giấy, Hà Nội",
      "latitude": 21.0380,
      "longitude": 105.7970,
      "status": "active",
      "availableSlots": 8,
      "totalSlots": 12
    }
  ]
}
```

### Nếu backend chưa có lat/lng:

1. Thêm 2 columns vào bảng `Stations`:
```sql
ALTER TABLE Stations ADD COLUMN latitude DECIMAL(10, 8);
ALTER TABLE Stations ADD COLUMN longitude DECIMAL(11, 8);

-- Update 4 trạm với tọa độ Hà Nội
UPDATE Stations SET latitude = 21.0380, longitude = 105.7970 WHERE station_id = 1;
UPDATE Stations SET latitude = 21.0245, longitude = 105.8412 WHERE station_id = 2;
UPDATE Stations SET latitude = 21.0100, longitude = 105.8500 WHERE station_id = 3;
UPDATE Stations SET latitude = 21.0200, longitude = 105.8100 WHERE station_id = 4;
```

2. Update Java model `Station.java`:
```java
private Double latitude;
private Double longitude;

// Getters & Setters
public Double getLatitude() { return latitude; }
public void setLatitude(Double latitude) { this.latitude = latitude; }
public Double getLongitude() { return longitude; }
public void setLongitude(Double longitude) { this.longitude = longitude; }
```

3. Update `StationDao.java`:
```java
String sql = """
    SELECT station_id, name, address, status, 
           available_slots, total_slots,
           latitude, longitude
    FROM Stations
""";

// Trong ResultSet mapping:
station.setLatitude(rs.getDouble("latitude"));
station.setLongitude(rs.getDouble("longitude"));
```

## 🎨 Tùy chỉnh

### Thay đổi màu marker:
File: `StationsMapView.jsx`, dòng ~192
```javascript
fill="${station.status === 'active' ? '#10b981' : '#ef4444'}"
```

### Thay đổi zoom level:
File: `StationsMapView.jsx`, dòng ~154
```javascript
zoom={13} // Thay đổi từ 10-20
```

### Thay đổi vị trí trung tâm:
File: `StationsMapView.jsx`, dòng ~18
```javascript
const defaultCenter = {
  lat: 21.0285,  // Latitude
  lng: 105.8542  // Longitude
};
```

## 🐛 Troubleshooting

### Lỗi: "This page can't load Google Maps correctly"
**Nguyên nhân:** API key không hợp lệ hoặc chưa enable API
**Giải pháp:** 
1. Kiểm tra API key trong file `.env`
2. Enable Maps JavaScript API, Directions API trong Google Console

### Lỗi: "Google is not defined"
**Nguyên nhân:** Google Maps chưa load xong
**Giải pháp:** Component đã xử lý - đợi `isLoaded === true`

### Lỗi: "Geolocation permission denied"
**Nguyên nhân:** User không cho phép truy cập vị trí
**Giải pháp:** Chỉ đường vẫn hoạt động nếu user cho phép, nếu không sẽ hiển thị alert

### Map không hiển thị trạm
**Nguyên nhân:** Backend không trả về latitude/longitude
**Giải pháp:** Component tự động dùng 4 trạm mẫu

## 📚 Tài liệu tham khảo

- Google Maps Platform: https://developers.google.com/maps
- React Google Maps API: https://react-google-maps-api-docs.netlify.app/
- Pricing: https://mapsplatform.google.com/pricing/

## 🎯 Tóm tắt

✅ **Đã cài đặt:** Google Maps với 4 trạm
✅ **Các tính năng:** Click marker, chỉ đường, đổi pin
✅ **Cần làm:** Lấy Google Maps API key và thêm vào file `.env`

**Next steps:**
1. Lấy Google Maps API key (MIỄN PHÍ)
2. Tạo file `.env` và thêm key
3. Chạy `npm run dev` và test!
