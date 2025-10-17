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
      // Keep logs minimal; return structured error
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
          data: response.data,
          message: 'Lấy thông tin người dùng thành công'
        };
      } else {
        throw new Error(response.message || 'Không thể lấy thông tin người dùng');
      }
    } catch (error) {
      const errorInfo = apiUtils.handleError(error);
      
      // Offline/Not Found fallback: return minimal user from localStorage for demo
      const shouldFallback =
        errorInfo?.code === 'ERR_NETWORK' ||
        errorInfo?.status === 0 ||
        errorInfo?.status === 404;
      if (shouldFallback) {
        try {
          const stored = localStorage.getItem('currentUser');
          if (stored) {
            const demoUser = JSON.parse(stored);
            return {
              success: true,
              data: demoUser,
              message: 'Dữ liệu demo từ localStorage (offline)'
            };
          }
        } catch (_) {}
      }
      
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

  // Update user profile
  async updateUserProfile(userId, profileData) {
    try {
      console.log('UserService: Update user profile', userId, profileData);
      
      const response = await apiUtils.put(API_CONFIG.ENDPOINTS.USERS.BY_ID(userId), profileData);
      
      if (response.success) {
        return {
          success: true,
          data: response.data,
          message: 'Cập nhật hồ sơ thành công'
        };
      } else {
        throw new Error(response.message || 'Không thể cập nhật hồ sơ');
      }
    } catch (error) {
      console.error('Update user profile error:', error);
      const errorInfo = apiUtils.handleError(error);
      return {
        success: false,
        message: errorInfo.message || 'Lỗi khi cập nhật hồ sơ',
        error: errorInfo
      };
    }
  }

  // Get user dashboard data
  async getUserDashboard(userId) {
    try {
      console.log('UserService: Get user dashboard', userId);
      
      const response = await apiUtils.get(`/api/users/${userId}/dashboard`);
      
      if (response.success) {
        return {
          success: true,
          data: response.data,
          message: 'Lấy dữ liệu dashboard thành công'
        };
      } else {
        throw new Error(response.message || 'Không thể lấy dữ liệu dashboard');
      }
    } catch (error) {
      const errorInfo = apiUtils.handleError(error);
      const shouldFallback = ((API_CONFIG.USE_DEMO_FALLBACK === true) || (API_CONFIG.USE_DEMO_FALLBACK === 'true')) && (
        errorInfo?.code === 'ERR_NETWORK' ||
        errorInfo?.status === 0 ||
        errorInfo?.status === 404
      );
      if (shouldFallback) {
        try {
          const stored = localStorage.getItem('currentUser');
          if (stored) {
            const user = JSON.parse(stored);
            const demoDashboard = {
              user,
              vehicles: 2,
              swapsThisMonth: 3,
              totalSwaps: 12,
              subscription: {
                plan: 'Standard',
                status: 'active',
                renewDate: new Date(Date.now() + 14 * 24 * 3600 * 1000).toISOString()
              },
              recentActivities: [
                { id: 'a1', type: 'swap', time: new Date().toISOString(), station: 'Station A', result: 'success' },
                { id: 'a2', type: 'payment', time: new Date(Date.now() - 86400000).toISOString(), amount: 149000 },
              ]
            };
            return {
              success: true,
              data: demoDashboard,
              message: 'Dữ liệu dashboard demo (offline)'
            };
          }
        } catch (_) {}
      }
      return {
        success: false,
        message: errorInfo.message || 'Lỗi khi lấy dữ liệu dashboard',
        error: errorInfo
      };
    }
  }

  // Update user preferences
  async updateUserPreferences(userId, preferences) {
    try {
      console.log('UserService: Update user preferences', userId, preferences);
      
      const response = await apiUtils.put(`/api/users/${userId}/preferences`, preferences);
      
      if (response.success) {
        return {
          success: true,
          data: response.data,
          message: 'Cập nhật tùy chọn thành công'
        };
      } else {
        throw new Error(response.message || 'Không thể cập nhật tùy chọn');
      }
    } catch (error) {
      console.error('Update user preferences error:', error);
      const errorInfo = apiUtils.handleError(error);
      return {
        success: false,
        message: errorInfo.message || 'Lỗi khi cập nhật tùy chọn',
        error: errorInfo
      };
    }
  }

  // Change password
  async changePassword(userId, passwordData) {
    try {
      console.log('UserService: Change password', userId);
      
      const response = await apiUtils.put(`/api/users/${userId}/password`, {
        oldPassword: passwordData.oldPassword,
        newPassword: passwordData.newPassword
      });
      
      if (response.success) {
        return {
          success: true,
          message: 'Đổi mật khẩu thành công'
        };
      } else {
        throw new Error(response.message || 'Không thể đổi mật khẩu');
      }
    } catch (error) {
      console.error('Change password error:', error);
      const errorInfo = apiUtils.handleError(error);
      return {
        success: false,
        message: errorInfo.message || 'Lỗi khi đổi mật khẩu',
        error: errorInfo
      };
    }
  }
}

export default new UserService();

