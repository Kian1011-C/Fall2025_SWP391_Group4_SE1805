import { apiUtils } from '../config/api.js';

const stationService = {
  /**
   * Lấy danh sách tất cả các trạm, có thể có bộ lọc.
   * Dành cho trang "Quản lý Trạm" của Nhân viên.
   * @param {object} filters - Các tham số lọc (VD: { status: 'active' })
   */
  getAllStations: async (filters = {}) => {
    try {
      console.log('StationService: Lấy tất cả trạm với bộ lọc:', filters);
      // Gọi đến API: GET /api/stations
      const response = await apiUtils.get('/api/stations', filters);
      
      if (response.success) {
        return { success: true, data: response.data, message: 'Lấy danh sách trạm thành công' };
      } else {
        throw new Error(response.message || 'Không thể lấy danh sách trạm');
      }
    } catch (error) {
      console.error('Lỗi khi lấy danh sách trạm:', error);
      const errorInfo = apiUtils.handleError(error);
      return { success: false, message: errorInfo.message || 'Lỗi API', data: [] };
    }
  },

  /**
   * Lấy danh sách các trụ thuộc một trạm.
   * Dành cho quy trình đổi pin của Tài xế.
   */
  getTowersByStation: async (stationId) => {
    try {
      console.log(`StationService: Lấy danh sách trụ cho trạm ${stationId}`);
      // Endpoint này theo Controller của bạn là /api/driver/towers
      const response = await apiUtils.get(`/api/driver/towers`, { stationId: stationId });
      
      if (response.success) {
        return { success: true, data: response.data, message: 'Lấy danh sách trụ thành công' };
      } else {
        throw new Error(response.message || 'Không thể lấy danh sách trụ');
      }
    } catch (error) {
      console.error(`Lỗi khi lấy danh sách trụ cho trạm ${stationId}:`, error);
      const errorInfo = apiUtils.handleError(error);
      return { success: false, message: errorInfo.message || 'Lỗi API', data: [] };
    }
  },
};

export default stationService;