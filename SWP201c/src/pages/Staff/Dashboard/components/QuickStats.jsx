import React from 'react';

const QuickStats = ({ title, stats }) => {
  return (
    <div 
      style={{ 
        background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)', 
        padding: '25px', 
        borderRadius: '16px',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
      }}
    >
      <h3 style={{ 
        margin: '0 0 20px 0', 
        color: 'white', 
        fontSize: '18px',
        fontWeight: '600'
      }}>
        {title}
      </h3>
      <div style={{ display: 'grid', gap: '15px' }}>
        {stats.map((stat, index) => (
          <div 
            key={index}
            style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              padding: '12px',
              background: '#0f172a',
              borderRadius: '8px',
              borderLeft: `3px solid ${stat.color || '#3b82f6'}`
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              {stat.icon && <span style={{ fontSize: '20px' }}>{stat.icon}</span>}
              <span style={{ color: '#cbd5e1', fontSize: '14px' }}>{stat.label}</span>
            </div>
            <span style={{ 
              color: 'white', 
              fontWeight: 'bold',
              fontSize: '16px' 
            }}>
              {stat.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default QuickStats;
