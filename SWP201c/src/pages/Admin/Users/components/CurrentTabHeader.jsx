// Admin/Users/components/CurrentTabHeader.jsx
// Header for current active tab with add button

import React from 'react';
import { getTabInfo } from '../utils';

export const CurrentTabHeader = ({ 
  activeTab, 
  filteredCount, 
  onAddClick 
}) => {
  const tabInfo = getTabInfo(activeTab);

  const getAddLabel = () => {
    switch (activeTab) {
      case 'users':
        return 'Thêm người dùng';
      case 'staff':
        return 'Thêm nhân viên';
      case 'admin':
        return 'Thêm quản trị viên';
      default:
        return 'Thêm mới';
    }
  };

  return (
    <div style={{
      background: 'rgba(26, 32, 44, 0.8)',
      borderRadius: '12px',
      padding: '20px',
      marginBottom: '20px',
      border: '1px solid rgba(255, 255, 255, 0.1)',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
        <div style={{
          padding: '12px',
          borderRadius: '10px',
          background: `${tabInfo.color}20`,
          fontSize: '1.5rem'
        }}>
          {tabInfo.icon}
        </div>
        <div>
          <h2 style={{ 
            margin: 0, 
            color: '#FFFFFF', 
            fontSize: '1.3rem' 
          }}>
            {tabInfo.title}
          </h2>
          <p style={{ 
            margin: 0, 
            color: '#B0B0B0', 
            fontSize: '0.9rem' 
          }}>
            {filteredCount} người dùng được tìm thấy
          </p>
        </div>
      </div>
      <button
        onClick={onAddClick}
        style={{
          padding: '12px 24px',
          background: `linear-gradient(135deg, ${tabInfo.color}, ${tabInfo.color}dd)`,
          color: 'white',
          border: 'none',
          borderRadius: '8px',
          cursor: 'pointer',
          fontWeight: '500',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}
      >
        <span>+</span> {getAddLabel()}
      </button>
    </div>
  );
};
