// Admin/Users/components/UsersSubTabs.jsx
// Sub-tabs for switching between user types

import React from 'react';

export const UsersSubTabs = ({ activeTab, onTabChange, stats }) => {
  const tabs = [
    { id: 'users', label: 'Người dùng', icon: '🚗', count: stats.drivers, color: '#19c37d' },
    { id: 'staff', label: 'Nhân viên', icon: '👨‍💼', count: stats.staff, color: '#ffa500' },
    { id: 'admin', label: 'Quản trị', icon: '👨‍💻', count: stats.admins, color: '#e74c3c' }
  ];

  return (
    <div style={{
      background: 'rgba(26, 32, 44, 0.8)',
      borderRadius: '12px',
      border: '1px solid rgba(255, 255, 255, 0.1)',
      marginBottom: '20px',
      overflow: 'hidden'
    }}>
      <div style={{ 
        display: 'flex',
        borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
      }}>
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            style={{
              flex: 1,
              padding: '15px 20px',
              background: activeTab === tab.id 
                ? `rgba(${parseInt(tab.color.slice(1, 3), 16)}, ${parseInt(tab.color.slice(3, 5), 16)}, ${parseInt(tab.color.slice(5, 7), 16)}, 0.2)` 
                : 'transparent',
              color: activeTab === tab.id ? tab.color : '#E0E0E0',
              border: 'none',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '500',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              borderBottom: activeTab === tab.id 
                ? `2px solid ${tab.color}` 
                : '2px solid transparent',
              transition: 'all 0.3s ease'
            }}
          >
            <span>{tab.icon}</span> {tab.label} ({tab.count})
          </button>
        ))}
      </div>
    </div>
  );
};
