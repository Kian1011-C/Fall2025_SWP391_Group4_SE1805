// src/assets/js/services/supportService.js
import { API_CONFIG, apiUtils } from '../config/api.js';

const supportService = {
  /**
   * Create a support/issue ticket per backend API:
   * POST /api/issues with body { userId, stationId, description }
   */
  async createIssue({ userId, stationId, description }) {
    try {
      const payload = { userId, stationId, description };
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
};

export default supportService;


