// Auth Context - Quản lý authentication
import React, { createContext, useContext, useState, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { showToast } from '../assets/js/helpers/helpers';
import authService from '../assets/js/services/authService';

const AuthContext = createContext();

// eslint-disable-next-line react-refresh/only-export-components
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

  const handleLogin = useCallback(async (email, password) => {
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
        
        // Use redirect field from API response, fallback to role-based navigation
        const redirectPath = response.redirect || 
                           (normalizedRole === 'admin' ? '/admin/dashboard' :
                            normalizedRole === 'staff' ? '/staff/dashboard' :
                            '/driver/dashboard');
        
        // Force chọn xe sau mỗi lần đăng nhập mới
        try {
          localStorage.removeItem('selectedVehicle');
          sessionStorage.removeItem('selectedVehicle');
        } catch (err) {
          console.warn('Could not clear vehicle selection:', err);
        }
        
        console.log('🚀 AuthContext: Navigating to:', redirectPath, 'for role:', normalizedRole, 'redirect from API:', response.redirect);
        showToast(`Chào mừng ${userData.name}! Đang chuyển đến ${normalizedRole.toUpperCase()} Dashboard...`, 'success');
        
        // Small delay to show the toast before navigating
        setTimeout(() => {
          console.log('🎯 AuthContext: Executing navigation to:', redirectPath);
          navigate(redirectPath);
        }, 500);
        
        return { success: true };
      } else {
        showToast(response.message || 'Đăng nhập thất bại!', 'error');
        return { success: false };
      }
    } catch (error) {
      console.error('Login error:', error);
      showToast('Có lỗi xảy ra khi đăng nhập!', 'error');
      return { success: false };
    } finally {
      setIsLoggingIn(false);
    }
  }, [navigate]);

  const handleLogout = useCallback(async () => {
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
  }, [navigate]);

  const value = useMemo(() => ({
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
  }), [
    currentUser,
    showLoginModal,
    showRegisterModal,
    isLoggingIn,
    currentView,
    handleLogin,
    handleLogout
  ]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext;

