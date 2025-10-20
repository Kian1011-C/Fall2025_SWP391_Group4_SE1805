// Staff/Dashboard/components/RecentActivity.jsx
import React from 'react';
import ActivityItem from './ActivityItem';

const RecentActivity = ({ activities }) => {
  return (
    <div style={{ 
      marginTop: '40px',
      background: 'rgba(26, 32, 44, 0.8)',
      borderRadius: '12px',
      padding: '25px',
      boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
      border: '1px solid rgba(255, 255, 255, 0.1)',
      backdropFilter: 'blur(10px)'
    }}>
      <h3 style={{ margin: '0 0 20px 0', color: '#FFFFFF' }}>
        Hoạt động gần đây
      </h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {activities.map(activity => (
          <ActivityItem key={activity.id} activity={activity} />
        ))}
      </div>
    </div>
  );
};

export default RecentActivity;
