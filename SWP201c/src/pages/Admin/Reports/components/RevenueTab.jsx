// Admin/Reports/components/RevenueTab.jsx
// Revenue tab with station table and daily chart

import React from 'react';
import { 
  formatCurrency, 
  formatNumber, 
  getMaxDailyRevenue,
  calculateBarHeight,
  formatChartDate,
  formatRevenueLabel,
  calculateAvgTransactionValue
} from '../utils';

export const RevenueTab = ({ data }) => {
  if (!data) return null;

  const { byStation = [], daily = [] } = data;
  const maxRevenue = getMaxDailyRevenue(daily);

  return (
    <div>
      {/* Revenue by Station Table */}
      <div style={{
        background: 'rgba(26, 32, 44, 0.8)',
        borderRadius: '16px',
        padding: '25px',
        marginBottom: '25px',
        border: '1px solid rgba(255, 255, 255, 0.1)'
      }}>
        <h3 style={{ color: '#FFFFFF', marginBottom: '20px', fontSize: '1.2rem' }}>
          💰 Doanh thu theo trạm
        </h3>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: '0 10px' }}>
            <thead>
              <tr>
                <th style={{ color: '#B0B0B0', textAlign: 'left', padding: '12px', fontSize: '0.9rem' }}>
                  Trạm
                </th>
                <th style={{ color: '#B0B0B0', textAlign: 'right', padding: '12px', fontSize: '0.9rem' }}>
                  Doanh thu
                </th>
                <th style={{ color: '#B0B0B0', textAlign: 'right', padding: '12px', fontSize: '0.9rem' }}>
                  Giao dịch
                </th>
                <th style={{ color: '#B0B0B0', textAlign: 'right', padding: '12px', fontSize: '0.9rem' }}>
                  TB/Giao dịch
                </th>
              </tr>
            </thead>
            <tbody>
              {byStation.map((station, index) => {
                const avgValue = calculateAvgTransactionValue(
                  station.revenue,
                  station.transactions
                );
                return (
                  <tr key={index} style={{
                    background: 'rgba(255, 255, 255, 0.05)',
                    transition: 'all 0.3s ease'
                  }}>
                    <td style={{ 
                      color: '#FFFFFF', 
                      padding: '15px',
                      borderTopLeftRadius: '8px',
                      borderBottomLeftRadius: '8px'
                    }}>
                      {station.name}
                    </td>
                    <td style={{ color: '#10B981', textAlign: 'right', padding: '15px', fontWeight: '600' }}>
                      {formatCurrency(station.revenue)}
                    </td>
                    <td style={{ color: '#FFFFFF', textAlign: 'right', padding: '15px' }}>
                      {formatNumber(station.transactions)}
                    </td>
                    <td style={{ 
                      color: '#6ab7ff', 
                      textAlign: 'right', 
                      padding: '15px',
                      borderTopRightRadius: '8px',
                      borderBottomRightRadius: '8px'
                    }}>
                      {formatCurrency(avgValue)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* 7-Day Revenue Chart */}
      <div style={{
        background: 'rgba(26, 32, 44, 0.8)',
        borderRadius: '16px',
        padding: '25px',
        border: '1px solid rgba(255, 255, 255, 0.1)'
      }}>
        <h3 style={{ color: '#FFFFFF', marginBottom: '20px', fontSize: '1.2rem' }}>
          📊 Doanh thu 7 ngày gần nhất
        </h3>
        <div style={{ 
          display: 'flex', 
          alignItems: 'flex-end', 
          justifyContent: 'space-between',
          gap: '10px',
          height: '300px',
          padding: '20px 0'
        }}>
          {daily.map((day, index) => {
            const height = calculateBarHeight(day.revenue, maxRevenue, 250);
            return (
              <div key={index} style={{ 
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '10px'
              }}>
                <div style={{
                  fontSize: '0.75rem',
                  color: '#6ab7ff',
                  fontWeight: '500',
                  whiteSpace: 'nowrap'
                }}>
                  {formatRevenueLabel(day.revenue)}
                </div>
                <div style={{
                  width: '100%',
                  height: `${height}px`,
                  background: 'linear-gradient(to top, #667eea, #764ba2)',
                  borderRadius: '8px 8px 0 0',
                  transition: 'all 0.3s ease',
                  position: 'relative'
                }}>
                  <div style={{
                    position: 'absolute',
                    top: '-25px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    opacity: 0,
                    transition: 'opacity 0.3s ease',
                    fontSize: '0.8rem',
                    color: '#FFFFFF',
                    background: 'rgba(0, 0, 0, 0.8)',
                    padding: '4px 8px',
                    borderRadius: '4px',
                    whiteSpace: 'nowrap'
                  }}>
                    {formatCurrency(day.revenue)}
                  </div>
                </div>
                <div style={{
                  fontSize: '0.8rem',
                  color: '#B0B0B0'
                }}>
                  {formatChartDate(day.date)}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
