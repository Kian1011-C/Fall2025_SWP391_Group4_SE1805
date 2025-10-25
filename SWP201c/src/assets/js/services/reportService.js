import { apiUtils, API_CONFIG } from '../config/api.js';

class ReportService {
  /**
   * Tạo và gửi báo cáo sự cố mới
   * API: POST /api/reports
   * @param {object} reportData - Dữ liệu báo cáo
   */
  async createReport(reportData) {
    try {
      console.log('ReportService: Tạo báo cáo mới', reportData);
      
      // Try the main reports endpoint first
      let response;
      try {
        response = await apiUtils.post('/api/reports', reportData);
      } catch (error) {
        // If 404, try alternative endpoints
        if (error.response?.status === 404) {
          console.log('⚠️ /api/reports not found, trying alternative endpoints...');
          
          // Try support tickets endpoint
          try {
            response = await apiUtils.post('/api/support/tickets', reportData);
          } catch (supportError) {
            // Try issues endpoint
            try {
              response = await apiUtils.post('/api/issues', reportData);
            } catch (issuesError) {
              // If all endpoints fail, return a helpful error
              throw new Error('API endpoint không tồn tại. Backend cần implement một trong các endpoint: /api/reports, /api/support/tickets, hoặc /api/issues');
            }
          }
        } else {
          throw error;
        }
      }
      
      if (response.success) {
        return { 
          success: true, 
          data: response.data, 
          message: 'Gửi báo cáo thành công' 
        };
      } else {
        throw new Error(response.message || 'Không thể gửi báo cáo');
      }
    } catch (error) {
      console.error('Lỗi khi tạo báo cáo:', error);
      const errorInfo = apiUtils.handleError(error);
      return { 
        success: false, 
        message: errorInfo.message || 'Lỗi khi gửi báo cáo', 
        error: errorInfo 
      };
    }
  }

  /**
   * Lấy danh sách báo cáo của user
   * API: GET /api/reports/user/{userId}
   * @param {string} userId - ID của user
   */
  async getUserReports(userId) {
    try {
      console.log(`ReportService: Lấy báo cáo của user ${userId}`);
      
      const response = await apiUtils.get(`/api/reports/user/${userId}`);
      
      if (response.success) {
        return { 
          success: true, 
          data: response.data, 
          message: 'Lấy danh sách báo cáo thành công' 
        };
      } else {
        throw new Error(response.message || 'Không thể lấy danh sách báo cáo');
      }
    } catch (error) {
      console.error('Lỗi khi lấy danh sách báo cáo:', error);
      const errorInfo = apiUtils.handleError(error);
      return { 
        success: false, 
        message: errorInfo.message || 'Lỗi khi lấy danh sách báo cáo', 
        error: errorInfo 
      };
    }
  }

  /**
   * Lấy chi tiết báo cáo
   * API: GET /api/reports/{reportId}
   * @param {string} reportId - ID của báo cáo
   */
  async getReportById(reportId) {
    try {
      console.log(`ReportService: Lấy chi tiết báo cáo ${reportId}`);
      
      const response = await apiUtils.get(`/api/reports/${reportId}`);
      
      if (response.success) {
        return { 
          success: true, 
          data: response.data, 
          message: 'Lấy chi tiết báo cáo thành công' 
        };
      } else {
        throw new Error(response.message || 'Không thể lấy chi tiết báo cáo');
      }
    } catch (error) {
      console.error('Lỗi khi lấy chi tiết báo cáo:', error);
      const errorInfo = apiUtils.handleError(error);
      return { 
        success: false, 
        message: errorInfo.message || 'Lỗi khi lấy chi tiết báo cáo', 
        error: errorInfo 
      };
    }
  }

  /**
   * Cập nhật trạng thái báo cáo
   * API: PUT /api/reports/{reportId}/status
   * @param {string} reportId - ID của báo cáo
   * @param {string} status - Trạng thái mới
   */
  async updateReportStatus(reportId, status) {
    try {
      console.log(`ReportService: Cập nhật trạng thái báo cáo ${reportId} thành ${status}`);
      
      const response = await apiUtils.put(`/api/reports/${reportId}/status`, { status });
      
      if (response.success) {
        return { 
          success: true, 
          data: response.data, 
          message: 'Cập nhật trạng thái thành công' 
        };
      } else {
        throw new Error(response.message || 'Không thể cập nhật trạng thái');
      }
    } catch (error) {
      console.error('Lỗi khi cập nhật trạng thái báo cáo:', error);
      const errorInfo = apiUtils.handleError(error);
      return { 
        success: false, 
        message: errorInfo.message || 'Lỗi khi cập nhật trạng thái', 
        error: errorInfo 
      };
    }
  }
}

export default new ReportService();