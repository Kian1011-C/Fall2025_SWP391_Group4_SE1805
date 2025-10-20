// Admin/Reports/components/UsageTab.jsx
// Usage tab with battery status and station utilization

import React from 'react';
import { formatNumber, getUtilizationColor, getBatteryStatusProgress } from '../utils';

export const UsageTab = ({ data }) => {
  if (!data) return null;

  const { batteryStatus = {}, stationUtilization = [] } = data;

  const batteryCategories = [
    { 
      key: 'available', 
      label: 'Sẵn sàng', 
      color: '#10B981',
      icon: '✅'
    },
    { 
      key: 'charging', 
      label: 'Đang sạc', 
      color: '#F59E0B',
      icon: '⚡'
    },
    { 
      key: 'inUse', 
      label: 'Đang sử dụng', 
      color: '#3B82F6',
      icon: '🔋'
    },
    { 
      key: 'maintenance', 
      label: 'Bảo trì', 
      color: '#EF4444',
      icon: '🔧'
    }
  ];

  const totalBatteries = batteryCategories.reduce(
    (sum, cat) => sum + (batteryStatus[cat.key] || 0), 
    0
  );

  return (
    <div>
      {/* Battery Status */}
      <div style={{
        background: 'rgba(26, 32, 44, 0.8)',
        borderRadius: '16px',
        padding: '25px',
        marginBottom: '25px',
        border: '1px solid rgba(255, 255, 255, 0.1)'
      }}>
        <h3 style={{ color: '#FFFFFF', marginBottom: '20px', fontSize: '1.2rem' }}>
          🔋 Trạng thái pin
        </h3>
        <div style={{ 
          display: 'grid', 
          gap: '15px'
        }}>
          {batteryCategories.map((category) => {
            const count = batteryStatus[category.key] || 0;
            const percentage = getBatteryStatusProgress(category.key, batteryStatus);
            
            return (
              <div key={category.key}>
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between',
                  marginBottom: '8px'
                }}>
                  <span style={{ color: '#FFFFFF', fontSize: '0.9rem' }}>
                    {category.icon} {category.label}
                  </span>
                  <span style={{ color: category.color, fontWeight: '600' }}>
                    {formatNumber(count)} ({percentage}%)
                  </span>
                </div>
                <div style={{
                  width: '100%',
                  height: '8px',
                  background: 'rgba(255, 255, 255, 0.1)',
                  borderRadius: '4px',
                  overflow: 'hidden'
                }}>
                  <div style={{
                    width: `${percentage}%`,
                    height: '100%',
                    background: category.color,
                    borderRadius: '4px',
                    transition: 'width 0.5s ease'
                  }} />
                </div>
              </div>
            );
          })}
        </div>
        <div style={{
          marginTop: '20px',
          padding: '15px',
          background: 'rgba(106, 183, 255, 0.1)',
          borderRadius: '8px',
          border: '1px solid rgba(106, 183, 255, 0.2)'
        }}>
          <div style={{ color: '#B0B0B0', fontSize: '0.85rem', marginBottom: '5px' }}>
            Tổng số pin
          </div>
          <div style={{ color: '#6ab7ff', fontSize: '1.5rem', fontWeight: '700' }}>
            {formatNumber(totalBatteries)}
          </div>
        </div>
      </div>

      {/* Station Utilization */}
      <div style={{
        background: 'rgba(26, 32, 44, 0.8)',
        borderRadius: '16px',
        padding: '25px',
        border: '1px solid rgba(255, 255, 255, 0.1)'
      }}>
        <h3 style={{ color: '#FFFFFF', marginBottom: '20px', fontSize: '1.2rem' }}>
          ⚡ Tỷ lệ sử dụng trạm
        </h3>
        <div style={{ display: 'grid', gap: '15px' }}>
          {stationUtilization.map((station, index) => {
            const utilizationColor = getUtilizationColor(station.utilization);
            
            return (
              <div key={index}>
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between',
                  marginBottom: '8px'
                }}>
                  <span style={{ color: '#FFFFFF', fontSize: '0.9rem' }}>
                    {station.name}
                  </span>
                  <span style={{ 
                    color: utilizationColor, 
                    fontWeight: '600',
                    fontSize: '0.9rem'
                  }}>
                    {station.utilization}%
                  </span>
                </div>
                <div style={{
                  width: '100%',
                  height: '10px',
                  background: 'rgba(255, 255, 255, 0.1)',
                  borderRadius: '5px',
                  overflow: 'hidden'
                }}>
                  <div style={{
                    width: `${station.utilization}%`,
                    height: '100%',
                    background: utilizationColor,
                    borderRadius: '5px',
                    transition: 'width 0.5s ease'
                  }} />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
