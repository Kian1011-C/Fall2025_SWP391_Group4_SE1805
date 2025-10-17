// Driver/Profile/components/ProfileStats.jsx
// Profile statistics and completion card

import React from 'react';
import { getProfileStats, getProfileCompletion } from '../utils';

export const ProfileStats = ({ user }) => {
  const stats = getProfileStats(user);
  const completion = getProfileCompletion(user);

  return (
    <div style={{
      background: 'rgba(26, 32, 44, 0.8)',
      borderRadius: '16px',
      padding: '25px',
      border: '1px solid rgba(255, 255, 255, 0.1)',
      marginTop: '25px'
    }}>
      <h3 style={{ 
        color: '#FFFFFF', 
        margin: '0 0 20px 0',
        fontSize: '1.2rem'
      }}>
        📊 Thống kê tài khoản
      </h3>

      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
        gap: '20px',
        marginBottom: '25px'
      }}>
        {/* Member Since */}
        <div>
          <div style={{ 
            color: '#B0B0B0', 
            fontSize: '0.85rem',
            marginBottom: '5px'
          }}>
            Thành viên từ
          </div>
          <div style={{ 
            color: '#19c37d', 
            fontSize: '1.1rem',
            fontWeight: '600'
          }}>
            {stats.memberSince}
          </div>
        </div>

        {/* Days Since Join */}
        <div>
          <div style={{ 
            color: '#B0B0B0', 
            fontSize: '0.85rem',
            marginBottom: '5px'
          }}>
            Số ngày hoạt động
          </div>
          <div style={{ 
            color: '#6ab7ff', 
            fontSize: '1.1rem',
            fontWeight: '600'
          }}>
            {stats.daysSinceJoin} ngày
          </div>
        </div>

        {/* Total Vehicles */}
        <div>
          <div style={{ 
            color: '#B0B0B0', 
            fontSize: '0.85rem',
            marginBottom: '5px'
          }}>
            Phương tiện
          </div>
          <div style={{ 
            color: '#F59E0B', 
            fontSize: '1.1rem',
            fontWeight: '600'
          }}>
            {stats.totalVehicles} xe
          </div>
        </div>

        {/* Active Contracts */}
        <div>
          <div style={{ 
            color: '#B0B0B0', 
            fontSize: '0.85rem',
            marginBottom: '5px'
          }}>
            Hợp đồng đang hoạt động
          </div>
          <div style={{ 
            color: '#8B5CF6', 
            fontSize: '1.1rem',
            fontWeight: '600'
          }}>
            {stats.activeContracts}
          </div>
        </div>
      </div>

      {/* Profile Completion */}
      <div>
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between',
          marginBottom: '10px'
        }}>
          <span style={{ color: '#B0B0B0', fontSize: '0.9rem' }}>
            Hoàn thiện hồ sơ
          </span>
          <span style={{ 
            color: completion === 100 ? '#19c37d' : '#F59E0B',
            fontWeight: '600'
          }}>
            {completion}%
          </span>
        </div>
        <div style={{
          width: '100%',
          height: '8px',
          background: 'rgba(255, 255, 255, 0.1)',
          borderRadius: '4px',
          overflow: 'hidden'
        }}>
          <div style={{
            width: `${completion}%`,
            height: '100%',
            background: completion === 100 
              ? 'linear-gradient(90deg, #19c37d, #15a36a)'
              : 'linear-gradient(90deg, #F59E0B, #D97706)',
            borderRadius: '4px',
            transition: 'width 0.5s ease'
          }} />
        </div>
      </div>
    </div>
  );
};
