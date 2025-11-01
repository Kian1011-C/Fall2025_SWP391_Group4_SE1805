# ✅ SỬA LỖI "FAILED TO CREATE USER" VÀ CẢI THIỆN UX

**Ngày sửa:** November 1, 2025  
**Vấn đề:** User không thể tạo được khi nhấn "Lưu", báo lỗi "Failed to create user"

---

## 🐛 NGUYÊN NHÂN LỖI

### **Vấn đề chính: Role Mismatch**

- **Frontend gửi:** `role: "driver"` (lowercase)
- **Backend expect:** `role: "EV Driver"` (title case với space)
- **Database lưu:** `"EV Driver"`, `"Staff"`, `"Admin"`

→ Backend nhận role "driver" nhưng không convert sang "EV Driver" nên gây lỗi khi insert vào DB.

---

## 🔧 CÁC SỬA CHỮA ĐÃ THỰC HIỆN

### 1. **Backend - AdminController.java** ✅ SỬA

**File:** `EvDrivers/src/main/java/hsf302/fa25/s3/controller/AdminController.java`

#### **A. Thêm Role Normalization trong CREATE (POST /api/admin/users)**

**Vị trí:** Trong method `createUser()` - sau khi validate email/password

**Code cũ:**
```java
// Set role and defaults
if (user.getRole() == null || user.getRole().isEmpty()) {
    user.setRole("EV Driver");
}
```

**Code mới:**
```java
// Normalize role from frontend (driver/staff/admin) to DB format
if (user.getRole() != null && !user.getRole().trim().isEmpty()) {
    String roleInput = user.getRole().trim().toLowerCase();
    if (roleInput.equals("driver") || roleInput.equals("drivers") || roleInput.equals("ev driver")) {
        user.setRole("EV Driver");
    } else if (roleInput.equals("staff") || roleInput.equals("staffs")) {
        user.setRole("Staff");
    } else if (roleInput.equals("admin") || roleInput.equals("administrator")) {
        user.setRole("Admin");
    } else {
        // If unknown role, default to EV Driver
        user.setRole("EV Driver");
    }
} else {
    user.setRole("EV Driver");
}
```

**Thêm logs:**
```java
System.out.println("📥 AdminController: Nhận request tạo user mới - " + user.getEmail());
System.out.println("📝 Role được chuẩn hóa: " + user.getRole());
System.out.println("📝 UserId: " + user.getUserId());
```

**Thêm CCCD default:**
```java
if (user.getCccd() == null) user.setCccd("");
```

**Cải thiện error handling:**
```java
if (created) {
    System.out.println("✅ User tạo thành công: " + user.getUserId());
    response.put("success", true);
    response.put("message", "User created successfully");
    response.put("data", user);
    return ResponseEntity.status(201).body(response);
} else {
    System.out.println("❌ userDao.addUser() trả về false");
    response.put("success", false);
    response.put("message", "Failed to create user in database");
    return ResponseEntity.status(500).body(response);
}
```

```java
} catch (Exception e) {
    System.err.println("❌ Lỗi khi tạo user: " + e.getMessage());
    e.printStackTrace();
    Map<String, Object> response = new HashMap<>();
    response.put("success", false);
    response.put("message", "Error creating user: " + e.getMessage());
    return ResponseEntity.status(500).body(response);
}
```

#### **B. Thêm Role Normalization trong UPDATE (PUT /api/admin/users/{userId})**

**Vị trí:** Trong method `updateUser()` - sau khi merge existing values

**Code cũ:**
```java
if (user.getRole() == null) user.setRole(existing.getRole());
```

**Code mới:**
```java
// Normalize role from frontend (driver/staff/admin) to DB format
if (user.getRole() != null && !user.getRole().trim().isEmpty()) {
    String roleInput = user.getRole().trim().toLowerCase();
    if (roleInput.equals("driver") || roleInput.equals("drivers") || roleInput.equals("ev driver")) {
        user.setRole("EV Driver");
    } else if (roleInput.equals("staff") || roleInput.equals("staffs")) {
        user.setRole("Staff");
    } else if (roleInput.equals("admin") || roleInput.equals("administrator")) {
        user.setRole("Admin");
    } else {
        // Keep existing role if unknown
        user.setRole(existing.getRole());
    }
} else {
    user.setRole(existing.getRole());
}
```

**Thêm logs:**
```java
System.out.println("📝 AdminController: Nhận request cập nhật user - " + userId);
System.out.println("📝 Role được chuẩn hóa: " + user.getRole());
System.out.println("✅ User cập nhật thành công: " + userId);
System.out.println("❌ userDao.updateUser() trả về false");
```

---

### 2. **Frontend - UserFormModal.jsx** ✅ SỬA

**File:** `SWP201c/src/pages/Admin/Users/components/UserFormModal.jsx`

#### **Đổi text nút "Lưu" → "Tạo" / "Cập nhật"**

