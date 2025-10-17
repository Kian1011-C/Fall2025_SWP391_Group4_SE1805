// Admin/Stations/components/StationsStats.jsx
// Statistics cards for stations overview

import React from 'react';
import { calculateStationsStats } from '../utils';

export const StationsStats = ({ stations }) => {
  const stats = calculateStationsStats(stations);

  const statsCards = [
    {
      title: 'Tổng số trạm',
      value: stats.totalStations,
      icon: '🏢',
      color: '#6ab7ff',
      gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
    },
    {
      title: 'Trạm hoạt động',
      value: stats.activeStations,
      icon: '✅',
      color: '#10B981',
      gradient: 'linear-gradient(135deg, #10B981 0%, #059669 100%)'
    },
    {
      title: 'Tổng slots',
      value: stats.totalSlots,
      icon: '🔋',
      color: '#F59E0B',
      gradient: 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)'
    },
    {
      title: 'Tỷ lệ sử dụng TB',
      value: `${stats.avgUtilization}%`,
      icon: '📊',
      color: '#EF4444',
      gradient: 'linear-gradient(135deg, #EF4444 0%, #DC2626 100%)'
    }
  ];

  return (
    <div style={{ 
      display: 'grid', 
      gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
      gap: '20px',
      marginBottom: '30px'
    }}>
      {statsCards.map((stat, index) => (
        <div key={index} style={{
          background: stat.gradient,
          borderRadius: '16px',
          padding: '25px',
          color: 'white',
          boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)'
        }}>
          <div style={{ fontSize: '2rem', marginBottom: '10px' }}>{stat.icon}</div>
          <div style={{ fontSize: '0.9rem', opacity: 0.9, marginBottom: '8px' }}>
            {stat.title}
          </div>
          <div style={{ fontSize: '2rem', fontWeight: '700' }}>
            {stat.value}
          </div>
        </div>
      ))}
    </div>
  );
};
