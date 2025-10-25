import { apiUtils, API_CONFIG } from '../config/api.js';

const transactionService = {
  /**
   * Lấy danh sách tất cả các giao dịch (cho Admin/Staff).
   * Gọi đến SwapController @GetMapping("/swaps").
   */
  getAllTransactions: async (filters = {}) => {
    try {
      console.log('TransactionService: Lấy tất cả giao dịch với bộ lọc:', filters);
      const response = await apiUtils.get(API_CONFIG.ENDPOINTS.SWAPS.BASE, filters);
      
      if (response.success) {
        return { success: true, data: response.data, message: 'Lấy lịch sử giao dịch thành công' };
      } else {
        throw new Error(response.message || 'Không thể lấy lịch sử giao dịch');
      }
    } catch (error) {
      console.error('Lỗi khi lấy danh sách giao dịch:', error);
      const errorInfo = apiUtils.handleError(error);
      return { success: false, message: errorInfo.message || 'Lỗi API', data: [] };
    }
  },
};

export default transactionService;