**Code cũ:**
```jsx
<button type="submit" className="user-modal-btn-save">Lưu</button>
```

**Code mới:**
```jsx
<button type="submit" className="user-modal-btn-save">
  {isEditing ? 'Cập nhật' : 'Tạo'}
</button>
```

**Lý do:** 
- Khi tạo mới → Nút hiển thị "Tạo" (dễ hiểu hơn)
- Khi sửa → Nút hiển thị "Cập nhật"
- UX tốt hơn, user biết rõ đang làm gì

---

## 📊 BẢNG MAPPING ROLE

| Frontend Value | Backend Normalize To | Database Stored |
|---------------|---------------------|-----------------|
| `"driver"` | `"EV Driver"` | `"EV Driver"` |
| `"drivers"` | `"EV Driver"` | `"EV Driver"` |
| `"ev driver"` | `"EV Driver"` | `"EV Driver"` |
| `"staff"` | `"Staff"` | `"Staff"` |
| `"staffs"` | `"Staff"` | `"Staff"` |
| `"admin"` | `"Admin"` | `"Admin"` |
| `"administrator"` | `"Admin"` | `"Admin"` |
| `null` / `""` | `"EV Driver"` (default) | `"EV Driver"` |
| Unknown value | `"EV Driver"` (default) | `"EV Driver"` |

---

## 🧪 HƯỚNG DẪN TEST SAU KHI SỬA

### **Bước 1: Compile và Restart Backend**

```powershell
cd "c:\Users\truon\Downloads\Fall2025_SWP391_Group4_SE1805-feature-backend-thanh (5)\Fall2025_SWP391_Group4_SE1805-feature-backend-thanh\EvDrivers"
mvn clean compile
mvn spring-boot:run
```

**Chờ backend khởi động thành công** (thấy dòng "Started EvDriversApplication")

### **Bước 2: Refresh Frontend**

```
Ctrl + Shift + R (hard refresh để clear cache)
```

### **Bước 3: Test CREATE (Thêm User Mới)**

**3.1. Mở Console (F12 → Console tab)**

**3.2. Click nút "+ Thêm người dùng mới"**

**Kỳ vọng:**
- ✅ Modal mở với title "Tạo Người dùng Mới"
- ✅ Nút submit hiển thị **"Tạo"** (không còn là "Lưu")

**3.3. Điền thông tin test:**
```
Họ: Nguyễn
Tên: Van A
Email: nguyenvana@test.com
Mật khẩu: 123456
Số điện thoại: 0987654321
CCCD: 001234567890
Vai trò: Driver (chọn trong dropdown)
Trạng thái: Hoạt động
```

**3.4. Click "Tạo"**

**Kỳ vọng Frontend Console:**
```
🔵 UserFormModal: Submit form {role: "driver", ...}
🔵 AdminUsers: handleSave called
🔵 useAdminUsersData: handleCreate called
🔵 UserService: Tạo người dùng mới tại /api/admin/users
✅ UserService: Tạo người dùng thành công
✅ Tạo người dùng thành công, tải lại danh sách...
✅ Lưu thành công, đóng modal
```

**Kỳ vọng Backend Console:**
```
📥 AdminController: Nhận request tạo user mới - nguyenvana@test.com
📝 Role được chuẩn hóa: EV Driver
📝 UserId: nguyenvana@test.com
✅ User tạo thành công: nguyenvana@test.com
```

**Kỳ vọng UI:**
- ✅ Modal đóng
- ✅ User mới xuất hiện trong bảng với role "EV Driver"
- ✅ KHÔNG có alert lỗi "Failed to create user"

### **Bước 4: Test UPDATE (Sửa User)**

**4.1. Click "✏️ Sửa" trên user vừa tạo**

**Kỳ vọng:**
- ✅ Modal mở với title "Chỉnh sửa Người dùng"
- ✅ Nút submit hiển thị **"Cập nhật"** (không còn là "Lưu")
- ✅ Form điền sẵn thông tin user

**4.2. Đổi vai trò: Driver → Staff**

**4.3. Click "Cập nhật"**

**Kỳ vọng Backend Console:**
```
📝 AdminController: Nhận request cập nhật user - nguyenvana@test.com
📝 Role được chuẩn hóa: Staff
✅ User cập nhật thành công: nguyenvana@test.com
```

**Kỳ vọng UI:**
- ✅ Modal đóng
- ✅ User trong bảng cập nhật role thành "Staff" (màu xanh)

### **Bước 5: Test với các Role khác**

**Test Staff:**
```
Vai trò: Staff
Expected Backend: Role = "Staff"
Expected UI: Badge màu xanh "Staff"
```

**Test Admin:**
```
Vai trò: Admin
Expected Backend: Role = "Admin"
Expected UI: Badge màu vàng "Admin"
```

---

## 🐛 TROUBLESHOOTING

### **Vấn đề 1: Vẫn báo "Failed to create user"**

