# 🔧 SWAP DEBUG CHECKLIST

## ❌ Lỗi hiện tại:
```
Không thể tạo bản ghi đổi pin
```

## 📋 CHECKLIST DEBUG (Thực hiện từng bước)

### ✅ Bước 1: Kiểm tra Frontend Console (F12)
Mở Console và tìm các log sau:

#### 1.1. Log từ InitiateSwapForm.jsx:
```
📤 [InitiateSwapForm] Dữ liệu gửi đi:
  ├─ userId: ...
  ├─ vehicleId: ... (type: number)
  ├─ oldBatteryId: ... (type: number hoặc null)
  ├─ newBatteryId: ... (type: number)
  ├─ contractId: ... (type: number hoặc null)  ⚠️ QUAN TRỌNG
  └─ staffId: ... (type: string)
```

**Kiểm tra:**
- [ ] `contractId` có giá trị? (không được null)
- [ ] `vehicleId` có giá trị? (không được null)
- [ ] `staffId` có giá trị?

#### 1.2. Log từ swapService.js:
```
📤 GỌI API TẠO SWAP (POST /api/swaps)
Payload sẽ gửi đến backend:
  ├─ userId: ...
  ├─ contractId: ...  ⚠️ PHẢI CÓ GIÁ TRỊ
  ├─ vehicleId: ...   ⚠️ PHẢI CÓ GIÁ TRỊ
  ├─ oldBatteryId: ...
  ├─ newBatteryId: ...
  ├─ stationId: ...
  ├─ staffId: ...
  └─ swapStatus: "INITIATED"
```

**Kiểm tra:**
- [ ] `contractId` là số (không phải null/undefined)
- [ ] `vehicleId` là số (không phải null/undefined)

---

### ✅ Bước 2: Kiểm tra Backend Console (IntelliJ/Eclipse)

#### 2.1. Log từ SwapController:
```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📥 SwapController: Nhận request tạo swap mới
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  ├─ userId: ...
  ├─ vehicleId: ...   ⚠️ PHẢI CÓ GIÁ TRỊ
  ├─ oldBatteryId: ...
  ├─ newBatteryId: ...
  ├─ contractId: ...  ⚠️ PHẢI CÓ GIÁ TRỊ
  ├─ staffId: ...
  ├─ stationId: ...
  └─ swapStatus: ...
```

**Kiểm tra:**
- [ ] `contractId` có giá trị?
- [ ] `vehicleId` có giá trị?

#### 2.2. Log từ SwapDao:
```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📥 SwapDao: Chuẩn bị INSERT vào database
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  ├─ userId: ...
  ├─ contractId: ... (NOT NULL REQUIRED)  ⚠️ CRITICAL
  ├─ vehicleId: ... (NOT NULL REQUIRED)   ⚠️ CRITICAL
  ...
```

**Kiểm tra:**
- [ ] Có thấy log "❌ LỖI: contractId is NULL but required!" không?
- [ ] Có thấy log "❌ LỖI: vehicleId is NULL but required!" không?
- [ ] Có thấy exception SQL không?

---

### ✅ Bước 3: Kiểm tra Database

#### 3.1. Kiểm tra xe có contractId không:
```sql
SELECT 
    v.vehicle_id,
    v.plate_number,
    v.user_id,
    c.contract_id,
    c.status AS contract_status
FROM Vehicles v
LEFT JOIN Contracts c ON v.vehicle_id = c.vehicle_id AND c.status = 'active'
WHERE v.user_id = 'driver001';  -- Thay bằng userId thực tế
```

**Kỳ vọng:**
- Phải có ít nhất 1 xe với `contract_id IS NOT NULL`
- Contract có `status = 'active'`

#### 3.2. Kiểm tra pin IN_STOCK:
```sql
SELECT battery_id, model, status, state_of_health
FROM Batteries
WHERE status = 'in_stock';
```

**Kỳ vọng:**
- Phải có ít nhất 1 pin với `status = 'in_stock'`

#### 3.3. Kiểm tra cấu trúc bảng Swaps:
```sql
SELECT COLUMN_NAME, IS_NULLABLE, DATA_TYPE
FROM INFORMATION_SCHEMA.COLUMNS
WHERE TABLE_NAME = 'Swaps'
ORDER BY ORDINAL_POSITION;
```

**Kiểm tra:**
- [ ] `contract_id`: IS_NULLABLE = 'NO' (NOT NULL)
- [ ] `vehicle_id`: IS_NULLABLE = 'NO' (NOT NULL)

---

## 🔍 CÁC NGUYÊN NHÂN PHỔ BIẾN

