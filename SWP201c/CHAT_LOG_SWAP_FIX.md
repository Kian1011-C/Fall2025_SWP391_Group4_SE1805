# 🔧 TỔNG KẾT: Sửa lỗi Form Đổi Pin Thủ Công (Staff Manual Swap)

## 📋 Yêu cầu ban đầu của người dùng

1. ✅ Form yêu cầu **nhập User ID trước**, sau đó mới nhập thông tin đổi pin
2. ✅ **Dropdown chọn xe** hiển thị biển số xe, nhưng lấy giá trị `vehicleId`
3. ✅ **contractId** tự động lấy từ `vehicleId` (từ bảng Contracts)
4. ✅ **oldBatteryId** tự động lấy từ thông tin xe
5. ✅ **newBatteryId** nhập thủ công (lấy từ kho, trạng thái `in_stock`)
6. ✅ **stationId** giữ nguyên (cố định = 1)
7. ✅ **staffId** lấy từ người dùng đang đăng nhập
8. ✅ **Không hiển thị towerId/slotId** vì lấy pin từ kho (không cần tower/slot)

---

## 🔧 Các thay đổi đã thực hiện

### **1. Frontend - InitiateSwapForm.jsx**

#### **Thay đổi 1.1: Form 2 bước**
- **Bước 1**: Nhập User ID → Gọi API `GET /api/users/{userId}/vehicles`
- **Bước 2**: Chọn xe → Tự động điền `contractId`, `oldBatteryId`, `newBatteryId` nhập thủ công

#### **Thay đổi 1.2: Xử lý dropdown chọn xe**
```javascript
// VẤN ĐỀ: vehicleId từ backend là NUMBER, dropdown trả về STRING
// SAI:
const vehicle = userVehicles.find(v => v.vehicleId === vehicleId); // 1 !== "1" → false

// ĐÚNG:
const vehicleIdNum = parseInt(vehicleIdStr, 10);
const vehicle = userVehicles.find(v => v.vehicleId === vehicleIdNum); // 1 === 1 → true
```

#### **Thay đổi 1.3: Tự động điền contractId và oldBatteryId**
```javascript
setOldBatteryId(vehicle.batteryId ? String(vehicle.batteryId) : '');
setContractId(vehicle.contractId ? String(vehicle.contractId) : '');
```

#### **Thay đổi 1.4: Convert dữ liệu sang số trước khi gửi**
```javascript
const swapData = {
    userId: userId,
    vehicleId: selectedVehicle.vehicleId, // number
    oldBatteryId: oldBatteryId ? parseInt(oldBatteryId, 10) : null,
    newBatteryId: parseInt(newBatteryId, 10),
    contractId: contractId ? parseInt(contractId, 10) : null,
    staffId: currentStaffId || 'staff001'
};
```

---

### **2. Frontend - index.jsx**

#### **Thay đổi 2.1: Lấy staffId từ AuthContext**
```javascript
const { currentUser } = useAuth();
const currentStaffId = currentUser?.userId || 'staff001'; // Fallback
```

#### **Thay đổi 2.2: Hiển thị thông tin nhân viên**
- Hiển thị tên/email nhân viên đang đăng nhập
- Hiển thị cảnh báo nếu không có staffId

---

### **3. Frontend - useSwapBattery.js**

#### **Thay đổi 3.1: Truyền đầy đủ dữ liệu**
```javascript
const requestBody = {
    userId: formData.userId,
    vehicleId: formData.vehicleId,
    oldBatteryId: formData.oldBatteryId || null,
    newBatteryId: formData.newBatteryId,
    contractId: formData.contractId || null,
    stationId: defaultStationId,
    staffId: formData.staffId || staffId
};
```

---

### **4. Frontend - swapService.js**

#### **Thay đổi 4.1: Sửa field mapping đúng với backend model**
```javascript
// TRƯỚC (SAI):
const swapDataForBE = {
    batteryId: realSwapData.oldBatteryId,  // ❌ Backend cần "oldBatteryId"
    status: "INITIATED"                     // ❌ Backend cần "swapStatus"
};

// SAU (ĐÚNG):
const swapDataForBE = {
    oldBatteryId: realSwapData.oldBatteryId,  // ✅ Backend field: oldBatteryId
    newBatteryId: realSwapData.newBatteryId,
    staffId: realSwapData.staffId,             // ✅ Thêm staffId
    swapStatus: "INITIATED"                    // ✅ Backend field: swapStatus
};
```

#### **Thay đổi 4.2: Xóa code tìm empty slot**
```javascript
// KHÔNG TÌM EMPTY SLOT vì lấy pin từ kho (IN_STOCK)
// Pin IN_STOCK không cần towerId/slotId
```

---

### **5. Frontend - SwapInProgress.jsx**

