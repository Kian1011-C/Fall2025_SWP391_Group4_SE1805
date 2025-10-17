// Admin/Stations/components/StationsControls.jsx
// Search and filter controls for stations

import React from 'react';
import { getSortOptions } from '../utils';

export const StationsControls = ({ 
  searchQuery, 
  sortBy, 
  onSearchChange, 
  onSortChange 
}) => {
  const sortOptions = getSortOptions();

  return (
    <div style={{
      background: 'rgba(26, 32, 44, 0.8)',
      borderRadius: '12px',
      padding: '20px',
      marginBottom: '25px',
      border: '1px solid rgba(255, 255, 255, 0.1)',
      display: 'flex',
      gap: '15px',
      flexWrap: 'wrap'
    }}>
      {/* Search Input */}
      <div style={{ flex: '1 1 300px' }}>
        <input
          type="text"
          placeholder="🔍 Tìm kiếm theo tên, địa chỉ, quản lý, SĐT..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          style={{
            width: '100%',
            padding: '12px 16px',
            background: 'rgba(255, 255, 255, 0.05)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            borderRadius: '8px',
            color: '#FFFFFF',
            fontSize: '14px'
          }}
        />
      </div>

      {/* Sort Dropdown */}
      <div style={{ flex: '0 1 200px' }}>
        <select
          value={sortBy}
          onChange={(e) => onSortChange(e.target.value)}
          style={{
            width: '100%',
            padding: '12px 16px',
            background: 'rgba(255, 255, 255, 0.05)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            borderRadius: '8px',
            color: '#FFFFFF',
            fontSize: '14px'
          }}
        >
          {sortOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};
