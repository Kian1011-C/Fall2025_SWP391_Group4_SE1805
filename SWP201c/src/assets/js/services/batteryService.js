import { apiUtils } from '../config/api.js'; // <-- SỬA LỖI #1: Dùng {} để import đúng đối tượng 'apiUtils'

const batteryService = {
  /**
   * Lấy danh sách tất cả các viên pin (có thể có bộ lọc).
   * Dành cho trang "Kho Pin" của Nhân viên.
   * Gọi đến BatteryController.
   * @param {object} filters - Các tham số lọc (VD: { status: 'AVAILABLE' })
   */
  getAllBatteries: async (filters = {}) => {
    try {
      console.log('BatteryService: Lấy tất cả pin với bộ lọc:', filters);
      
      // SỬA LỖI #2: Dùng 'apiUtils.get' thay vì 'api.get'
      const response = await apiUtils.get('/api/batteries', filters);
      
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

  // Các hàm service khác liên quan đến pin có thể được thêm vào đây...
};

export default batteryService;