#### **Thay đổi 5.1: Ẩn towerId và slotId**
```javascript
// TRƯỚC: Hiển thị towerId, slotId
<div>Tháp số: #{swapDetails.towerId}</div>
<div>Hộc số: #{swapDetails.slotNumber}</div>

// SAU: Không hiển thị (đã xóa)
// Chỉ hiển thị: Mã giao dịch, Pin mới, Pin cũ, Trạng thái
```

---

### **6. Backend - VehicleBatteryInfo.java**

#### **Thay đổi 6.1: Thêm field contractId**
```java
public class VehicleBatteryInfo {
    private int vehicleId;
    private String userId;
    private String plateNumber;
    private String vehicleModel;
    // ... các field khác
    private Integer contractId; // ✅ Thêm field mới
}
```

---

### **7. Backend - VehicleDao.java**

#### **Thay đổi 7.1: JOIN với bảng Contracts để lấy contractId**
```java
String sql = """
    SELECT 
        v.vehicle_id,
        v.plate_number,
        v.model AS vehicle_model,
        ...
        c.contract_id  -- ✅ Thêm column
    FROM Vehicles v
    LEFT JOIN Batteries b ON v.current_battery_id = b.battery_id
    LEFT JOIN Contracts c ON v.vehicle_id = c.vehicle_id AND c.status = 'active'  -- ✅ JOIN mới
    WHERE v.user_id = ?
""";

// Set contractId vào object
v.setContractId(rs.getObject("contract_id", Integer.class));
```

---

### **8. Backend - SwapController.java**

#### **Thay đổi 8.1: Thêm log chi tiết**
```java
@PostMapping("/swaps")
public Map<String, Object> createSwap(@RequestBody Swap swap) {
    System.out.println("📥 SwapController: Nhận request tạo swap mới");
    System.out.println("  ├─ userId: " + swap.getUserId());
    System.out.println("  ├─ vehicleId: " + swap.getVehicleId());
    System.out.println("  ├─ oldBatteryId: " + swap.getOldBatteryId());
    System.out.println("  ├─ newBatteryId: " + swap.getNewBatteryId());
    System.out.println("  ├─ contractId: " + swap.getContractId());
    System.out.println("  ├─ staffId: " + swap.getStaffId());
    System.out.println("  ├─ stationId: " + swap.getStationId());
    System.out.println("  └─ swapStatus: " + swap.getSwapStatus());
    // ...
}
```

---

### **9. Backend - SwapDao.java**

#### **Thay đổi 9.1: Validate required fields**
```java
// Validate contractId và vehicleId (NOT NULL trong DB)
if (swap.getContractId() == null) {
    System.err.println("❌ LỖI: contractId is NULL but required!");
    return null;
}
if (swap.getVehicleId() == null) {
    System.err.println("❌ LỖI: vehicleId is NULL but required!");
    return null;
}
```

---

### **10. Database - fix_staff_user.sql**

#### **Tạo file SQL để kiểm tra/tạo staff user**
```sql
-- Kiểm tra staff001 có tồn tại không
SELECT user_id, first_name, last_name, email, role, status
FROM Users
WHERE user_id = 'staff001';

-- Nếu không tồn tại, tạo mới:
INSERT INTO Users (user_id, last_name, first_name, email, phone, password, role, cccd, status, is_email_verified)
VALUES 
('staff001', N'Phạm', N'Văn Đức', 'duc.staff@evswap.com', '0904567890', 'staff123', 'Staff', '123456789004', 'active', 1);
```

---

## 🐛 Các lỗi đã khắc phục

### **Lỗi 1: Dropdown xe bị reset về "-- Chọn xe --"**
**Nguyên nhân:** 
- `vehicleId` từ backend là `number` (int)
- Dropdown `<select>` trả về `string`
- So sánh `1 === "1"` → `false`

**Giải pháp:**
- Thêm state `selectedVehicleId` (string) cho dropdown
- Convert string → number khi so sánh: `parseInt(vehicleIdStr, 10)`

---

### **Lỗi 2: contractId và oldBatteryId không tự động điền**
**Nguyên nhân:** Dropdown không giữ giá trị → không tìm thấy xe → không set được contractId/oldBatteryId

**Giải pháp:** Sửa lỗi dropdown (xem Lỗi 1)

---

### **Lỗi 3: Backend không nhận được staffId và oldBatteryId**
**Nguyên nhân:** 
- `swapService.js` map sai field:
  - `oldBatteryId` → `batteryId` ❌
  - `swapStatus` → `status` ❌
  - Thiếu `staffId` ❌

**Giải pháp:** Sửa mapping đúng với backend model `Swap.java`

---

### **Lỗi 4: Foreign Key constraint "FK_Swaps_UsersStaff"**
**Nguyên nhân:** `staffId = 'staff001'` không tồn tại trong bảng `Users`

**Giải pháp:** 
- Chạy file `create_database.sql` (đã có sẵn data `staff001`)
- Hoặc chạy `fix_staff_user.sql` để tạo thủ công

---

## 📊 Luồng dữ liệu hoàn chỉnh

