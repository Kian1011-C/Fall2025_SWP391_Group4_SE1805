import React from 'react';

const ReportCard = ({ label, value, icon, color = '#f59e0b' }) => (
  <div style={{ background: '#1f2937', padding: '25px', borderRadius: '16px', borderLeft: `5px solid ${color}` }}>
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <div>
        <div style={{ color: '#9ca3af', fontSize: '14px', textTransform: 'uppercase', marginBottom: '8px' }}>{label}</div>
        <div style={{ color: 'white', fontSize: '32px', fontWeight: 'bold' }}>{value}</div>
      </div>
      <div style={{ fontSize: '40px', opacity: '0.7' }}>{icon}</div>
    </div>
  </div>
);

export default ReportCard;