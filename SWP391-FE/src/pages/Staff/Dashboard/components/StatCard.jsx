import React from 'react';

const StatCard = ({ label, value, icon, color }) => (
  <div 
    style={{ 
      background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)', 
      padding: '25px', 
      borderRadius: '16px', 
      borderLeft: `5px solid ${color}`,
      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
      transition: 'all 0.3s ease',
      cursor: 'default'
    }}
    onMouseEnter={(e) => {
      e.currentTarget.style.transform = 'translateY(-4px)';
      e.currentTarget.style.boxShadow = '0 10px 15px -3px rgba(0, 0, 0, 0.2), 0 4px 6px -2px rgba(0, 0, 0, 0.1)';
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.transform = 'translateY(0)';
      e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)';
    }}
  >
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <div style={{ flex: 1 }}>
        <div 
          style={{ 
            color: '#94a3b8', 
            fontSize: '13px', 
            textTransform: 'uppercase', 
            marginBottom: '10px',
            fontWeight: '600',
            letterSpacing: '0.5px'
          }}
        >
          {label}
        </div>
        <div 
          style={{ 
            color: 'white', 
            fontSize: typeof value === 'string' && value.length > 10 ? '24px' : '32px', 
            fontWeight: 'bold',
            wordBreak: 'break-word'
          }}
        >
          {value}
        </div>
      </div>
      <div 
        style={{ 
          fontSize: '48px', 
          opacity: '0.5',
          lineHeight: '1',
          marginLeft: '15px',
          filter: `drop-shadow(0 0 10px ${color}40)`
        }}
      >
        {icon}
      </div>
    </div>
  </div>
);

export default StatCard;