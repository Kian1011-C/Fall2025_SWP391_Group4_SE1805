// Empty Vehicles State Component
import React from 'react';

const EmptyVehicles = ({ onAddVehicle }) => {
  return (
    <div style={{
      background: 'rgba(26, 32, 44, 0.8)',
      borderRadius: '20px',
      padding: '60px 20px',
      textAlign: 'center',
      border: '1px solid rgba(255, 255, 255, 0.1)'
    }}>
      <div style={{ fontSize: '5rem', marginBottom: '20px' }}>🚙</div>
      <h3 style={{ color: '#FFFFFF', marginBottom: '10px' }}>Chưa có phương tiện nào</h3>
      <p style={{ color: '#B0B0B0', marginBottom: '25px' }}>
        Thêm phương tiện để bắt đầu sử dụng dịch vụ đổi pin
      </p>
      <button
        onClick={onAddVehicle}
        style={{
          padding: '14px 28px',
          background: 'linear-gradient(135deg, #19c37d, #15a36a)',
          color: 'white',
          border: 'none',
          borderRadius: '10px',
          cursor: 'pointer',
          fontSize: '1.1rem',
          fontWeight: '600',
          boxShadow: '0 4px 15px rgba(25, 195, 125, 0.3)',
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px'
        }}
      >
        ➕ Thêm phương tiện đầu tiên
      </button>
    </div>
  );
};

export default EmptyVehicles;
