import { apiUtils, API_CONFIG } from '../config/api.js';

const stationService = {
  /**
   * Lấy danh sách tất cả các trạm.
   * Dành cho trang "Quản lý Trạm" của Nhân viên và Admin.
   * @param {object} filters - Các tham số lọc (VD: { status: 'active' })
   */
  getAllStations: async (filters = {}) => {
    try {
      console.log('StationService: Lấy tất cả trạm với bộ lọc:', filters);
      // Gọi đến API: GET /api/stations
      const response = await apiUtils.get(API_CONFIG.ENDPOINTS.STATIONS.BASE, filters);
      
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
  
  /**
   * Tạo một trạm mới (cho Admin).
   * @param {object} stationData - Dữ liệu của trạm mới
   */
  createStation: async (stationData) => {
    try {
      console.log('StationService: Tạo trạm mới', stationData);
      const response = await apiUtils.post(API_CONFIG.ENDPOINTS.STATIONS.BASE, stationData);
      
      if (response.success) {
        return { success: true, data: response.data, message: 'Tạo trạm thành công' };
      } else {
        throw new Error(response.message || 'Không thể tạo trạm');
      }
    } catch (error) {
      console.error('Lỗi khi tạo trạm:', error);
      const errorInfo = apiUtils.handleError(error);
      return { success: false, message: errorInfo.message || 'Lỗi API' };
    }
  },

  /**
   * Cập nhật thông tin một trạm (cho Admin).
   * @param {number} stationId - ID của trạm cần cập nhật
   * @param {object} stationData - Dữ liệu cập nhật
   */
  updateStation: async (stationId, stationData) => {
    try {
      console.log(`StationService: Cập nhật trạm ${stationId}`, stationData);
      const response = await apiUtils.put(API_CONFIG.ENDPOINTS.STATIONS.BY_ID(stationId), stationData);
      
      if (response.success) {
        return { success: true, data: response.data, message: 'Cập nhật trạm thành công' };
      } else {
        throw new Error(response.message || 'Không thể cập nhật trạm');
      }
    } catch (error) {
      console.error(`Lỗi khi cập nhật trạm ${stationId}:`, error);
      const errorInfo = apiUtils.handleError(error);
      return { success: false, message: errorInfo.message || 'Lỗi API' };
    }
  },
};

export default stationService;