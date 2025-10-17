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
  DebugInfo,
  SelectVehicleModal
} from './components';

const DriverDashboard = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  
  // Custom hooks for data and vehicle selection
  // Read selected vehicle from session to avoid circular dependency
  let sessionSelectedVehicle = null;
  try { sessionSelectedVehicle = JSON.parse(sessionStorage.getItem('selectedVehicle')); } catch {}

  const {
    vehicles,
    contracts,
    recentPayments,
    stats,
    loading,
    error,
    refetch
  } = useDashboardData(sessionSelectedVehicle);
  
  const { selectedVehicle, setSelectedVehicle } = useSelectedVehicle(vehicles);

  // Show selection modal on first visit if no selected vehicle

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

  const displayedVehicles = selectedVehicle ? [selectedVehicle] : vehicles;

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
        {/* Selected vehicle banner + change button */}
        {selectedVehicle && (
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            background: 'rgba(30,41,59,0.6)',
            border: '1px solid rgba(148,163,184,0.24)',
            borderRadius: 12,
            padding: '12px 16px',
            marginBottom: 16
          }}>
            <div>
              <div style={{ fontWeight: 700, color: '#FFFFFF' }}>
                Xe đang sử dụng: {selectedVehicle.plateNumber || selectedVehicle.license_plate || selectedVehicle.licensePlate || 'N/A'}
              </div>
              <div style={{ fontSize: 13, color: '#B0B0B0' }}>
                Loại: {selectedVehicle.model || selectedVehicle.vehicleModel || 'N/A'} — Pin: {selectedVehicle.health ?? selectedVehicle.batteryLevel ?? selectedVehicle.battery_level ?? 'N/A'}%
              </div>
            </div>
            <button
              onClick={() => {
                try { sessionStorage.removeItem('selectedVehicle'); } catch {}
                setSelectedVehicle(null);
              }}
              style={{
                padding: '8px 12px',
                background: 'linear-gradient(135deg, #6ab7ff, #4a90e2)',
                color: '#fff',
                border: 'none',
                borderRadius: 8,
                cursor: 'pointer',
                fontWeight: 600
              }}
            >
              Đổi xe
            </button>
          </div>
        )}
        {!selectedVehicle && vehicles?.length > 0 && (
          <SelectVehicleModal
            vehicles={vehicles}
            onSelect={(v) => {
              try { sessionStorage.setItem('selectedVehicle', JSON.stringify(v)); } catch {}
              setSelectedVehicle(v);
            }}
          />
        )}
        {/* TEST Settings button removed */}
        
        {/* Debug Info */}
        <DebugInfo 
          currentUser={currentUser}
          vehicles={vehicles}
          contracts={contracts}
          error={error}
          onRefresh={refetch}
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
          vehicles={displayedVehicles}
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
