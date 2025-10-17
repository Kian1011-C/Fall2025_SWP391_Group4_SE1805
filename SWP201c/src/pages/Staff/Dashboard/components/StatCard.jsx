import React from 'react';

const StatCard = ({ label, value, icon, color }) => (
  <div style={{ background: '#1e293b', padding: '25px', borderRadius: '16px', borderLeft: `5px solid ${color}` }}>
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <div>
        <div style={{ color: '#94a3b8', fontSize: '14px', textTransform: 'uppercase', marginBottom: '8px' }}>{label}</div>
        <div style={{ color: 'white', fontSize: '32px', fontWeight: 'bold' }}>{value}</div>
      </div>
      <div style={{ fontSize: '40px', opacity: '0.7' }}>{icon}</div>
    </div>
  </div>
);

export default StatCard;