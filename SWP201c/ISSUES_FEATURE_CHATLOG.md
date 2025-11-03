# Chat Log - Issues Management Feature

## Ngày: 3 tháng 11, 2025

---

## 1. YÊU CẦU BAN ĐẦU

**User:** "làm issues dự trên BE cho tôi"

**Mục tiêu:** Tích hợp Issues Management với backend API đã có sẵn

---

## 2. PHÂN TÍCH BACKEND API

### Backend Structure (đã có sẵn)

**IssueController.java:**
- `POST /issues` - Tạo issue mới
  - Body: `{ userId, stationId, description }`
  - Response: `{ success: boolean }`

- `GET /issues?role={role}&userId={userId}` - Lấy danh sách issues
  - Params: 
    - `role`: "EV Driver" | "Staff" | "Admin"
    - `userId`: Required nếu role="EV Driver"
  - Response: `{ success: true, items: [...] }`

**IssueDao.java:**
- `insert(userId, stationId, description)` - Thêm issue vào DB
- `listByVisibility(role, userId)` - Lấy danh sách theo role

**Database Schema (Issues table):**
```sql
issue_id INT PRIMARY KEY IDENTITY(1,1)
user_id VARCHAR(50)
station_id INT
description NVARCHAR(500)
status VARCHAR(20) DEFAULT 'open'
created_at DATETIME DEFAULT GETDATE()
```

**Status values:** `open`, `in_progress`, `resolved`

---

## 3. FRONTEND IMPLEMENTATION

### 3.1. Service Layer (issueService.js)

**Các method đã tạo:**

```javascript
// 1. Tạo issue mới
createIssue: async (userId, stationId, description) => {
  const response = await apiUtils.post('/issues', {
    userId, stationId, description
  });
  return { success: response.success, message: ... };
}

// 2. Lấy tất cả issues (role-based)
getAllIssues: async (role, userId = null) => {
  // Build query string thủ công vì axios params bị wrap thành params[role]
  let queryString = `role=${encodeURIComponent(role)}`;
  if (userId) {
    queryString += `&userId=${encodeURIComponent(userId)}`;
  }
  const response = await apiUtils.get(`/issues?${queryString}`);
  
  // Map backend fields to frontend format
  const mappedData = response.items.map(item => ({
    issueId: item.issueId || item.issue_id,
    userId: item.userId || item.user_id,
    stationId: item.stationId || item.station_id,
    description: item.description,
    status: item.status,
    createdAt: item.createdAt || item.created_at
  }));
  
  return { success: true, data: mappedData };
}

// 3. Wrapper methods cho từng role
getStaffIssues: async () => getAllIssues('Staff', null)
getDriverIssues: async (userId) => getAllIssues('EV Driver', userId)
getAdminIssues: async () => getAllIssues('Admin', null)
```

**Lưu ý quan trọng:**
- Backend Spring Boot không nhận `params` object từ axios
- Phải build query string thủ công: `?role=Staff&userId=123`
- Map linh hoạt giữa camelCase và snake_case

---

### 3.2. React Hook (useIssueData.js)

**Staff/Issues/hooks/useIssueData.js:**

```javascript
const useIssueData = () => {
  const [issues, setIssues] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchIssues = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const result = await issueService.getStaffIssues(); // Staff role mặc định
      
      if (result.success && result.data) {
        setIssues(result.data);
      } else {
        throw new Error(result.message || 'Không thể lấy danh sách');
      }
    } catch (err) {
      console.error('useIssueData error:', err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchIssues();
  }, []);

  return { issues, isLoading, error, refetch: fetchIssues };
};
```

---

### 3.3. UI Component (IssueRow.jsx)

**Staff/Issues/components/IssueRow.jsx:**

```javascript
const IssueRow = ({ issue }) => {
  // Map dữ liệu từ backend (hỗ trợ cả camelCase và snake_case)
  const id = issue.issueId || issue.id;
  const description = issue.description || 'Không có mô tả';
  const status = issue.status || 'N/A';
  const userId = issue.userId || issue.user_id || 'N/A';
  const stationId = issue.stationId || issue.station_id || 'N/A';
  const time = issue.createdAt || issue.created_at || new Date().toISOString();

  // Format status text tiếng Việt
  const getStatusText = (status) => {
    const s = status ? status.toLowerCase() : '';
    if (s === 'open') return 'Mới';
    if (s === 'in_progress') return 'Đang xử lý';
    if (s === 'resolved') return 'Đã giải quyết';
    return status;
  };

  return (
    <tr>
      <td>#{id}</td>
      <td>{description}</td>
      <td><span style={getStatusStyle(status)}>{getStatusText(status)}</span></td>
      <td>
        <div>User: {userId}</div>
        <div>Trạm: #{stationId}</div>
      </td>
      <td>{new Date(time).toLocaleString('vi-VN')}</td>
      <td>
        <button>Xem chi tiết</button>
      </td>
    </tr>
  );
};
```

