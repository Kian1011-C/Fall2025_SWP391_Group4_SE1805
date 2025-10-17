// Vehicle Detail Modal - Basic Info Section
import React from 'react';

const BasicInfoSection = ({ vehicle }) => {
  return (
    <div style={{
      background: 'rgba(255, 255, 255, 0.05)',
      borderRadius: '12px',
      padding: '20px',
      marginBottom: '20px'
    }}>
      <h4 style={{ color: '#19c37d', marginBottom: '15px' }}>📋 Thông tin cơ bản</h4>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span style={{ color: '#B0B0B0' }}>Biển số xe:</span>
          <span style={{ color: '#FFFFFF', fontWeight: '600' }}>
            {vehicle.plateNumber || 'N/A'}
          </span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span style={{ color: '#B0B0B0' }}>Model:</span>
          <span style={{ color: '#FFFFFF', fontWeight: '600' }}>
            {vehicle.vehicleModel || 'N/A'}
          </span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span style={{ color: '#B0B0B0' }}>Số VIN:</span>
          <span style={{ color: '#9c88ff', fontWeight: '600', fontSize: '0.9rem' }}>
            {vehicle.vinNumber || 'N/A'}
          </span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span style={{ color: '#B0B0B0' }}>Quãng đường:</span>
          <span style={{ color: '#19c37d', fontWeight: '600' }}>
            {(vehicle.currentOdometer || 0).toLocaleString()} km
          </span>
        </div>
      </div>
    </div>
  );
};

export default BasicInfoSection;
