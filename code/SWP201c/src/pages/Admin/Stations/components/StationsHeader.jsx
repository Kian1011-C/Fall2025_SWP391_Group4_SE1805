// Admin/Stations/components/StationsHeader.jsx
// Header section for stations page

import React from 'react';

export const StationsHeader = ({ onAddStation }) => {
  return (
    <div style={{
      background: 'linear-gradient(135deg, rgba(106, 183, 255, 0.1), rgba(106, 183, 255, 0.05))',
      borderRadius: '20px',
      padding: '30px',
      marginBottom: '30px',
      border: '1px solid rgba(106, 183, 255, 0.2)',
      backdropFilter: 'blur(20px)'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ 
            margin: 0, 
            color: '#FFFFFF', 
            fontSize: '2.2rem', 
            fontWeight: '700',
            display: 'flex',
            alignItems: 'center',
            gap: '15px'
          }}>
            🏢 Quản lý trạm
          </h1>
          <p style={{ 
            margin: '10px 0 0 0', 
            color: '#B0B0B0', 
            fontSize: '1rem'
          }}>
            Quản lý tất cả các trạm đổi pin trong hệ thống
          </p>
        </div>
        
        <button
          onClick={onAddStation}
          style={{
            padding: '12px 24px',
            background: 'linear-gradient(135deg, #10B981, #059669)',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontWeight: '600',
            fontSize: '14px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            transition: 'transform 0.2s ease'
          }}
          onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
          onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
        >
          <span style={{ fontSize: '1.2rem' }}>+</span>
          Thêm trạm mới
        </button>
      </div>
    </div>
  );
};
