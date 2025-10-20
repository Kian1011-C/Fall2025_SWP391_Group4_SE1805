// Admin/Batteries/components/BatteriesControls.jsx
// Search bar, filter and add button controls

import React from 'react';
import { getStatusOptions } from '../utils';

export const BatteriesControls = ({
  searchTerm,
  onSearchChange,
  selectedStatus,
  onStatusChange,
  onAddClick
}) => {
  const statusOptions = getStatusOptions();

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
      {/* Search Input */}
      <input
        type="text"
        placeholder="Tìm kiếm theo mã pin, số seri hoặc trạm..."
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

      {/* Status Filter */}
      <select
        value={selectedStatus}
        onChange={(e) => onStatusChange(e.target.value)}
        style={{
          padding: '12px 16px',
          border: '2px solid rgba(255, 255, 255, 0.2)',
          borderRadius: '8px',
          background: 'rgba(255, 255, 255, 0.1)',
          color: '#FFFFFF',
          fontSize: '14px'
        }}
      >
        {statusOptions.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>

      {/* Add Battery Button */}
      <button
        onClick={onAddClick}
        style={{
          padding: '12px 24px',
          background: 'linear-gradient(135deg, #27ae60, #2ecc71)',
          color: 'white',
          border: 'none',
          borderRadius: '8px',
          cursor: 'pointer',
          fontSize: '14px',
          fontWeight: '500'
        }}
      >
        ➕ Thêm pin
      </button>
    </div>
  );
};
