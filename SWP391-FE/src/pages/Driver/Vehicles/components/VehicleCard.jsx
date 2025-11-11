// Vehicle Card Component
import React from 'react';

const VehicleCard = ({ vehicle, onClick }) => {
  return (
    <div
      onClick={() => onClick(vehicle)}
      style={{
        background: 'rgba(26, 32, 44, 0.8)',
        borderRadius: '20px',
        padding: '25px',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        position: 'relative'
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-5px)';
        e.currentTarget.style.boxShadow = '0 8px 30px rgba(25, 195, 125, 0.3)';
        e.currentTarget.style.borderColor = '#19c37d';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = 'none';
        e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)';
      }}
    >
      <div style={{ fontSize: '3rem', marginBottom: '15px', textAlign: 'center' }}>🚗</div>
      
      <h3 style={{ color: '#FFFFFF', margin: '0 0 15px 0', textAlign: 'center' }}>
        {vehicle.vehicleModel || 'Xe điện'}
      </h3>
      
      <div style={{ 
        display: 'flex', 
        flexDirection: 'column', 
        gap: '12px',
        marginBottom: '20px'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span style={{ color: '#B0B0B0' }}>Biển số:</span>
          <span style={{ color: '#FFFFFF', fontWeight: '600' }}>
            {vehicle.plateNumber || 'N/A'}
          </span>
        </div>
        
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span style={{ color: '#B0B0B0' }}>Quãng đường:</span>
          <span style={{ color: '#19c37d', fontWeight: '600' }}>
            {(vehicle.currentOdometer || 0).toLocaleString()} km
          </span>
        </div>
        
        {vehicle.batteryModel && (
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ color: '#B0B0B0' }}>Loại pin:</span>
            <span style={{ color: '#6ab7ff', fontWeight: '600' }}>
              {vehicle.batteryModel}
            </span>
          </div>
        )}
        
        {vehicle.vinNumber && (
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ color: '#B0B0B0' }}>VIN:</span>
            <span style={{ color: '#9c88ff', fontWeight: '600', fontSize: '0.8rem' }}>
              ...{vehicle.vinNumber.slice(-8)}
            </span>
          </div>
        )}
      </div>
      
      {/* Click to view badge */}
      <div style={{
        position: 'absolute',
        top: '15px',
        right: '15px',
        background: 'rgba(25, 195, 125, 0.2)',
        padding: '5px 12px',
        borderRadius: '20px',
        fontSize: '0.75rem',
        color: '#19c37d',
        fontWeight: '600'
      }}>
        👁️ Xem chi tiết
      </div>
    </div>
  );
};

export default VehicleCard;
