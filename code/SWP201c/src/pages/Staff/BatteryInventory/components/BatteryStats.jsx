// Staff/BatteryInventory/components/BatteryStats.jsx
import React from 'react';
import { getStatusStats, getStatusColor } from '../utils';

const BatteryStats = ({ batteries }) => {
  const stats = getStatusStats(batteries);

  return (
    <div style={{ 
      display: 'grid', 
      gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', 
      gap: '15px',
      marginBottom: '20px'
    }}>
      {Object.entries(stats).map(([status, count]) => (
        <div 
          key={status}
          style={{
            background: 'rgba(26, 32, 44, 0.8)',
            borderRadius: '12px',
            padding: '15px',
            textAlign: 'center',
            border: `1px solid ${getStatusColor(status)}40`
          }}
        >
          <div style={{ 
            fontSize: '24px', 
            fontWeight: 'bold', 
            color: getStatusColor(status) 
          }}>
            {count}
          </div>
          <div style={{ fontSize: '12px', color: '#E0E0E0', marginTop: '5px' }}>
            {status}
          </div>
        </div>
      ))}
    </div>
  );
};

export default BatteryStats;
