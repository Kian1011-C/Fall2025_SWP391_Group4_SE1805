// Driver/Dashboard/index.jsx
// Container for Driver Dashboard - orchestrates all components and hooks

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import { useDashboardData, useSelectedVehicle } from './hooks';
import { formatCurrency } from './utils';
import {
  WelcomeHeader,
  StatsCards,
  QuickActions,
  VehicleManagement,
  PaymentHistory,
  DebugInfo
} from './components';

const DriverDashboard = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  
  // Custom hooks for data and vehicle selection
  const {
    vehicles,
    contracts,
    recentPayments,
    stats,
    loading,
    error,
    refetch
  } = useDashboardData();
  
  const { selectedVehicle, setSelectedVehicle } = useSelectedVehicle(vehicles);

  // Loading state
  if (loading) {
    return (
      <div className="dashboard-loading">
        <div className="loading-spinner"></div>
        <p className="loading-text">Đang tải dashboard...</p>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="dashboard-error">
        <div className="error-content">
          <div className="error-icon">⚠️</div>
          <h3 className="error-title">Lỗi tải dữ liệu</h3>
          <p className="error-message">{error}</p>
          <button className="retry-btn" onClick={refetch}>
            Thử lại
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="driver-dashboard">
      {/* TEST BUTTON FOR SETTINGS */}
      <button
        className="test-settings-btn"
        onClick={() => {
          console.log('🧪 TEST: Navigating to /driver/settings');
          navigate('/driver/settings');
        }}
      >
        🧪 TEST Settings
      </button>
      
      {/* Debug Info */}
      <DebugInfo 
        currentUser={currentUser}
        vehicles={vehicles}
        contracts={contracts}
        error={error}
      />
      
      {/* Welcome Header */}
      <WelcomeHeader 
        currentUser={currentUser} 
        activeVehicles={stats.activeVehicles} 
      />
      
      {/* Stats Cards */}
      <StatsCards 
        stats={stats} 
        formatCurrency={formatCurrency} 
      />
      
      {/* Quick Actions */}
      <QuickActions 
        selectedVehicle={selectedVehicle} 
      />
      
      {/* Vehicle Management */}
      <VehicleManagement
        vehicles={vehicles}
        contracts={contracts}
        selectedVehicle={selectedVehicle}
        onSelectVehicle={setSelectedVehicle}
      />
      
      {/* Payment History */}
      <PaymentHistory 
        payments={recentPayments} 
      />
    </div>
  );
};

export default DriverDashboard;
