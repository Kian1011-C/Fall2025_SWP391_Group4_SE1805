// Admin/Contracts/components/ContractsStatsCards.jsx
// Statistics cards for contracts overview

import React from 'react';
import { formatCurrency } from '../utils';

export const ContractsStatsCards = ({ stats }) => {
  const statsData = [
    { label: 'Tổng hợp đồng', value: stats.total, color: '#6ab7ff', isRevenue: false },
    { label: 'Đang hoạt động', value: stats.active, color: '#27ae60', isRevenue: false },
    { label: 'Chờ xử lý', value: stats.pending, color: '#f39c12', isRevenue: false },
    { label: 'Hết hạn', value: stats.expired, color: '#e74c3c', isRevenue: false },
    { label: 'Doanh thu', value: formatCurrency(stats.totalRevenue), color: '#19c37d', isRevenue: true }
  ];

  return (
    <div style={{ 
      display: 'grid', 
      gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', 
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
            fontSize: stat.isRevenue ? '18px' : '24px', 
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
