import { apiUtils, API_CONFIG } from '../config/api.js';

class UserService {
  /**
   * Lấy danh sách tất cả người dùng (Admin) bằng cách gộp Drivers và Staff.
   */
  async getAllUsers(filters = {}) {
    try {
      console.log('UserService: Lấy tất cả người dùng từ /api/admin/users...', filters);
      
      // Gọi MỘT API duy nhất mà backend có
      // filters (ví dụ: { role: 'driver', search: 'abc' }) 
      // sẽ được apiUtils tự động chuyển thành query params:
      // /api/admin/users?role=driver&search=abc
      const response = await apiUtils.get('/api/admin/users', filters);
      
      if (response.success && Array.isArray(response.data)) {
        // Dữ liệu trả về từ backend đã là một mảng user hoàn chỉnh
        return { 
          success: true, 
          data: response.data, 
          message: 'Lấy danh sách người dùng thành công',
          // Chúng ta cũng nên trả về thông tin phân trang
          total: response.total,
          page: response.page,
          totalPages: response.totalPages
        };
      } else {
        throw new Error(response.message || 'Không thể lấy danh sách người dùng');
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
   * Lấy thông tin profile chi tiết của người dùng.
   * @param {string} userId - ID của người dùng
   */
  async getUserProfile(userId) {
    try {
      console.log(`UserService: Lấy thông tin profile cho user ${userId} từ API GET /api/users/${userId}/profile`);
      
      const response = await apiUtils.get(`/api/users/${userId}/profile`);
      
      if (response.success) {
        console.log('✅ API profile trả về dữ liệu:', response);
        return { success: true, data: response.data, message: 'Lấy thông tin profile thành công' };
      } else {
        throw new Error(response.message || 'Không thể lấy thông tin profile');
      }
    } catch (error) {
      console.error(`Lỗi khi lấy thông tin profile user ${userId}:`, error);
      const errorInfo = apiUtils.handleError(error);
      return { success: false, message: errorInfo.message || 'Lỗi API' };
    }
  }

  /**
   * Lấy thông tin dashboard của người dùng (Driver) - SỬ DỤNG API MỚI.
   * @param {string} userId - ID của người dùng
   */
  async getUserDashboard(userId) {
    try {
      console.log(`UserService: Lấy dashboard cho user ${userId} từ API mới GET /api/users/{id}`);
      
      // SỬ DỤNG API MỚI: GET /api/users/{id}
      const response = await apiUtils.get(`/api/users/${userId}`);
      
      if (response.success) {
        console.log('✅ API mới trả về dữ liệu:', response);
        
        // Xử lý dữ liệu từ API mới - DỮ LIỆU Ở ROOT LEVEL
        const user = response.user || {};
        const dashboard = response.dashboard || {};
        const vehicles = response.vehicles || [];
        
        console.log('🔍 Dữ liệu từ backend:');
        console.log('- user:', user);
        console.log('- dashboard:', dashboard);
        console.log('- vehicles:', vehicles);
        
        // Tạo cấu trúc dashboard từ dữ liệu API mới
        const dashboardData = {
          user: {
            id: user.userId || user.id || userId,
            name: `${user.firstName || ''} ${user.lastName || ''}`.trim() || user.name,
            email: user.email,
            phone: user.phone,
            role: user.role
          },
          vehicles: vehicles,
          dashboard: {
            totalSwaps: dashboard.totalSwaps || 0,
            activeVehicles: vehicles.length,
            monthlySpent: dashboard.monthlySpent || 0,
            totalDistance: dashboard.totalDistance || 0,
            currentPlans: dashboard.currentPlans || [],
            contracts: dashboard.contracts || [],
            // Thêm các field khác từ dashboard
            vehiclePlate: dashboard.vehiclePlate,
            vehicleModel: dashboard.vehicleModel,
            contractNumber: dashboard.contractNumber,
            contractStatus: dashboard.contractStatus,
            batteryModel: dashboard.batteryModel,
            batteryHealth: dashboard.batteryHealth,
            batteryStatus: dashboard.batteryStatus
          }
        };
        
        console.log('✅ Dashboard data được tạo:', dashboardData);
        return { success: true, data: dashboardData, message: 'Lấy dashboard thành công từ API mới' };
      } else {
        throw new Error(response.message || 'Không thể lấy dashboard từ API mới');
      }
    } catch (error) {
      console.error('❌ Lỗi khi lấy dashboard từ API mới:', error);
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