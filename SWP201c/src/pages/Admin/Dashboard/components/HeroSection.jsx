// Admin/Dashboard/components/HeroSection.jsx
// Hero section with welcome message and current time

import React from 'react';
import { formatNumber, formatCurrency } from '../utils';

export const HeroSection = ({ currentTime, stats }) => {
  return (
    <div style={{
      background: 'linear-gradient(135deg, rgba(25, 195, 125, 0.1), rgba(106, 183, 255, 0.1))',
      borderRadius: '20px',
      padding: '40px',
      marginBottom: '30px',
      border: '1px solid rgba(255, 255, 255, 0.1)',
      backdropFilter: 'blur(20px)',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Background Pattern */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundImage: `
          radial-gradient(circle at 20% 80%, rgba(25, 195, 125, 0.1) 0%, transparent 50%),
          radial-gradient(circle at 80% 20%, rgba(106, 183, 255, 0.1) 0%, transparent 50%),
          radial-gradient(circle at 40% 40%, rgba(255, 165, 0, 0.05) 0%, transparent 50%)
        `,
        zIndex: 0
      }} />
      
      <div style={{ position: 'relative', zIndex: 1 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <div>
            <h1 style={{ 
              margin: 0, 
              color: '#FFFFFF', 
              fontSize: '2.5rem', 
              fontWeight: '700',
              background: 'linear-gradient(135deg, #19c37d, #6ab7ff)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}>
              ⚙️ Dashboard Quản trị
            </h1>
            <p style={{ 
              margin: '10px 0 0 0', 
              color: '#B0B0B0', 
              fontSize: '1.1rem',
              fontWeight: '400'
            }}>
              Chào mừng bạn đến với hệ thống quản lý pin EV
            </p>
          </div>
          <div style={{
            background: 'rgba(255, 255, 255, 0.1)',
            borderRadius: '15px',
            padding: '15px 25px',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            textAlign: 'center'
          }}>
            <div style={{ color: '#19c37d', fontSize: '1.1rem', fontWeight: '600' }}>
              {currentTime.toLocaleDateString('vi-VN')}
            </div>
            <div style={{ color: '#6ab7ff', fontSize: '1.4rem', fontWeight: '700' }}>
              {currentTime.toLocaleTimeString('vi-VN')}
            </div>
          </div>
        </div>
        
        {/* Quick Stats Overview */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
          gap: '15px',
          marginTop: '20px'
        }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ color: '#19c37d', fontSize: '1.8rem', fontWeight: '700' }}>
              {formatNumber(stats.totalUsers)}
            </div>
            <div style={{ color: '#E0E0E0', fontSize: '0.9rem' }}>Người dùng</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ color: '#6ab7ff', fontSize: '1.8rem', fontWeight: '700' }}>
              {formatNumber(stats.totalBatteries)}
            </div>
            <div style={{ color: '#E0E0E0', fontSize: '0.9rem' }}>Pin</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ color: '#ffa500', fontSize: '1.8rem', fontWeight: '700' }}>
              {stats.totalStations}
            </div>
            <div style={{ color: '#E0E0E0', fontSize: '0.9rem' }}>Trạm</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ color: '#ff6b6b', fontSize: '1.8rem', fontWeight: '700' }}>
              {formatNumber(stats.totalTransactions)}
            </div>
            <div style={{ color: '#E0E0E0', fontSize: '0.9rem' }}>Giao dịch</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ color: '#4ecdc4', fontSize: '1.8rem', fontWeight: '700' }}>
              {formatCurrency(stats.monthlyRevenue)}
            </div>
            <div style={{ color: '#E0E0E0', fontSize: '0.9rem' }}>Doanh thu</div>
          </div>
        </div>
      </div>
    </div>
  );
};
