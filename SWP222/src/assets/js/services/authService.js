// Authentication Service
// Handle user authentication and authorization

import { API_CONFIG, apiUtils } from '../config/api.js';

class AuthService {
  constructor() {
    this.currentUser = this.loadUserFromStorage();
    this.isLoggedIn = !!this.currentUser;
  }

  // Load user from localStorage
  loadUserFromStorage() {
    try {
      const userData = localStorage.getItem('currentUser');
      return userData ? JSON.parse(userData) : null;
    } catch (error) {
      console.error('Error loading user from storage:', error);
      return null;
    }
  }

  // Save user to localStorage
  saveUserToStorage(user) {
    try {
      localStorage.setItem('currentUser', JSON.stringify(user));
      this.currentUser = user;
      this.isLoggedIn = true;
    } catch (error) {
      console.error('Error saving user to storage:', error);
    }
  }

  // Clear user from localStorage
  clearUserFromStorage() {
    localStorage.removeItem('currentUser');
    localStorage.removeItem('authToken');
    this.currentUser = null;
    this.isLoggedIn = false;
  }

  async login(credentials) {
    try {
      console.log('AuthService: Login attempt with backend API', credentials);
      
      // Call real Spring Boot API first
      const backendResponse = await apiUtils.post(API_CONFIG.ENDPOINTS.AUTH.LOGIN, {
        email: credentials.email || credentials.username,
        password: credentials.password
      });

      console.log('AuthService: Backend response:', backendResponse);

      if (backendResponse.success && backendResponse.user) {
        // Save auth token if provided
        if (backendResponse.token) {
          localStorage.setItem('authToken', backendResponse.token);
        }

        // Save user data
        this.saveUserToStorage(backendResponse.user);

        return {
          success: true,
          user: backendResponse.user,
          token: backendResponse.token || 'backend_token',
          message: backendResponse.message || 'Đăng nhập thành công'
        };
      }
      
      // If backend fails, fallback to demo accounts for development
      console.log('AuthService: Backend failed, trying demo accounts');
      const DEMO_ACCOUNTS = [
        {
          email: 'admin@evswap.com',
          password: 'admin123',
          user: {
            id: 'admin001',
            email: 'admin@evswap.com',
            name: 'Nguyen Duc Anh',
            firstName: 'Duc Anh',
            lastName: 'Nguyen',
            role: 'admin',
            phone: '0901234567',
            cccd: '123456789001',
            status: 'active'
          }
        },
        {
          email: 'minh.driver@gmail.com',
          password: 'driver123',
          user: {
            id: 'driver001',
            email: 'minh.driver@gmail.com',
            name: 'Tran Van Minh',
            firstName: 'Van Minh',
            lastName: 'Tran',
            role: 'driver',
            phone: '0902345678',
            cccd: '123456789002',
            status: 'active'
          }
        },
        {
          email: 'hoa.driver@gmail.com',
          password: 'driver123',
          user: {
            id: 'driver002',
            email: 'hoa.driver@gmail.com',
            name: 'Le Thi Hoa',
            firstName: 'Thi Hoa',
            lastName: 'Le',
            role: 'driver',
            phone: '0903456789',
            cccd: '123456789003',
            status: 'active'
          }
        },
        {
          email: 'duc.staff@evswap.com',
          password: 'staff123',
          user: {
            id: 'staff001',
            email: 'duc.staff@evswap.com',
            name: 'Pham Van Duc',
            firstName: 'Van Duc',
            lastName: 'Pham',
            role: 'staff',
            phone: '0904567890',
            cccd: '123456789004',
            status: 'active'
          }
        },
        {
          email: 'mai.staff@evswap.com',
          password: 'staff123',
          user: {
            id: 'staff002',
            email: 'mai.staff@evswap.com',
            name: 'Hoang Thi Mai',
            firstName: 'Thi Mai',
            lastName: 'Hoang',
            role: 'staff',
            phone: '0905678901',
            cccd: '123456789005',
            status: 'active'
          }
        }
      ];

      // Check if using demo account
      const demoAccount = DEMO_ACCOUNTS.find(account => 
        account.email === credentials.email && account.password === credentials.password
      );
      
      if (demoAccount) {
        // Save demo user
        this.saveUserToStorage(demoAccount.user);
        
        return {
          success: true,
          user: demoAccount.user,
          token: `demo_token_${demoAccount.user.id}`,
          message: `Đăng nhập thành công - ${demoAccount.user.role.toUpperCase()}`
        };
      }
      
      // Call real API
      const response = await apiUtils.post(API_CONFIG.ENDPOINTS.AUTH.LOGIN, {
        email: credentials.email || credentials.username,
        password: credentials.password
      });

      if (response.success && response.data) {
        // Save auth token
        if (response.data.token) {
          localStorage.setItem('authToken', response.data.token);
        }

        // Save user data
        this.saveUserToStorage(response.data.user);

        return {
          success: true,
          user: response.data.user,
          token: response.data.token,
          message: 'Đăng nhập thành công'
        };
      } else {
        throw new Error(response.message || 'Đăng nhập thất bại');
      }
    } catch (error) {
      console.error('Login error:', error);
      const errorInfo = apiUtils.handleError(error);
      return {
        success: false,
        message: errorInfo.message || 'Đăng nhập thất bại',
        error: errorInfo
      };
    }
  }

