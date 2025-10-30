import { apiUtils, API_CONFIG } from '../config/api.js';

const adminDashboardService = {
  /**
   * Lấy dữ liệu thống kê tổng quan cho Admin Dashboard.
   * Gọi đến ReportController.
   * @param {object} filters - Các tham số lọc (VD: { period: 'monthly' })
   */
  getDashboardOverview: async (filters = {}) => {
    try {
      // Gọi lại endpoint cũ hợp lệ với backend: /api/reports/overview
      const response = await apiUtils.get('/api/reports/overview', filters);
      
      if (response.success) {
        return { success: true, data: response.data, message: 'Lấy thống kê thành công' };
      } else {
        throw new Error(response.message || 'Không thể lấy thống kê');
      }
    } catch (error) {
      const errorInfo = apiUtils.handleError(error);
      return { success: false, message: errorInfo.message || 'Lỗi API', data: {} };
    }
  },
};

export default adminDashboardService;