// Menu items configuration for DashboardLayout
import { 
  FiHome, FiZap, FiMap, FiTruck, FiPackage, FiFileText, 
  FiCreditCard, FiHelpCircle, FiSettings, FiMapPin, 
  FiCheckSquare, FiBattery, FiAlertTriangle, FiBarChart2,
  FiUsers
} from 'react-icons/fi';

const menuItems = {
  driver: [
    { icon: FiHome, label: 'Trang chủ', path: '/driver/dashboard' },
    { icon: FiZap, label: 'Đổi pin', path: '/driver/swap-battery' },
    { icon: FiMap, label: 'Bản đồ trạm', path: '/driver/stations-map' },
    { icon: FiTruck, label: 'Xe của tôi', path: '/driver/vehicles' },
    { icon: FiPackage, label: 'Gói dịch vụ', path: '/driver/subscriptions' },
    { icon: FiFileText, label: 'Hợp đồng', path: '/driver/contracts' },
    { icon: FiCreditCard, label: 'Thanh toán', path: '/driver/payments' },
    { icon: FiHelpCircle, label: 'Hỗ trợ', path: '/driver/support' },
    { icon: FiSettings, label: 'Cài đặt', path: '/driver/settings' },
  ],
  staff: [
    { icon: FiHome, label: 'Trang chủ', path: '/staff/dashboard' },
    { icon: FiMapPin, label: 'Quản lý trạm', path: '/staff/station-management' },
    { icon: FiCheckSquare, label: 'Xác nhận đổi pin', path: '/staff/swap-confirm' },
    { icon: FiBattery, label: 'Kho pin', path: '/staff/battery-stock' },
    { icon: FiAlertTriangle, label: 'Sự cố', path: '/staff/issues' },
    { icon: FiCreditCard, label: 'Thanh toán', path: '/staff/payments' },
    { icon: FiBarChart2, label: 'Báo cáo', path: '/staff/reports' },
  ],
  admin: [
    { icon: FiHome, label: 'Trang chủ', path: '/admin/dashboard' },
    { icon: FiUsers, label: 'Người dùng', path: '/admin/users' },
    { icon: FiMapPin, label: 'Trạm sạc', path: '/admin/stations' },
    { icon: FiBattery, label: 'Pin', path: '/admin/batteries' },
    { icon: FiPackage, label: 'Gói dịch vụ', path: '/admin/subscriptions' },
    { icon: FiFileText, label: 'Hợp đồng', path: '/admin/contracts' },
    { icon: FiCreditCard, label: 'Thanh toán', path: '/admin/payments' },
    { icon: FiBarChart2, label: 'Báo cáo', path: '/admin/reports' },
  ],
};

export default menuItems;


