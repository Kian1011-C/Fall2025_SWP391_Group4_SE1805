import React, { createContext, useContext, useState } from 'react';
import { BatteryProvider } from './BatteryContext';
import { TransactionProvider } from './TransactionContext';
import { IssueProvider } from './IssueContext';
import { ReportProvider } from './ReportContext';
import { NotificationProvider } from './NotificationContext';
import { useAuth } from './AuthContext';
import { useSwap } from './SwapContext';

const AppContext = createContext();

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
};

export const AppProvider = ({ children }) => {
  // Note: AuthContext và SwapContext được wrap bên ngoài AppProvider
  // nên chúng ta không thể sử dụng useAuth() và useSwap() ở đây
  
  const [dashboardTab, setDashboardTab] = useState('home');
  
  // Domain states moved to feature contexts (Battery/Transaction/Issue/Report/Notification)
  // Swap Confirm States
  const [pendingSwapRequests, setPendingSwapRequests] = useState([]);
  const [showSwapConfirmModal, setShowSwapConfirmModal] = useState(false);
  const [selectedSwapConfirm, setSelectedSwapConfirm] = useState(null);
  
  // Reports, issues handled in respective contexts
  
  
  // Vehicle and Plan Selection States
  const [showVehiclePlanSelection, setShowVehiclePlanSelection] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [selectedPlan, setSelectedPlan] = useState(null);
  
  // App-level misc UI data (if needed)

  // Notifications handled in NotificationContext

  // Auth Functions
  const handleLogin = async (email, password) => {
    setIsLoggingIn(true);
    try {
      const response = await authService.login({ email, password });
      
      if (response.success) {
        const userData = response.user;
        setCurrentUser(userData);
        setCurrentView('dashboard');
        setShowLoginModal(false);
        showToast(`Chào mừng ${userData.name}!`, 'success');
        
        // Use redirect field from API response, fallback to role-based navigation
        const redirectPath = response.redirect || 
                           (userData.role === 'admin' ? '/admin/dashboard' :
                            userData.role === 'staff' ? '/staff/dashboard' :
                            '/driver/dashboard');
        navigate(redirectPath);
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
      setDashboardTab('home');
      navigate('/');
      showToast('Đã đăng xuất!', 'success');
    } catch (error) {
      console.error('Logout error:', error);
      showToast('Có lỗi xảy ra khi đăng xuất!', 'error');
    }
  };

  // Battery helpers moved to BatteryContext


  // Transaction helpers moved to TransactionContext

  // Pending Swap Functions
  const getPendingSwapRequestsForStation = (stationId) => {
    return pendingSwapRequests.filter(request => request.stationId === stationId);
  };

  const confirmSwapRequest = (requestId) => {
    const request = pendingSwapRequests.find(r => r.id === requestId);
    if (request) {
      setPendingSwapRequests(prev => prev.filter(r => r.id !== requestId));
      
      const transaction = {
        ...request,
        swapTime: new Date().toISOString(),
        paymentStatus: 'Success',
        duration: '2 phút 30 giây',
        completedBy: currentUser?.email || 'system'
      };
      setTransactions(prev => [transaction, ...prev]);
      
      showToast('Đã xác nhận đổi pin thành công!', 'success');
    }
  };

  const rejectSwapRequest = (requestId) => {
    setPendingSwapRequests(prev => prev.filter(r => r.id !== requestId));
    showToast('Đã từ chối yêu cầu đổi pin!', 'warning');
  };

  // Issue helpers moved to IssueContext

  // Report helpers moved to ReportContext

  // Notification helpers moved to NotificationContext

  const value = {
    // App-specific states only
    dashboardTab,
    setDashboardTab,

    // Pending Swaps (tạm để ở AppContext — thuộc flow chung)
    pendingSwapRequests,
    setPendingSwapRequests,
    showSwapConfirmModal,
    setShowSwapConfirmModal,
    selectedSwapConfirm,
    setSelectedSwapConfirm,
    getPendingSwapRequestsForStation,
    confirmSwapRequest,
    rejectSwapRequest,

    // Vehicle & Plan
    showVehiclePlanSelection,
    setShowVehiclePlanSelection,
    selectedVehicle,
    setSelectedVehicle,
    selectedPlan,
    setSelectedPlan,
  };

  // Compose feature providers around children
  return (
    <AppContext.Provider value={value}>
      <NotificationProvider>
        <ReportProvider>
          <IssueProvider>
            <TransactionProvider>
              <BatteryProvider>
                {children}
              </BatteryProvider>
            </TransactionProvider>
          </IssueProvider>
        </ReportProvider>
      </NotificationProvider>
    </AppContext.Provider>
  );
};

