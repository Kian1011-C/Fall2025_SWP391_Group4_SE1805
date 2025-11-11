import React from 'react';

const StatsCards = ({ stats }) => {
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
  };

  const formatNumber = (value) => {
    return new Intl.NumberFormat('vi-VN').format(value);
  };

  const statCards = [
    { title: 'Lượt đổi pin', value: formatNumber(stats?.totalSwaps || 0), icon: '', trend: formatNumber(stats?.totalSwaps || 0) + ' lượt', bgColor: '#FF9800', textColor: '#fff' },
    { title: 'Doanh thu tháng', value: formatCurrency(stats?.monthlyRevenue || 0), icon: '', trend: formatCurrency(stats?.revenue || 0), bgColor: '#2196F3', textColor: '#fff' },
    { title: 'Giao dịch', value: formatNumber(stats?.totalTransactions || 0), icon: '', trend: formatNumber(stats?.totalTransactions || 0) + ' giao dịch', bgColor: '#8BC34A', textColor: '#fff' },
    { title: 'Tổng doanh thu', value: formatCurrency(stats?.revenue || 0), icon: '', trend: formatCurrency(stats?.monthlyRevenue || 0), bgColor: '#4CAF50', textColor: '#fff' },
    { title: 'Tài khoản', value: formatNumber(stats?.totalUsers || 0), icon: '', trend: formatNumber(stats?.totalUsers || 0) + ' người', bgColor: '#9C27B0', textColor: '#fff' },
    { title: 'Trạm sạc', value: formatNumber(stats?.totalStations || 0), icon: '', trend: formatNumber(stats?.totalStations || 0) + ' trạm', bgColor: '#009688', textColor: '#fff' },
    { title: 'Pin', value: formatNumber(stats?.totalBatteries || 0), icon: '', trend: formatNumber(stats?.activeBatteries || 0) + ' khả dụng', bgColor: '#E91E63', textColor: '#fff' },
    { title: 'Tài khoản hoạt động', value: formatNumber(stats?.activeUsers || 0), icon: '', trend: formatNumber(stats?.activeUsers || 0) + '/' + formatNumber(stats?.totalUsers || 0), bgColor: '#00BCD4', textColor: '#fff' }
  ];

  return (
    <div className="stats-cards-grid">
      {statCards.map((card, index) => (
        <div key={index} className="stat-card" style={{ backgroundColor: card.bgColor, color: card.textColor, boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
          <div className="stat-icon" style={{ fontSize: '2.5rem' }}>{card.icon}</div>
          <div className="stat-content">
            <h3 style={{ color: card.textColor, fontWeight: '600' }}>{card.title}</h3>
            <p className="stat-value" style={{ color: card.textColor, fontSize: '1.8rem', fontWeight: 'bold' }}>{card.value}</p>
            <span style={{ color: card.textColor, opacity: 0.9, fontSize: '0.9rem' }}> {card.trend}</span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default StatsCards;
