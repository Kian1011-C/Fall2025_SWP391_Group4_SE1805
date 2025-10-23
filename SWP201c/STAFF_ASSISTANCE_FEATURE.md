# 🤝 Staff Assistance Request Feature
## 📋 Tổng quan
Tính năng cho phép người dùng (Driver) yêu cầu hỗ trợ đổi pin từ nhân viên (Staff) thay vì tự đổi pin qua quy trình tự động 7 bước.

## 🎯 Mục đích
- Cung cấp luồng đổi pin thay thế cho người dùng cần hỗ trợ
- Giúp người dùng gặp khó khăn hoặc không thể tự đổi pin
- Tạo kết nối giữa Driver và Staff tại trạm sạc

## 🔧 Implementation Details

### 1. API Methods (swapService.js)
```javascript
// Gửi yêu cầu hỗ trợ từ staff
async requestStaffAssistance(assistanceData)

// Lấy danh sách yêu cầu chờ xử lý (cho staff)
async getPendingAssistanceRequests(stationId)

// Staff chấp nhận yêu cầu
async acceptAssistanceRequest(requestId, staffId)

// Staff hoàn thành hỗ trợ
async completeAssistanceRequest(requestId, completionData)
```

### 2. UI Components (SwapBattery.jsx)

#### State Variables:
```javascript
const [showStaffAssistanceModal, setShowStaffAssistanceModal] = useState(false);
const [assistanceLoading, setAssistanceLoading] = useState(false);
const [assistanceSuccess, setAssistanceSuccess] = useState(false);
```

#### Reusable Component:
```javascript
const renderStaffAssistanceButton = (position = 'bottom') => {
  // Component nhỏ gọn xuất hiện ở tất cả steps
  // Chỉ hiển thị khi đã chọn trạm sạc
}
```

## 🚀 Features

### 1. Nút "Yêu cầu hỗ trợ từ nhân viên"
- ✅ Xuất hiện ở tất cả 5 steps (Step 1-5)
- ✅ UI gradient cam đẹp mắt với animation
- ✅ Chỉ active khi đã chọn trạm sạc
- ✅ Responsive và user-friendly

### 2. Modal với 3 trạng thái
- **Xác nhận**: Hiển thị thông tin sẽ gửi
- **Loading**: Spinner khi đang gửi request
- **Success**: Thông báo thành công với chi tiết

### 3. Thông tin được gửi
```javascript
{
  userId: "ID người dùng",
  userName: "Tên người dùng", 
  userPhone: "Số điện thoại",
  vehicleId: "ID xe",
  vehiclePlate: "Biển số xe",
  vehicleModel: "Model xe",
  currentBatteryLevel: "Mức pin hiện tại",
  stationId: "ID trạm sạc",
  stationName: "Tên trạm sạc",
  stationLocation: "Địa chỉ trạm",
  requestType: "MANUAL_SWAP_ASSISTANCE",
  priority: "HIGH/MEDIUM/LOW (dựa trên mức pin)",
  note: "Ghi chú chi tiết",
  requestedAt: "Thời gian yêu cầu",
  contractId: "ID hợp đồng"
}
```

## 🔄 User Flow

### Driver Side:
1. **Chọn trạm sạc** → Nút "Yêu cầu hỗ trợ" xuất hiện
2. **Nhấn nút** → Modal xác nhận hiển thị
3. **Xác nhận gửi** → Loading → Success notification
4. **Nhận thông báo** → Chờ staff liên hệ

### Staff Side (Future Implementation):
1. **Nhận notification** → Yêu cầu hỗ trợ mới
2. **Xem chi tiết** → Thông tin xe và vị trí
3. **Chấp nhận** → Đến hỗ trợ khách hàng
4. **Hoàn thành** → Cập nhật trạng thái

## 📁 Files Modified

### 1. `src/assets/js/services/swapService.js`
- ➕ `requestStaffAssistance()`
- ➕ `getPendingAssistanceRequests()`
- ➕ `acceptAssistanceRequest()`
- ➕ `completeAssistanceRequest()`

### 2. `src/pages/Driver/SwapBattery.jsx`
- ➕ State variables cho staff assistance
- ➕ `handleRequestStaffAssistance()`
- ➕ `handleCloseStaffAssistanceModal()`
- ➕ `renderStaffAssistanceButton()` component
- ➕ Staff assistance modal với 3 states
- ✏️ Updated all steps (1-5) với assistance button

## 🎨 UI/UX Design

### Button Style:
- 🧡 Gradient orange background
- 🤝 Icon và text rõ ràng
- ✨ Hover animations
- 📱 Responsive design

### Modal Design:
- 🌟 3 trạng thái khác nhau
- 📋 Hiển thị thông tin chi tiết
- ⏱️ Loading spinner
- ✅ Success confirmation
- 🎯 Priority indicators

## 🔧 Technical Notes

### API Endpoints (Expected):
```
POST /api/swaps/request-assistance
GET  /api/swaps/assistance-requests
POST /api/swaps/assistance-requests/:id/accept
POST /api/swaps/assistance-requests/:id/complete
```

### Priority Logic:
- **HIGH**: Battery ≤ 10%
- **MEDIUM**: Battery ≤ 20%
- **LOW**: Battery > 20%

### Error Handling:
- API failures handled gracefully
- User-friendly error messages
- Fallback states

## 🚀 Deployment Status
- ✅ Frontend Implementation: Complete
- ⏳ Backend API: Pending
- ⏳ Staff Dashboard: Pending
- ⏳ Notification System: Pending

## 📝 Future Enhancements
1. Real-time notifications cho staff
2. Staff dashboard để quản lý requests
3. GPS tracking để xem vị trí staff
4. Rating system sau khi hoàn thành
5. Analytics và reporting

---

## 🤝 Summary
Tính năng "Staff Assistance Request" đã được implement hoàn chỉnh ở frontend, cho phép người dùng dễ dàng yêu cầu hỗ trợ từ nhân viên tại bất kỳ bước nào trong quy trình đổi pin. UI/UX được thiết kế user-friendly với animations và responsive design.

**Created:** October 10, 2025  
**Status:** ✅ Frontend Complete