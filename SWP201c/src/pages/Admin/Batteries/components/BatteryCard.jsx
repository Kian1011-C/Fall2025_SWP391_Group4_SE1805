// Admin/Batteries/components/BatteryCard.jsx
// Individual battery card component

import React from 'react';
import {
  getStatusLabel,
  getStatusColor,
  getHealthColor,
  getChargeColor
} from '../utils';

export const BatteryCard = ({ battery, onMaintenance, onDelete }) => {
  return (
    <div style={{
      background: 'rgba(26, 32, 44, 0.8)',
      borderRadius: '12px',
      padding: '20px',
      border: '1px solid rgba(255, 255, 255, 0.1)',
      backdropFilter: 'blur(10px)',
      transition: 'transform 0.2s ease',
      cursor: 'pointer'
    }}
    onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
    onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
    >
      {/* Battery Header */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        marginBottom: '15px' 
      }}>
        <div style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#FFFFFF' }}>
          {battery.id}
        </div>
        <span style={{
          padding: '4px 12px',
          borderRadius: '20px',
          backgroundColor: getStatusColor(battery.status),
          color: 'white',
          fontSize: '0.8rem',
          fontWeight: '500'
        }}>
          {getStatusLabel(battery.status)}
        </span>
      </div>

      {/* Battery Info */}
      <div style={{ marginBottom: '15px' }}>
        {[
          { label: 'Số seri:', value: battery.serialNumber },
          { label: 'Trạm:', value: battery.station },
          { label: 'Dung lượng:', value: `${battery.capacity} kWh` }
        ].map((info, index) => (
          <div key={index} style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            marginBottom: '5px' 
          }}>
            <span style={{ color: '#B0B0B0', fontSize: '0.9rem' }}>
              {info.label}
            </span>
            <span style={{ color: '#FFFFFF', fontWeight: '500' }}>
              {info.value}
            </span>
          </div>
        ))}
      </div>

      {/* Battery Metrics */}
      <div style={{ marginBottom: '15px' }}>
        {/* Current Charge */}
        <div style={{ marginBottom: '10px' }}>
          <div style={{ fontSize: '0.85rem', color: '#B0B0B0', marginBottom: '5px' }}>
            Pin hiện tại
          </div>
          <div style={{ 
            width: '100%', 
            height: '8px', 
            background: 'rgba(255, 255, 255, 0.2)', 
            borderRadius: '4px', 
            overflow: 'hidden',
            marginBottom: '5px'
          }}>
            <div style={{
              width: `${battery.currentCharge}%`,
              height: '100%',
              backgroundColor: getChargeColor(battery.currentCharge),
              transition: 'width 0.3s ease'
            }}></div>
          </div>
          <div style={{ fontSize: '0.9rem', fontWeight: '600', color: '#FFFFFF', textAlign: 'right' }}>
            {battery.currentCharge}%
          </div>
        </div>

        {/* Health */}
        <div>
          <div style={{ fontSize: '0.85rem', color: '#B0B0B0', marginBottom: '5px' }}>
            Sức khỏe pin
          </div>
          <div style={{ 
            width: '100%', 
            height: '8px', 
            background: 'rgba(255, 255, 255, 0.2)', 
            borderRadius: '4px', 
            overflow: 'hidden',
            marginBottom: '5px'
          }}>
            <div style={{
              width: `${battery.health}%`,
              height: '100%',
              backgroundColor: getHealthColor(battery.health),
              transition: 'width 0.3s ease'
            }}></div>
          </div>
          <div style={{ fontSize: '0.9rem', fontWeight: '600', color: '#FFFFFF', textAlign: 'right' }}>
            {battery.health}%
          </div>
        </div>
      </div>

      {/* Battery Details */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        marginBottom: '15px',
        padding: '10px',
        background: 'rgba(255, 255, 255, 0.05)',
        borderRadius: '8px'
      }}>
        {[
          { icon: '🔄', value: battery.cycleCount, label: 'chu kỳ' },
          { icon: '🌡️', value: `${battery.temperature}°C`, label: '' },
          { icon: '📅', value: battery.manufactureDate.split('-')[0], label: '' }
        ].map((detail, index) => (
          <div key={index} style={{ 
            textAlign: 'center', 
            fontSize: '0.85rem', 
            color: '#FFFFFF' 
          }}>
            <div style={{ fontSize: '1.2rem', marginBottom: '2px' }}>
              {detail.icon}
            </div>
            <div>{detail.value} {detail.label}</div>
          </div>
        ))}
      </div>

      {/* Actions */}
      <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
        <button
          onClick={() => onMaintenance(battery.id)}
          style={{
            padding: '8px 16px',
            background: '#9b59b6',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '0.8rem'
          }}
        >
          🔧 Bảo trì
        </button>
        <button
          onClick={() => onDelete(battery.id)}
          style={{
            padding: '8px 16px',
            background: '#e74c3c',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '0.8rem'
          }}
        >
          🗑️ Xóa
        </button>
      </div>
    </div>
  );
};
