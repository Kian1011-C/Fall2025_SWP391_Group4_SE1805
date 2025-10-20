// Auth Context - Quản lý authentication
import React, { createContext, useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { showToast } from '../assets/js/helpers/helpers';
import authService from '../assets/js/services/authService';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState(null);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [currentView, setCurrentView] = useState('landing');

  // Thêm log để kiểm tra giá trị currentView
  console.log('🔍 AuthContext: currentView =', currentView);

  const handleLogin = async (email, password) => {
    console.log('🔐 AuthContext: Starting login process for:', email);
    setIsLoggingIn(true);
    try {
      const response = await authService.login({ email, password });
      console.log('🔐 AuthContext: Login response:', response);
      
      if (response.success) {
        const userData = response.user;
        setCurrentUser(userData);
        setCurrentView('dashboard');
        setShowLoginModal(false);
        
        // Handle both frontend role format and database role format
        const normalizeRole = (role) => {
          const roleMap = {
            'Admin': 'admin',
            'Staff': 'staff', 
            'EV Driver': 'driver',
            'admin': 'admin',
            'staff': 'staff',
            'driver': 'driver'
          };
          return roleMap[role] || 'driver';
        };

        const normalizedRole = normalizeRole(userData.role);
        
        // Update user object with normalized role for consistency
        const updatedUser = { ...userData, role: normalizedRole };
        setCurrentUser(updatedUser);
        
        // Navigate to appropriate dashboard
        const dashboardPath = normalizedRole === 'admin' ? '/admin/dashboard' :
                             normalizedRole === 'staff' ? '/staff/dashboard' :
                             '/driver/dashboard';
        
        console.log('🚀 AuthContext: Navigating to dashboard:', dashboardPath, 'for role:', normalizedRole);
        showToast(`Chào mừng ${userData.name}! Đang chuyển đến ${normalizedRole.toUpperCase()} Dashboard...`, 'success');
        
        // Small delay to show the toast before navigating
        setTimeout(() => {
          console.log('🎯 AuthContext: Executing navigation to:', dashboardPath);
          navigate(dashboardPath);
        }, 500);
      } else {
        showToast(response.message || 'Đăng nhập thất bại!', 'error');
      }
    } catch (error) {
      console.error('Login error:', error);
      showToast('Có lỗi xảy ra khi đăng nhập!', 'error');
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleLogout = async () => {
    try {
      await authService.logout();
      setCurrentUser(null);
      setCurrentView('landing');
      navigate('/');
      showToast('Đã đăng xuất!', 'success');
    } catch (error) {
      console.error('Logout error:', error);
      showToast('Có lỗi xảy ra khi đăng xuất!', 'error');
    }
  };

  const value = {
    currentUser,
    setCurrentUser,
    showLoginModal,
    setShowLoginModal,
    showRegisterModal,
    setShowRegisterModal,
    isLoggingIn,
    currentView,
    setCurrentView,
    handleLogin,
    handleLogout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext;

