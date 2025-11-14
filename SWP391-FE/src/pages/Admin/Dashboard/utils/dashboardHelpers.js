// Admin/Dashboard/utils/dashboardHelpers.js
// Pure helper functions for dashboard

export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    minimumFractionDigits: 0
  }).format(amount);
};

export const formatNumber = (number) => {
  return new Intl.NumberFormat('vi-VN').format(number);
};

export const getDateRange = () => {
  const now = new Date();
  const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
  const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0);
  
  return {
    startDate: firstDay.toISOString().split('T')[0],
    endDate: lastDay.toISOString().split('T')[0]
  };
};

export const getAdminFeatures = () => [
  {
    id: 1,
    icon: '',
    title: 'Quản lý người dùng',
    description: 'Quản lý tài khoản và phân quyền người dùng',
    route: '/admin/users',
    color: '#19c37d'
  },
  {
    id: 2,
    icon: '',
    title: 'Quản lý pin',
    description: 'Theo dõi và quản lý kho pin EV',
    route: '/admin/batteries',
    color: '#6ab7ff'
  },
  {
    id: 3,
    icon: '',
    title: 'Quản lý trạm',
    description: 'Quản lý các trạm đổi pin',
    route: '/admin/stations',
    color: '#ffa500'
  },
  {
    id: 4,
    icon: '',
    title: 'Báo cáo & Thống kê',
    description: 'Xem báo cáo và phân tích dữ liệu',
    route: '/admin/reports',
    color: '#ff6b6b'
  },
  {
    id: 5,
    icon: '',
    title: 'Quản lý hợp đồng',
    description: 'Quản lý hợp đồng và giao dịch',
    route: '/admin/contracts',
    color: '#9c88ff'
  },
  {
    id: 6,
    icon: '',
    title: 'Gói dịch vụ',
    description: 'Quản lý các gói subscription',
    route: '/admin/subscriptions',
    color: '#4ecdc4'
  }
];

export const getRecentActivities = () => [
  { icon: '', text: 'Người dùng mới đăng ký tài khoản', time: '2 phút trước', color: '#19c37d' },
  { icon: '', text: 'Đổi pin tại trạm thành công', time: '5 phút trước', color: '#6ab7ff' },
  { icon: '', text: 'Thanh toán hoàn tất', time: '8 phút trước', color: '#ffa500' },
  { icon: '‍', text: 'Nhân viên đăng nhập hệ thống', time: '12 phút trước', color: '#9c88ff' },
  { icon: '', text: 'Bảo trì pin được lên lịch', time: '15 phút trước', color: '#ff6b6b' }
];
