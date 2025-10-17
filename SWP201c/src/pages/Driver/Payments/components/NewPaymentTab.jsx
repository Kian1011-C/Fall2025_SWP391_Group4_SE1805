// Driver/Payments/components/NewPaymentTab.jsx
import React from 'react';
import NewPaymentSection from './NewPaymentSection';

const NewPaymentTab = ({ onProcessPayment }) => {
  return (
    <div style={{ 
      background: 'rgba(26, 32, 44, 0.6)',
      backdropFilter: 'blur(10px)',
      padding: '25px',
      borderRadius: '16px',
      border: '1px solid rgba(255, 255, 255, 0.1)'
    }}>
      <h3 style={{ 
        color: '#FFFFFF', 
        marginBottom: '20px',
        display: 'flex',
        alignItems: 'center',
        gap: '10px'
      }}>
        💰 Thanh toán mới
      </h3>

      <NewPaymentSection onProcessPayment={onProcessPayment} />
    </div>
  );
};

export default NewPaymentTab;
