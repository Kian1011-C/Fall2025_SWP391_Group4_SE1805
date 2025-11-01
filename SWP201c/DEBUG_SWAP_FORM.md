# 🔧 DEBUG GUIDE - Swap Battery Form

## ✅ Các thay đổi đã thực hiện

### 1. **Sửa lỗi dropdown không giữ giá trị**

**Vấn đề:** 
- Khi chọn xe từ dropdown, giá trị bị reset về "-- Chọn xe --"
- ContractId và oldBatteryId không tự động điền

**Nguyên nhân:**
- `vehicleId` từ backend là `number` (int)
- Giá trị từ `<select>` là `string`
- So sánh `v.vehicleId === vehicleId` luôn trả về `false` vì khác kiểu dữ liệu

**Giải pháp:**
```javascript
// TRƯỚC (SAI):
const handleVehicleSelect = (e) => {
    const vehicleId = e.target.value; // string "1"
    const vehicle = userVehicles.find(v => v.vehicleId === vehicleId); 
    // ❌ So sánh: 1 === "1" → false
}

// SAU (ĐÚNG):
const handleVehicleSelect = (e) => {
    const vehicleIdStr = e.target.value; // string "1"
    const vehicleIdNum = parseInt(vehicleIdStr, 10); // number 1
    const vehicle = userVehicles.find(v => v.vehicleId === vehicleIdNum);
    // ✅ So sánh: 1 === 1 → true
}
```

### 2. **Thêm state riêng cho vehicleId**

```javascript
const [selectedVehicleId, setSelectedVehicleId] = useState(''); // State riêng cho dropdown
```

Dùng `selectedVehicleId` (string) cho dropdown `value`, để tránh lỗi controlled component.

### 3. **Cải thiện UI**

- ✅ Thêm checkmark (✅) khi đã điền contractId/oldBatteryId
- ✅ Thay đổi màu text (xanh lá = có dữ liệu, xám = chưa có)
- ✅ Hiển thị "Chưa có dữ liệu" thay vì để trống

## 📝 Cách kiểm tra

### Bước 1: Mở Console (F12)
Khi chọn xe, bạn sẽ thấy log:
```
🚗 Đã chọn vehicleId (string): "1"
🚗 vehicleId (number): 1
🚗 Danh sách xe: [...]
🚗 Xe tìm thấy: {...}
✅ Đã set vehicle: {...}
```

### Bước 2: Kiểm tra các trường
- **Contract ID**: Phải tự động hiển thị sau khi chọn xe
- **Pin cũ ID**: Phải tự động hiển thị sau khi chọn xe
- **Dropdown xe**: Phải giữ giá trị đã chọn (không reset về "-- Chọn xe --")

### Bước 3: Test flow đầy đủ
1. Nhập User ID: `driver001` hoặc `U123456789ab`
2. Click "Tiếp theo"
3. Chọn xe từ dropdown
4. Kiểm tra Contract ID và Pin cũ ID đã tự động điền
5. Nhập Pin mới ID: `101`
6. Click "Bắt đầu Đổi Pin"

## 🐛 Các lỗi có thể gặp

### Lỗi 1: "Không tìm thấy xe với vehicleId: X"
**Nguyên nhân:** Backend trả về vehicleId không khớp với dữ liệu
**Giải pháp:** Kiểm tra console log và xem cấu trúc dữ liệu từ API

### Lỗi 2: contractId = null hoặc undefined
**Nguyên nhân:** User chưa có hợp đồng active
**Giải pháp:** 
- Kiểm tra bảng `Contracts` trong DB
- Đảm bảo có ít nhất 1 contract với `status = 'active'` và `vehicle_id = X`

### Lỗi 3: oldBatteryId = null
**Nguyên nhân:** Xe chưa được gán pin (`current_battery_id = NULL`)
**Giải pháp:** 
- Cập nhật bảng `Vehicles`, set `current_battery_id = <battery_id>`
- Hoặc cho phép đổi pin mà không cần old battery

## 📊 Cấu trúc dữ liệu Backend

### API Response: `GET /api/users/{userId}/vehicles`
```json
{
  "success": true,
  "data": [
    {
      "vehicleId": 1,           // ⚠️ Kiểu NUMBER (int)
      "userId": "driver001",
      "plateNumber": "30B-6789",
      "vehicleModel": "VinFast VF8",
      "batteryId": 101,          // ⚠️ Kiểu NUMBER hoặc null
      "contractId": 5,           // ⚠️ Kiểu NUMBER hoặc null
      "health": 95.5,
      "currentOdometer": 12500.0
    }
  ]
}
```

## 🎯 Checklist hoàn thành

- [x] Form bước 1: Nhập User ID
- [x] Form bước 2: Chọn xe từ dropdown
- [x] Dropdown giữ giá trị đã chọn
- [x] contractId tự động điền
- [x] oldBatteryId tự động điền
- [x] staffId lấy từ AuthContext
- [x] stationId cố định = 1
- [x] Backend: Thêm field `contractId` vào `VehicleBatteryInfo`
- [x] Backend: JOIN với bảng `Contracts`
- [x] UI: Hiển thị checkmark khi có dữ liệu
- [x] Log debug đầy đủ

## 🚀 Next Steps

1. Test với dữ liệu thật
2. Xử lý trường hợp xe không có hợp đồng
3. Xử lý trường hợp xe chưa có pin
4. Thêm validation cho newBatteryId
