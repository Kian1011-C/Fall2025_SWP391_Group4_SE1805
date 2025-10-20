// Staff/BatteryInventory/components/BatteryFilters.jsx
import React from 'react';
import { getStatusOptions } from '../utils';

const BatteryFilters = ({ 
  filterStatus, 
  setFilterStatus, 
  filterStation, 
  setFilterStation,
  stations 
}) => {
  const statusOptions = getStatusOptions();

  return (
    <div style={{ 
      display: 'flex', 
      gap: '15px', 
      marginBottom: '20px',
      flexWrap: 'wrap'
    }}>
      <div>
        <label style={{ color: '#E0E0E0', marginRight: '10px' }}>Trạng thái:</label>
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          style={{
            padding: '8px 15px',
            borderRadius: '8px',
            background: 'rgba(26, 32, 44, 0.8)',
            color: '#FFFFFF',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            cursor: 'pointer'
          }}
        >
          <option value="Tất cả">Tất cả</option>
          {statusOptions.map(status => (
            <option key={status} value={status}>{status}</option>
          ))}
        </select>
      </div>

      <div>
        <label style={{ color: '#E0E0E0', marginRight: '10px' }}>Trạm:</label>
        <select
          value={filterStation}
          onChange={(e) => setFilterStation(e.target.value)}
          style={{
            padding: '8px 15px',
            borderRadius: '8px',
            background: 'rgba(26, 32, 44, 0.8)',
            color: '#FFFFFF',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            cursor: 'pointer'
          }}
        >
          <option value="Tất cả">Tất cả trạm</option>
          {stations.map(station => (
            <option key={station} value={station}>{station}</option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default BatteryFilters;
