// Staff Assistance Button Component
import React from 'react';

const StaffAssistanceButton = ({ selectedStation, onRequestAssistance, position = 'bottom' }) => {
  if (!selectedStation) return null;

  return (
    <div
      style={{
        marginTop: position === 'bottom' ? '24px' : '0',
        marginBottom: position === 'top' ? '24px' : '0',
        padding: '16px',
        background: 'linear-gradient(135deg, #fff3e0 0%, #ffcc80 20%, #fff3e0 100%)',
        borderRadius: '12px',
        border: '1px solid #ff9800',
        textAlign: 'center'
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '12px',
          marginBottom: '8px'
        }}
      >
        <span style={{ fontSize: '24px' }}></span>
        <span
          style={{
            fontSize: '14px',
            fontWeight: '600',
            color: '#e65100'
          }}
        >
          Cần hỗ trợ từ nhân viên?
        </span>
      </div>
      <button
        onClick={onRequestAssistance}
        style={{
          padding: '10px 20px',
          background: 'linear-gradient(135deg, #ff9800 0%, #f57c00 100%)',
          color: '#fff',
          border: 'none',
          borderRadius: '8px',
          fontSize: '13px',
          fontWeight: '600',
          cursor: 'pointer',
          boxShadow: '0 2px 8px rgba(255, 152, 0, 0.3)',
          transition: 'all 0.3s ease',
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          margin: '0 auto'
        }}
        onMouseOver={(e) => {
          e.target.style.transform = 'translateY(-1px)';
          e.target.style.boxShadow = '0 4px 12px rgba(255, 152, 0, 0.4)';
        }}
        onMouseOut={(e) => {
          e.target.style.transform = 'translateY(0)';
          e.target.style.boxShadow = '0 2px 8px rgba(255, 152, 0, 0.3)';
        }}
      >
        <span style={{ fontSize: '16px' }}>‍</span>
        <span>Yêu cầu hỗ trợ</span>
      </button>
    </div>
  );
};

export default StaffAssistanceButton;
