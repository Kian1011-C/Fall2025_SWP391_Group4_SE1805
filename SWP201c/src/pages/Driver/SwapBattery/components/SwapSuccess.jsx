// Swap Success Component - Step 7
import React from 'react';
import { getBatteryLevel, getVehiclePlate } from '../utils/swapHelpers';

const SwapSuccess = ({ swapResult, selectedStation, selectedVehicle, currentBatteryLevel }) => {
  const vehiclePlate = getVehiclePlate(selectedVehicle);
  const oldBatteryLevel = getBatteryLevel(selectedVehicle, currentBatteryLevel);

  return (
    <div className="success-container">
      <div className="success-icon">✅</div>
      <div className="success-title">Đổi pin thành công!</div>
      <div className="success-message">
        Pin của bạn đã được thay thế thành công. Xe của bạn đã sẵn sàng để tiếp tục hành trình!
      </div>

      <div className="success-details">
        {swapResult?.swapId && (
          <div className="detail-row">
            <span className="detail-label">Mã giao dịch:</span>
            <span className="detail-value">#{swapResult.swapId}</span>
          </div>
        )}
        <div className="detail-row">
          <span className="detail-label">Trạm sạc:</span>
          <span className="detail-value">{swapResult?.stationName || selectedStation?.name}</span>
        </div>
        <div className="detail-row">
          <span className="detail-label">Thời gian:</span>
          <span className="detail-value">
            {swapResult?.time || new Date().toLocaleString('vi-VN')}
          </span>
        </div>
        <div className="detail-row">
          <span className="detail-label">Xe:</span>
          <span className="detail-value">{vehiclePlate}</span>
        </div>
        <div className="detail-row">
          <span className="detail-label">Pin cũ:</span>
          <span className="detail-value" style={{ color: '#f44336' }}>
            {swapResult?.oldBattery || oldBatteryLevel}%
          </span>
        </div>
        <div className="detail-row">
          <span className="detail-label">Pin mới:</span>
          <span className="detail-value" style={{ color: '#4caf50' }}>
            {swapResult?.newBattery || 100}%
          </span>
        </div>
        <div className="detail-row">
          <span className="detail-label">Trạng thái:</span>
          <span className="detail-value" style={{ color: '#4caf50' }}>
            ✅ Hoàn tất
          </span>
        </div>
      </div>

      <div
        style={{
          marginTop: '24px',
          padding: '16px',
          background: '#e8f5e9',
          borderRadius: '12px',
          width: '100%',
          maxWidth: '500px'
        }}
      >
        <p style={{ margin: 0, fontSize: '14px', color: '#4caf50', textAlign: 'center' }}>
          🎉 Chúc bạn có một chuyến đi an toàn!
        </p>
      </div>
    </div>
  );
};

export default SwapSuccess;
