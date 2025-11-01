# 🐛 Debug Hướng Dẫn: Battery CRUD Không Hoạt Động

## 📋 Checklist Debug

### **Bước 1: Kiểm tra Backend có chạy không?**

```bash
# Mở terminal trong thư mục backend
cd "c:\Users\truon\Downloads\Fall2025_SWP391_Group4_SE1805-feature-backend-thanh (5)\Fall2025_SWP391_Group4_SE1805-feature-backend-thanh\EvDrivers"

# Build lại backend
mvn clean compile

# Chạy backend
mvn spring-boot:run
```

**Kỳ vọng:**
- Backend chạy ở port `8080`
- Console hiển thị: `Started EvDriversApplication in X seconds`

---

### **Bước 2: Kiểm tra Frontend có connect được backend không?**

Mở **Browser Console** (F12):

```javascript
// Test API connection
fetch('http://localhost:8080/api/batteries')
  .then(res => res.json())
  .then(data => console.log('✅ Backend connected:', data))
  .catch(err => console.error('❌ Backend error:', err));
```

**Nếu lỗi CORS:**
```
Access to fetch at 'http://localhost:8080/api/batteries' from origin 'http://localhost:5173' 
has been blocked by CORS policy
```

**Giải pháp:** Kiểm tra `@CrossOrigin` trong `BatteryController.java`

---

### **Bước 3: Kiểm tra Log khi click "Lưu"**

#### **Frontend Console (F12):**

Khi click nút **"Lưu"** trong modal, bạn sẽ thấy log này:

```
🔵 BatteryFormModal: Submit form
  ├─ isEditing: false
  ├─ batteryId: undefined
  ├─ formData: {model: "VinFast VF-e34 Battery", capacity: "100", stateOfHealth: "100", cycleCount: "0", status: "available"}
  └─ submitData (converted): {model: "VinFast VF-e34 Battery", capacity: 100, stateOfHealth: 100, cycleCount: 0, status: "available"}

🟢 AdminBatteries: handleSave called
  ├─ batteryId: undefined
  └─ formData: {model: "VinFast VF-e34 Battery", capacity: 100, stateOfHealth: 100, cycleCount: 0, status: "available"}

➕ Calling handleCreate...

🔵 useBatteriesData: handleCreate called with: {model: "VinFast VF-e34 Battery", capacity: 100, stateOfHealth: 100, cycleCount: 0, status: "available"}

BatteryService: Tạo pin mới {model: "VinFast VF-e34 Battery", capacity: 100, stateOfHealth: 100, cycleCount: 0, status: "available"}

🔵 useBatteriesData: createBattery response: {success: true, data: {...}, message: "Tạo pin thành công"}

📬 Response: {success: true, data: {...}, message: "Tạo pin thành công"}
```

#### **Backend Console:**

```
📥 BatteryController: Nhận request tạo pin mới
  ├─ model: VinFast VF-e34 Battery
  ├─ capacity: 100
  ├─ stateOfHealth: 100.0
  ├─ cycleCount: 0
  └─ status: available
✅ Pin tạo thành công!
```

---

### **Bước 4: Kiểm tra các vấn đề thường gặp**

#### **Vấn đề 1: Không có log nào trong Console**

**Nguyên nhân:** Frontend chưa build lại sau khi sửa code

**Giải pháp:**
```bash
# Ctrl+C để stop dev server
# Sau đó chạy lại:
npm run dev
```

---

#### **Vấn đề 2: Log dừng ở "Calling handleCreate..." không có response**

**Nguyên nhân:** Backend không chạy hoặc API endpoint sai

**Kiểm tra:**
1. Backend có chạy không? → `http://localhost:8080/api/batteries`
2. Port có đúng không? → Kiểm tra `api.js` có `BASE_URL: 'http://localhost:8080'`

---

#### **Vấn đề 3: Backend trả về lỗi 400 Bad Request**

**Nguyên nhân:** Dữ liệu gửi lên không đúng format

**Kiểm tra Backend Console:**
```
📥 BatteryController: Nhận request tạo pin mới
  ├─ model: VinFast VF-e34 Battery
  ├─ capacity: 100
  ├─ stateOfHealth: 100.0
  ├─ cycleCount: 0
  └─ status: available
❌ Lỗi: Model is required
```

**Giải pháp:** Kiểm tra `formData` có đầy đủ field required không

---

#### **Vấn đề 4: Backend trả về lỗi 500 Internal Server Error**

**Nguyên nhân:** Lỗi SQL hoặc database connection

**Kiểm tra Backend Console:**
```
❌ Lỗi khi tạo pin: java.sql.SQLException: Invalid column name 'cycle_count'
```

**Giải pháp:**
1. Database có column `cycle_count` không?
2. `BatteryDao.java` đã build lại chưa? → `mvn clean compile`

---

#### **Vấn đề 5: Status không lưu đúng (hiển thị "available" nhưng DB là "AVAILABLE")**

**Nguyên nhân:** Backend convert lowercase → UPPERCASE

**Đây là behavior ĐÚNG!** Backend tự động convert:
- Frontend gửi: `"available"`
- Backend lưu: `"AVAILABLE"`
- Frontend hiển thị: `"available"` (lowercase trong BatteryRow.jsx)

---

### **Bước 5: Test từng API riêng lẻ**

#### **Test CREATE API:**

```bash
# Mở terminal hoặc Postman
curl -X POST http://localhost:8080/api/batteries \
  -H "Content-Type: application/json" \
  -d '{
    "model": "Test Battery",
    "capacity": 100,
    "stateOfHealth": 100,
    "cycleCount": 0,
    "status": "AVAILABLE"
  }'
```

