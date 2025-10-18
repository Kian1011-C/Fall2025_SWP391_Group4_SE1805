import React from 'react';
import { getVehiclePlate } from '../utils/swapHelpers';

const SwapConfirmation = ({
  selectedStation,
  selectedTower,
  selectedVehicle,
  selectedNewBatterySlot,
  selectedEmptySlot,
  error,
  onStartSwap,
  isStartingSwap = false
}) => {
  const vehiclePlate = getVehiclePlate(selectedVehicle);
  

  return (
    <div>
      <h3
        style={{
          marginBottom: '32px',
          fontSize: '20px',
          fontWeight: '600',
          color: '#333',
          textAlign: 'center'
        }}
      >
        🔋 Xác nhận đổi pin
      </h3>

      <div style={{ marginBottom: '32px', padding: '16px', background: '#f8f9fa', borderRadius: '12px' }}>
        <p style={{ margin: 0, fontSize: '14px', color: '#666' }}>
          <strong>Trạm đã chọn:</strong> {selectedStation?.name}
        </p>
        <p style={{ margin: '8px 0 0 0', fontSize: '14px', color: '#666' }}>
          <strong>Địa chỉ:</strong> {selectedStation?.location}
        </p>
        <p style={{ margin: '8px 0 0 0', fontSize: '14px', color: '#666' }}>
          <strong>Trụ:</strong> Trụ {selectedTower?.towerNumber}
        </p>
        {selectedNewBatterySlot && (
          <p style={{ margin: '8px 0 0 0', fontSize: '14px', color: '#666' }}>
            <strong>Slot pin mới:</strong> Slot {selectedNewBatterySlot.slotNumber} ({selectedNewBatterySlot.batteryLevel}% pin)
          </p>
        )}
        {selectedEmptySlot && (
          <p style={{ margin: '8px 0 0 0', fontSize: '14px', color: '#666' }}>
            <strong>Slot trống:</strong> Slot {selectedEmptySlot.slotNumber}
          </p>
        )}
        {selectedVehicle && (
          <p style={{ margin: '8px 0 0 0', fontSize: '14px', color: '#666' }}>
            <strong>Xe:</strong> {vehiclePlate}
          </p>
        )}
      </div>

      {/* Thông báo hệ thống tự động quét pin */}
      <div style={{ marginBottom: '32px', padding: '20px', background: '#e3f2fd', borderRadius: '12px', border: '1px solid #1976d2' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
          <div style={{ fontSize: '24px' }}>🤖</div>
          <h4 style={{ margin: 0, fontSize: '16px', fontWeight: '600', color: '#1976d2' }}>
            Hệ thống IoT tự động
          </h4>
        </div>
        <p style={{ margin: 0, fontSize: '14px', color: '#1976d2', lineHeight: '1.5' }}>
          Khi bạn bấm "BẮT ĐẦU ĐỔI PIN", hệ thống sẽ tự động quét và tìm pin đầy (100%) trong trụ. 
          Không cần chọn pin trước, hệ thống IoT sẽ tự động xử lý.
        </p>
      </div>

      {error && (
        <div
          style={{
            marginBottom: '20px',
            padding: '12px',
            background: '#ffebee',
            borderRadius: '8px',
            border: '1px solid #f44336'
          }}
        >
          <p style={{ margin: 0, color: '#f44336', fontSize: '14px' }}>⚠️ {error}</p>
        </div>
      )}

      <div
        style={{
          marginTop: '32px',
          padding: '16px',
          background: '#fff3e0',
          borderRadius: '12px',
          border: '1px solid #ffe0b2'
        }}
      >
        <p style={{ margin: 0, fontSize: '14px', color: '#f57c00', textAlign: 'center' }}>
          ⚡ Thời gian ước tính: 2-3 phút
        </p>
      </div>

      {/* Nút bắt đầu đổi pin */}
      <div style={{ marginTop: '32px', textAlign: 'center' }}>
        <button
          onClick={onStartSwap}
          disabled={isStartingSwap}
          style={{
            padding: '16px 40px',
            background: isStartingSwap 
              ? 'linear-gradient(135deg, #ccc 0%, #999 100%)'
              : 'linear-gradient(135deg, #19c37d 0%, #4ecdc4 100%)',
            color: '#fff',
            border: 'none',
            borderRadius: '12px',
            fontSize: '16px',
            fontWeight: '600',
            cursor: isStartingSwap ? 'not-allowed' : 'pointer',
            boxShadow: isStartingSwap 
              ? '0 2px 8px rgba(0, 0, 0, 0.1)'
              : '0 4px 12px rgba(25, 195, 125, 0.3)',
            transition: 'all 0.3s ease',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            margin: '0 auto',
            opacity: isStartingSwap ? 0.7 : 1
          }}
          onMouseOver={(e) => {
            if (!isStartingSwap) {
              e.target.style.transform = 'translateY(-2px)';
              e.target.style.boxShadow = '0 6px 16px rgba(25, 195, 125, 0.4)';
            }
          }}
          onMouseOut={(e) => {
            if (!isStartingSwap) {
              e.target.style.transform = 'translateY(0)';
              e.target.style.boxShadow = '0 4px 12px rgba(25, 195, 125, 0.3)';
            }
          }}
        >
          <span style={{ fontSize: '20px' }}>
            {isStartingSwap ? '⏳' : '🔋'}
          </span>
          <span>
            {isStartingSwap ? 'Đang bắt đầu...' : 'BẮT ĐẦU ĐỔI PIN'}
          </span>
        </button>
        <p style={{ marginTop: '12px', fontSize: '13px', color: '#666' }}>
          {isStartingSwap 
            ? 'Đang khởi tạo quy trình đổi pin...' 
            : 'Nhấn để bắt đầu quy trình đổi pin'
          }
        </p>
      </div>
    </div>
  );
};

export default SwapConfirmation;
