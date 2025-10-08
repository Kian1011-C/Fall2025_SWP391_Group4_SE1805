// User Service
// Handle user management operations

import { API_CONFIG, apiUtils } from '../config/api.js';

class UserService {
  async getAllUsers(filters = {}) {
    try {
      console.log('UserService: Get all users', filters);
      
      const response = await apiUtils.get(API_CONFIG.ENDPOINTS.USERS.BASE, filters);
      
      if (response.success) {
        return {
          success: true,
          data: response.data,
          message: 'Lấy danh sách người dùng thành công'
        };
      } else {
        throw new Error(response.message || 'Không thể lấy danh sách người dùng');
      }
    } catch (error) {
      console.error('Get all users error:', error);
      const errorInfo = apiUtils.handleError(error);
      return {
        success: false,
        message: errorInfo.message || 'Lỗi khi lấy danh sách người dùng',
        error: errorInfo
      };
    }
  }

  async getUserById(userId) {
    try {
      console.log('UserService: Get user by ID', userId);
      
      const response = await apiUtils.get(API_CONFIG.ENDPOINTS.USERS.BY_ID(userId));
      
      if (response.success) {
        return {
          success: true,
          data: response,
          message: 'Lấy thông tin người dùng thành công'
        };
      } else {
        throw new Error(response.message || 'Không thể lấy thông tin người dùng');
      }
    } catch (error) {
      console.error('Get user by ID error:', error);
      const errorInfo = apiUtils.handleError(error);
      
      // If it's a network error, try to parse the actual response
      if (error.response && error.response.data) {
        return {
          success: error.response.data.success || false,
          data: error.response.data,
          message: error.response.data.message || 'Lỗi từ server'
        };
      }
      
      return {
        success: false,
        message: errorInfo.message || 'Lỗi khi lấy thông tin người dùng',
        error: errorInfo
      };
    }
  }

  // Get user profile
  async getUserProfile(userId) {
    try {
      console.log('UserService: Get user profile', userId);
      
      const response = await apiUtils.get(API_CONFIG.ENDPOINTS.USERS.PROFILE(userId));
      
      if (response.success) {
        return {
          success: true,
          data: response.data,
          message: 'Lấy hồ sơ người dùng thành công'
        };
      } else {
        throw new Error(response.message || 'Không thể lấy hồ sơ người dùng');
      }
    } catch (error) {
      console.error('Get user profile error:', error);
      const errorInfo = apiUtils.handleError(error);
      return {
        success: false,
        message: errorInfo.message || 'Lỗi khi lấy hồ sơ người dùng',
        error: errorInfo
      };
    }
  }

  // Get user statistics
  async getUserStatistics(userId) {
    try {
      console.log('UserService: Get user statistics', userId);
      
      const response = await apiUtils.get(API_CONFIG.ENDPOINTS.USERS.STATISTICS(userId));
      
      if (response.success) {
        return {
          success: true,
          data: response.data,
          message: 'Lấy thống kê người dùng thành công'
        };
      } else {
        throw new Error(response.message || 'Không thể lấy thống kê người dùng');
      }
    } catch (error) {
      console.error('Get user statistics error:', error);
      const errorInfo = apiUtils.handleError(error);
      return {
        success: false,
        message: errorInfo.message || 'Lỗi khi lấy thống kê người dùng',
        error: errorInfo
      };
    }
  }

  // Get user subscription
  async getUserSubscription(userId) {
    try {
      console.log('UserService: Get user subscription', userId);
      
      const response = await apiUtils.get(API_CONFIG.ENDPOINTS.USERS.SUBSCRIPTION(userId));
      
      if (response.success) {
        return {
          success: true,
          data: response.data,
          message: 'Lấy gói đăng ký thành công'
        };
      } else {
        throw new Error(response.message || 'Không thể lấy gói đăng ký');
      }
    } catch (error) {
      console.error('Get user subscription error:', error);
      const errorInfo = apiUtils.handleError(error);
      return {
        success: false,
        message: errorInfo.message || 'Lỗi khi lấy gói đăng ký',
        error: errorInfo
      };
    }
  }

  async createUser(userData) {
    try {
      console.log('UserService: Create user', userData);
      
      const response = await apiUtils.post(API_CONFIG.ENDPOINTS.USERS.BASE, userData);
      
      if (response.success) {
        return {
          success: true,
          data: response.data,
          message: 'Tạo người dùng thành công'
        };
      } else {
        throw new Error(response.message || 'Không thể tạo người dùng');
      }
    } catch (error) {
      console.error('Create user error:', error);
      const errorInfo = apiUtils.handleError(error);
      return {
        success: false,
        message: errorInfo.message || 'Lỗi khi tạo người dùng',
        error: errorInfo
      };
    }
  }

  async updateUser(userId, userData) {
    try {
      console.log('UserService: Update user', userId, userData);
      
      const response = await apiUtils.put(API_CONFIG.ENDPOINTS.USERS.BY_ID(userId), userData);
      
      if (response.success) {
        return {
          success: true,
          data: response.data,
          message: 'Cập nhật người dùng thành công'
        };
      } else {
        throw new Error(response.message || 'Không thể cập nhật người dùng');
      }
    } catch (error) {
      console.error('Update user error:', error);
      const errorInfo = apiUtils.handleError(error);
      return {
        success: false,
        message: errorInfo.message || 'Lỗi khi cập nhật người dùng',
        error: errorInfo
      };
    }
  }

  async deleteUser(userId) {
    try {
      console.log('UserService: Delete user', userId);
      
      const response = await apiUtils.delete(API_CONFIG.ENDPOINTS.USERS.BY_ID(userId));
      
      if (response.success) {
        return {
          success: true,
          message: 'Xóa người dùng thành công'
        };
      } else {
        throw new Error(response.message || 'Không thể xóa người dùng');
      }
    } catch (error) {
      console.error('Delete user error:', error);
      const errorInfo = apiUtils.handleError(error);
      return {
        success: false,
        message: errorInfo.message || 'Lỗi khi xóa người dùng',
        error: errorInfo
      };
    }
  }

  async toggleUserStatus(userId) {
    try {
      console.log('UserService: Toggle user status', userId);
      
      const response = await apiUtils.post(API_CONFIG.ENDPOINTS.USERS.TOGGLE_STATUS(userId));
      
      if (response.success) {
        return {
          success: true,
          data: response.data,
          message: 'Cập nhật trạng thái người dùng thành công'
        };
      } else {
        throw new Error(response.message || 'Không thể cập nhật trạng thái');
      }
    } catch (error) {
      console.error('Toggle user status error:', error);
      const errorInfo = apiUtils.handleError(error);
      return {
        success: false,
        message: errorInfo.message || 'Lỗi khi cập nhật trạng thái',
        error: errorInfo
      };
    }
  }
}

export default new UserService();

