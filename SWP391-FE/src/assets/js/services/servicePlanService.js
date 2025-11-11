import { apiUtils, API_CONFIG } from '../config/api.js';

const BASE_URL = '/api/admin/serviceplan';

const servicePlanService = {
  /**
   * Lấy danh sách tất cả các gói cước active.
   */
  getAllServicePlans: async () => {
    try {
      console.log('ServicePlanService: Lấy tất cả gói cước...');
      const response = await apiUtils.get(`${BASE_URL}/list`);
      
      if (response.success) {
        return { success: true, data: response.data, total: response.total, message: 'Lấy danh sách gói cước thành công' };
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
      
      // Convert isUnlimited to baseDistance = -1
      const payload = {
        planName: planData.planName,
        basePrice: planData.basePrice,
        baseDistance: planData.isUnlimited ? -1 : planData.baseDistance,
        depositFee: planData.depositFee,
        description: planData.description,
        active: true
      };
      
      const response = await apiUtils.post(`${BASE_URL}/add`, payload);
      
      if (response.success) {
        return { success: true, data: response.data, message: response.message || 'Tạo gói cước thành công' };
      } else {
        throw new Error(response.message || 'Không thể tạo gói cước');
      }
    } catch (error) {
      console.error('Lỗi khi tạo gói cước:', error);
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
      
      // Convert isUnlimited to baseDistance = -1
      const payload = {
        planId: planId,
        planName: planData.planName,
        basePrice: planData.basePrice,
        baseDistance: planData.isUnlimited ? -1 : planData.baseDistance,
        depositFee: planData.depositFee,
        description: planData.description,
        active: planData.active !== undefined ? planData.active : true
      };
      
      const response = await apiUtils.post(`${BASE_URL}/update`, payload);
      
      if (response.success) {
        return { success: true, data: response.data, message: response.message || 'Cập nhật gói cước thành công' };
      } else {
        throw new Error(response.message || 'Không thể cập nhật gói cước');
      }
    } catch (error) {
      console.error('Lỗi khi cập nhật gói cước:', error);
      const errorInfo = apiUtils.handleError(error);
      return { success: false, message: errorInfo.message || 'Lỗi API' };
    }
  },

  /**
   * Xóa (deactivate) một gói cước (cho Admin).
   * @param {number} planId - ID của gói cước cần xóa
   */
  deleteServicePlan: async (planId) => {
    try {
      console.log(`ServicePlanService: Xóa gói cước ${planId}`);
      const response = await apiUtils.post(`${BASE_URL}/delete`, { planId });
      
      if (response.success) {
        return { success: true, message: response.message || 'Xóa gói cước thành công' };
      } else {
        throw new Error(response.message || 'Không thể xóa gói cước');
      }
    } catch (error) {
      console.error('Lỗi khi xóa gói cước:', error);
      const errorInfo = apiUtils.handleError(error);
      return { success: false, message: errorInfo.message || 'Lỗi API' };
    }
  },
};

export default servicePlanService;