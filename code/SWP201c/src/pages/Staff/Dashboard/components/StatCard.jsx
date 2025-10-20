// Staff/Dashboard/components/StatCard.jsx
import React from 'react';

const StatCard = ({ label, value, color, loading }) => {
  return (
    <div style={{
      background: 'rgba(26, 32, 44, 0.8)',
      borderRadius: '12px',
      padding: '20px',
      boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
      textAlign: 'center',
      border: '1px solid rgba(255, 255, 255, 0.1)',
      backdropFilter: 'blur(10px)'
    }}>
      <div style={{ fontSize: '24px', fontWeight: 'bold', color }}>
        {loading ? '...' : value}
      </div>
      <div style={{ fontSize: '14px', color: '#E0E0E0', marginTop: '5px' }}>
        {label}
      </div>
    </div>
  );
};

export default StatCard;
