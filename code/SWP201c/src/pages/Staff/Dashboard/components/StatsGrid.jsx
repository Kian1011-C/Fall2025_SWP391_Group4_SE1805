// Staff/Dashboard/components/StatsGrid.jsx
import React from 'react';
import StatCard from './StatCard';

const StatsGrid = ({ statCards, loading }) => {
  return (
    <div className="quick-stats" style={{ 
      display: 'grid', 
      gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
      gap: '20px', 
      marginBottom: '30px' 
    }}>
      {statCards.map(card => (
        <StatCard
          key={card.id}
          label={card.label}
          value={card.value}
          color={card.color}
          loading={loading}
        />
      ))}
    </div>
  );
};

export default StatsGrid;
