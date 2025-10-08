import React, { createContext, useContext, useState } from 'react';
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
  
  // Battery Management States
  const [batteries, setBatteries] = useState([]);
  const [batteryHistory, setBatteryHistory] = useState([]);
  const [batteryFilter, setBatteryFilter] = useState('all');
  const [showBatteryModal, setShowBatteryModal] = useState(false);
  const [selectedBattery, setSelectedBattery] = useState(null);
  
  
  // Transaction Management States
  const [transactions, setTransactions] = useState([]);
  const [transactionFilter, setTransactionFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');
  const [showTransactionModal, setShowTransactionModal] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  
  // Swap Confirm States
  const [pendingSwapRequests, setPendingSwapRequests] = useState([]);
  const [showSwapConfirmModal, setShowSwapConfirmModal] = useState(false);
  const [selectedSwapConfirm, setSelectedSwapConfirm] = useState(null);
  
  // Issues Management States
  const [issues, setIssues] = useState([]);
  const [issueFilter, setIssueFilter] = useState('all');
  const [showIssueModal, setShowIssueModal] = useState(false);
  const [selectedIssue, setSelectedIssue] = useState(null);
  
  // Reports States
  const [reports, setReports] = useState([]);
  const [dateRange, setDateRange] = useState('week');
  const [chartData, setChartData] = useState({});
  
  
  // Vehicle and Plan Selection States
  const [showVehiclePlanSelection, setShowVehiclePlanSelection] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [selectedPlan, setSelectedPlan] = useState(null);
  
  const [batteryData, setBatteryData] = useState({
    current: 25,
    health: 92,
    temperature: 28,
    voltage: 48.2,
    cycles: 156
  });

  // Notifications
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: 'info',
      title: 'Trạm mới',
      message: 'Trạm sạc Station 15 đã mở tại Quận 7',
      time: '2 phút trước',
      unread: true
    },
    {
      id: 2,
      type: 'warning',
      title: 'Pin sắp hết',
      message: 'Pin hiện tại còn 15%. Tìm trạm đổi pin gần nhất?',
      time: '5 phút trước',
      unread: true
    },
    {
      id: 3,
      type: 'success',
      title: 'Đổi pin thành công',
      message: 'Bạn đã đổi pin thành công tại Station 8',
      time: '1 giờ trước',
      unread: false
    }
  ]);

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
        
        // Navigate to dashboard based on role
        const dashboardPath = userData.role === 'admin' ? '/admin/dashboard' :
                             userData.role === 'staff' ? '/staff/dashboard' :
                             '/driver/dashboard';
        navigate(dashboardPath);
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

  // Battery Functions
  const updateBatteryStatus = (batteryId, newStatus, reason = '') => {
    setBatteries(prev => 
      prev.map(battery => 
        battery.id === batteryId 
          ? { ...battery, status: newStatus }
          : battery
      )
    );

    const battery = batteries.find(b => b.id === batteryId);
    if (battery) {
      const historyEntry = {
        id: batteryHistory.length + 1,
        batteryId,
        oldStatus: battery.status,
        newStatus,
        timestamp: new Date().toISOString(),
        changedBy: currentUser?.email || 'system',
        reason
      };
      setBatteryHistory(prev => [historyEntry, ...prev]);
    }

    showToast(`Đã cập nhật trạng thái pin ${batteryId}`, 'success');
  };

  const getBatteriesForStation = (stationId) => {
    return batteries.filter(battery => battery.stationId === stationId);
  };

  const getFilteredBatteries = () => {
    if (batteryFilter === 'all') return batteries;
    return batteries.filter(battery => battery.status === batteryFilter);
  };


  // Transaction Functions
  const getTransactionsForStation = (stationId) => {
    return transactions.filter(transaction => transaction.stationId === stationId);
  };

  const getFilteredTransactions = () => {
    let filtered = transactions;
    
    if (transactionFilter !== 'all') {
      filtered = filtered.filter(t => t.paymentStatus === transactionFilter);
    }
    
    if (dateFilter !== 'all') {
      const now = new Date();
      filtered = filtered.filter(t => {
        const transactionDate = new Date(t.swapTime);
        const daysDiff = Math.floor((now - transactionDate) / (1000 * 60 * 60 * 24));
        
        switch(dateFilter) {
          case 'today': return daysDiff === 0;
          case 'week': return daysDiff <= 7;
          case 'month': return daysDiff <= 30;
          default: return true;
        }
      });
    }
    
    return filtered;
  };

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

  // Issue Functions
  const getIssuesForStation = (stationId) => {
    return issues.filter(issue => issue.stationId === stationId);
  };

  const getFilteredIssues = () => {
    if (issueFilter === 'all') return issues;
    return issues.filter(issue => issue.status === issueFilter);
  };

  const updateIssueStatus = (issueId, newStatus, solutionNotes = '') => {
    setIssues(prev =>
      prev.map(issue =>
        issue.id === issueId
          ? { 
              ...issue, 
              status: newStatus, 
              solutionNotes,
              updatedAt: new Date().toISOString(),
              assignedTo: currentUser?.email || 'system'
            }
          : issue
      )
    );
    showToast(`Đã cập nhật trạng thái sự cố ${issueId}`, 'success');
  };

  // Report Functions
  const getFilteredReports = () => {
    if (!reports.dailyStats) return [];
    
    const now = new Date();
    return reports.dailyStats.filter(stat => {
      const statDate = new Date(stat.date);
      const daysDiff = Math.floor((now - statDate) / (1000 * 60 * 60 * 24));
      
      switch(dateRange) {
        case 'day': return daysDiff === 0;
        case 'week': return daysDiff <= 7;
        case 'month': return daysDiff <= 30;
        default: return true;
      }
    });
  };

  const getChartData = () => {
    const filtered = getFilteredReports();
    return {
      labels: filtered.map(stat => stat.date),
      datasets: [
        {
          label: 'Số lượt đổi pin',
          data: filtered.map(stat => stat.swaps),
          borderColor: '#4F8CFF',
          backgroundColor: 'rgba(79, 140, 255, 0.1)'
        },
        {
          label: 'Doanh thu (VNĐ)',
          data: filtered.map(stat => stat.revenue),
          borderColor: '#19c37d',
          backgroundColor: 'rgba(25, 195, 125, 0.1)'
        }
      ]
    };
  };

  // Notification Functions
  const markNotificationAsRead = (id) => {
    setNotifications(prev =>
      prev.map(notif => 
        notif.id === id ? { ...notif, unread: false } : notif
      )
    );
  };

  const value = {
    // App-specific states only
    dashboardTab,
    setDashboardTab,
    
    // Battery
    batteries,
    setBatteries,
    batteryHistory,
    setBatteryHistory,
    batteryFilter,
    setBatteryFilter,
    showBatteryModal,
    setShowBatteryModal,
    selectedBattery,
    setSelectedBattery,
    updateBatteryStatus,
    getBatteriesForStation,
    getFilteredBatteries,
    batteryData,
    setBatteryData,
    
    
    // Transactions
    transactions,
    setTransactions,
    transactionFilter,
    setTransactionFilter,
    dateFilter,
    setDateFilter,
    showTransactionModal,
    setShowTransactionModal,
    selectedTransaction,
    setSelectedTransaction,
    getTransactionsForStation,
    getFilteredTransactions,
    
    // Pending Swaps
    pendingSwapRequests,
    setPendingSwapRequests,
    showSwapConfirmModal,
    setShowSwapConfirmModal,
    selectedSwapConfirm,
    setSelectedSwapConfirm,
    getPendingSwapRequestsForStation,
    confirmSwapRequest,
    rejectSwapRequest,
    
    // Issues
    issues,
    setIssues,
    issueFilter,
    setIssueFilter,
    showIssueModal,
    setShowIssueModal,
    selectedIssue,
    setSelectedIssue,
    getIssuesForStation,
    getFilteredIssues,
    updateIssueStatus,
    
    // Reports
    reports,
    setReports,
    dateRange,
    setDateRange,
    chartData,
    setChartData,
    getFilteredReports,
    getChartData,
    
    
    // Vehicle & Plan
    showVehiclePlanSelection,
    setShowVehiclePlanSelection,
    selectedVehicle,
    setSelectedVehicle,
    selectedPlan,
    setSelectedPlan,
    
    // Notifications
    notifications,
    setNotifications,
    markNotificationAsRead
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

