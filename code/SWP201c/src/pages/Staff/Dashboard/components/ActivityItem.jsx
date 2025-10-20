// Staff/Dashboard/components/ActivityItem.jsx
import React from 'react';

const ActivityItem = ({ activity }) => {
  return (
    <div style={{ 
      display: 'flex', 
      alignItems: 'center', 
      padding: '10px',
      background: 'rgba(255, 255, 255, 0.05)',
      borderRadius: '8px',
      border: '1px solid rgba(255, 255, 255, 0.1)'
    }}>
      <span style={{ marginRight: '10px' }}>{activity.icon}</span>
      <span style={{ flex: 1, color: '#E0E0E0' }}>{activity.message}</span>
      <span style={{ color: '#B0B0B0', fontSize: '12px' }}>{activity.time}</span>
    </div>
  );
};

export default ActivityItem;
