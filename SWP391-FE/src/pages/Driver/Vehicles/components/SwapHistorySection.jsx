// Vehicle Detail Modal - Swap History Section
import React from 'react';

const SwapHistorySection = () => {
  return (
    <div style={{
      background: 'rgba(255, 255, 255, 0.05)',
      borderRadius: '12px',
      padding: '20px'
    }}>
      <h4 style={{ color: '#19c37d', marginBottom: '15px' }}> Lịch sử đổi pin</h4>
      <div style={{
        textAlign: 'center',
        padding: '20px',
        background: 'rgba(255, 255, 255, 0.05)',
        borderRadius: '8px'
      }}>
        <div style={{ fontSize: '2rem', marginBottom: '10px' }}></div>
        <div style={{ color: '#B0B0B0', fontSize: '0.9rem' }}>
          Tính năng đang phát triển
        </div>
        <div style={{ color: '#666', fontSize: '0.85rem', marginTop: '5px' }}>
          Lịch sử đổi pin sẽ được hiển thị ở đây
        </div>
      </div>
    </div>
  );
};

export default SwapHistorySection;
