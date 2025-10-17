// Admin/Stations/components/StationsGrid.jsx
// Grid layout for displaying station cards

import React from 'react';
import { StationCard } from './StationCard';

export const StationsGrid = ({ stations, onEdit, onDelete }) => {
  if (!stations || stations.length === 0) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '300px',
        background: 'rgba(26, 32, 44, 0.8)',
        borderRadius: '12px',
        border: '1px solid rgba(255, 255, 255, 0.1)'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '4rem', marginBottom: '15px' }}>🏢</div>
          <h3 style={{ color: '#FFFFFF', marginBottom: '10px' }}>
            Chưa có trạm nào
          </h3>
          <p style={{ color: '#B0B0B0' }}>
            Nhấn "Thêm trạm mới" để tạo trạm đầu tiên
          </p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ 
      display: 'grid', 
      gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', 
      gap: '20px'
    }}>
      {stations.map((station) => (
        <StationCard
          key={station.id}
          station={station}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
};
