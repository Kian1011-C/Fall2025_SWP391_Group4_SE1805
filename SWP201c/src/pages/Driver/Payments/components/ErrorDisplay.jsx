// Error Display Component
import React from 'react';

const ErrorDisplay = ({ error }) => {
  return (
    <div style={{
      padding: '20px',
      background: 'rgba(255, 107, 107, 0.1)',
      borderRadius: '12px',
      border: '1px solid rgba(255, 107, 107, 0.3)',
      textAlign: 'center'
    }}>
      <div style={{ fontSize: '2rem', marginBottom: '10px' }}>❌</div>
      <p style={{ color: '#ff6b6b', margin: 0 }}>Lỗi: {error}</p>
    </div>
  );
};

export default ErrorDisplay;
