// Admin/Batteries/components/BatteriesGrid.jsx
// Grid layout for battery cards

import React from 'react';
import { BatteryCard } from './BatteryCard';

export const BatteriesGrid = ({ batteries, onMaintenance, onDelete }) => {
  if (!batteries || batteries.length === 0) {
    return (
      <div style={{
        textAlign: 'center',
        padding: '40px',
        color: '#B0B0B0',
        fontSize: '1.1rem'
      }}>
        Không tìm thấy pin nào
      </div>
    );
  }

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
      gap: '20px',
      marginBottom: '30px'
    }}>
      {batteries.map((battery) => (
        <BatteryCard
          key={battery.id}
          battery={battery}
          onMaintenance={onMaintenance}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
};
