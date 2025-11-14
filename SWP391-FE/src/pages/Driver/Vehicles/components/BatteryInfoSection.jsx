// Vehicle Detail Modal - Battery Info Section
import React from 'react';

const BatteryInfoSection = ({ vehicle }) => {
  return (
    <div style={{
      background: 'rgba(255, 255, 255, 0.05)',
      borderRadius: '12px',
      padding: '20px',
      marginBottom: '20px'
    }}>
      <h4 style={{ color: '#19c37d', marginBottom: '15px' }}> Thông tin pin</h4>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span style={{ color: '#B0B0B0' }}>Loại pin:</span>
          <span style={{ color: '#6ab7ff', fontWeight: '600' }}>
            {vehicle.batteryModel || vehicle.batteryType || 'N/A'}
          </span>
        </div>
        {vehicle.batteryId && (
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ color: '#B0B0B0' }}>ID Pin:</span>
            <span style={{ color: '#9c88ff', fontWeight: '600' }}>
              {vehicle.batteryId}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default BatteryInfoSection;