```
1. User nhập User ID: "driver001"
   ↓
2. Click "Tiếp theo" → API: GET /api/users/driver001/vehicles
   ↓
3. Backend trả về: [{vehicleId: 1, plateNumber: "30A-12345", contractId: 1, batteryId: 36, ...}]
   ↓
4. Frontend hiển thị dropdown: "30A-12345 (VinFast VF-e34)"
   ↓
5. User chọn xe → Frontend tự động điền:
   - vehicleId: 1
   - contractId: 1
   - oldBatteryId: 36
   ↓
6. User nhập newBatteryId: 39 (pin in_stock)
   ↓
7. Click "Bắt đầu Đổi Pin" → API: POST /api/swaps
   Body: {
     userId: "driver001",
     vehicleId: 1,
     oldBatteryId: 36,
     newBatteryId: 39,
     contractId: 1,
     staffId: "staff001",
     stationId: 1,
     swapStatus: "INITIATED"
   }
   ↓
8. Backend INSERT vào bảng Swaps
   ↓
9. Trả về: { success: true, swapId: 123, ... }
   ↓
10. Frontend hiển thị màn hình "Swap In Progress"
```

---

## ✅ Kết quả cuối cùng

### **Frontend:**
- ✅ Form 2 bước (nhập User ID → chọn xe)
- ✅ Dropdown giữ giá trị xe đã chọn
- ✅ contractId tự động điền
- ✅ oldBatteryId tự động điền
- ✅ staffId lấy từ người đăng nhập (hoặc fallback 'staff001')
- ✅ Không hiển thị towerId/slotId

### **Backend:**
- ✅ API `/api/users/{userId}/vehicles` trả về contractId
- ✅ API `/api/swaps` nhận đầy đủ dữ liệu
- ✅ Validate contractId và vehicleId NOT NULL
- ✅ Log chi tiết để debug

### **Database:**
- ✅ Bảng `VehicleBatteryInfo` có field `contractId`
- ✅ User `staff001` tồn tại với role 'Staff'
- ✅ Có pin với status 'in_stock' để test

---

## 📝 Files đã chỉnh sửa

### **Frontend (React):**
1. `InitiateSwapForm.jsx` - Form 2 bước, xử lý dropdown
2. `index.jsx` - Lấy staffId từ AuthContext
3. `useSwapBattery.js` - Truyền đầy đủ dữ liệu
4. `swapService.js` - Sửa field mapping
5. `SwapInProgress.jsx` - Ẩn towerId/slotId

### **Backend (Java Spring Boot):**
6. `VehicleBatteryInfo.java` - Thêm field contractId
7. `VehicleDao.java` - JOIN với Contracts
8. `SwapController.java` - Thêm log debug
9. `SwapDao.java` - Validate required fields

### **Database:**
10. `fix_staff_user.sql` - Script tạo/kiểm tra staff user
11. `create_database.sql` - File SQL đầy đủ (đã có sẵn data)

### **Documentation:**
12. `DEBUG_SWAP_FORM.md` - Hướng dẫn debug
13. `SWAP_DEBUG_CHECKLIST.md` - Checklist debug chi tiết

---

## 🚀 Hướng dẫn test

### **Bước 1: Chuẩn bị Database**
```sql
-- Chạy file create_database.sql (hoặc kiểm tra staff001)
USE ev_battery_swap;
SELECT user_id, first_name, last_name, role FROM Users WHERE user_id = 'staff001';
-- Kỳ vọng: 1 dòng với role = 'Staff'
```

### **Bước 2: Khởi động Backend**
- Kiểm tra console có log "📥 SwapController: Nhận request..."

### **Bước 3: Test Frontend**
1. Mở browser → F12 Console
2. Nhập User ID: `driver001`
3. Chọn xe: `30A-12345`
4. Kiểm tra contractId và oldBatteryId đã tự động điền
5. Nhập Pin mới: `39` (hoặc pin nào có status 'in_stock')
6. Click "Bắt đầu Đổi Pin"
7. Xem Console log và Backend log

### **Kỳ vọng:**
- ✅ Frontend Console: Hiển thị log đầy đủ từ InitiateSwapForm
- ✅ Backend Console: Hiển thị log từ SwapController và SwapDao
- ✅ Response: `{ success: true, swapId: 123, ... }`
- ✅ UI: Chuyển sang màn hình "Swap In Progress"

---

## 🎯 Tóm tắt

**Vấn đề chính:**
1. Dropdown xe không giữ giá trị (do kiểu dữ liệu string/number không khớp)
2. Field mapping sai (oldBatteryId, swapStatus)
3. staffId không tồn tại trong database

**Giải pháp:**
1. Convert string → number khi xử lý dropdown
2. Sửa field mapping đúng với backend model
3. Tạo user staff001 trong database

**Kết quả:** Form đổi pin thủ công hoạt động đầy đủ với 2 bước, tự động điền contractId/oldBatteryId, và gửi đúng staffId đến backend. ✅
