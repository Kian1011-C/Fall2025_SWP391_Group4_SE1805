// Empty Payments State Component
import React from 'react';

const EmptyPayments = () => {
  return (
    <div style={{
      padding: '60px 20px',
      textAlign: 'center',
      background: 'rgba(255, 255, 255, 0.02)',
      borderRadius: '12px',
      border: '1px dashed rgba(255, 255, 255, 0.1)'
    }}>
      <div style={{ fontSize: '4rem', marginBottom: '15px' }}>📭</div>
      <h3 style={{ color: '#FFFFFF', marginBottom: '10px' }}>
        Chưa có giao dịch
      </h3>
      <p style={{ color: '#B0B0B0', margin: 0 }}>
        Lịch sử thanh toán của bạn sẽ hiển thị ở đây
      </p>
    </div>
  );
};

export default EmptyPayments;
