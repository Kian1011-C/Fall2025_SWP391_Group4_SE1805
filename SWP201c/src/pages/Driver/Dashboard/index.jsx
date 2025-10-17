// Driver/Dashboard/index.jsx
// Container for Driver Dashboard - orchestrates all components and hooks

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import DashboardLayout from '../../../layouts/DashboardLayout';
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
      <DashboardLayout role="driver">
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '60vh'
        }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{
              width: '60px',
              height: '60px',
              border: '4px solid rgba(25, 195, 125, 0.2)',
              borderTop: '4px solid #19c37d',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite',
              margin: '0 auto 20px'
            }} />
            <p style={{ color: '#B0B0B0', fontSize: '1.1rem' }}>
              Đang tải dashboard...
            </p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  // Error state
  if (error) {
    return (
      <DashboardLayout role="driver">
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '60vh'
        }}>
          <div style={{
            background: 'rgba(239, 68, 68, 0.1)',
            borderRadius: '12px',
            padding: '30px',
            border: '1px solid rgba(239, 68, 68, 0.3)',
            textAlign: 'center',
            maxWidth: '500px'
          }}>
            <div style={{ fontSize: '3rem', marginBottom: '15px' }}>⚠️</div>
            <h3 style={{ color: '#EF4444', marginBottom: '10px' }}>
              Lỗi tải dữ liệu
            </h3>
            <p style={{ color: '#B0B0B0', marginBottom: '20px' }}>{error}</p>
            <button
              onClick={refetch}
              style={{
                padding: '10px 20px',
                background: 'linear-gradient(135deg, #19c37d, #15a36a)',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontWeight: '600'
              }}
            >
              Thử lại
            </button>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout role="driver">
      <style>
        {`
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
        `}
      </style>

      <div style={{ padding: '20px', minHeight: '100vh' }}>
        {/* TEST BUTTON FOR SETTINGS */}
        <button
          onClick={() => {
            console.log('🧪 TEST: Navigating to /driver/settings');
            navigate('/driver/settings');
          }}
          style={{
            position: 'fixed',
            top: '80px',
            right: '20px',
            padding: '12px 24px',
            background: 'linear-gradient(135deg, #ff6b6b, #ff5252)',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontWeight: 'bold',
            fontSize: '14px',
            zIndex: 9999,
            boxShadow: '0 4px 15px rgba(255, 107, 107, 0.4)'
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
    </DashboardLayout>
  );
};

export default DriverDashboard;
