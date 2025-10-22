import { apiUtils, API_CONFIG } from '../config/api.js';

const contractService = {
  /**
   * Lấy danh sách hợp đồng của một user cụ thể
   * API: GET /api/contracts/user/{userId}
   */
  getUserContracts: async (userId) => {
    try {
      // Gọi đến API đúng theo documentation
      const response = await apiUtils.get(API_CONFIG.ENDPOINTS.CONTRACTS.BY_USER(userId));
      
      if (response.success) {
        return { success: true, data: response.data, message: 'Lấy danh sách hợp đồng thành công' };
      } else {
        throw new Error(response.message || 'Không thể lấy danh sách hợp đồng');
      }
    } catch (error) {
      console.error('Lỗi khi lấy danh sách hợp đồng:', error);
      const errorInfo = apiUtils.handleError(error);
      return { success: false, message: errorInfo.message || 'Lỗi API', data: [] };
    }
  },

  /**
   * Lấy plan của một vehicle cụ thể
   * API: GET /api/contracts/vehicle/{vehicleId}/plan
   */
  getVehiclePlan: async (vehicleId) => {
    try {
      const response = await apiUtils.get(`/api/contracts/vehicle/${vehicleId}/plan`);
      
      if (response.success) {
        return { success: true, data: response.data, message: 'Lấy plan thành công' };
      } else {
        throw new Error(response.message || 'Không thể lấy plan');
      }
    } catch (error) {
      console.error('Lỗi khi lấy plan của vehicle:', error);
      const errorInfo = apiUtils.handleError(error);
      return { success: false, message: errorInfo.message || 'Lỗi API', data: null };
    }
  },

  /**
   * Lấy tất cả contracts (cho Admin/Staff)
   * Fallback method để tương thích với code cũ
   */
  getAllContracts: async (filters = {}) => {
    try {
      // Thử gọi API (có thể không tồn tại trong backend)
      const response = await apiUtils.get(API_CONFIG.ENDPOINTS.CONTRACTS.BASE, filters);
      
      if (response.success) {
        return { success: true, data: response.data, message: 'Lấy danh sách hợp đồng thành công' };
      } else {
        throw new Error(response.message || 'Không thể lấy danh sách hợp đồng');
      }
    } catch (error) {
      console.error('Lỗi khi lấy danh sách hợp đồng:', error);
      const errorInfo = apiUtils.handleError(error);
      return { success: false, message: errorInfo.message || 'Lỗi API', data: [] };
    }
  },

  /**
   * Lấy danh sách các gói cước (plans)
   * API: GET /api/contracts/plans
   */
  getPlans: async () => {
    try {
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

  // Alias to match hook naming
  getContractPlans: async () => {
    return await contractService.getPlans();
  }
};

export default contractService;