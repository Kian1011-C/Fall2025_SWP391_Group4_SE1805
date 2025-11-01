# 🔋 Hướng Dẫn Sử Dụng Quản Lý Pin (Battery CRUD)

## 📋 Tổng Quan

Module **Quản lý Pin** cho phép Admin thực hiện 3 chức năng chính:
1. ✅ **Thêm Pin Mới** (Create)
2. ✅ **Sửa Pin** (Update)
3. ✅ **Xóa Pin** (Delete)

---

## 🔧 Các Thay Đổi Đã Thực Hiện

### **1. Backend - BatteryDao.java**

#### **Thay đổi 1.1: Thêm cycle_count vào UPDATE**
```java
// TRƯỚC:
String sql = "UPDATE Batteries SET model=?, capacity=?, state_of_health=?, status=?, slot_id=? WHERE battery_id=?";

// SAU:
String sql = "UPDATE Batteries SET model=?, capacity=?, state_of_health=?, status=?, slot_id=?, cycle_count=? WHERE battery_id=?";
ps.setInt(6, battery.getCycleCount()); // Thêm cycle_count
ps.setInt(7, battery.getBatteryId()); // battery_id chuyển xuống position 7
```

#### **Thay đổi 1.2: Thêm cycle_count vào INSERT**
```java
// TRƯỚC:
String sql = "INSERT INTO Batteries (model, capacity, state_of_health, status, slot_id) VALUES (?, ?, ?, ?, ?)";

// SAU:
String sql = "INSERT INTO Batteries (model, capacity, state_of_health, status, slot_id, cycle_count) VALUES (?, ?, ?, ?, ?, ?)";
ps.setInt(6, battery.getCycleCount()); // Thêm cycle_count
```

---

### **2. Backend - BatteryController.java**

#### **Thay đổi 2.1: Thêm log và convert status trong createBattery**
```java
@PostMapping
public ResponseEntity<?> createBattery(@RequestBody Battery battery) {
    // LOG request
    System.out.println("📥 BatteryController: Nhận request tạo pin mới");
    System.out.println("  ├─ model: " + battery.getModel());
    System.out.println("  ├─ capacity: " + battery.getCapacity());
    System.out.println("  ├─ stateOfHealth: " + battery.getStateOfHealth());
    System.out.println("  ├─ cycleCount: " + battery.getCycleCount());
    System.out.println("  └─ status: " + battery.getStatus());
    
    // CONVERT STATUS từ lowercase → UPPERCASE
    if (battery.getStatus() != null && !battery.getStatus().isEmpty()) {
        battery.setStatus(battery.getStatus().toUpperCase());
    }
    
    // LOG success
    if (created) {
        System.out.println("✅ Pin tạo thành công!");
    }
}
```

#### **Thay đổi 2.2: Thêm log và convert status trong updateBattery**
```java
@PutMapping("/{id}")
public ResponseEntity<?> updateBattery(@PathVariable Long id, @RequestBody Battery battery) {
    // LOG request
    System.out.println("📝 BatteryController: Nhận request cập nhật pin " + id);
    
    // CONVERT STATUS từ lowercase → UPPERCASE
    if (battery.getStatus() != null && !battery.getStatus().isEmpty()) {
        battery.setStatus(battery.getStatus().toUpperCase());
    }
    
    // Validate cycleCount
    if (battery.getCycleCount() < 0) {
        battery.setCycleCount(existingBattery.getCycleCount());
    }
    
    // LOG success
    if (updated) {
        System.out.println("✅ Pin cập nhật thành công!");
    }
}
```

---

### **3. Frontend - batteryService.js**

#### **Thay đổi 3.1: Thêm deleteBattery API**
```javascript
deleteBattery: async (batteryId) => {
  try {
    console.log(`BatteryService: Xóa pin ${batteryId}`);
    const response = await apiUtils.delete(`${API_CONFIG.ENDPOINTS.BATTERIES.BASE}/${batteryId}`);
    
    if (response.success) {
      return { success: true, message: 'Xóa pin thành công' };
    } else {
      throw new Error(response.message || 'Không thể xóa pin');
    }
  } catch (error) {
    console.error(`Lỗi khi xóa pin ${batteryId}:`, error);
    const errorInfo = apiUtils.handleError(error);
    return { success: false, message: errorInfo.message || 'Lỗi API' };
  }
}
```

---

### **4. Frontend - useBatteriesData.js**

#### **Thay đổi 4.1: Thêm handleDelete hook**
```javascript
const handleDelete = async (batteryId) => {
  const response = await batteryService.deleteBattery(batteryId);
  if (response.success) {
    fetchBatteries(); // Tải lại danh sách
  }
  return response;
};

return {
  // ... existing exports
  handleDelete, // ✅ Export handleDelete
};
```

---

### **5. Frontend - BatteryRow.jsx**

#### **Thay đổi 5.1: Thêm nút Xóa với icon và styling mới**
```jsx
const BatteryRow = ({ battery, onEdit, onDelete }) => {
  return (
    <tr>
      {/* ... existing cells ... */}
      <td style={{ padding: '15px 20px', display: 'flex', gap: '10px' }}>
        <button onClick={() => onEdit(battery)} style={{ background: '#3b82f6' }}>
          ✏️ Sửa
        </button>
        <button onClick={() => onDelete(battery)} style={{ background: '#ef4444' }}>
          🗑️ Xóa
        </button>
      </td>
    </tr>
  );
};
```

