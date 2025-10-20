// Admin/Dashboard/components/StatsCards.jsx
// Main statistics cards (Users, Batteries, Revenue)

import React from 'react';
import { formatNumber, formatCurrency } from '../utils';

export const StatsCards = ({ stats }) => {
  const cards = [
    {
      title: 'Người dùng',
      subtitle: 'Quản lý tài khoản',
      icon: '👥',
      value: formatNumber(stats.totalUsers),
      subValue: `${formatNumber(stats.activeUsers)} hoạt động`,
      color: '#19c37d',
      gradient: 'linear-gradient(135deg, rgba(25, 195, 125, 0.1), rgba(25, 195, 125, 0.05))'
    },
    {
      title: 'Kho pin',
      subtitle: 'Quản lý pin EV',
      icon: '🔋',
      value: formatNumber(stats.totalBatteries),
      subValue: `${formatNumber(stats.activeBatteries)} sẵn sàng`,
      color: '#6ab7ff',
      gradient: 'linear-gradient(135deg, rgba(106, 183, 255, 0.1), rgba(106, 183, 255, 0.05))'
    },
    {
      title: 'Doanh thu',
      subtitle: 'Tháng này',
      icon: '💰',
      value: formatCurrency(stats.monthlyRevenue),
      subValue: `${formatNumber(stats.totalTransactions)} giao dịch`,
      color: '#ffa500',
      gradient: 'linear-gradient(135deg, rgba(255, 165, 0, 0.1), rgba(255, 165, 0, 0.05))'
    }
  ];

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
      gap: '25px',
      marginBottom: '30px'
    }}>
      {cards.map((card, index) => (
        <div key={index} style={{
          background: card.gradient,
          borderRadius: '20px',
          padding: '30px',
          border: `1px solid ${card.color}33`,
          backdropFilter: 'blur(10px)',
          position: 'relative',
          overflow: 'hidden'
        }}>
          <div style={{
            position: 'absolute',
            top: '-20px',
            right: '-20px',
            width: '100px',
            height: '100px',
            background: `${card.color}33`,
            borderRadius: '50%',
            filter: 'blur(20px)'
          }} />
          <div style={{ position: 'relative', zIndex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '20px' }}>
              <div style={{
                padding: '15px',
                borderRadius: '15px',
                background: card.color,
                fontSize: '2rem',
                boxShadow: `0 10px 30px ${card.color}4d`
              }}>
                {card.icon}
              </div>
              <div>
                <h3 style={{ margin: 0, color: '#FFFFFF', fontSize: '1.3rem' }}>
                  {card.title}
                </h3>
                <p style={{ margin: 0, color: '#B0B0B0', fontSize: '0.9rem' }}>
                  {card.subtitle}
                </p>
              </div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ fontSize: '2.5rem', fontWeight: '700', color: card.color }}>
                  {card.value}
                </div>
                <div style={{ fontSize: '0.9rem', color: card.color }}>
                  {card.subValue}
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
