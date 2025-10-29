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
    // Demo accounts (development fallback)
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
    
    const tryDemoLogin = () => {
      if (!(API_CONFIG.USE_DEMO_FALLBACK === true || API_CONFIG.USE_DEMO_FALLBACK === 'true')) {
        return null;
      }
      const demoAccount = DEMO_ACCOUNTS.find(account =>
        account.email === (credentials.email || credentials.username) &&
        account.password === credentials.password
      );
      if (!demoAccount) return null;
      this.saveUserToStorage(demoAccount.user);
      return {
        success: true,
        user: demoAccount.user,
        token: `demo_token_${demoAccount.user.id}`,
        redirect: null, // Demo accounts don't have redirect field
        message: `Đăng nhập thành công - ${demoAccount.user.role.toUpperCase()}`
      };
    };

    try {
      console.log('AuthService: Login attempt with backend API', credentials);

      // Call real Spring Boot API
      const backendResponse = await apiUtils.post(
        API_CONFIG.ENDPOINTS.AUTH.LOGIN,
        {
          email: credentials.email || credentials.username,
          password: credentials.password
        }
      );

      console.log('AuthService: Backend response:', backendResponse);

      // Handle various backend response shapes
      const responseUser = backendResponse.user || backendResponse.data?.user;
      const responseToken = backendResponse.token || backendResponse.data?.token;
      const responseSuccess = backendResponse.success ?? backendResponse.data?.success ?? !!responseUser;

      if (responseSuccess && responseUser) {
        if (responseToken) {
          localStorage.setItem('authToken', responseToken);
        }
        this.saveUserToStorage(responseUser);
        return {
          success: true,
          user: responseUser,
          token: responseToken || 'backend_token',
          redirect: backendResponse.redirect || backendResponse.data?.redirect,
          message: backendResponse.message || backendResponse.data?.message || 'Đăng nhập thành công'
        };
      }

      // Backend responded but not successful → try demo
      const demoResult = tryDemoLogin();
      if (demoResult) return demoResult;

      return {
        success: false,
        message: backendResponse.message || backendResponse.data?.message || 'Đăng nhập thất bại'
      };
    } catch (error) {
      // Network/CORS error → try demo fallback
      console.error('Login error:', error);
      const demoResult = tryDemoLogin();
      if (demoResult) return demoResult;

      const errorInfo = apiUtils.handleError(error);
      const isCorsOrNetwork = errorInfo?.code === 'ERR_NETWORK' || errorInfo?.status === 0;
      return {
        success: false,
        message: isCorsOrNetwork
          ? 'Không thể kết nối máy chủ (CORS/Network). Thử lại sau hoặc dùng tài khoản demo.'
          : (errorInfo.message || 'Đăng nhập thất bại'),
        error: errorInfo
      };
    }
  }

  async logout() {
    // Always clear local state first for instant UX
    this.clearUserFromStorage();

    // If there is no token, skip network call entirely
    const token = localStorage.getItem('authToken');
    if (!token) {
      return { success: true, message: 'Đã đăng xuất (offline)' };
    }

    try {
      // Best-effort server logout; ignore CORS/network issues
      await apiUtils.post(API_CONFIG.ENDPOINTS.AUTH.LOGOUT);
      return { success: true, message: 'Đăng xuất thành công' };
    } catch {
      // Swallow errors to avoid noisy console when backend is unreachable
      return { success: true, message: 'Đã đăng xuất (server không phản hồi)' };
    }
  }

  async register(userData) {
    try {
      console.log('AuthService: Register user', userData);
      
      // Create FormData for Spring Boot backend
      const formData = new FormData();
      formData.append('firstName', userData.firstName);
      formData.append('lastName', userData.lastName);
      formData.append('email', userData.email);
      formData.append('phone', userData.phone);
      formData.append('password', userData.password);
      formData.append('cccd', userData.cccd);
      
      console.log('AuthService: Sending FormData:', {
        firstName: userData.firstName,
        lastName: userData.lastName,
        email: userData.email,
        phone: userData.phone,
        password: '[HIDDEN]',
        cccd: userData.cccd
      });
      
      const response = await apiUtils.postFormData('/api/users/register', formData);

      console.log('AuthService: Registration response:', response);

      if (response.success) {
        return {
          success: true,
          message: response.message || 'Đăng ký thành công! Vui lòng kiểm tra email để nhập OTP.',
          userId: response.userId,
          redirect: response.redirect
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

  async verifyOTP(userId, otp) {
    try {
      console.log('AuthService: Verify OTP', { userId, otp });
      
      // Create FormData for Spring Boot backend
      const formData = new FormData();
      formData.append('userId', userId);
      formData.append('otp', otp);
      
      console.log('AuthService: Sending FormData for OTP:', {
        userId: userId,
        otp: otp
      });
      
      const response = await apiUtils.postFormData('/api/users/verify-otp', formData);

      console.log('AuthService: OTP verification response:', response);

      if (response.success) {
        return {
          success: true,
          message: response.message || 'Xác thực thành công!',
          redirect: response.redirect
        };
      } else {
        throw new Error(response.message || 'Mã OTP không đúng');
      }
    } catch (error) {
      console.error('Verify OTP error:', error);
      const errorInfo = apiUtils.handleError(error);
      return {
        success: false,
        message: errorInfo.message || 'Xác thực OTP thất bại',
        error: errorInfo
      };
    }
  }

  async resendOTP(userId) {
    try {
      console.log('AuthService: Resend OTP', { userId });
      
      // Create FormData for Spring Boot backend
      const formData = new FormData();
      formData.append('userId', userId);
      
      console.log('AuthService: Sending FormData for resend OTP:', {
        userId: userId
      });
      
      const response = await apiUtils.postFormData('/api/users/resend-otp', formData);

      console.log('AuthService: Resend OTP response:', response);

      if (response.success) {
        return {
          success: true,
          message: response.message || 'Đã gửi lại mã OTP!'
        };
      } else {
        throw new Error(response.message || 'Không thể gửi lại mã OTP');
      }
    } catch (error) {
      console.error('Resend OTP error:', error);
      const errorInfo = apiUtils.handleError(error);
      return {
        success: false,
        message: errorInfo.message || 'Gửi lại mã OTP thất bại',
        error: errorInfo
      };
    }
  }

  // Send forgot password email link
  async forgotPassword(email) {
    try {
      console.log('AuthService: Forgot Password', { email });
      const formData = new FormData();
      formData.append('email', email);
      const response = await apiUtils.postFormData('/api/users/forgot', formData);
      console.log('AuthService: Forgot Password response:', response);
      if (response.success) {
        return {
          success: true,
          message: response.message || 'Nếu email tồn tại, hệ thống đã gửi liên kết đặt lại.'
        };
      } else {
        throw new Error(response.message || 'Yêu cầu quên mật khẩu thất bại');
      }
    } catch (error) {
      console.error('Forgot Password error:', error);
      const errorInfo = apiUtils.handleError(error);
      return {
        success: false,
        message: errorInfo.message || 'Không thể xử lý yêu cầu quên mật khẩu',
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