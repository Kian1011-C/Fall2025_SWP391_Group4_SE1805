// Admin/Batteries/components/BatteriesStatsCards.jsx
// Statistics cards for battery overview

import React from 'react';

export const BatteriesStatsCards = ({ stats }) => {
  const statsData = [
    { label: 'Tổng số pin', value: stats.total, color: '#6ab7ff' },
    { label: 'Sẵn sàng', value: stats.available, color: '#27ae60' },
    { label: 'Đang sạc', value: stats.charging, color: '#f39c12' },
    { label: 'Đang dùng', value: stats.inUse, color: '#3498db' },
    { label: 'Bảo trì', value: stats.maintenance, color: '#9b59b6' },
    { label: 'Sức khỏe TB', value: `${stats.avgHealth}%`, color: '#19c37d' }
  ];

  return (
    <div style={{ 
      display: 'grid', 
      gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', 
      gap: '15px', 
      marginBottom: '30px' 
    }}>
      {statsData.map((stat, index) => (
        <div key={index} style={{
          background: 'rgba(26, 32, 44, 0.8)',
          borderRadius: '12px',
          padding: '20px',
          textAlign: 'center',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(10px)'
        }}>
          <div style={{ 
            fontSize: '24px', 
            fontWeight: 'bold', 
            color: stat.color 
          }}>
            {stat.value}
          </div>
          <div style={{ 
            fontSize: '14px', 
            color: '#E0E0E0', 
            marginTop: '5px' 
          }}>
            {stat.label}
          </div>
        </div>
      ))}
    </div>
  );
};