### ❌ Nguyên nhân 1: contractId = null
**Triệu chứng:**
- Frontend log: `contractId: null` hoặc `contractId: undefined`
- Backend log: `contractId: null (NOT NULL REQUIRED)`

**Giải pháp:**
1. Kiểm tra xe có hợp đồng active không (xem SQL ở trên)
2. Nếu không có hợp đồng, tạo hợp đồng mới:
```sql
INSERT INTO Contracts (user_id, plan_id, vehicle_id, start_date, end_date, status)
VALUES ('driver001', 1, 1, GETDATE(), DATEADD(year, 1, GETDATE()), 'active');
```

### ❌ Nguyên nhân 2: vehicleId = null
**Triệu chứng:**
- Dropdown chọn xe bị reset về "-- Chọn xe --"
- Frontend log: `vehicleId: null`

**Giải pháp:**
- Kiểm tra `handleVehicleSelect` có convert string → number đúng không
- Kiểm tra `selectedVehicleId` state

### ❌ Nguyên nhân 3: Foreign Key constraint
**Triệu chứng:**
- Backend có exception SQL về foreign key
- Ví dụ: "INSERT statement conflicted with FOREIGN KEY constraint"

**Giải pháp:**
- Kiểm tra `contractId` tồn tại trong bảng `Contracts`
- Kiểm tra `vehicleId` tồn tại trong bảng `Vehicles`
- Kiểm tra `staffId` tồn tại trong bảng `Users`
- Kiểm tra `newBatteryId` tồn tại trong bảng `Batteries`

### ❌ Nguyên nhân 4: Data type mismatch
**Triệu chứng:**
- Backend nhận được string thay vì number

**Giải pháp:**
- Kiểm tra `InitiateSwapForm.jsx` có `parseInt()` đúng không
- Kiểm tra `swapService.js` không convert sai kiểu

---

## 📝 HƯỚNG DẪN FIX NHANH

### Fix 1: Tạo hợp đồng cho xe (nếu thiếu)
```sql
-- Tìm xe không có hợp đồng
SELECT v.vehicle_id, v.plate_number, v.user_id
FROM Vehicles v
LEFT JOIN Contracts c ON v.vehicle_id = c.vehicle_id AND c.status = 'active'
WHERE c.contract_id IS NULL;

-- Tạo hợp đồng mới
INSERT INTO Contracts (user_id, plan_id, vehicle_id, start_date, end_date, status)
SELECT 
    v.user_id,
    1,  -- plan_id (thay bằng plan thực tế)
    v.vehicle_id,
    GETDATE(),
    DATEADD(year, 1, GETDATE()),
    'active'
FROM Vehicles v
LEFT JOIN Contracts c ON v.vehicle_id = c.vehicle_id AND c.status = 'active'
WHERE c.contract_id IS NULL;
```

### Fix 2: Kiểm tra VehicleBatteryInfo có trả về contractId không
```java
// VehicleDao.java - Đã sửa (có contractId)
SELECT 
    v.vehicle_id,
    v.plate_number,
    v.model AS vehicle_model,
    ...
    c.contract_id  -- ✅ ĐÃ THÊM
FROM Vehicles v
LEFT JOIN Batteries b ON v.current_battery_id = b.battery_id
LEFT JOIN Contracts c ON v.vehicle_id = c.vehicle_id AND c.status = 'active'  -- ✅ ĐÃ JOIN
WHERE v.user_id = ?
```

---

## ✅ KẾT QUẢ KỲ VỌNG

Sau khi fix, bạn sẽ thấy:

**Frontend Console:**
```
✅ Đã set vehicle: {
  vehicleId: 1,
  plateNumber: "30B-6789",
  batteryId: 101,
  contractId: 5  // ✅ CÓ GIÁ TRỊ
}

📤 [InitiateSwapForm] Dữ liệu gửi đi:
  ├─ contractId: 5 (type: number)  // ✅ ĐÚNG
  └─ vehicleId: 1 (type: number)   // ✅ ĐÚNG
```

**Backend Console:**
```
📥 SwapDao: Chuẩn bị INSERT vào database
  ├─ contractId: 5 (NOT NULL REQUIRED)  // ✅ CÓ GIÁ TRỊ
  ├─ vehicleId: 1 (NOT NULL REQUIRED)   // ✅ CÓ GIÁ TRỊ

🔍 Đang thực thi SQL INSERT...
✅ Số dòng bị ảnh hưởng: 1
✅ Swap ID được tạo: 123
✅ Tạo swap thành công với ID: 123
```

**Frontend Response:**
```
📥 NHẬN RESPONSE TỪ POST /api/swaps
Response: {
  "success": true,
  "swapId": 123,
  "data": {...}
}
```
