// Driver/Dashboard/index.jsx
// Container for Driver Dashboard - orchestrates all components and hooks

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import { useDashboardData, useSelectedVehicle } from './hooks';
import { formatCurrency } from './utils';
import SelectVehicleModal from './components/SelectVehicleModal';
import SelectedVehicleDisplay from './components/SelectedVehicleDisplay';
import {
  WelcomeHeader,
  StatsCards,
  QuickActions,
  VehicleManagement,
  PaymentHistory
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
  const [showSelectModal, setShowSelectModal] = React.useState(false);

  // Reload vehicle data sau khi swap xong
  React.useEffect(() => {
    const needsReload = sessionStorage.getItem('vehicleNeedsReload');
    if (needsReload === 'true') {
      console.log('🔄 Phát hiện flag vehicleNeedsReload, đang reload xe từ API...');
      
      // Clear flag ngay để tránh reload lặp lại
      sessionStorage.removeItem('vehicleNeedsReload');
      
      // Refetch toàn bộ data (bao gồm vehicles)
      refetch();
      
      // Cập nhật selectedVehicle từ sessionStorage (đã được cập nhật trong useSwapData)
      try {
        const updatedVehicleStr = sessionStorage.getItem('selectedVehicle');
        if (updatedVehicleStr) {
          const updatedVehicle = JSON.parse(updatedVehicleStr);
          setSelectedVehicle(updatedVehicle);
          localStorage.setItem('selectedVehicle', updatedVehicleStr);
          console.log('✅ Đã cập nhật selectedVehicle sau swap:', updatedVehicle);
        }
      } catch (err) {
        console.error('❌ Lỗi khi parse updatedVehicle:', err);
      }
    }
  }, [refetch, setSelectedVehicle]);

  // Open modal automatically when no vehicle selected
  React.useEffect(() => {
    if (!selectedVehicle) {
      // mở modal khi chưa có xe được chọn (ưu tiên từ localStorage)
      let persisted = null;
      try { persisted = JSON.parse(localStorage.getItem('selectedVehicle')); } catch {}
      if (persisted) {
        setSelectedVehicle(persisted);
        setShowSelectModal(false);
      } else {
        setShowSelectModal(true);
      }
    } else {
      setShowSelectModal(false);
    }
  }, [selectedVehicle, setSelectedVehicle]);

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
      {/* Selected vehicle summary */}
      <SelectedVehicleDisplay selectedVehicle={selectedVehicle} contracts={contracts} />
      <div style={{ marginBottom: 12 }}>
        <button className="btn" onClick={() => setShowSelectModal(true)}>Chọn xe khác</button>
      </div>
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
    {showSelectModal && (
      <SelectVehicleModal
        vehicles={vehicles}
        onSelect={(v) => {
          try { 
            sessionStorage.setItem('selectedVehicle', JSON.stringify(v));
            localStorage.setItem('selectedVehicle', JSON.stringify(v));
          } catch {}
          setSelectedVehicle(v);
          setShowSelectModal(false);
        }}
      />
    )}
    </div>
  );
};

export default DriverDashboard;
