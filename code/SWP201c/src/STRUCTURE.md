## Cấu trúc thư mục dự án (Frontend)

Mục tiêu: giúp thành viên mới nắm nhanh nơi đặt file và cách tổ chức code.

### Nguyên tắc chung
- Code theo tính năng (feature) đặt trong `src/pages/<Role>/<Feature>`.
- Code dùng-chung đặt ngoài `pages/` trong các thư mục chuyên trách: `components/`, `context/`, `layouts/`, `assets/`.
- Dùng alias import để đường dẫn ngắn gọn: `@components`, `@pages`, `@services`, `@context`, `@assets`.

### Thư mục chính
- `src/pages/` — mỗi vai trò (Admin/Driver/Staff) có nhiều module (Batteries, Stations, ...)
  - `components/` — UI chỉ phục vụ module đó
  - `hooks/` — hook logic riêng của module
  - `utils/` — util riêng của module
  - `index.jsx` — entry cho trang/module

- `src/components/` — component dùng-chung toàn ứng dụng
  - `common/` — phần tử giao diện cơ bản (LandingPage, LoadingFallback, ...)
  - `modals/` — modal dùng-chung (LoginModal, RegisterModal)
  - `ProtectedRoute.jsx` — bảo vệ route theo role

- `src/context/` — context dùng toàn app (Auth, App, Notification, ...)
  - Nếu một context chỉ phục vụ 1 module, chuyển thành hook cục bộ trong `pages/<...>/hooks/`

- `src/layouts/` — bố cục theo vai trò (Header/Sidebar/MenuItems)

- `src/assets/`
  - `css/` — stylesheet dùng chung
  - `js/services/` — lớp gọi API tập trung (axios)
  - `js/utils/` — helper dùng chung

### Quy ước đặt tên
- Tên component trang bắt đầu theo domain: `AdminStationsHeader`, `DriverContractsList`.
- `index.js` chỉ re-export, không chứa logic.

### Routing & quyền truy cập
- Định tuyến chính ở `src/App.jsx` và `src/routes/*`.
- Dùng `ProtectedRoute` để giới hạn quyền theo role.

### Quản lý state
- Ưu tiên Context + hooks cục bộ cho module.
- Store tập trung (nếu cần) đặt ở `src/assets/js/store/`. Chỉ giữ slice nào thực sự được import.

### Lint & môi trường
- Config alias ở `vite.config.js`.
- Sử dụng `.env` với `VITE_API_BASE_URL`, `VITE_API_TIMEOUT`.