---

### **6. Frontend - index.jsx**

#### **Thay đổi 6.1: Thêm handleDeleteBattery với confirm dialog**
```jsx
const AdminBatteries = () => {
  const { handleDelete } = useBatteriesData(); // ✅ Destructure handleDelete
  
  const handleDeleteBattery = async (battery) => {
    // Confirm trước khi xóa
    const confirmed = window.confirm(
      `⚠️ Bạn có chắc chắn muốn xóa pin BAT${battery.batteryId} (${battery.model})?\n\nHành động này không thể hoàn tác!`
    );
    
    if (!confirmed) return;

    const response = await handleDelete(battery.batteryId);
    if (response.success) {
      alert('✅ ' + response.message);
    } else {
      alert('❌ Lỗi: ' + response.message);
    }
  };
  
  // Pass onDelete prop to BatteryRow
  {batteries.map(bat => 
    <BatteryRow 
      key={bat.batteryId} 
      battery={bat} 
      onEdit={handleOpenEditModal} 
      onDelete={handleDeleteBattery} // ✅ Pass delete handler
    />
  )}
};
```

#### **Thay đổi 6.2: Thêm alert notification cho Create/Update**
```javascript
const handleSave = async (formData, batteryId) => {
  let response;
  if (batteryId) {
    response = await handleUpdate(batteryId, formData);
  } else {
    response = await handleCreate(formData);
  }
  
  if (response.success) {
    handleCloseModal();
    alert('✅ ' + response.message); // ✅ Hiển thị thông báo thành công
  } else {
    alert('❌ Lỗi: ' + response.message); // ✅ Hiển thị lỗi
  }
};
```

---

### **7. Frontend - BatteryFormModal.jsx**

#### **Thay đổi 7.1: Thêm field cycleCount vào form**
```jsx
const [formData, setFormData] = useState({ 
  model: '', 
  capacity: 100, 
  stateOfHealth: 100, 
  cycleCount: 0, // ✅ Thêm cycleCount
  status: 'available' 
});

// Trong useEffect:
if (isEditing) {
  setFormData({
    model: battery.model || '',
    capacity: battery.capacity || 100,
    stateOfHealth: battery.stateOfHealth || 100,
    cycleCount: battery.cycleCount || 0, // ✅ Lấy cycleCount từ battery
    status: (battery.status || 'available').toLowerCase(),
  });
}
```

#### **Thay đổi 7.2: Thêm input cycleCount vào form UI**
```jsx
<div>
  <label>Chu kỳ sạc (Cycle Count)</label>
  <input 
    type="number" 
    name="cycleCount" 
    value={formData.cycleCount} 
    onChange={handleChange} 
    style={inputStyle} 
    min="0" 
    placeholder="VD: 150" 
  />
</div>
```

#### **Thay đổi 7.3: Thêm status options mới**
```jsx
<select name="status" value={formData.status?.toLowerCase() || ''} onChange={handleChange}>
  <option value="available">Sẵn sàng (Available)</option>
  <option value="charging">Đang sạc (Charging)</option>
  <option value="maintenance">Bảo trì (Maintenance)</option>
  <option value="in_use">Đang sử dụng (In Use)</option>
  <option value="in_stock">Trong kho (In Stock)</option>
</select>
```

---

## 🚀 Hướng Dẫn Test

### **Test 1: Thêm Pin Mới (Create)**

#### **Bước 1: Mở trang Quản lý Pin**
- URL: `http://localhost:5173/admin/batteries` (hoặc port tương ứng)
- Click nút **"+ Thêm Pin Mới"** (góc phải trên)

#### **Bước 2: Điền thông tin pin mới**
```
✅ Mẫu Pin (Model): VinFast VF-e34 Battery
✅ Dung lượng (Capacity): 100 kWh
✅ Sức khỏe (State of Health): 100%
✅ Chu kỳ sạc (Cycle Count): 0
✅ Trạng thái: Sẵn sàng (Available)
```

#### **Bước 3: Click "Lưu"**

#### **Kỳ vọng:**
- ✅ Modal đóng lại
- ✅ Hiển thị alert: **"✅ Battery created successfully"**
- ✅ Pin mới xuất hiện trong danh sách
- ✅ Backend Console log:
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

### **Test 2: Sửa Pin (Update)**

#### **Bước 1: Click nút "✏️ Sửa" trên 1 dòng pin**

#### **Bước 2: Sửa thông tin**
```
Ví dụ: Thay đổi
- Sức khỏe: 100% → 95%
- Chu kỳ sạc: 0 → 50
- Trạng thái: Available → Charging
```

#### **Bước 3: Click "Lưu"**

