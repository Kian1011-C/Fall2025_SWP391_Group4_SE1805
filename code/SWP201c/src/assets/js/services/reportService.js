// Report Service
// Handle reports and analytics

import { API_CONFIG, apiUtils } from '../config/api.js';

class ReportService {
  async getOverviewReport(dateRange = 'month') {
    try {
      console.log('ReportService: Get overview report', dateRange);
      
      const response = await apiUtils.get(API_CONFIG.ENDPOINTS.REPORTS.OVERVIEW, { dateRange });
      
      if (response.success) {
        return {
          success: true,
          data: response.data,
          message: 'Lấy báo cáo tổng quan thành công'
        };
      } else {
        throw new Error(response.message || 'Không thể lấy báo cáo tổng quan');
      }
    } catch (error) {
      console.error('Get overview report error:', error);
      const errorInfo = apiUtils.handleError(error);
      return {
        success: false,
        message: errorInfo.message || 'Lỗi khi lấy báo cáo tổng quan',
        error: errorInfo
      };
    }
  }

  async getRevenueReport(dateRange = 'month') {
    try {
      console.log('ReportService: Get revenue report', dateRange);
      
      const response = await apiUtils.get(API_CONFIG.ENDPOINTS.REPORTS.REVENUE, { dateRange });
      
      if (response.success) {
        return {
          success: true,
          data: response.data,
          message: 'Lấy báo cáo doanh thu thành công'
        };
      } else {
        throw new Error(response.message || 'Không thể lấy báo cáo doanh thu');
      }
    } catch (error) {
      console.error('Get revenue report error:', error);
      const errorInfo = apiUtils.handleError(error);
      return {
        success: false,
        message: errorInfo.message || 'Lỗi khi lấy báo cáo doanh thu',
        error: errorInfo
      };
    }
  }

  async getUsageReport(dateRange = 'month') {
    try {
      console.log('ReportService: Get usage report', dateRange);
      
      const response = await apiUtils.get(API_CONFIG.ENDPOINTS.REPORTS.USAGE, { dateRange });
      
      if (response.success) {
        return {
          success: true,
          data: response.data,
          message: 'Lấy báo cáo sử dụng thành công'
        };
      } else {
        throw new Error(response.message || 'Không thể lấy báo cáo sử dụng');
      }
    } catch (error) {
      console.error('Get usage report error:', error);
      const errorInfo = apiUtils.handleError(error);
      return {
        success: false,
        message: errorInfo.message || 'Lỗi khi lấy báo cáo sử dụng',
        error: errorInfo
      };
    }
  }

  async getCustomerReport(dateRange = 'month') {
    try {
      console.log('ReportService: Get customer report', dateRange);
      
      const response = await apiUtils.get(API_CONFIG.ENDPOINTS.REPORTS.CUSTOMERS, { dateRange });
      
      if (response.success) {
        return {
          success: true,
          data: response.data,
          message: 'Lấy báo cáo khách hàng thành công'
        };
      } else {
        throw new Error(response.message || 'Không thể lấy báo cáo khách hàng');
      }
    } catch (error) {
      console.error('Get customer report error:', error);
      const errorInfo = apiUtils.handleError(error);
      return {
        success: false,
        message: errorInfo.message || 'Lỗi khi lấy báo cáo khách hàng',
        error: errorInfo
      };
    }
  }

  async exportReport(reportType, dateRange, format = 'pdf') {
    try {
      console.log('ReportService: Export report', reportType, dateRange, format);
      
      const response = await apiUtils.post(API_CONFIG.ENDPOINTS.REPORTS.EXPORT, {
        reportType,
        dateRange,
        format
      });
      
      if (response.success) {
        return {
          success: true,
          data: response.data,
          message: 'Xuất báo cáo thành công'
        };
      } else {
        throw new Error(response.message || 'Không thể xuất báo cáo');
      }
    } catch (error) {
      console.error('Export report error:', error);
      const errorInfo = apiUtils.handleError(error);
      return {
        success: false,
        message: errorInfo.message || 'Lỗi khi xuất báo cáo',
        error: errorInfo
      };
    }
  }
}

export default new ReportService();

