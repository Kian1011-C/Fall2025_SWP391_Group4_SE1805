import { apiUtils, API_CONFIG } from '../config/api.js';

const reportService = {
  /**
   * Lấy dữ liệu báo cáo Doanh thu cho Admin.
   * Gọi đến ReportController.
   * @param {object} filters - Các tham số lọc (VD: { startDate: '...', endDate: '...' })
   */
  getRevenueReport: async (filters = {}) => {
    try {
      console.log('ReportService: Lấy báo cáo doanh thu...', filters);
      const response = await apiUtils.get(API_CONFIG.ENDPOINTS.REPORTS.REVENUE, filters);
      
      if (response.success) {
        return { success: true, data: response.data, message: 'Lấy báo cáo doanh thu thành công' };
      } else {
        throw new Error(response.message || 'Không thể lấy báo cáo doanh thu');
      }
    } catch (error) {
      console.error('Lỗi khi lấy báo cáo doanh thu:', error);
      const errorInfo = apiUtils.handleError(error);
      return { success: false, message: errorInfo.message || 'Lỗi API', data: {} };
    }
  },

  /**
   * Lấy dữ liệu báo cáo Sử dụng (pin, trạm).
   * Gọi đến ReportController.
   */
  getUsageReport: async (filters = {}) => {
    try {
      console.log('ReportService: Lấy báo cáo sử dụng...', filters);
      const response = await apiUtils.get(API_CONFIG.ENDPOINTS.REPORTS.USAGE, filters);
      
      if (response.success) {
        return { success: true, data: response.data, message: 'Lấy báo cáo sử dụng thành công' };
      } else {
        throw new Error(response.message || 'Không thể lấy báo cáo sử dụng');
      }
    } catch (error) {
      console.error('Lỗi khi lấy báo cáo sử dụng:', error);
      const errorInfo = apiUtils.handleError(error);
      return { success: false, message: errorInfo.message || 'Lỗi API', data: {} };
    }
  },
};

export default reportService;