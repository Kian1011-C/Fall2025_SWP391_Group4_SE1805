// Staff/BatteryInventory/components/BatteryUpdateModal.jsx
import React from 'react';
import { getStatusOptions } from '../utils';

const BatteryUpdateModal = ({ 
  show,
  battery,
  updateData,
  isUpdating = false,
  onUpdateField,
  onSave,
  onClose
}) => {
  if (!show || !battery) return null;

  const statusOptions = getStatusOptions();

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0, 0, 0, 0.7)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000
    }}>
      <div style={{
        background: 'rgba(26, 32, 44, 0.95)',
        borderRadius: '16px',
        padding: '30px',
        maxWidth: '500px',
        width: '90%',
        border: '1px solid rgba(255, 255, 255, 0.1)'
      }}>
        <h2 style={{ color: '#FFFFFF', marginBottom: '20px' }}>
          Cập nhật Pin {battery.batteryId}
        </h2>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          <div>
            <label style={{ color: '#E0E0E0', display: 'block', marginBottom: '5px' }}>
              Trạng thái:
            </label>
            <select
              value={updateData.status}
              onChange={(e) => onUpdateField('status', e.target.value)}
              style={inputStyle}
            >
              {statusOptions.map(status => (
                <option key={status} value={status}>{status}</option>
              ))}
            </select>
          </div>

          <div>
            <label style={{ color: '#E0E0E0', display: 'block', marginBottom: '5px' }}>
              Sức khỏe (%):
            </label>
            <input
              type="number"
              min="0"
              max="100"
              value={updateData.health}
              onChange={(e) => onUpdateField('health', e.target.value)}
              style={inputStyle}
            />
          </div>

          <div>
            <label style={{ color: '#E0E0E0', display: 'block', marginBottom: '5px' }}>
              Nhiệt độ (°C):
            </label>
            <input
              type="number"
              value={updateData.temperature}
              onChange={(e) => onUpdateField('temperature', e.target.value)}
              style={inputStyle}
            />
          </div>

          <div>
            <label style={{ color: '#E0E0E0', display: 'block', marginBottom: '5px' }}>
              Điện áp (V):
            </label>
            <input
              type="number"
              step="0.1"
              value={updateData.voltage}
              onChange={(e) => onUpdateField('voltage', e.target.value)}
              style={inputStyle}
            />
          </div>
        </div>

        <div style={{ 
          display: 'flex', 
          gap: '10px', 
          marginTop: '20px',
          justifyContent: 'flex-end'
        }}>
          <button
            onClick={onClose}
            disabled={isUpdating}
            style={{
              padding: '10px 20px',
              background: 'rgba(255, 255, 255, 0.1)',
              color: '#FFFFFF',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              borderRadius: '8px',
              cursor: isUpdating ? 'not-allowed' : 'pointer',
              opacity: isUpdating ? 0.5 : 1
            }}
          >
            Hủy
          </button>
          <button
            onClick={onSave}
            disabled={isUpdating}
            style={{
              padding: '10px 20px',
              background: isUpdating 
                ? 'rgba(25, 195, 125, 0.5)' 
                : 'linear-gradient(135deg, #19c37d, #15a36a)',
              color: '#FFFFFF',
              border: 'none',
              borderRadius: '8px',
              cursor: isUpdating ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            {isUpdating ? (
              <>
                <span>⏳</span>
                <span>Đang lưu...</span>
              </>
            ) : (
              'Lưu'
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

const inputStyle = {
  width: '100%',
  padding: '10px',
  borderRadius: '8px',
  background: 'rgba(26, 32, 44, 0.8)',
  color: '#FFFFFF',
  border: '1px solid rgba(255, 255, 255, 0.2)'
};

export default BatteryUpdateModal;
