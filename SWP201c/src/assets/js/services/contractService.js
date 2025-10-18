import { apiUtils, API_CONFIG } from '../config/api.js';

const contractService = {
  /**
   * Lấy danh sách tất cả các hợp đồng (cho Admin).
   */
  getAllContracts: async (filters = {}) => {
    try {
      console.log('ContractService: Lấy tất cả hợp đồng với bộ lọc:', filters);
      // Gọi đến API: GET /api/contracts
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
};

export default contractService;