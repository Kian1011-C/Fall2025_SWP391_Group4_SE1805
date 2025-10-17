// Loading Fallback Component for Lazy Loading
import React from 'react';

const LoadingFallback = () => {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      background: '#0f172a',
      color: '#fff'
    }}>
      <div style={{
        width: '48px',
        height: '48px',
        border: '4px solid rgba(79, 140, 255, 0.2)',
        borderTop: '4px solid #4F8CFF',
        borderRadius: '50%',
        animation: 'spin 1s linear infinite'
      }}></div>
      <p style={{ marginTop: '20px', fontSize: '16px', color: '#999' }}>
        Đang tải...
      </p>
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default LoadingFallback;


