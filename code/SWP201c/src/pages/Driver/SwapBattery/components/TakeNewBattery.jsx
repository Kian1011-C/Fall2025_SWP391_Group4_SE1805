// Take New Battery Component - Step 7
import React, { useState, useEffect } from 'react';

const TakeNewBattery = ({
  selectedStation,
  selectedTower,
  selectedNewBatterySlot
}) => {
  const [progress, setProgress] = useState(0);
  const [isTaking, setIsTaking] = useState(false);

  useEffect(() => {
    // Auto-start after 1 second
    const timer = setTimeout(() => {
      setIsTaking(true);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (isTaking && progress < 100) {
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
  }, [isTaking, progress]);

  // Completion handled via parent action button

  const newBatteryLevel = selectedNewBatterySlot?.batteryLevel || 100;

  return (
    <div style={{ textAlign: 'center', padding: '40px 20px' }}>
      {/* Icon lớn */}
      <div style={{ fontSize: '80px', marginBottom: '24px', animation: 'bounce 2s infinite' }}>
        🔋⬆️
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
        Bước 2: Lấy pin mới ra
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
          📦 <strong>Slot pin mới:</strong> Slot {selectedNewBatterySlot?.slotNumber}
        </p>
        <p style={{ margin: '0', fontSize: '15px', color: '#4caf50', fontWeight: '600' }}>
          ⚡ <strong>Pin mới:</strong> {newBatteryLevel}%
        </p>
      </div>

      {/* Hướng dẫn */}
      <div
        style={{
          background: '#e8f5e9',
          padding: '20px',
          borderRadius: '12px',
          marginBottom: '32px',
          maxWidth: '500px',
          margin: '0 auto 32px auto',
          border: '2px solid #c8e6c9'
        }}
      >
        <h4 style={{ margin: '0 0 16px 0', fontSize: '16px', color: '#2e7d32' }}>
          📋 Hướng dẫn:
        </h4>
        <ol style={{ margin: 0, paddingLeft: '20px', textAlign: 'left', color: '#2e7d32' }}>
          <li style={{ marginBottom: '8px' }}>
            Lấy pin mới từ Slot {selectedNewBatterySlot?.slotNumber} của Trụ {selectedTower?.towerNumber}
          </li>
          <li style={{ marginBottom: '8px' }}>Kiểm tra pin không bị hư hỏng</li>
          <li style={{ marginBottom: '8px' }}>Lắp pin mới vào xe</li>
          <li>Đảm bảo pin được cắm chắc chắn</li>
        </ol>
      </div>

      {/* Progress bar */}
      {isTaking && (
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
            {progress < 100 ? `Đang kiểm tra... ${progress}%` : '✅ Pin mới đã sẵn sàng!'}
          </p>
        </div>
      )}

      {/* QR button removed */}

      {/* Completion message */}
      {progress >= 100 && (
        <div style={{ marginTop: '24px' }}>
          <p style={{ fontSize: '16px', color: '#4caf50', fontWeight: '600' }}>
            ✅ Pin mới đã được lắp thành công!
          </p>
          <p style={{ fontSize: '14px', color: '#666', marginTop: '8px' }}>
            Nhấn nút "Hoàn tất đổi pin" ở dưới để hoàn tất quy trình
          </p>
        </div>
      )}
    </div>
  );
};

export default TakeNewBattery;
