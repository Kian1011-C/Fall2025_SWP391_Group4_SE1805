import { apiUtils, API_CONFIG } from '../config/api.js';

class UserService {
  /**
   * Lấy danh sách tất cả người dùng (Admin) bằng cách gộp Drivers và Staff.
   */
  async getAllUsers(filters = {}) {
    try {
      console.log('UserService: Lấy tất cả người dùng (Drivers và Staff)...', filters);
      
      // Gọi cả hai API cùng lúc
      const [driversResponse, staffResponse] = await Promise.all([
        apiUtils.get('/api/admin/drivers', filters),
        apiUtils.get('/api/admin/staff', filters)
      ]);
      
      if (driversResponse.success && staffResponse.success) {
        // Gộp hai danh sách lại
        const allUsers = [
          ...driversResponse.data.map(user => ({ ...user, role: 'driver' })),
          ...staffResponse.data.map(user => ({ ...user, role: 'staff' }))
        ];
        
        return { success: true, data: allUsers, message: 'Lấy danh sách người dùng thành công' };
      } else {
        throw new Error(driversResponse.message || staffResponse.message || 'Không thể lấy danh sách người dùng');
      }
    } catch (error) {
      console.error('Lỗi khi lấy danh sách người dùng:', error);
      const errorInfo = apiUtils.handleError(error);
      return { success: false, message: errorInfo.message || 'Lỗi API', data: [] };
    }
  }

  /**
   * Cập nhật thông tin người dùng (cho Admin).
   * @param {string} userId - ID của người dùng
   * @param {object} userData - Dữ liệu cập nhật
   */
  async updateUser(userId, userData) {
    try {
      const endpoint = userData.role === 'driver' ? `/api/admin/drivers/${userId}` : `/api/admin/staff/${userId}`;
      console.log(`UserService: Cập nhật người dùng ${userId} tại ${endpoint}`, userData);
      const response = await apiUtils.put(endpoint, userData);
      
      if (response.success) {
        return { success: true, data: response.data, message: 'Cập nhật người dùng thành công' };
      } else {
        throw new Error(response.message || 'Không thể cập nhật người dùng');
      }
    } catch (error) {
      const errorInfo = apiUtils.handleError(error);
      return { success: false, message: errorInfo.message || 'Lỗi khi cập nhật người dùng', error: errorInfo };
    }
  }

  /**
   * Tạo người dùng mới (cho Admin).
   * @param {object} userData - Dữ liệu người dùng mới
   */
  async createUser(userData) {
    try {
      const endpoint = userData.role === 'driver' ? '/api/admin/drivers' : '/api/admin/staff';
      console.log(`UserService: Tạo người dùng tại ${endpoint}`, userData);
      const response = await apiUtils.post(endpoint, userData);
      
      if (response.success) {
        return { success: true, data: response.data, message: 'Tạo người dùng thành công' };
      } else {
        throw new Error(response.message || 'Không thể tạo người dùng');
      }
    } catch (error) {
      console.error('Lỗi khi tạo người dùng:', error);
      const errorInfo = apiUtils.handleError(error);
      return { success: false, message: errorInfo.message || 'Lỗi khi tạo người dùng', error: errorInfo };
    }
  }

  /**
   * Lấy thông tin dashboard của người dùng (Driver).
   * @param {string} userId - ID của người dùng
   */
  async getUserDashboard(userId) {
    try {
      console.log(`UserService: Lấy dashboard cho user ${userId}`);
      
      // Thử endpoint có sẵn trước
      const response = await apiUtils.get(`/api/users/${userId}/statistics`);
      
      if (response.success) {
        // Tạo cấu trúc dashboard từ dữ liệu statistics
        const dashboardData = {
          user: response.data.user || { id: userId },
          vehicles: response.data.vehicles || [],
          dashboard: {
            totalSwaps: response.data.totalSwaps || 0,
            activeVehicles: response.data.activeVehicles || 0,
            monthlySpent: response.data.monthlySpent || 0,
            totalDistance: response.data.totalDistance || 0
          }
        };
        
        return { success: true, data: dashboardData, message: 'Lấy dashboard thành công' };
      } else {
        throw new Error(response.message || 'Không thể lấy dashboard');
      }
    } catch (error) {
      console.error('Lỗi khi lấy dashboard:', error);
      const errorInfo = apiUtils.handleError(error);
      return { success: false, message: errorInfo.message || 'Lỗi khi lấy dashboard', error: errorInfo };
    }
  }

  /**
   * Lấy thông tin profile của driver.
   * @param {string} userId - ID của driver
   */
  async getDriverProfile(userId) {
    try {
      console.log(`UserService: Lấy profile driver ${userId}`);
      const response = await apiUtils.get(`/api/driver/profile/${userId}`);
      
      if (response.success) {
        return { success: true, data: response.data, message: 'Lấy profile driver thành công' };
      } else {
        throw new Error(response.message || 'Không thể lấy profile driver');
      }
    } catch (error) {
      console.error('Lỗi khi lấy profile driver:', error);
      const errorInfo = apiUtils.handleError(error);
      return { success: false, message: errorInfo.message || 'Lỗi khi lấy profile driver', error: errorInfo };
    }
  }
}

export default new UserService();