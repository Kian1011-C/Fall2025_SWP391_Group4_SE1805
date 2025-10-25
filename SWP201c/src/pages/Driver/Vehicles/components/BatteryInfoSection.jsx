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
      <h4 style={{ color: '#19c37d', marginBottom: '15px' }}>🔋 Thông tin pin</h4>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span style={{ color: '#B0B0B0' }}>Sức khỏe pin:</span>
          <span style={{ 
            color: vehicle.health > 70 ? '#19c37d' : 
                   vehicle.health > 30 ? '#ffa500' : '#ff6b6b',
            fontWeight: '600',
            fontSize: '1.2rem'
          }}>
            {(vehicle.health || 0).toFixed(1)}%
          </span>
        </div>
        <div style={{
          width: '100%',
          height: '10px',
          background: 'rgba(255, 255, 255, 0.1)',
          borderRadius: '5px',
          overflow: 'hidden'
        }}>
          <div style={{
            width: `${vehicle.health || 0}%`,
            height: '100%',
            background: vehicle.health > 70 ? '#19c37d' : 
                       vehicle.health > 30 ? '#ffa500' : '#ff6b6b',
            transition: 'width 0.3s ease'
          }} />
        </div>
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