  async logout() {
    try {
      console.log('AuthService: Logout');
      
      // Call logout endpoint to invalidate token on server
      await apiUtils.post(API_CONFIG.ENDPOINTS.AUTH.LOGOUT);
      
      // Clear local storage
      this.clearUserFromStorage();
      
      return {
        success: true,
        message: 'Đăng xuất thành công'
      };
    } catch (error) {
      console.error('Logout error:', error);
      // Clear local storage even if API call fails
      this.clearUserFromStorage();
      
      return {
        success: true,
        message: 'Đăng xuất thành công'
      };
    }
  }

  async register(userData) {
    try {
      console.log('AuthService: Register user', userData);
      
      const response = await apiUtils.post('/api/auth/register', {
        username: userData.username,
        email: userData.email,
        password: userData.password,
        fullName: userData.fullName,
        phone: userData.phone,
        role: userData.role || 'driver'
      });

      if (response.success) {
        return {
          success: true,
          message: 'Đăng ký thành công',
          data: response.data
        };
      } else {
        throw new Error(response.message || 'Đăng ký thất bại');
      }
    } catch (error) {
      console.error('Register error:', error);
      const errorInfo = apiUtils.handleError(error);
      return {
        success: false,
        message: errorInfo.message || 'Đăng ký thất bại',
        error: errorInfo
      };
    }
  }

  async getCurrentUserFromAPI() {
    try {
      const response = await apiUtils.get(API_CONFIG.ENDPOINTS.AUTH.ME);
      
      if (response.success && response.data) {
        this.saveUserToStorage(response.data);
        return response.data;
      } else {
        throw new Error('Không thể lấy thông tin người dùng');
      }
    } catch (error) {
      console.error('Get current user error:', error);
      this.clearUserFromStorage();
      throw error;
    }
  }

  getCurrentUser() {
    return this.currentUser;
  }

  isAuthenticated() {
    const token = localStorage.getItem('authToken');
    return this.isLoggedIn && !!token;
  }

  // Normalize role from database format to frontend format
  normalizeRole(role) {
    const roleMap = {
      'Admin': 'admin',
      'Staff': 'staff', 
      'EV Driver': 'driver',
      'admin': 'admin',
      'staff': 'staff',
      'driver': 'driver'
    };
    return roleMap[role] || 'driver';
  }

  // Check if user has specific role
  hasRole(role) {
    const userRole = this.normalizeRole(this.currentUser?.role);
    const checkRole = this.normalizeRole(role);
    return userRole === checkRole;
  }

  // Check if user has any of the specified roles
  hasAnyRole(roles) {
    const userRole = this.normalizeRole(this.currentUser?.role);
    return roles.some(role => this.normalizeRole(role) === userRole);
  }

  // Get user permissions
  getPermissions() {
    const rolePermissions = {
      'admin': ['all'], // Admin có tất cả quyền
      'Admin': ['all'], // Database role format
      'staff': ['stations', 'batteries', 'transactions', 'reports', 'swaps', 'issues'],
      'Staff': ['stations', 'batteries', 'transactions', 'reports', 'swaps', 'issues'], // Database role format
      'driver': ['profile', 'swap', 'payments', 'history', 'vehicles', 'contracts'],
      'EV Driver': ['profile', 'swap', 'payments', 'history', 'vehicles', 'contracts'] // Database role format
    };

    return rolePermissions[this.currentUser?.role] || [];
  }

  // Check if user has specific permission
  hasPermission(permission) {
    const permissions = this.getPermissions();
    return permissions.includes('all') || permissions.includes(permission);
  }
}

export default new AuthService();