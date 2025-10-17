// Admin/Reports/components/OverviewTab.jsx
// Overview tab with key metrics and quick insights

import React from 'react';
import { formatCurrency, formatNumber, getGrowthColor } from '../utils';

export const OverviewTab = ({ data }) => {
  if (!data) return null;

  const { keyMetrics = {}, quickInsights = {} } = data;

  const metrics = [
    {
      title: 'Tổng doanh thu',
      value: formatCurrency(keyMetrics.totalRevenue || 0),
      growth: keyMetrics.revenueGrowth || 0,
      gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      icon: '💰'
    },
    {
      title: 'Giao dịch',
      value: formatNumber(keyMetrics.totalTransactions || 0),
      growth: keyMetrics.transactionsGrowth || 0,
      gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
      icon: '📊'
    },
    {
      title: 'Người dùng hoạt động',
      value: formatNumber(keyMetrics.activeUsers || 0),
      growth: keyMetrics.usersGrowth || 0,
      gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
      icon: '👥'
    },
    {
      title: 'Trạm hoạt động',
      value: formatNumber(keyMetrics.activeStations || 0),
      growth: keyMetrics.stationsGrowth || 0,
      gradient: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
      icon: '⚡'
    }
  ];

  const insights = [
    {
      label: 'Tỷ lệ sử dụng pin',
      value: `${quickInsights.batteryUtilization || 0}%`,
      color: '#43e97b'
    },
    {
      label: 'Thời gian đổi trung bình',
      value: `${quickInsights.avgSwapTime || 0} phút`,
      color: '#4facfe'
    },
    {
      label: 'Độ hài lòng',
      value: `${quickInsights.customerSatisfaction || 0}/5 ⭐`,
      color: '#f093fb'
    },
    {
      label: 'Giờ cao điểm',
      value: quickInsights.peakHour || 'N/A',
      color: '#667eea'
    }
  ];

  return (
    <div>
      {/* Key Metrics Cards */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
        gap: '20px',
        marginBottom: '30px'
      }}>
        {metrics.map((metric, index) => (
          <div key={index} style={{
            background: metric.gradient,
            borderRadius: '16px',
            padding: '25px',
            color: 'white',
            boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)'
          }}>
            <div style={{ fontSize: '2rem', marginBottom: '10px' }}>{metric.icon}</div>
            <div style={{ fontSize: '0.9rem', opacity: 0.9, marginBottom: '8px' }}>
              {metric.title}
            </div>
            <div style={{ fontSize: '1.8rem', fontWeight: '700', marginBottom: '8px' }}>
              {metric.value}
            </div>
            <div style={{ 
              fontSize: '0.85rem',
              color: getGrowthColor(metric.growth) === '#10B981' ? '#a7f3d0' : '#fecaca'
            }}>
              {metric.growth > 0 ? '↗' : metric.growth < 0 ? '↘' : '→'} {Math.abs(metric.growth)}% so với kỳ trước
            </div>
          </div>
        ))}
      </div>

      {/* Quick Insights */}
      <div style={{
        background: 'rgba(26, 32, 44, 0.8)',
        borderRadius: '16px',
        padding: '25px',
        border: '1px solid rgba(255, 255, 255, 0.1)'
      }}>
        <h3 style={{ color: '#FFFFFF', marginBottom: '20px', fontSize: '1.2rem' }}>
          📈 Thống kê nhanh
        </h3>
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
          gap: '20px'
        }}>
          {insights.map((insight, index) => (
            <div key={index} style={{
              background: 'rgba(255, 255, 255, 0.05)',
              borderRadius: '12px',
              padding: '20px',
              border: `1px solid ${insight.color}33`
            }}>
              <div style={{ 
                color: '#B0B0B0', 
                fontSize: '0.85rem',
                marginBottom: '8px'
              }}>
                {insight.label}
              </div>
              <div style={{ 
                color: insight.color, 
                fontSize: '1.5rem',
                fontWeight: '700'
              }}>
                {insight.value}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
