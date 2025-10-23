import { apiUtils, API_CONFIG } from '../config/api.js';

const servicePlanService = {
  /**
   * Lấy danh sách tất cả các gói cước.
   * Gọi đến ContractController @GetMapping("/plans").
   */
  getAllServicePlans: async () => {
    try {
      console.log('ServicePlanService: Lấy tất cả gói cước...');
      const response = await apiUtils.get(API_CONFIG.ENDPOINTS.CONTRACTS.PLANS);
      
      if (response.success) {
        return { success: true, data: response.data, message: 'Lấy danh sách gói cước thành công' };
      } else {
        throw new Error(response.message || 'Không thể lấy danh sách gói cước');
      }
    } catch (error) {
      console.error('Lỗi khi lấy danh sách gói cước:', error);
      const errorInfo = apiUtils.handleError(error);
      return { success: false, message: errorInfo.message || 'Lỗi API', data: [] };
    }
  },

  /**
   * Tạo một gói cước mới (cho Admin).
   * @param {object} planData - Dữ liệu của gói cước mới
   */
  createServicePlan: async (planData) => {
    try {
      console.log('ServicePlanService: Tạo gói cước mới', planData);
      // Giả sử API của bạn là: POST /api/contracts/plans
      const response = await apiUtils.post(API_CONFIG.ENDPOINTS.CONTRACTS.PLANS, planData);
      
      if (response.success) {
        return { success: true, data: response.data, message: 'Tạo gói cước thành công' };
      } else {
        throw new Error(response.message || 'Không thể tạo gói cước');
      }
    } catch (error) {
      const errorInfo = apiUtils.handleError(error);
      return { success: false, message: errorInfo.message || 'Lỗi API' };
    }
  },

  /**
   * Cập nhật thông tin một gói cước (cho Admin).
   * @param {number} planId - ID của gói cước cần cập nhật
   * @param {object} planData - Dữ liệu cập nhật
   */
  updateServicePlan: async (planId, planData) => {
    try {
      console.log(`ServicePlanService: Cập nhật gói cước ${planId}`, planData);
      // Giả sử API của bạn là: PUT /api/contracts/plans/{planId}
      const response = await apiUtils.put(`${API_CONFIG.ENDPOINTS.CONTRACTS.PLANS}/${planId}`, planData);
      
      if (response.success) {
        return { success: true, data: response.data, message: 'Cập nhật gói cước thành công' };
      } else {
        throw new Error(response.message || 'Không thể cập nhật gói cước');
      }
    } catch (error) {
      const errorInfo = apiUtils.handleError(error);
      return { success: false, message: errorInfo.message || 'Lỗi API' };
    }
  },
};

export default servicePlanService;