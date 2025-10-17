// QR Code Modal Component
import React from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { createSwapQRData } from '../utils/swapHelpers';

const QRCodeModal = ({
  show,
  currentStep,
  currentUser,
  selectedVehicle,
  selectedStation,
  selectedTower,
  userContract,
  currentBatteryLevel,
  swapResult,
  onClose
}) => {
  if (!show) return null;

  const isInProgress = currentStep === 6;
  const qrData = createSwapQRData({
    currentUser,
    selectedVehicle,
    selectedStation,
    selectedTower,
    userContract,
    currentBatteryLevel,
    swapResult,
    isInProgress
  });

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0, 0, 0, 0.75)',
        backdropFilter: 'blur(8px)',
        zIndex: 99999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        animation: 'fadeIn 0.3s ease'
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: '#fff',
          borderRadius: '24px',
          padding: '40px',
          maxWidth: '450px',
          width: '90%',
          boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
          position: 'relative',
          animation: 'slideUp 0.3s ease'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '16px',
            right: '16px',
            width: '36px',
            height: '36px',
            borderRadius: '50%',
            border: 'none',
            background: '#f5f5f5',
            color: '#666',
            fontSize: '24px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'all 0.2s ease'
          }}
          onMouseOver={(e) => {
            e.target.style.background = '#ff5252';
            e.target.style.color = '#fff';
          }}
          onMouseOut={(e) => {
            e.target.style.background = '#f5f5f5';
            e.target.style.color = '#666';
          }}
        >
          ×
        </button>

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>📱</div>
          <h3
            style={{
              margin: '0 0 8px 0',
              fontSize: '24px',
              fontWeight: '700',
              background:
                isInProgress
                  ? 'linear-gradient(135deg, #4caf50 0%, #45a049 100%)'
                  : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}
          >
            {isInProgress ? 'Mã QR Đổi Pin' : 'Mã QR Nhận Diện'}
          </h3>
          <p style={{ margin: 0, fontSize: '14px', color: '#666' }}>
            {isInProgress
              ? 'Cho nhân viên quét mã này để xác nhận'
              : 'Nhân viên sẽ quét mã để xác nhận xe của bạn'}
          </p>
        </div>

        {/* QR Code */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            padding: '24px',
            background: isInProgress ? '#f1f8f4' : '#f8f9fa',
            borderRadius: '16px',
            marginBottom: '24px'
          }}
        >
          <QRCodeSVG
            value={JSON.stringify(qrData)}
            size={250}
            level="H"
            includeMargin={true}
            bgColor="#ffffff"
            fgColor={isInProgress ? '#4caf50' : '#667eea'}
          />
        </div>

        {/* Info */}
        <div
          style={{
            textAlign: 'center',
            padding: '16px',
            background: '#fff3e0',
            borderRadius: '12px',
            marginBottom: '16px'
          }}
        >
          <p
            style={{
              margin: '0 0 8px 0',
              fontSize: '13px',
              color: '#f57c00',
              fontWeight: '600'
            }}
          >
            ⏱️ Mã QR hợp lệ trong 5 phút
          </p>
          <p style={{ margin: 0, fontSize: '12px', color: '#666' }}>
            📍 {selectedStation?.name} - Trụ {selectedTower?.towerNumber}
          </p>
        </div>

        {/* Close button */}
        <button
          onClick={onClose}
          style={{
            width: '100%',
            padding: '14px',
            background: '#f5f5f5',
            border: 'none',
            borderRadius: '12px',
            fontSize: '15px',
            fontWeight: '600',
            color: '#666',
            cursor: 'pointer',
            transition: 'all 0.2s ease'
          }}
          onMouseOver={(e) => {
            e.target.style.background = '#e0e0e0';
          }}
          onMouseOut={(e) => {
            e.target.style.background = '#f5f5f5';
          }}
        >
          Đóng
        </button>
      </div>
    </div>
  );
};

export default QRCodeModal;
