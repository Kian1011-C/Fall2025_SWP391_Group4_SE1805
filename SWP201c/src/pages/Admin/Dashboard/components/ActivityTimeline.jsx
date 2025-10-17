// Admin/Dashboard/components/ActivityTimeline.jsx
// Recent activity timeline

import React from 'react';

export const ActivityTimeline = ({ activities }) => {
  return (
    <div style={{
      background: 'rgba(26, 32, 44, 0.8)',
      borderRadius: '20px',
      padding: '30px',
      border: '1px solid rgba(255, 255, 255, 0.1)',
      backdropFilter: 'blur(10px)'
    }}>
      <h3 style={{ 
        color: '#FFFFFF', 
        marginBottom: '25px', 
        display: 'flex', 
        alignItems: 'center', 
        gap: '10px',
        fontSize: '1.3rem'
      }}>
        🕒 Hoạt động gần đây
      </h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        {activities.map((activity, index) => (
          <div key={index} style={{
            display: 'flex',
            alignItems: 'center',
            gap: '15px',
            padding: '15px',
            borderRadius: '12px',
            background: 'rgba(255, 255, 255, 0.05)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            transition: 'all 0.3s ease'
          }}>
            <div style={{
              fontSize: '1.5rem',
              padding: '10px',
              borderRadius: '10px',
              background: `${activity.color}20`,
              border: `1px solid ${activity.color}40`
            }}>
              {activity.icon}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ color: '#FFFFFF', fontSize: '0.95rem', marginBottom: '2px' }}>
                {activity.text}
              </div>
              <div style={{ color: '#B0B0B0', fontSize: '0.8rem' }}>
                {activity.time}
              </div>
            </div>
            <div style={{
              width: '4px',
              height: '30px',
              background: activity.color,
              borderRadius: '2px'
            }} />
          </div>
        ))}
      </div>
    </div>
  );
};
