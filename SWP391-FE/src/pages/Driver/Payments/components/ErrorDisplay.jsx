// src/pages/Driver/Payments/components/ErrorDisplay.jsx
import React from 'react';

// Style cho trạng thái lỗi
const errorStyle = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '40px 20px',
  color: '#fca5a5', // text-red-300
  textAlign: 'center',
  border: '2px dashed #ef4444', // border-red-500
  borderRadius: '12px',
  background: 'rgba(239, 68, 68, 0.1)',
};

const iconStyle = {
  fontSize: '3rem',
  marginBottom: '15px',
};

const ErrorDisplay = ({ error }) => {
  return (
    <div style={errorStyle}>
      <div style={iconStyle}></div>
      <h4 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 600, color: '#f87171' }}>
        Đã xảy ra lỗi
      </h4>
      <p style={{ margin: '5px 0 0 0', fontSize: '0.9rem' }}>
        {/* Hiển thị lỗi (nếu error là string) hoặc thông báo chung */}
        {typeof error === 'string' ? error : 'Không thể tải dữ liệu. Vui lòng thử lại.'}
      </p>
    </div>
  );
};

export default ErrorDisplay;