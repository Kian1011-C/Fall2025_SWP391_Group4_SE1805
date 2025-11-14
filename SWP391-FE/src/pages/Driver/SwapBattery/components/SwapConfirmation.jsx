import React from 'react';
import StaffAssistanceButton from './StaffAssistanceButton';
import { getBatteryLevel, getVehiclePlate } from '../utils/swapHelpers';

const SwapConfirmation = ({
  selectedStation,
  selectedTower,
  selectedVehicle,
  selectedNewBatterySlot,
  selectedEmptySlot,
  oldBatteryId,
  error,
  onRequestStaffAssistance
}) => {
  const vehiclePlate = getVehiclePlate(selectedVehicle);
  const batteryLevel = getBatteryLevel(selectedVehicle, oldBatteryId);
  
  // Get new battery level from selected slot
  const newBatteryLevel = selectedNewBatterySlot?.batteryLevel || 100;
  
  console.log(' SwapConfirmation DEBUG:');
  console.log('  - selectedVehicle:', selectedVehicle);
  console.log('  - vehicle.health:', selectedVehicle?.health);
  console.log('  - vehicle.batteryLevel:', selectedVehicle?.batteryLevel);
  console.log('  - currentBatteryLevel (fallback):', oldBatteryId);
  console.log('  - Final batteryLevel:', batteryLevel);
  console.log('  - New battery level:', newBatteryLevel, 'from slot:', selectedNewBatterySlot);
  console.log('  - Empty slot:', selectedEmptySlot);

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
         Xác nhận đổi pin
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
          <p style={{ margin: 0, color: '#f44336', fontSize: '14px' }}> {error}</p>
        </div>
      )}

      <div className="battery-comparison">
        {/* Pin cũ */}
        <div className="battery-display">
          <div className="battery-icon-large battery-old"></div>
          <div className="battery-label">Pin hiện tại</div>
          <div className="battery-percentage" style={{ 
            color: batteryLevel < 50 ? '#f44336' : batteryLevel < 80 ? '#ff9800' : '#4caf50'
          }}>
            {batteryLevel}%
          </div>
          <span style={{ 
            fontSize: '14px', 
            color: batteryLevel < 50 ? '#f44336' : batteryLevel < 80 ? '#ff9800' : '#4caf50'
          }}>
            {batteryLevel < 50 ? ' Pin yếu' : batteryLevel < 80 ? ' Pin trung bình' : ' Pin tốt'}
          </span>
        </div>

        {/* Mũi tên */}
        <div className="arrow-icon">→</div>

        {/* Pin mới */}
        <div className="battery-display">
          <div className="battery-icon-large battery-new"></div>
          <div className="battery-label">Pin mới</div>
          <div className="battery-percentage" style={{ color: '#4caf50' }}>
            {newBatteryLevel}%
          </div>
          <span style={{ fontSize: '14px', color: '#4caf50' }}>
            {newBatteryLevel >= 95 ? ' Pin đầy' : ' Pin tốt'}
          </span>
        </div>
      </div>

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
           Thời gian ước tính: 2-3 phút
        </p>
      </div>

      <StaffAssistanceButton
        selectedStation={selectedStation}
        onRequestAssistance={onRequestStaffAssistance}
        position="bottom"
      />
    </div>
  );
};

export default SwapConfirmation;
