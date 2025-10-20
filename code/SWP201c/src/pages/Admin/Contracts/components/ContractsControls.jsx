// Admin/Contracts/components/ContractsControls.jsx
// Search bar and filter controls

import React from 'react';
import { getStatusOptions, getTypeOptions } from '../utils';

export const ContractsControls = ({
  searchTerm,
  onSearchChange,
  selectedStatus,
  onStatusChange,
  selectedType,
  onTypeChange
}) => {
  const statusOptions = getStatusOptions();
  const typeOptions = getTypeOptions();

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
        placeholder="Tìm kiếm theo mã hợp đồng, tên khách hàng..."
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

      {/* Type Filter */}
      <select
        value={selectedType}
        onChange={(e) => onTypeChange(e.target.value)}
        style={{
          padding: '12px 16px',
          border: '2px solid rgba(255, 255, 255, 0.2)',
          borderRadius: '8px',
          background: 'rgba(255, 255, 255, 0.1)',
          color: '#FFFFFF',
          fontSize: '14px'
        }}
      >
        {typeOptions.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
};