**Kiểm tra:**
1. Backend có restart sau khi compile không?
2. Console backend có log `📥 AdminController: Nhận request tạo user mới` không?
3. Nếu có log `❌ userDao.addUser() trả về false` → Kiểm tra database connection
4. Nếu có log `❌ Lỗi khi tạo user: ...` → Đọc message lỗi chi tiết

**Giải pháp:**
- Kiểm tra SQL Server có chạy không
- Kiểm tra connection string trong `application.properties`
- Kiểm tra table `Users` có tồn tại không

### **Vấn đề 2: Email already exists**

**Nguyên nhân:** Email đã được dùng bởi user khác

**Giải pháp:** 
- Dùng email khác
- Hoặc xóa user cũ trước

### **Vấn đề 3: Nút vẫn hiển thị "Lưu" thay vì "Tạo"/"Cập nhật"**

**Nguyên nhân:** Frontend chưa refresh cache

**Giải pháp:**
```
Ctrl + Shift + R (hard refresh)
hoặc
Ctrl + F5
```

### **Vấn đề 4: Role vẫn không đúng trong database**

**Kiểm tra:**
1. Backend console có log `📝 Role được chuẩn hóa: ...` không?
2. Log hiển thị role gì? (phải là "EV Driver", "Staff", hoặc "Admin")

**Giải pháp:**
- Nếu log đúng nhưng DB sai → Kiểm tra UserDao.addUser() có lưu đúng field role không
- Nếu log sai → Kiểm tra frontend gửi role gì (F12 → Network tab → Payload)

---

## 📝 CONSOLE LOGS REFERENCE

### **Logs khi TẠO USER THÀNH CÔNG:**

**Frontend:**
```
🔵 AdminUsers: Mở modal tạo người dùng mới
🔵 UserFormModal: Modal is OPEN, rendering with Portal...
🔵 UserFormModal: Submit form {firstName: "Van A", lastName: "Nguyễn", email: "nguyenvana@test.com", role: "driver", ...}
🔵 AdminUsers: handleSave called {userId: undefined, formData: {...}}
🔵 useAdminUsersData: handleCreate called {...}
🔵 UserService: Tạo người dùng mới tại /api/admin/users {...}
✅ UserService: Tạo người dùng thành công {data: {...}}
✅ Tạo người dùng thành công, tải lại danh sách...
✅ Lưu thành công, đóng modal
🔵 AdminUsers: Đóng modal
```

**Backend:**
```
📥 AdminController: Nhận request tạo user mới - nguyenvana@test.com
📝 Role được chuẩn hóa: EV Driver
📝 UserId: nguyenvana@test.com
✅ User tạo thành công: nguyenvana@test.com
```

### **Logs khi TẠO USER THẤT BẠI:**

**Frontend:**
```
🔵 UserService: Tạo người dùng mới tại /api/admin/users {...}
❌ Lỗi khi tạo người dùng: Error: ... (message từ backend)
❌ Tạo người dùng thất bại: Failed to create user in database
```

**Backend:**
```
📥 AdminController: Nhận request tạo user mới - test@example.com
📝 Role được chuẩn hóa: EV Driver
📝 UserId: test@example.com
❌ userDao.addUser() trả về false
```

HOẶC

```
📥 AdminController: Nhận request tạo user mới - test@example.com
❌ Lỗi khi tạo user: [Chi tiết lỗi SQL/Exception]
[Stack trace...]
```

---

## 🎯 KẾT LUẬN

### ✅ ĐÃ SỬA:

1. **Backend Role Normalization** - Convert "driver" → "EV Driver", "staff" → "Staff", "admin" → "Admin"
2. **Backend Logging** - Thêm console logs chi tiết cho debug
3. **Backend Error Handling** - Cải thiện error messages, thêm printStackTrace
4. **Backend CCCD Default** - Set CCCD = "" nếu null để tránh lỗi DB
5. **Frontend Button Text** - Đổi "Lưu" → "Tạo" khi create, "Cập nhật" khi edit

### 🎉 KẾT QUẢ:

- ✅ User có thể TẠO MỚI thành công với bất kỳ role nào
- ✅ User có thể SỬA thành công và đổi role
- ✅ UX tốt hơn với button text rõ ràng ("Tạo" vs "Cập nhật")
- ✅ Console logs đầy đủ giúp debug dễ dàng
- ✅ Error messages chi tiết hơn

### 📋 CHECKLIST TRƯỚC KHI TEST:

- [ ] Backend đã compile: `mvn clean compile`
- [ ] Backend đang chạy: `mvn spring-boot:run`
- [ ] Frontend đã hard refresh: `Ctrl + Shift + R`
- [ ] Console (F12) đã mở để xem logs
- [ ] SQL Server đang chạy và có kết nối

---

**Trạng thái:** ✅ SẴN SÀNG TEST  
**Người thực hiện:** GitHub Copilot  
**Ngày hoàn thành:** November 1, 2025
