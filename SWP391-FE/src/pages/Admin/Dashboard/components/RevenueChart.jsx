import React from 'react';

const RevenueChart = ({ period, stats }) => {
  // Mock data for chart - In real app, this would come from API
  const getChartData = () => {
    switch (period) {
      case 'day':
        return {
          labels: ['00:00', '04:00', '08:00', '12:00', '16:00', '20:00', '24:00'],
          data: [1200000, 2500000, 4200000, 5800000, 4500000, 6200000, 3800000]
        };
      case 'week':
        return {
          labels: ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'],
          data: [25000000, 32000000, 28000000, 35000000, 42000000, 38000000, 30000000]
        };
      case 'month':
        return {
          labels: ['Tuần 1', 'Tuần 2', 'Tuần 3', 'Tuần 4'],
          data: [85000000, 120000000, 95000000, 140000000]
        };
      case 'year':
        return {
          labels: ['T1', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'T8', 'T9', 'T10', 'T11', 'T12'],
          data: [320000000, 350000000, 380000000, 420000000, 450000000, 480000000, 520000000, 490000000, 510000000, 540000000, 560000000, 580000000]
        };
      default:
        return { labels: [], data: [] };
    }
  };

  const chartData = getChartData();
  const maxValue = Math.max(...chartData.data);
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  return (
    <div className="revenue-chart">
      <div className="chart-container">
        <div className="chart-grid">
          {chartData.labels.map((label, index) => {
            const value = chartData.data[index];
            const heightPercent = (value / maxValue) * 100;
            
            return (
              <div key={index} className="chart-bar-container">
                <div 
                  className="chart-bar" 
                  style={{ height: `${heightPercent}%` }}
                  title={formatCurrency(value)}
                >
                  <span className="chart-bar-value">{formatCurrency(value)}</span>
                </div>
                <div className="chart-label">{label}</div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="chart-summary">
        <div className="summary-item">
          <span className="summary-label">Tổng</span>
          <span className="summary-value">
            {formatCurrency(chartData.data.reduce((a, b) => a + b, 0))}
          </span>
        </div>
        <div className="summary-item">
          <span className="summary-label">Trung bình</span>
          <span className="summary-value">
            {formatCurrency(chartData.data.reduce((a, b) => a + b, 0) / chartData.data.length)}
          </span>
        </div>
        <div className="summary-item">
          <span className="summary-label">Cao nhất</span>
          <span className="summary-value">
            {formatCurrency(maxValue)}
          </span>
        </div>
      </div>
    </div>
  );
};

export default RevenueChart;
