// Staff Assistance Modal Component
import React from 'react';
import { getBatteryLevel, getVehiclePlate, getPriorityLabel } from '../utils/swapHelpers';

const StaffAssistanceModal = ({
  show,
  loading,
  success,
  selectedStation,
  selectedVehicle,
  currentBatteryLevel,
  onConfirm,
  onClose
}) => {
  if (!show) return null;

  const vehiclePlate = getVehiclePlate(selectedVehicle);
  const batteryLevel = getBatteryLevel(selectedVehicle, currentBatteryLevel);
  const priorityLabel = getPriorityLabel(batteryLevel);

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
      onClick={() => !loading && onClose()}
    >
      <div
        style={{
          background: '#fff',
          borderRadius: '24px',
          padding: '40px',
          maxWidth: '500px',
          width: '90%',
          boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
          position: 'relative',
          animation: 'slideUp 0.3s ease'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        {!loading && (
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
        )}

        {/* Content based on state */}
        {success ? (
          // Success state
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '64px', marginBottom: '24px' }}>✅</div>
            <h3
              style={{
                margin: '0 0 16px 0',
                fontSize: '24px',
                fontWeight: '700',
                color: '#4caf50'
              }}
            >
              Yêu cầu đã được gửi!
            </h3>
            <p
              style={{
                margin: '0 0 24px 0',
                fontSize: '16px',
                color: '#666',
                lineHeight: '1.5'
              }}
            >
              Nhân viên tại <strong>{selectedStation?.name}</strong> sẽ sớm liên hệ và hỗ trợ bạn
              đổi pin.
            </p>

            <div
              style={{
                background: '#f1f8f4',
                padding: '20px',
                borderRadius: '12px',
                marginBottom: '24px'
              }}
            >
              <h4
                style={{
                  margin: '0 0 12px 0',
                  fontSize: '16px',
                  color: '#2e7d32'
                }}
              >
                📋 Thông tin yêu cầu:
              </h4>
              <div style={{ fontSize: '14px', color: '#2e7d32', textAlign: 'left' }}>
                <p style={{ margin: '4px 0' }}>
                  🚗 <strong>Xe:</strong> {vehiclePlate}
                </p>
                <p style={{ margin: '4px 0' }}>
                  🔋 <strong>Pin hiện tại:</strong> {batteryLevel}%
                </p>
                <p style={{ margin: '4px 0' }}>
                  📍 <strong>Trạm:</strong> {selectedStation?.name}
                </p>
                <p style={{ margin: '4px 0' }}>
                  ⏰ <strong>Thời gian:</strong> {new Date().toLocaleString('vi-VN')}
                </p>
              </div>
            </div>

            <div
              style={{
                background: '#fff3e0',
                padding: '16px',
                borderRadius: '12px',
                marginBottom: '24px'
              }}
            >
              <p
                style={{
                  margin: 0,
                  fontSize: '14px',
                  color: '#f57c00',
                  fontWeight: '600'
                }}
              >
                ⏱️ Thời gian chờ ước tính: 5-10 phút
              </p>
            </div>

            <button
              onClick={onClose}
              style={{
                width: '100%',
                padding: '16px',
                background: 'linear-gradient(135deg, #4caf50 0%, #45a049 100%)',
                border: 'none',
                borderRadius: '12px',
                fontSize: '16px',
                fontWeight: '600',
                color: '#fff',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
              onMouseOver={(e) => {
                e.target.style.transform = 'translateY(-2px)';
              }}
              onMouseOut={(e) => {
                e.target.style.transform = 'translateY(0)';
              }}
            >
              Đóng
            </button>
          </div>
        ) : loading ? (
          // Loading state
          <div style={{ textAlign: 'center' }}>
            <div className="loading-spinner" style={{ margin: '0 auto 24px auto' }}></div>
            <h3
              style={{
                margin: '0 0 16px 0',
                fontSize: '24px',
                fontWeight: '700',
                color: '#ff9800'
              }}
            >
              Đang gửi yêu cầu...
            </h3>
            <p
              style={{
                margin: 0,
                fontSize: '16px',
                color: '#666'
              }}
            >
              Vui lòng đợi trong giây lát
            </p>
          </div>
        ) : (
          // Confirmation state
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '64px', marginBottom: '24px' }}>🤝</div>
            <h3
              style={{
                margin: '0 0 16px 0',
                fontSize: '24px',
                fontWeight: '700',
                color: '#ff9800'
              }}
            >
              Yêu cầu hỗ trợ từ nhân viên
            </h3>
            <p
              style={{
                margin: '0 0 24px 0',
                fontSize: '16px',
                color: '#666',
                lineHeight: '1.5'
              }}
            >
              Bạn có muốn yêu cầu nhân viên tại <strong>{selectedStation?.name}</strong> hỗ trợ đổi
              pin cho xe của bạn không?
            </p>

            <div
              style={{
                background: '#f8f9fa',
                padding: '20px',
                borderRadius: '12px',
                marginBottom: '24px'
              }}
            >
              <h4
                style={{
                  margin: '0 0 12px 0',
                  fontSize: '16px',
                  color: '#333'
                }}
              >
                📋 Thông tin sẽ được gửi:
              </h4>
              <div style={{ fontSize: '14px', color: '#666', textAlign: 'left' }}>
                <p style={{ margin: '4px 0' }}>
                  🚗 <strong>Xe:</strong> {vehiclePlate}
                </p>
                <p style={{ margin: '4px 0' }}>
                  🔋 <strong>Pin hiện tại:</strong> {batteryLevel}%
                </p>
                <p style={{ margin: '4px 0' }}>
                  📍 <strong>Trạm:</strong> {selectedStation?.name}
                </p>
                <p style={{ margin: '4px 0' }}>
                  🏆 <strong>Độ ưu tiên:</strong> {priorityLabel}
                </p>
              </div>
            </div>

            <div
              style={{
                display: 'flex',
                gap: '12px',
                justifyContent: 'center'
              }}
            >
              <button
                onClick={onClose}
                style={{
                  flex: 1,
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
                Hủy
              </button>
              <button
                onClick={onConfirm}
                style={{
                  flex: 2,
                  padding: '14px',
                  background: 'linear-gradient(135deg, #ff9800 0%, #f57c00 100%)',
                  border: 'none',
                  borderRadius: '12px',
                  fontSize: '15px',
                  fontWeight: '600',
                  color: '#fff',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
                onMouseOver={(e) => {
                  e.target.style.transform = 'translateY(-2px)';
                }}
                onMouseOut={(e) => {
                  e.target.style.transform = 'translateY(0)';
                }}
              >
                ✅ Gửi yêu cầu
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default StaffAssistanceModal;
