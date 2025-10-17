// Stats Cards Component
import React from 'react';

const StatsCards = ({ stats, formatCurrency }) => {
  const statsConfig = [
    {
      icon: '🔋',
      value: stats.totalSwaps,
      label: 'Tổng lượt đổi pin',
      color: 'rgba(25, 195, 125, 0.3)',
      valueColor: '#19c37d',
      fontSize: '2rem'
    },
    {
      icon: '💎',
      value: stats.currentPlans.length > 0 ? stats.currentPlans.join(', ') : 'Chưa có gói',
      label: stats.currentPlans.length > 1 ? 'Các gói hiện tại' : 'Gói hiện tại',
      color: 'rgba(106, 183, 255, 0.3)',
      valueColor: '#6ab7ff',
      fontSize: '1.1rem'
    },
    {
      icon: '🚗',
      value: stats.activeVehicles,
      label: 'Xe đang sử dụng',
      color: 'rgba(255, 165, 0, 0.3)',
      valueColor: '#ffa500',
      fontSize: '2rem'
    },
    {
      icon: '💰',
      value: formatCurrency(stats.monthlySpent),
      label: 'Chi phí tháng này',
      color: 'rgba(156, 136, 255, 0.3)',
      valueColor: '#9c88ff',
      fontSize: '1.3rem'
    },
    {
      icon: '📏',
      value: `${stats.totalDistance.toLocaleString()} km`,
      label: 'Tổng quãng đường',
      color: 'rgba(34, 197, 94, 0.3)',
      valueColor: '#22c55e',
      fontSize: '1.3rem'
    }
  ];

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
      gap: '20px',
      marginBottom: '30px'
    }}>
      {statsConfig.map((stat, index) => (
        <div
          key={index}
          style={{
            background: 'rgba(26, 32, 44, 0.8)',
            borderRadius: '15px',
            padding: '25px',
            border: `1px solid ${stat.color}`
          }}
        >
          <div style={{ fontSize: '2rem', marginBottom: '10px' }}>{stat.icon}</div>
          <div style={{ 
            color: stat.valueColor, 
            fontSize: stat.fontSize, 
            fontWeight: '700', 
            marginBottom: '5px' 
          }}>
            {stat.value}
          </div>
          <div style={{ color: '#B0B0B0', fontSize: '0.9rem' }}>{stat.label}</div>
        </div>
      ))}
    </div>
  );
};

export default StatsCards;
