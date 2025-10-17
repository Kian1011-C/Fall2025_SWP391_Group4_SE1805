// Admin/Reports/components/ReportsHeader.jsx
// Header section for reports page

import React from 'react';
import { getDateRangeOptions } from '../utils';

export const ReportsHeader = ({ dateRange, onDateRangeChange, onExport }) => {
  const dateRangeOptions = getDateRangeOptions();

  return (
    <div style={{
      background: 'linear-gradient(135deg, rgba(106, 183, 255, 0.1), rgba(106, 183, 255, 0.05))',
      borderRadius: '20px',
      padding: '30px',
      marginBottom: '30px',
      border: '1px solid rgba(106, 183, 255, 0.2)',
      backdropFilter: 'blur(20px)'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ 
            margin: 0, 
            color: '#FFFFFF', 
            fontSize: '2.2rem', 
            fontWeight: '700',
            display: 'flex',
            alignItems: 'center',
            gap: '15px'
          }}>
            📊 Báo cáo & Phân tích
          </h1>
          <p style={{ 
            margin: '10px 0 0 0', 
            color: '#B0B0B0', 
            fontSize: '1rem'
          }}>
            Báo cáo tổng quan và phân tích dữ liệu hệ thống
          </p>
        </div>
        
        <div style={{ display: 'flex', gap: '10px' }}>
          <select
            value={dateRange}
            onChange={(e) => onDateRangeChange(e.target.value)}
            style={{
              padding: '12px 16px',
              background: 'rgba(26, 32, 44, 0.8)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              borderRadius: '8px',
              color: '#FFFFFF',
              fontSize: '14px'
            }}
          >
            {dateRangeOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          
          <button
            onClick={onExport}
            style={{
              padding: '12px 20px',
              background: 'linear-gradient(135deg, #6ab7ff, #4a9eff)',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: '500',
              fontSize: '14px'
            }}
          >
            📥 Xuất báo cáo
          </button>
        </div>
      </div>
    </div>
  );
};
