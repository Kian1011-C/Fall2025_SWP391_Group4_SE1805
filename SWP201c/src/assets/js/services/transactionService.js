import { apiUtils } from '../config/api.js';

const transactionService = {
  /**
   * Lấy danh sách tất cả các giao dịch đổi pin.
   * Dành cho trang "Quản lý Giao dịch" của Nhân viên.
   * Gọi đến SwapController.
   * @param {object} filters - Các tham số lọc (VD: { status: 'COMPLETED' })
   */
  getAllTransactions: async (filters = {}) => {
    try {
      console.log('TransactionService: Lấy tất cả giao dịch với bộ lọc:', filters);
      // Gọi đến API: GET /api/swaps
      const response = await apiUtils.get('/api/swaps', filters);
      
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