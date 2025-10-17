// Admin/Stations/components/StationCard.jsx
// Individual station card component

import React from 'react';
import { 
  formatPhoneNumber, 
  getAvailabilityStatus, 
  calculateUtilization,
  getUtilizationColor 
} from '../utils';

export const StationCard = ({ station, onEdit, onDelete }) => {
  const availabilityStatus = getAvailabilityStatus(
    station.availableBatteries || 0, 
    station.totalSlots || 0
  );
  const utilization = calculateUtilization(
    station.availableBatteries || 0,
    station.totalSlots || 0
  );
  const utilizationColor = getUtilizationColor(utilization);

  return (
    <div style={{
      background: 'rgba(26, 32, 44, 0.8)',
      borderRadius: '16px',
      padding: '25px',
      border: '1px solid rgba(255, 255, 255, 0.1)',
      transition: 'all 0.3s ease'
    }}
    onMouseEnter={(e) => {
      e.currentTarget.style.transform = 'translateY(-5px)';
      e.currentTarget.style.boxShadow = '0 8px 25px rgba(106, 183, 255, 0.2)';
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.transform = 'translateY(0)';
      e.currentTarget.style.boxShadow = 'none';
    }}
    >
      {/* Station Name */}
      <h3 style={{ 
        color: '#FFFFFF', 
        margin: '0 0 20px 0',
        fontSize: '1.3rem',
        fontWeight: '600'
      }}>
        {station.name}
      </h3>

      {/* Station Details */}
      <div style={{ marginBottom: '20px' }}>
        <div style={{ 
          color: '#B0B0B0', 
          fontSize: '0.9rem',
          marginBottom: '10px',
          display: 'flex',
          alignItems: 'flex-start',
          gap: '8px'
        }}>
          <span>📍</span>
          <span>{station.address}</span>
        </div>
        
        <div style={{ 
          color: '#B0B0B0', 
          fontSize: '0.9rem',
          marginBottom: '10px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          <span>👤</span>
          <span>{station.manager}</span>
        </div>
        
        <div style={{ 
          color: '#B0B0B0', 
          fontSize: '0.9rem',
          marginBottom: '10px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          <span>📞</span>
          <span>{formatPhoneNumber(station.phone)}</span>
        </div>
      </div>

      {/* Battery Slots Info */}
      <div style={{
        background: 'rgba(255, 255, 255, 0.05)',
        borderRadius: '12px',
        padding: '15px',
        marginBottom: '20px'
      }}>
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '10px'
        }}>
          <span style={{ color: '#B0B0B0', fontSize: '0.85rem' }}>
            Slots khả dụng
          </span>
          <span style={{ 
            color: availabilityStatus.color, 
            fontWeight: '600',
            fontSize: '1.1rem'
          }}>
            {station.availableBatteries || 0}/{station.totalSlots || 0}
          </span>
        </div>
        
        {/* Utilization Bar */}
        <div style={{
          width: '100%',
          height: '8px',
          background: 'rgba(255, 255, 255, 0.1)',
          borderRadius: '4px',
          overflow: 'hidden',
          marginBottom: '8px'
        }}>
          <div style={{
            width: `${utilization}%`,
            height: '100%',
            background: utilizationColor,
            borderRadius: '4px',
            transition: 'width 0.5s ease'
          }} />
        </div>
        
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between',
          fontSize: '0.75rem'
        }}>
          <span style={{ color: availabilityStatus.color }}>
            {availabilityStatus.label}
          </span>
          <span style={{ color: utilizationColor }}>
            {utilization}% sử dụng
          </span>
        </div>
      </div>

      {/* Action Buttons */}
      <div style={{ display: 'flex', gap: '10px' }}>
        <button
          onClick={() => onEdit(station)}
          style={{
            flex: 1,
            padding: '10px',
            background: 'linear-gradient(135deg, #6ab7ff, #4a9eff)',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontWeight: '500',
            fontSize: '14px',
            transition: 'opacity 0.2s ease'
          }}
          onMouseEnter={(e) => e.currentTarget.style.opacity = '0.9'}
          onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
        >
          ✏️ Sửa
        </button>
        
        <button
          onClick={() => {
            if (window.confirm(`Xác nhận xóa trạm "${station.name}"?`)) {
              onDelete(station.id);
            }
          }}
          style={{
            flex: 1,
            padding: '10px',
            background: 'linear-gradient(135deg, #EF4444, #DC2626)',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontWeight: '500',
            fontSize: '14px',
            transition: 'opacity 0.2s ease'
          }}
          onMouseEnter={(e) => e.currentTarget.style.opacity = '0.9'}
          onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
        >
          🗑️ Xóa
        </button>
      </div>
    </div>
  );
};
