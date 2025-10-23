import { apiUtils, API_CONFIG } from '../config/api.js';

const batteryService = {
  /**
   * Lấy danh sách tất cả các viên pin (cho Admin/Staff).
   * @param {object} filters - Các tham số lọc (VD: { status: 'AVAILABLE' })
   */
  getAllBatteries: async (filters = {}) => {
    try {
      console.log('BatteryService: Lấy tất cả pin với bộ lọc:', filters);
      const response = await apiUtils.get(API_CONFIG.ENDPOINTS.BATTERIES.BASE, filters);
      
      if (response.success) {
        return { success: true, data: response.data, message: 'Lấy danh sách pin thành công' };
      } else {
        throw new Error(response.message || 'Không thể lấy danh sách pin');
      }
    } catch (error) {
      console.error('Lỗi khi lấy danh sách pin:', error);
      const errorInfo = apiUtils.handleError(error);
      return { success: false, message: errorInfo.message || 'Lỗi API', data: [] };
    }
  },

  /**
   * Tạo một viên pin mới (cho Admin).
   * @param {object} batteryData - Dữ liệu của pin mới
   */
  createBattery: async (batteryData) => {
    try {
      console.log('BatteryService: Tạo pin mới', batteryData);
      const response = await apiUtils.post(API_CONFIG.ENDPOINTS.BATTERIES.BASE, batteryData);
      
      if (response.success) {
        return { success: true, data: response.data, message: 'Tạo pin thành công' };
      } else {
        throw new Error(response.message || 'Không thể tạo pin');
      }
    } catch (error) {
      console.error('Lỗi khi tạo pin:', error);
      const errorInfo = apiUtils.handleError(error);
      return { success: false, message: errorInfo.message || 'Lỗi API' };
    }
  },

  /**
   * Cập nhật thông tin một viên pin (cho Admin).
   * @param {number} batteryId - ID của pin cần cập nhật
   * @param {object} batteryData - Dữ liệu cập nhật
   */
  updateBattery: async (batteryId, batteryData) => {
    try {
      console.log(`BatteryService: Cập nhật pin ${batteryId}`, batteryData);
      const response = await apiUtils.put(`${API_CONFIG.ENDPOINTS.BATTERIES.BASE}/${batteryId}`, batteryData);
      
      if (response.success) {
        return { success: true, data: response.data, message: 'Cập nhật pin thành công' };
      } else {
        throw new Error(response.message || 'Không thể cập nhật pin');
      }
    } catch (error) {
      console.error(`Lỗi khi cập nhật pin ${batteryId}:`, error);
      const errorInfo = apiUtils.handleError(error);
      return { success: false, message: errorInfo.message || 'Lỗi API' };
    }
  },
};

export default batteryService;