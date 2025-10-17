import { apiUtils } from '../config/api.js';

const issueService = {
  /**
   * Lấy danh sách tất cả các sự cố.
   * @param {object} filters - Các tham số lọc (VD: { status: 'open' })
   */
  getAllIssues: async (filters = {}) => {
    try {
      console.log('IssueService: Lấy tất cả sự cố với bộ lọc:', filters);
      // Giả sử API của bạn là: GET /api/issues
      const response = await apiUtils.get('/api/issues', filters);
      
      if (response.success) {
        return { success: true, data: response.data, message: 'Lấy danh sách sự cố thành công' };
      } else {
        throw new Error(response.message || 'Không thể lấy danh sách sự cố');
      }
    } catch (error) {
      console.error('Lỗi khi lấy danh sách sự cố:', error);
      const errorInfo = apiUtils.handleError(error);
      return { success: false, message: errorInfo.message || 'Lỗi API', data: [] };
    }
  },

  // Các hàm khác như createIssue, updateIssue... sẽ được thêm vào đây sau.
};

export default issueService;