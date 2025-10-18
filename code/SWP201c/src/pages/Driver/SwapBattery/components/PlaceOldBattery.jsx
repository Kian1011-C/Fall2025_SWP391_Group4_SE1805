// Place Old Battery Component - Step 4
import React, { useState, useEffect, useCallback } from 'react';
// import { swapService } from '../../../../assets/js/services/index.js';

const PlaceOldBattery = ({
  selectedStation,
  selectedTower,
  selectedEmptySlot,
  currentBatteryLevel,
  swapSessionId,
  oldBatteryId,
  onComplete,
  onError
}) => {
  const [progress, setProgress] = useState(0);
  const [isPlacing, setIsPlacing] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [_error, setError] = useState(null);

  useEffect(() => {
    // Auto-start after 1 second
    const timer = setTimeout(() => {
      setIsPlacing(true);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const handlePlaceOldBattery = useCallback(async () => {
    try {
      setIsCompleted(true);
      
      console.log('🚀 Placing old battery...', {
        swapSessionId,
        oldBatteryId,
        placedInSlot: selectedEmptySlot?.slotId || selectedEmptySlot?.id
      });

      // TODO: Uncomment when backend API is ready
      // const response = await swapService.placeOldBattery({
      //   swapSessionId,
      //   oldBatteryId,
      //   placedInSlot: selectedEmptySlot?.slotId || selectedEmptySlot?.id
      // });

      // Mock response for testing
      const mockResponse = {
        success: true,
        data: {
          nextStep: 'TAKE_NEW_BATTERY',
          newBatterySlot: 5,
          newBatteryId: 123
        },
        message: 'Pin cũ đã được đặt thành công'
      };

      console.log('🧪 Using mock response for testing');
      const response = mockResponse;

      if (response.success) {
        console.log('✅ Old battery placed successfully:', response.data);
        
        // Call onComplete with the response data
        setTimeout(() => {
          onComplete(response.data);
        }, 1000);
      } else {
        throw new Error(response.message || 'Không thể đặt pin cũ');
      }

    } catch (error) {
      console.error('❌ Error placing old battery:', error);
      setError(error.message || 'Lỗi khi đặt pin cũ');
      if (onError) {
        onError(error);
      }
    }
  }, [swapSessionId, oldBatteryId, selectedEmptySlot, onComplete, onError]);

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

  useEffect(() => {
    if (progress >= 100 && !isCompleted) {
      handlePlaceOldBattery();
    }
  }, [progress, isCompleted, handlePlaceOldBattery]);

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
