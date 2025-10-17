// Admin/Subscriptions/components/SubscriptionsHeader.jsx
// Header section for subscriptions page

import React from 'react';

export const SubscriptionsHeader = ({ onAddClick }) => {
  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'space-between', 
      alignItems: 'center', 
      marginBottom: '30px' 
    }}>
      <div>
        <h1 style={{ color: '#FFFFFF', margin: '0 0 10px 0' }}>
          💎 Quản lý gói dịch vụ
        </h1>
        <p style={{ color: '#B0B0B0', margin: 0 }}>
          Quản lý gói subscription và giá cả
        </p>
      </div>
      <button
        onClick={onAddClick}
        style={{
          padding: '12px 24px',
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
        + Thêm gói mới
      </button>
    </div>
  );
};
