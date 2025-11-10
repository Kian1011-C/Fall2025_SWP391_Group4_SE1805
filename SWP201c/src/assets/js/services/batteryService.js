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
   * Lấy thông tin một viên pin theo ID.
   * @param {number} batteryId - ID của pin cần lấy thông tin
   */
  getBatteryById: async (batteryId) => {
    try {
      console.log(`BatteryService: Lấy thông tin pin ${batteryId}`);
      const response = await apiUtils.get(`${API_CONFIG.ENDPOINTS.BATTERIES.BASE}/${batteryId}`);
      
      if (response.success) {
        return { success: true, data: response.data, message: 'Lấy thông tin pin thành công' };
      } else {
        throw new Error(response.message || 'Không thể lấy thông tin pin');
      }
    } catch (error) {
      console.error(`Lỗi khi lấy thông tin pin ${batteryId}:`, error);
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

  /**
   * Xóa một viên pin (cho Admin).
   * @param {number} batteryId - ID của pin cần xóa
   */
  deleteBattery: async (batteryId) => {
    try {
      console.log(`BatteryService: Xóa pin ${batteryId}`);
      const response = await apiUtils.delete(`${API_CONFIG.ENDPOINTS.BATTERIES.BASE}/${batteryId}`);
      
      if (response.success) {
        return { success: true, message: 'Xóa pin thành công' };
      } else {
        throw new Error(response.message || 'Không thể xóa pin');
      }
    } catch (error) {
      console.error(`Lỗi khi xóa pin ${batteryId}:`, error);
      const errorInfo = apiUtils.handleError(error);
      return { success: false, message: errorInfo.message || 'Lỗi API' };
    }
  },

  /**
   * Gán pin vào slot (cho Admin/Staff).
   * @param {number} batteryId - ID của pin cần gán
   * @param {number} slotId - ID của slot
   */
  assignBatteryToSlot: async (batteryId, slotId) => {
    try {
      console.log(`BatteryService: Gán pin ${batteryId} vào slot ${slotId}`);
      const response = await apiUtils.post(
        `${API_CONFIG.ENDPOINTS.BATTERIES.BASE}/${batteryId}/assign-slot`,
        { slotId }
      );
      
      if (response.success) {
        return { success: true, data: response.data, message: response.message || 'Gán pin vào hộc thành công' };
      } else {
        throw new Error(response.message || 'Không thể gán pin vào hộc');
      }
    } catch (error) {
      console.error(`Lỗi khi gán pin ${batteryId} vào slot ${slotId}:`, error);
      const errorInfo = apiUtils.handleError(error);
      return { success: false, message: errorInfo.message || 'Lỗi API' };
    }
  },

  /**
   * Tháo pin khỏi hộc (slot)
   * @param {number} batteryId - ID của pin cần tháo
   */
  removeBatteryFromSlot: async (batteryId) => {
    try {
      console.log('BatteryService: Tháo pin khỏi hộc', batteryId);
      const response = await apiUtils.post(
        `/api/batteries/${batteryId}/remove-from-slot`
      );
      
      if (response.success) {
        return { success: true, data: response.data, message: response.message || 'Tháo pin khỏi hộc thành công' };
      } else {
        throw new Error(response.message || 'Không thể tháo pin khỏi hộc');
      }
    } catch (error) {
      console.error(`Lỗi khi tháo pin ${batteryId} khỏi slot:`, error);
      const errorInfo = apiUtils.handleError(error);
      return { success: false, message: errorInfo.message || 'Lỗi API' };
    }
  },
};

export default batteryService;