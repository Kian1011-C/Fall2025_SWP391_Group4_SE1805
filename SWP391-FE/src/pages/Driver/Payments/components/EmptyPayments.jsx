// src/pages/Driver/Payments/components/EmptyPayments.jsx
import React from 'react';

// Style cho trạng thái rỗng
const emptyStyle = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '40px 20px',
  color: '#9ca3af', // text-gray-400
  textAlign: 'center',
  border: '2px dashed rgba(255, 255, 255, 0.1)',
  borderRadius: '12px',
};

const iconStyle = {
  fontSize: '3rem',
  marginBottom: '15px',
  opacity: '0.5',
};

const EmptyPayments = () => {
  return (
    <div style={emptyStyle}>
      <div style={iconStyle}></div>
      <h4 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 600, color: '#e5e7eb' }}>
        Chưa có giao dịch
      </h4>
      <p style={{ margin: '5px 0 0 0', fontSize: '0.9rem' }}>
        Tất cả các thanh toán của bạn sẽ xuất hiện ở đây.
      </p>
    </div>
  );
};

export default EmptyPayments;