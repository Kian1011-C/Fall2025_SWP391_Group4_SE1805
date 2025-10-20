// Admin/Batteries/components/AddBatteryModal.jsx
// Modal for adding new battery

import React, { useState } from 'react';
import { getStationOptions } from '../utils';

export const AddBatteryModal = ({ isOpen, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    batteryId: '',
    serialNumber: '',
    capacity: '',
    station: 'Trạm Quận 1'
  });

  const stationOptions = getStationOptions();

  if (!isOpen) return null;

  const handleChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = () => {
    // Validate form
    if (!formData.batteryId || !formData.serialNumber || !formData.capacity) {
      alert('Vui lòng điền đầy đủ thông tin!');
      return;
    }

    onSubmit(formData);
    
    // Reset form
    setFormData({
      batteryId: '',
      serialNumber: '',
      capacity: '',
      station: 'Trạm Quận 1'
    });
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0,0,0,0.8)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000
    }}>
      <div style={{
        background: 'rgba(26, 32, 44, 0.95)',
        borderRadius: '12px',
        padding: '30px',
        width: '500px',
        border: '1px solid rgba(255, 255, 255, 0.2)'
      }}>
        <h3 style={{ color: '#FFFFFF', marginBottom: '20px' }}>
          Thêm pin mới
        </h3>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          {/* Battery ID */}
          <input
            type="text"
            placeholder="Mã pin (BAT-001)"
            value={formData.batteryId}
            onChange={(e) => handleChange('batteryId', e.target.value)}
            style={{
              padding: '12px',
              border: '2px solid rgba(255, 255, 255, 0.2)',
              borderRadius: '8px',
              background: 'rgba(255, 255, 255, 0.1)',
              color: '#FFFFFF'
            }}
          />

          {/* Serial Number */}
          <input
            type="text"
            placeholder="Số seri (LI2024001)"
            value={formData.serialNumber}
            onChange={(e) => handleChange('serialNumber', e.target.value)}
            style={{
              padding: '12px',
              border: '2px solid rgba(255, 255, 255, 0.2)',
              borderRadius: '8px',
              background: 'rgba(255, 255, 255, 0.1)',
              color: '#FFFFFF'
            }}
          />

          {/* Capacity */}
          <input
            type="number"
            placeholder="Dung lượng (kWh)"
            value={formData.capacity}
            onChange={(e) => handleChange('capacity', e.target.value)}
            style={{
              padding: '12px',
              border: '2px solid rgba(255, 255, 255, 0.2)',
              borderRadius: '8px',
              background: 'rgba(255, 255, 255, 0.1)',
              color: '#FFFFFF'
            }}
          />

          {/* Station */}
          <select
            value={formData.station}
            onChange={(e) => handleChange('station', e.target.value)}
            style={{
              padding: '12px',
              border: '2px solid rgba(255, 255, 255, 0.2)',
              borderRadius: '8px',
              background: 'rgba(255, 255, 255, 0.1)',
              color: '#FFFFFF'
            }}
          >
            {stationOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', gap: '15px', marginTop: '25px' }}>
          <button
            onClick={onClose}
            style={{
              flex: 1,
              padding: '12px',
              background: 'rgba(255, 255, 255, 0.2)',
              color: '#FFFFFF',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer'
            }}
          >
            Hủy
          </button>
          <button
            onClick={handleSubmit}
            style={{
              flex: 1,
              padding: '12px',
              background: '#27ae60',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer'
            }}
          >
            Thêm mới
          </button>
        </div>
      </div>
    </div>
  );
};
