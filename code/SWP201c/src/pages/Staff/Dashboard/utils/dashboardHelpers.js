// Staff/Dashboard/utils/dashboardHelpers.js
// Pure helper functions for staff dashboard

/**
 * Get staff features configuration
 */
export const getStaffFeatures = () => [
  {
    id: 'battery-inventory',
    title: 'Quản lý kho pin',
    description: 'Theo dõi và cập nhật trạng thái pin (đang dùng, sạc, hỏng)',
    icon: '🔋',
    color: '#6ab7ff',
    route: '/staff/battery-inventory'
  },
  {
    id: 'transaction-management',
    title: 'Quản lý giao dịch',
    description: 'Hiển thị danh sách toàn bộ lịch sử đổi pin và thanh toán',
    icon: '💳',
    color: '#ffa500',
    route: '/staff/transaction-management'
  },
  {
    id: 'battery-stock',
    title: 'Kho pin',
    description: 'Monitor and manage battery inventory',
    icon: '📦',
    color: '#9c88ff',
    route: '/staff/battery-stock'
  },
  {
    id: 'swap-confirm',
    title: 'Quản lý yêu cầu đổi pin',
    description: 'Process and confirm battery swap requests',
    icon: '✅',
    color: '#19c37d',
    route: '/staff/swap-confirm'
  },
  {
    id: 'issues',
    title: 'Xử lý sự cố',
    description: 'Quản lý các vấn đề kỹ thuật',
    icon: '🔧',
    color: '#ff4757',
    route: '/staff/issues'
  },
  {
    id: 'reports',
    title: 'Báo cáo',
    description: 'Báo cáo hoạt động trạm',
    icon: '📊',
    color: '#6c757d',
    route: '/staff/reports'
  }
];

/**
 * Get recent activities (mock data - should come from API)
 */
export const getRecentActivities = () => [
  {
    id: 1,
    icon: '🔋',
    message: 'Pin BAT-001 đã được đổi thành công tại Trạm Quận 1',
    time: '2 phút trước'
  },
  {
    id: 2,
    icon: '🏢',
    message: 'Trạm Quận 3 đã được cập nhật thông tin',
    time: '15 phút trước'
  },
  {
    id: 3,
    icon: '⚠️',
    message: 'Pin BAT-003 cần bảo trì khẩn cấp',
    time: '1 giờ trước'
  }
];

/**
 * Format today's date for API
 */
export const getTodayDate = () => {
  return new Date().toISOString().split('T')[0];
};

/**
 * Process dashboard stats from API response
 */
export const processDashboardStats = (apiData) => {
  if (!apiData) {
    return {
      activeStations: 0,
      readyBatteries: 0,
      todayTransactions: 0,
      successRate: 0
    };
  }

  return {
    activeStations: apiData.totalStations || 0,
    readyBatteries: apiData.activeBatteries || 0,
    todayTransactions: apiData.totalTransactions || 0,
    successRate: apiData.successRate || 0
  };
};

/**
 * Get stat card configuration
 */
export const getStatCards = (stats) => [
  {
    id: 'active-stations',
    label: 'Trạm hoạt động',
    value: stats.activeStations,
    color: '#19c37d'
  },
  {
    id: 'ready-batteries',
    label: 'Pin sẵn sàng',
    value: stats.readyBatteries,
    color: '#6ab7ff'
  },
  {
    id: 'today-transactions',
    label: 'Giao dịch hôm nay',
    value: stats.todayTransactions,
    color: '#ffa500'
  },
  {
    id: 'success-rate',
    label: 'Tỷ lệ thành công',
    value: `${stats.successRate}%`,
    color: '#9c88ff'
  }
];