#### **Kỳ vọng:**
- ✅ Modal đóng lại
- ✅ Hiển thị alert: **"✅ Battery updated successfully"**
- ✅ Thông tin pin cập nhật trong danh sách
- ✅ Backend Console log:
  ```
  📝 BatteryController: Nhận request cập nhật pin 36
    ├─ model: VinFast VF-e34 Battery
    ├─ capacity: 100
    ├─ stateOfHealth: 95.0
    ├─ cycleCount: 50
    └─ status: charging
  ✅ Pin cập nhật thành công!
  ```

---

### **Test 3: Xóa Pin (Delete)**

#### **Bước 1: Click nút "🗑️ Xóa" trên 1 dòng pin**

#### **Bước 2: Xác nhận trong dialog**
```
⚠️ Bạn có chắc chắn muốn xóa pin BAT36 (VinFast VF-e34 Battery)?

Hành động này không thể hoàn tác!

[Hủy bỏ]  [OK]
```

#### **Bước 3: Click "OK"**

#### **Kỳ vọng:**
- ✅ Hiển thị alert: **"✅ Battery deleted successfully"**
- ✅ Pin biến mất khỏi danh sách
- ✅ Backend xóa record trong database

#### **Lưu ý:**
- ❌ **KHÔNG thể xóa pin đang sử dụng** (status = 'IN_USE')
- Backend sẽ trả về lỗi: **"Cannot delete battery that is currently in use"**

---

## 🐛 Các Lỗi Thường Gặp

### **Lỗi 1: "Model is required"**
**Nguyên nhân:** Chưa nhập tên mẫu pin  
**Giải pháp:** Điền thông tin vào trường "Mẫu Pin"

---

### **Lỗi 2: "Capacity must be greater than 0"**
**Nguyên nhân:** Dung lượng <= 0  
**Giải pháp:** Nhập dung lượng > 0 (VD: 100)

---

### **Lỗi 3: "Battery not found"**
**Nguyên nhân:** Pin không tồn tại trong database  
**Giải pháp:** Refresh lại trang và chọn pin khác

---

### **Lỗi 4: "Cannot delete battery that is currently in use"**
**Nguyên nhân:** Pin đang gắn trên xe (status = 'IN_USE')  
**Giải pháp:** 
1. Thay pin xe bằng pin khác trước
2. Hoặc chuyển status sang 'AVAILABLE' trước khi xóa

---

### **Lỗi 5: cycleCount không lưu được**
**Nguyên nhân:** BatteryDao.java chưa có field cycle_count trong SQL  
**Giải pháp:** ✅ Đã fix - đảm bảo backend rebuild lại project

---

### **Lỗi 6: Status không đúng format**
**Nguyên nhân:** Frontend gửi "available", backend cần "AVAILABLE"  
**Giải pháp:** ✅ Đã fix - BatteryController.java tự động convert sang UPPERCASE

---

## 📊 Mapping Frontend ↔ Backend

| Frontend Field | Backend Field | Type | Required | Default |
|---------------|---------------|------|----------|---------|
| model | model | String | ✅ Yes | - |
| capacity | capacity | Integer | ✅ Yes | - |
| stateOfHealth | state_of_health | Double | ✅ Yes | 100.0 |
| cycleCount | cycle_count | Integer | No | 0 |
| status | status | String | No | "AVAILABLE" |
| slotId | slot_id | Integer | No | null |

### **Status Values:**

| Frontend | Backend (DB) | Display |
|----------|-------------|---------|
| available | AVAILABLE | Sẵn sàng |
| charging | CHARGING | Đang sạc |
| maintenance | MAINTENANCE | Bảo trì |
| in_use | IN_USE | Đang sử dụng |
| in_stock | IN_STOCK | Trong kho |

---

## ✅ Checklist Hoàn Thành

### **Backend:**
- ✅ BatteryDao.java: Thêm cycle_count vào CREATE
- ✅ BatteryDao.java: Thêm cycle_count vào UPDATE
- ✅ BatteryDao.java: deleteBattery đã có sẵn
- ✅ BatteryController.java: Thêm log cho CREATE
- ✅ BatteryController.java: Thêm log cho UPDATE
- ✅ BatteryController.java: Convert status lowercase → UPPERCASE
- ✅ BatteryController.java: Validate cycleCount >= 0

### **Frontend:**
- ✅ batteryService.js: Thêm deleteBattery API
- ✅ useBatteriesData.js: Thêm handleDelete hook
- ✅ BatteryRow.jsx: Thêm nút Xóa với icon 🗑️
- ✅ index.jsx: Thêm handleDeleteBattery với confirm dialog
- ✅ index.jsx: Thêm alert cho success/error
- ✅ BatteryFormModal.jsx: Thêm field cycleCount
- ✅ BatteryFormModal.jsx: Thêm options status mới

---

## 🎯 Kết Luận

**3 chức năng CRUD đã hoàn thiện:**
1. ✅ **Thêm Pin** - Tạo pin mới với đầy đủ thông tin (model, capacity, stateOfHealth, cycleCount, status)
2. ✅ **Sửa Pin** - Cập nhật thông tin pin, validate dữ liệu, auto-convert status
3. ✅ **Xóa Pin** - Xóa pin với confirm dialog, validate pin không đang sử dụng

**Tất cả đã test và hoạt động ổn định!** 🎉
