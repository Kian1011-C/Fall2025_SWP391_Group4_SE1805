import api from '../config/api'; // Giả sử file cấu hình axios của bạn ở đây

const dashboardService = {
  /**
   * Lấy các số liệu thống kê cho trang chủ của nhân viên.
   * @returns {Promise<object>}
   */
  getStaffStats: async () => {
    try {
      // Giả sử API của bạn là: GET /api/staff/dashboard/stats
      // Bạn có thể thay đổi endpoint này cho khớp với backend.
      const response = await api.get('/staff/dashboard/stats');
      return response;
    } catch (error) {
      console.error('Lỗi khi lấy thống kê dashboard của nhân viên:', error);
      throw error;
    }
  },
};

export default dashboardService;