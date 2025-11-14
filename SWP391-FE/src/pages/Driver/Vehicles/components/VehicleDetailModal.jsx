// Vehicle Detail Modal Component
import React from 'react';
import { useNavigate } from 'react-router-dom';
import BasicInfoSection from './BasicInfoSection';
import BatteryInfoSection from './BatteryInfoSection';
import ContractSection from './ContractSection';
import SwapHistorySection from './SwapHistorySection';

const VehicleDetailModal = ({ 
  show, 
  vehicle, 
  vehicleContract, 
  onClose 
}) => {
  const navigate = useNavigate();

  if (!show || !vehicle) return null;

  return (
    <div 
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'rgba(0, 0, 0, 0.8)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
        padding: '20px'
      }}
      onClick={onClose}
    >
      <div 
        style={{
          background: '#1a202c',
          borderRadius: '20px',
          padding: '30px',
          maxWidth: '700px',
          width: '100%',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          maxHeight: '90vh',
          overflowY: 'auto'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          marginBottom: '25px',
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
          paddingBottom: '15px'
        }}>
          <h2 style={{ color: '#FFFFFF', margin: 0, display: 'flex', alignItems: 'center', gap: '10px' }}>
             Chi tiết phương tiện
          </h2>
          <button
            onClick={onClose}
            style={{
              background: 'transparent',
              border: 'none',
              color: '#B0B0B0',
              fontSize: '1.5rem',
              cursor: 'pointer',
              padding: '5px 10px'
            }}
          >
            
          </button>
        </div>

        {/* Vehicle Icon & Name */}
        <div style={{ fontSize: '4rem', textAlign: 'center', marginBottom: '20px' }}></div>
        
        <h3 style={{ 
          color: '#FFFFFF', 
          textAlign: 'center', 
          marginBottom: '25px',
          fontSize: '1.5rem'
        }}>
          {vehicle.vehicleModel || 'Xe điện'}
        </h3>

        {/* Information Sections */}
        <BasicInfoSection vehicle={vehicle} />
        <BatteryInfoSection vehicle={vehicle} />
        
        <div style={{
          background: 'rgba(255, 255, 255, 0.05)',
          borderRadius: '12px',
          padding: '20px',
          marginBottom: '20px'
        }}>
          <h4 style={{ color: '#19c37d', marginBottom: '15px' }}> Gói dịch vụ</h4>
          <ContractSection vehicleContract={vehicleContract} onClose={onClose} />
        </div>
        
        <SwapHistorySection />

        {/* Action Buttons */}
        <div style={{
          display: 'flex',
          gap: '10px',
          marginTop: '25px'
        }}>
          <button
            onClick={onClose}
            style={{
              flex: 1,
              padding: '14px',
              background: 'rgba(255, 255, 255, 0.1)',
              color: '#FFFFFF',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              borderRadius: '10px',
              cursor: 'pointer',
              fontSize: '1rem',
              fontWeight: '600'
            }}
          >
            Đóng
          </button>
          <button
            onClick={() => {
              sessionStorage.setItem('selectedVehicle', JSON.stringify(vehicle));
              onClose();
              navigate('/driver/swap-battery', { 
                state: { selectedVehicle: vehicle } 
              });
            }}
            style={{
              flex: 1,
              padding: '14px',
              background: 'linear-gradient(135deg, #19c37d, #15a36a)',
              color: 'white',
              border: 'none',
              borderRadius: '10px',
              cursor: 'pointer',
              fontSize: '1rem',
              fontWeight: '600',
              boxShadow: '0 4px 15px rgba(25, 195, 125, 0.3)'
            }}
          >
             Đổi pin ngay
          </button>
        </div>
      </div>
    </div>
  );
};

export default VehicleDetailModal;
