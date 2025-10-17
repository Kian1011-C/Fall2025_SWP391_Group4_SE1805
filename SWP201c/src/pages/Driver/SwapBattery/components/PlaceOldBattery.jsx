// Place Old Battery Component - Step 6
import React, { useState, useEffect } from 'react';

const PlaceOldBattery = ({
  selectedStation,
  selectedTower,
  selectedEmptySlot,
  currentBatteryLevel,
  onComplete,
  onShowQR
}) => {
  const [progress, setProgress] = useState(0);
  const [isPlacing, setIsPlacing] = useState(false);

  useEffect(() => {
    // Auto-start after 1 second
    const timer = setTimeout(() => {
      setIsPlacing(true);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (isPlacing && progress < 100) {
      const interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval);
            return 100;
          }
          return prev + 2;
        });
      }, 100);

      return () => clearInterval(interval);
    }
  }, [isPlacing, progress]);

  const handleComplete = () => {
    onComplete();
  };

  return (
    <div style={{ textAlign: 'center', padding: '40px 20px' }}>
      {/* Icon lớn */}
      <div style={{ fontSize: '80px', marginBottom: '24px', animation: 'bounce 2s infinite' }}>
        🔋⬇️
      </div>

      {/* Tiêu đề */}
      <h3
        style={{
          fontSize: '24px',
          fontWeight: '700',
          color: '#333',
          marginBottom: '16px'
        }}
      >
        Bước 1: Đặt pin cũ vào trụ
      </h3>

      {/* Thông tin */}
      <div
        style={{
          background: '#f8f9fa',
          padding: '20px',
          borderRadius: '12px',
          marginBottom: '32px',
          maxWidth: '500px',
          margin: '0 auto 32px auto'
        }}
      >
        <p style={{ margin: '0 0 12px 0', fontSize: '15px', color: '#666' }}>
          📍 <strong>Trạm:</strong> {selectedStation?.name}
        </p>
        <p style={{ margin: '0 0 12px 0', fontSize: '15px', color: '#666' }}>
          🔌 <strong>Trụ:</strong> Trụ {selectedTower?.towerNumber}
        </p>
        <p style={{ margin: '0 0 12px 0', fontSize: '15px', color: '#666' }}>
          📦 <strong>Slot trống:</strong> Slot {selectedEmptySlot?.slotNumber}
        </p>
        <p style={{ margin: '0', fontSize: '15px', color: '#666' }}>
          🔋 <strong>Pin cũ:</strong> {currentBatteryLevel}%
        </p>
      </div>

      {/* Hướng dẫn */}
      <div
        style={{
          background: '#fff3e0',
          padding: '20px',
          borderRadius: '12px',
          marginBottom: '32px',
          maxWidth: '500px',
          margin: '0 auto 32px auto',
          border: '2px solid #ffe0b2'
        }}
      >
        <h4 style={{ margin: '0 0 16px 0', fontSize: '16px', color: '#f57c00' }}>
          📋 Hướng dẫn:
        </h4>
        <ol style={{ margin: 0, paddingLeft: '20px', textAlign: 'left', color: '#f57c00' }}>
          <li style={{ marginBottom: '8px' }}>Mở cốp xe và tháo pin cũ ra</li>
          <li style={{ marginBottom: '8px' }}>
            Đặt pin cũ vào Slot {selectedEmptySlot?.slotNumber} của Trụ {selectedTower?.towerNumber}
          </li>
          <li style={{ marginBottom: '8px' }}>Đảm bảo pin được cắm chắc chắn</li>
          <li>Chờ đèn xanh báo hiệu hoàn tất</li>
        </ol>
      </div>

      {/* Progress bar */}
      {isPlacing && (
        <div style={{ marginBottom: '32px' }}>
          <div
            style={{
              width: '100%',
              maxWidth: '400px',
              height: '8px',
              background: '#e0e0e0',
              borderRadius: '4px',
              overflow: 'hidden',
              margin: '0 auto 12px auto'
            }}
          >
            <div
              style={{
                width: `${progress}%`,
                height: '100%',
                background: 'linear-gradient(90deg, #4caf50, #8bc34a)',
                transition: 'width 0.3s ease',
                borderRadius: '4px'
              }}
            />
          </div>
          <p style={{ fontSize: '14px', color: '#666', margin: 0 }}>
            {progress < 100 ? `Đang kiểm tra... ${progress}%` : '✅ Pin cũ đã được đặt vào trụ!'}
          </p>
        </div>
      )}

      {/* QR Code button */}
      <div style={{ marginBottom: '32px' }}>
        <button
          onClick={onShowQR}
          style={{
            padding: '14px 32px',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: '#fff',
            border: 'none',
            borderRadius: '12px',
            fontSize: '15px',
            fontWeight: '600',
            cursor: 'pointer',
            boxShadow: '0 4px 12px rgba(102, 126, 234, 0.3)',
            transition: 'all 0.3s ease',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '10px'
          }}
        >
          <span style={{ fontSize: '20px' }}>📱</span>
          <span>Hiển thị mã QR cho nhân viên</span>
        </button>
        <p style={{ marginTop: '12px', fontSize: '13px', color: '#666' }}>
          Nhân viên quét mã để xác nhận
        </p>
      </div>

      {/* Next button */}
      {progress >= 100 && (
        <button
          onClick={handleComplete}
          style={{
            padding: '16px 48px',
            background: 'linear-gradient(135deg, #4caf50 0%, #45a049 100%)',
            color: '#fff',
            border: 'none',
            borderRadius: '12px',
            fontSize: '16px',
            fontWeight: '600',
            cursor: 'pointer',
            boxShadow: '0 4px 16px rgba(76, 175, 80, 0.3)',
            transition: 'all 0.3s ease',
            animation: 'fadeIn 0.5s ease'
          }}
        >
          Tiếp tục → Lấy pin mới
        </button>
      )}
    </div>
  );
};

export default PlaceOldBattery;
