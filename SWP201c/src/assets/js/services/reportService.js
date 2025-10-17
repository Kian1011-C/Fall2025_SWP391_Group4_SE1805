import api from '../config/api'; // Giả sử file cấu hình axios của bạn ở đây

const reportService = {
  /**
   * Lấy dữ liệu báo cáo tổng quan cho nhân viên.
   * @param {object} filters - Các tham số lọc (VD: { date: '2025-10-16' })
   * @returns {Promise<object>}
   */
  getStaffReport: async (filters = {}) => {
    try {
      // Giả sử API của bạn là: GET /api/reports/staff-overview
      const response = await api.get('/reports/staff-overview', { params: filters });
      return response;
    } catch (error) {
      console.error('Lỗi khi lấy dữ liệu báo cáo:', error);
      throw error;
    }
  },
};

export default reportService;