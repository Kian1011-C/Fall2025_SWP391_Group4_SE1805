// Swap Processing Component - Step 6
import React from 'react';

const SwapProcessing = ({ onShowQR }) => {
  return (
    <div className="processing-container">
      <div className="loading-spinner"></div>
      <div className="processing-text">🔄 Đang thực hiện đổi pin...</div>
      <div className="processing-subtext">
        Vui lòng đợi trong giây lát. Hệ thống đang xử lý yêu cầu của bạn.
      </div>

      {/* Nút hiển thị QR Code */}
      <div style={{ marginTop: '32px', textAlign: 'center' }}>
        <button
          onClick={onShowQR}
          style={{
            padding: '14px 32px',
            background: 'linear-gradient(135deg, #4caf50 0%, #45a049 100%)',
            color: '#fff',
            border: 'none',
            borderRadius: '12px',
            fontSize: '15px',
            fontWeight: '600',
            cursor: 'pointer',
            boxShadow: '0 4px 12px rgba(76, 175, 80, 0.3)',
            transition: 'all 0.3s ease',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            margin: '0 auto'
          }}
          onMouseOver={(e) => {
            e.target.style.transform = 'translateY(-2px)';
            e.target.style.boxShadow = '0 6px 16px rgba(76, 175, 80, 0.4)';
          }}
          onMouseOut={(e) => {
            e.target.style.transform = 'translateY(0)';
            e.target.style.boxShadow = '0 4px 12px rgba(76, 175, 80, 0.3)';
          }}
        >
          <span style={{ fontSize: '20px' }}>📱</span>
          <span>Hiển thị mã QR cho nhân viên</span>
        </button>
        <p style={{ marginTop: '12px', fontSize: '13px', color: '#666' }}>
          Nhân viên quét mã để xác nhận đổi pin
        </p>
      </div>

      <div
        style={{
          marginTop: '32px',
          display: 'flex',
          flexDirection: 'column',
          gap: '12px',
          width: '100%',
          maxWidth: '400px'
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            padding: '12px',
            background: '#f8f9fa',
            borderRadius: '8px'
          }}
        >
          <span style={{ fontSize: '20px' }}>✓</span>
          <span style={{ fontSize: '14px', color: '#666' }}>Xác thực thông tin xe</span>
        </div>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            padding: '12px',
            background: '#f8f9fa',
            borderRadius: '8px'
          }}
        >
          <span style={{ fontSize: '20px' }}>✓</span>
          <span style={{ fontSize: '14px', color: '#666' }}>Kết nối với trạm sạc</span>
        </div>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            padding: '12px',
            background: '#fff3e0',
            borderRadius: '8px'
          }}
        >
          <div
            className="loading-spinner"
            style={{ width: '20px', height: '20px', borderWidth: '3px' }}
          ></div>
          <span style={{ fontSize: '14px', color: '#f57c00', fontWeight: '600' }}>
            Đang thực hiện đổi pin...
          </span>
        </div>
      </div>
    </div>
  );
};

export default SwapProcessing;
