// Admin/Users/components/UsersStatsCards.jsx
// Statistics cards component

import React from 'react';

export const UsersStatsCards = ({ stats }) => {
  const statCards = [
    { label: 'Tổng số', value: stats.total, color: '#6ab7ff' },
    { label: 'Tài xế', value: stats.drivers, color: '#27ae60' },
    { label: 'Nhân viên', value: stats.staff, color: '#f39c12' },
    { label: 'Quản trị', value: stats.admins, color: '#e74c3c' },
    { label: 'Hoạt động', value: stats.active, color: '#19c37d' }
  ];

  return (
    <div style={{ 
      display: 'grid', 
      gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', 
      gap: '15px', 
      marginBottom: '30px' 
    }}>
      {statCards.map((stat, index) => (
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