**Kỳ vọng Response:**
```json
{
  "success": true,
  "message": "Battery created successfully",
  "data": {
    "batteryId": 42,
    "model": "Test Battery",
    "capacity": 100,
    "stateOfHealth": 100.0,
    "cycleCount": 0,
    "status": "AVAILABLE"
  }
}
```

---

#### **Test UPDATE API:**

```bash
curl -X PUT http://localhost:8080/api/batteries/42 \
  -H "Content-Type: application/json" \
  -d '{
    "model": "Test Battery Updated",
    "capacity": 100,
    "stateOfHealth": 95,
    "cycleCount": 10,
    "status": "CHARGING"
  }'
```

**Kỳ vọng Response:**
```json
{
  "success": true,
  "message": "Battery updated successfully",
  "data": {
    "batteryId": 42,
    "model": "Test Battery Updated",
    "capacity": 100,
    "stateOfHealth": 95.0,
    "cycleCount": 10,
    "status": "CHARGING"
  }
}
```

---

#### **Test DELETE API:**

```bash
curl -X DELETE http://localhost:8080/api/batteries/42
```

**Kỳ vọng Response:**
```json
{
  "success": true,
  "message": "Battery deleted successfully"
}
```

---

### **Bước 6: Kiểm tra Database**

```sql
-- Mở SQL Server Management Studio
USE ev_battery_swap;

-- Kiểm tra column cycle_count có tồn tại không
SELECT COLUMN_NAME, DATA_TYPE 
FROM INFORMATION_SCHEMA.COLUMNS 
WHERE TABLE_NAME = 'Batteries' 
  AND COLUMN_NAME = 'cycle_count';

-- Kỳ vọng: 1 dòng với DATA_TYPE = 'int'

-- Thử INSERT thủ công
INSERT INTO Batteries (model, capacity, state_of_health, status, cycle_count)
VALUES ('Manual Test', 100, 100, 'AVAILABLE', 0);

-- Kiểm tra kết quả
SELECT * FROM Batteries WHERE model = 'Manual Test';

-- Xóa test data
DELETE FROM Batteries WHERE model = 'Manual Test';
```

---

## 🔍 Các Lỗi Thường Gặp Và Cách Fix

| Lỗi | Nguyên Nhân | Giải Pháp |
|-----|-------------|-----------|
| **CORS Policy Error** | Backend không cho phép request từ frontend | Thêm `@CrossOrigin` vào `BatteryController.java` |
| **404 Not Found** | URL sai hoặc backend chưa chạy | Kiểm tra `http://localhost:8080/api/batteries` |
| **400 Bad Request: Model is required** | Frontend không gửi field `model` | Kiểm tra `formData` trong console log |
| **500 Internal Server Error: cycle_count** | Database thiếu column hoặc BatteryDao chưa build | Build lại backend: `mvn clean compile` |
| **Modal đóng nhưng không thấy pin mới** | `fetchBatteries()` không được gọi | Kiểm tra `response.success` có `true` không |
| **Pin tạo thành công nhưng cycleCount = null** | Backend không nhận được `cycleCount` | Kiểm tra `submitData` trong console log |

---

## 🎯 Hướng Dẫn Nhanh: "Tôi không thấy gì cả!"

1. ✅ **Mở F12 Console** → Nhìn thấy log không?
   - ❌ Không có log → Frontend chưa build lại → `npm run dev`
   - ✅ Có log → Tiếp bước 2

2. ✅ **Log có "Calling handleCreate..." không?**
   - ❌ Không có → Form không submit → Kiểm tra nút "Lưu" có `type="submit"` không
   - ✅ Có → Tiếp bước 3

3. ✅ **Log có "BatteryService: Tạo pin mới" không?**
   - ❌ Không có → Hook không gọi service → Kiểm tra `useBatteriesData.js`
   - ✅ Có → Tiếp bước 4

4. ✅ **Log có "Response:" với `success: true` không?**
   - ❌ Không có hoặc `success: false` → Backend lỗi → Xem Backend Console
   - ✅ Có → Pin đã tạo thành công! Refresh trang nếu không thấy.

---

## 📝 Template Báo Lỗi

Nếu vẫn không hoạt động, hãy cung cấp thông tin này:

```
**Frontend Console Log:**
[Copy toàn bộ log từ F12 Console khi click "Lưu"]

**Backend Console Log:**
[Copy toàn bộ log từ terminal backend]

**Hành động thực hiện:**
1. Click "Thêm Pin Mới"
2. Điền: Model = "Test", Capacity = 100, ...
3. Click "Lưu"

**Kết quả:**
- Modal có đóng không? [Có/Không]
- Có alert notification không? [Có/Không/Alert nội dung gì]
- Pin có xuất hiện trong danh sách không? [Có/Không]

**Database Check:**
SELECT * FROM Batteries ORDER BY battery_id DESC;
[Copy 5 dòng đầu tiên]
```

---

## ✅ Checklist Cuối Cùng

Trước khi test, đảm bảo:

- [ ] Backend đã build lại: `mvn clean compile`
- [ ] Backend đang chạy: `mvn spring-boot:run`
- [ ] Frontend đang chạy: `npm run dev`
- [ ] Database đang chạy và có data mẫu
- [ ] F12 Console đang mở để xem log
- [ ] Backend Console (terminal) đang hiển thị log
- [ ] Đã clear cache browser (Ctrl+Shift+R)

**Nếu tất cả đều OK, hãy test theo thứ tự:**
1. Test GET (Load danh sách) → Phải thấy pins hiện tại
2. Test DELETE (Xóa 1 pin) → Phải thấy pin biến mất
3. Test CREATE (Thêm pin mới) → Phải thấy pin mới xuất hiện
4. Test UPDATE (Sửa pin vừa tạo) → Phải thấy thông tin thay đổi

**Nếu bước nào fail, dừng lại và debug bước đó trước!**
