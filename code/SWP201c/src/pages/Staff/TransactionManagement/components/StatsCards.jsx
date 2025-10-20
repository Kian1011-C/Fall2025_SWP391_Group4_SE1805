import React from 'react';

const StatsCards = ({ stats, formatCurrency }) => {
  const Card = ({ color, value, label }) => (
    <div style={{ padding: '20px', borderRadius: '8px', background: '#fff', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
      <div style={{ fontSize: '24px', fontWeight: 'bold', color }}>{value}</div>
      <div style={{ fontSize: '14px', color: '#6b7280', marginTop: '5px' }}>{label}</div>
    </div>
  );

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '30px' }}>
      <Card color="#4f46e5" value={stats.total} label="Tổng giao dịch" />
      <Card color="#19c37d" value={stats.completed} label="Hoàn thành" />
      <Card color="#6ab7ff" value={stats.processing} label="Đang xử lý" />
      <Card color="#ff4757" value={stats.failed} label="Thất bại" />
      <Card color="#19c37d" value={formatCurrency(stats.totalRevenue)} label="Tổng doanh thu" />
    </div>
  );
};

export default StatsCards;


