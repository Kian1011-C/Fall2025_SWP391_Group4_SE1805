import { apiUtils } from '../config/api.js';

const swapService = {
  /**
   * Lấy TẤT CẢ các phiên đổi pin.
   * Logic lọc sẽ được thực hiện ở Frontend.
   * Gọi đến: GET /api/swaps
   */
  getAllSwaps: async () => {
    try {
      console.log('SwapService: Lấy tất cả các phiên đổi pin...');
      const response = await apiUtils.get('/api/swaps');
      
      if (response.success) {
        return { success: true, data: response.data || [], message: 'Lấy tất cả giao dịch thành công' };
      } else {
        throw new Error(response.message || 'Không thể lấy danh sách giao dịch');
      }
    } catch (error) {
      console.error('Lỗi khi lấy tất cả giao dịch:', error);
      const errorInfo = apiUtils.handleError(error);
      return { success: false, message: errorInfo.message || 'Lỗi API', data: [] };
    }
  },

  /**
   * CẬP NHẬT: Backend của bạn CHƯA CÓ API để cập nhật trạng thái.
   * Hàm này sẽ được giữ lại để bạn có thể nối API sau.
   * @param {string} swapId - ID của phiên đổi pin.
   * @param {string} status - Trạng thái mới (ví dụ: 'IN_PROGRESS', 'CANCELLED').
   */
  updateSwapStatus: async (swapId, status) => {
    console.warn(`SwapService: Backend chưa có API PUT /api/swaps/${swapId}. Hàm này chưa hoạt động.`);
    // Khi bạn tạo API ở backend, hãy bỏ comment đoạn code dưới đây
    /*
    try {
      const response = await apiUtils.put(`/api/swaps/${swapId}`, { status: status });
      if (response.success) {
        return { success: true, data: response.data };
      }
      throw new Error(response.message);
    } catch (error) {
      const errorInfo = apiUtils.handleError(error);
      return { success: false, message: errorInfo.message || 'Lỗi API' };
    }
    */
    // Giả lập thành công để UI không báo lỗi
    return Promise.resolve({ success: true }); 
  },
};

export default swapService;