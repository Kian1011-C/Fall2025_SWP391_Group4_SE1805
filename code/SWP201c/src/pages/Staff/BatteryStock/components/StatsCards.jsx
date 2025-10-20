import React from 'react';

const StatsCards = ({ stats }) => {
  const items = [
    { label: 'Tổng số pin', value: stats.total, color: '#6ab7ff' },
    { label: 'Sẵn sàng', value: stats.available, color: '#19c37d' },
    { label: 'Đang dùng', value: stats.inUse, color: '#6ab7ff' },
    { label: 'Đang sạc', value: stats.charging, color: '#ffa500' },
    { label: 'Bảo trì', value: stats.maintenance, color: '#ff4757' },
  ];
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '30px' }}>
      {items.map((stat, idx) => (
        <div key={idx} style={{ background: 'rgba(26, 32, 44, 0.8)', borderRadius: '12px', padding: '20px', textAlign: 'center', border: '1px solid rgba(255, 255, 255, 0.1)' }}>
          <div style={{ fontSize: '2rem', fontWeight: 'bold', color: stat.color }}>{stat.value}</div>
          <div style={{ fontSize: '0.9rem', color: '#E0E0E0', marginTop: '5px' }}>{stat.label}</div>
        </div>
      ))}
    </div>
  );
};

export default StatsCards;


