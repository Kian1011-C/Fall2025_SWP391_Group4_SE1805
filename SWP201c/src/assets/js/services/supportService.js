// src/assets/js/services/supportService.js
import { API_CONFIG, apiUtils } from '../config/api.js';

const supportService = {
  /**
   * Create a support/issue ticket per backend API:
   * POST /api/issues with body { userId, stationId, description }
   */
  async createIssue({ userId, title, description, priority, stationId }) {
    try {
      const payload = { userId, title, description, priority, stationId };
      const response = await apiUtils.post(API_CONFIG.ENDPOINTS.ISSUES.BASE, payload);
      if (response.success) {
        return { success: true, data: response.data || null };
      }
      return { success: false, message: response.message || 'Tạo yêu cầu thất bại' };
    } catch (error) {
      const err = apiUtils.handleError(error);
      return { success: false, message: err.message || 'Lỗi API', error: err };
    }
  },

  /**
   * List issues for a user (per Postman sample): GET /issues?role=EV%20Driver&userId=driver001
   */
  async listUserIssues({ userId, role = 'EV Driver' }) {
    try {
      const params = { userId, role };
      const response = await apiUtils.get(API_CONFIG.ENDPOINTS.ISSUES.BASE, params);
      if (response.success) {
        // BE sample returns { success: true, items: [...] }
        return { success: true, data: response.items || response.data || [] };
      }
      return { success: false, message: response.message || 'Không thể lấy danh sách yêu cầu' };
    } catch (error) {
      const err = apiUtils.handleError(error);
      return { success: false, message: err.message || 'Lỗi API', error: err };
    }
  }
};

export default supportService;


