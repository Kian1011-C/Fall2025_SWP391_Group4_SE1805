import { apiUtils } from '../config/api.js';

const issueService = {
  /**
   * Tạo issue mới (Driver report)
   * @param {string} userId - ID của user
   * @param {number} stationId - ID của station
   * @param {string} description - Mô tả sự cố
   */
  createIssue: async (userId, stationId, description) => {
    try {
      console.log('IssueService: Tạo issue mới', { userId, stationId, description });
      const response = await apiUtils.post('/issues', {
        userId,
        stationId,
        description
      });
      
      return {
        success: response.success || false,
        message: response.success ? 'Báo cáo sự cố thành công' : 'Không thể tạo báo cáo sự cố'
      };
    } catch (error) {
      console.error('Lỗi khi tạo issue:', error);
      const errorInfo = apiUtils.handleError(error);
      return { success: false, message: errorInfo.message || 'Lỗi khi tạo báo cáo' };
    }
  },

  /**
   * Lấy danh sách issues theo role
   * @param {string} role - 'EV Driver', 'Staff', hoặc 'Admin'
   * @param {string} userId - Required nếu role là 'EV Driver'
   */
  getAllIssues: async (role = 'Staff', userId = null) => {
    try {
      console.log('IssueService: Lấy danh sách issues với role:', role, 'userId:', userId);
      
      // Build query string manually to avoid axios params wrapper
      let queryString = `role=${encodeURIComponent(role)}`;
      if (userId) {
        queryString += `&userId=${encodeURIComponent(userId)}`;
      }
      
      const response = await apiUtils.get(`/issues?${queryString}`);
      
      if (response.success && response.items) {
        // Map backend fields to frontend format
        const mappedData = response.items.map(item => ({
          issueId: item.issueId || item.issue_id,
          userId: item.userId || item.user_id,
          stationId: item.stationId || item.station_id,
          description: item.description,
          status: item.status,
          createdAt: item.createdAt || item.created_at
        }));
        
        return { 
          success: true, 
          data: mappedData, 
          message: 'Lấy danh sách sự cố thành công' 
        };
      } else {
        throw new Error(response.message || 'Không thể lấy danh sách sự cố');
      }
    } catch (error) {
      console.error('Lỗi khi lấy danh sách sự cố:', error);
      const errorInfo = apiUtils.handleError(error);
      return { success: false, message: errorInfo.message || 'Lỗi API', data: [] };
    }
  },

  /**
   * Lấy issues của driver (chỉ của mình)
   * @param {string} userId - ID của driver
   */
  getDriverIssues: async (userId) => {
    return issueService.getAllIssues('EV Driver', userId);
  },

  /**
   * Lấy tất cả issues (Staff/Admin)
   */
  getStaffIssues: async () => {
    return issueService.getAllIssues('Staff', null);
  },

  getAdminIssues: async () => {
    return issueService.getAllIssues('Admin', null);
  }
};

export default issueService;