**Status badge colors:**
- `open` → Red (#991b1b / #fecaca)
- `in_progress` → Orange (#9a3412 / #fdba74)
- `resolved` → Green (#166534 / #86efac)

---

### 3.4. Main Page (Staff/Issues/index.jsx)

**Đã có sẵn:**
- ✅ Table layout với headers
- ✅ Status filter dropdown
- ✅ "Tạo báo cáo mới" button
- ✅ Loading/Error states
- ✅ useIssueData hook integration

```javascript
const StaffIssues = () => {
  const { issues, isLoading, error } = useIssueData();
  const [statusFilter, setStatusFilter] = useState('all');

  const renderContent = () => {
    if (isLoading) return <div>Đang tải...</div>;
    if (error) return <div>Lỗi: {error}</div>;
    
    return (
      <table>
        <thead>...</thead>
        <tbody>
          {issues.map(issue => 
            <IssueRow key={issue.id || issue.issueId} issue={issue} />
          )}
        </tbody>
      </table>
    );
  };

  return <div>{renderContent()}</div>;
};
```

---

## 4. VẤN ĐỀ ĐÃ GIẢI QUYẾT

### Issue #1: Lỗi 400 - params[role]=Staff

**Triệu chứng:**
```
:8080/issues?params%5Brole%5D=Staff:1 Failed to load resource: 400
```

**Nguyên nhân:**
- Axios serialize `{ params: { role: 'Staff' } }` thành `?params[role]=Staff`
- Backend Spring Boot chỉ nhận `?role=Staff`

**Giải pháp:**
```javascript
// ❌ SAI
const response = await apiUtils.get('/issues', { params: { role } });

// ✅ ĐÚNG
let queryString = `role=${encodeURIComponent(role)}`;
const response = await apiUtils.get(`/issues?${queryString}`);
```

---

### Issue #2: Backend chưa có API update status

**User:** "k có API nút ấn done cho những cái nào đã xử lí hả"

**Phân tích:**
- Backend chỉ có POST (create) và GET (list)
- Thiếu PATCH/PUT endpoint để cập nhật status

**Giải pháp đề xuất (chưa implement):**

**Backend - IssueController.java:**
```java
@PatchMapping("/{issueId}/status")
public ResponseEntity<?> updateStatus(
    @PathVariable int issueId,
    @RequestBody Map<String, String> body
) {
    String newStatus = body.get("status");
    if (!newStatus.equals("open") && !newStatus.equals("in_progress") 
        && !newStatus.equals("resolved")) {
        return ResponseEntity.badRequest().body(
            Map.of("success", false, "message", "Status không hợp lệ")
        );
    }
    
    boolean ok = issueDao.updateStatus(issueId, newStatus);
    return ResponseEntity.ok(Map.of(
        "success", ok, 
        "message", ok ? "Cập nhật thành công" : "Cập nhật thất bại"
    ));
}
```

**Backend - IssueDao.java:**
```java
public boolean updateStatus(int issueId, String status) {
    String sql = "UPDATE Issues SET status = ? WHERE issue_id = ?";
    try (Connection c = ConnectDB.getConnection();
         PreparedStatement ps = c.prepareStatement(sql)) {
        ps.setString(1, status);
        ps.setInt(2, issueId);
        return ps.executeUpdate() > 0;
    } catch (SQLException e) {
        System.err.println("IssueDao.updateStatus err: " + e.getMessage());
        return false;
    }
}
```

**Frontend - issueService.js:**
```javascript
updateIssueStatus: async (issueId, status) => {
  const response = await apiUtils.patch(`/issues/${issueId}/status`, { status });
  return { success: response.success, message: response.message };
}
```

**Frontend - IssueRow.jsx (với nút update):**
```javascript
const handleStatusUpdate = async (newStatus) => {
  const result = await issueService.updateIssueStatus(id, newStatus);
  if (result.success) {
    alert(result.message);
    onStatusChanged(); // Refresh list
  }
};

// UI buttons
{status === 'open' && (
  <button onClick={() => handleStatusUpdate('in_progress')}>
    Đang xử lý
  </button>
)}
{(status === 'open' || status === 'in_progress') && (
  <button onClick={() => handleStatusUpdate('resolved')}>
    ✓ Hoàn thành
  </button>
)}
```

---

## 5. TRẠNG THÁI HIỆN TẠI

### ✅ Đã hoàn thành:
1. **Backend API integration**
   - POST /issues (tạo issue)
   - GET /issues?role={role} (list issues)
   
2. **Frontend service layer**
   - issueService.js với 5 methods
   - Query string manual build để tránh axios params bug
   
3. **React components**
   - useIssueData hook (fetch data)
   - IssueRow component (display + field mapping)
   - Staff/Issues page (full UI)

4. **Field mapping**
   - Hỗ trợ cả camelCase và snake_case
   - Status badge với 3 màu
   - Date formatting tiếng Việt

### ❌ Chưa hoàn thành:
1. **Update status feature**
   - Backend: Thiếu PATCH /issues/{issueId}/status
   - Frontend: Thiếu nút "Đang xử lý" / "Hoàn thành"

2. **Create issue modal**
   - Form nhập userId, stationId, description
   - Validation
   - Submit to POST /issues

3. **Driver Issues page**
   - Copy Staff structure
   - Sử dụng getDriverIssues(userId)
   - Chỉ hiển thị issues của driver hiện tại

4. **Admin Issues page**
   - Copy Staff structure
   - Sử dụng getAdminIssues()

---

## 6. HƯỚNG DẪN TIẾP TỤC

### Bước 1: Thêm API update status (Backend)
```bash
# File: IssueController.java
# Thêm @PatchMapping("/{issueId}/status")

# File: IssueDao.java
# Thêm method updateStatus(issueId, status)
```

### Bước 2: Test API update
```bash
# PowerShell
Invoke-RestMethod -Uri "http://localhost:8080/issues/1/status" `
  -Method PATCH `
  -ContentType "application/json" `
  -Body '{"status":"resolved"}'
```

### Bước 3: Thêm nút update vào frontend
```javascript
// IssueRow.jsx
import { useState } from 'react';
const [isUpdating, setIsUpdating] = useState(false);

const handleStatusUpdate = async (newStatus) => {
  setIsUpdating(true);
  const result = await issueService.updateIssueStatus(id, newStatus);
  if (result.success) {
    alert(result.message);
    onStatusChanged(); // Refresh danh sách
  }
  setIsUpdating(false);
};
```

### Bước 4: Thêm callback refresh vào index.jsx
```javascript
// Staff/Issues/index.jsx
const { issues, isLoading, error, refetch } = useIssueData();

<IssueRow 
  issue={issue} 
  onStatusChanged={refetch} // Pass refetch callback
/>
```

---

## 7. API ENDPOINTS SUMMARY

| Method | Endpoint | Role Access | Params/Body | Response |
|--------|----------|-------------|-------------|----------|
| POST | /issues | Driver | `{userId, stationId, description}` | `{success: boolean}` |
| GET | /issues | All | `?role=Staff&userId=123` | `{success: true, items: [...]}` |
| PATCH | /issues/{id}/status | Staff/Admin | `{status: "resolved"}` | `{success: boolean, message}` ⚠️ Chưa có |

---

## 8. NOTES

### Backend Spring Boot:
- Port: 8080
- Database: SQL Server
- CORS: Đã config cho frontend

### Frontend React:
- Service layer: `/assets/js/services/issueService.js`
- Components: `/pages/Staff/Issues/`
- Hooks: `/pages/Staff/Issues/hooks/`

### Role-based visibility:
- **EV Driver**: Chỉ xem issues của mình (userId required)
- **Staff**: Xem tất cả issues
- **Admin**: Xem tất cả issues

### Status workflow:
```
open → in_progress → resolved
```

---

## 9. TESTING CHECKLIST

- [ ] Test GET /issues?role=Staff (xem tất cả)
- [ ] Test GET /issues?role=EV Driver&userId=123 (xem của user)
- [ ] Test POST /issues (tạo issue mới)
- [ ] Test PATCH /issues/1/status (update status) - Chưa có API
- [ ] Test frontend load data từ backend
- [ ] Test status filter dropdown
- [ ] Test date formatting tiếng Việt
- [ ] Test field mapping (camelCase vs snake_case)

---

**Tổng kết:** Issues feature đã tích hợp thành công với backend API cho phần LIST và CREATE. Thiếu API UPDATE STATUS để hoàn thiện workflow xử lý issues.
