// Driver/Payments/components/PaymentTabs.jsx
import React from 'react';

const PaymentTabs = ({ activeTab, onTabChange }) => {
  const tabStyle = (isActive) => ({
    padding: '12px 24px',
    background: isActive 
      ? 'linear-gradient(135deg, #19c37d, #15a36a)' 
      : 'transparent',
    color: '#FFFFFF',
    border: isActive ? 'none' : '1px solid rgba(25, 195, 125, 0.3)',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '1rem',
    fontWeight: '600',
    transition: 'all 0.3s ease',
    boxShadow: isActive 
      ? '0 4px 15px rgba(25, 195, 125, 0.3)' 
      : 'none'
  });

  return (
    <div style={{ 
      display: 'flex', 
      gap: '10px',
      marginBottom: '30px',
      borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
      paddingBottom: '10px'
    }}>
      <button
        onClick={() => onTabChange('history')}
        style={tabStyle(activeTab === 'history')}
      >
        📜 Lịch sử
      </button>
      <button
        onClick={() => onTabChange('payment')}
        style={tabStyle(activeTab === 'payment')}
      >
        💰 Thanh toán
      </button>
    </div>
  );
};

export default PaymentTabs;
