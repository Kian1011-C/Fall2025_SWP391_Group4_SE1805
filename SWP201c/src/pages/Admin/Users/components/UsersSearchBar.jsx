// Admin/Users/components/UsersSearchBar.jsx
// Search and filter controls

import React from 'react';

export const UsersSearchBar = ({ 
  searchTerm, 
  onSearchChange, 
  selectedStatus, 
  onStatusChange,
  activeTab 
}) => {
  const getPlaceholder = () => {
    switch (activeTab) {
      case 'users':
        return 'Tìm kiếm người dùng...';
      case 'staff':
        return 'Tìm kiếm nhân viên...';
      case 'admin':
        return 'Tìm kiếm quản trị viên...';
      default:
        return 'Tìm kiếm...';
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
      gap: '20px',
      alignItems: 'center',
      flexWrap: 'wrap'
    }}>
      <input
        type="text"
        placeholder={getPlaceholder()}
        value={searchTerm}
        onChange={(e) => onSearchChange(e.target.value)}
        style={{
          flex: 1,
          minWidth: '300px',
          padding: '12px 16px',
          border: '2px solid rgba(255, 255, 255, 0.2)',
          borderRadius: '8px',
          background: 'rgba(255, 255, 255, 0.1)',
          color: '#FFFFFF',
          fontSize: '14px'
        }}
      />

      <select
        value={selectedStatus}
        onChange={(e) => onStatusChange(e.target.value)}
        style={{
          padding: '12px 16px',
          border: '2px solid rgba(255, 255, 255, 0.2)',
          borderRadius: '8px',
          background: 'rgba(255, 255, 255, 0.1)',
          color: '#FFFFFF',
          fontSize: '14px',
          cursor: 'pointer'
        }}
      >
        <option value="all">Tất cả trạng thái</option>
        <option value="active">Hoạt động</option>
        <option value="inactive">Không hoạt động</option>
      </select>
    </div>
  );
};
