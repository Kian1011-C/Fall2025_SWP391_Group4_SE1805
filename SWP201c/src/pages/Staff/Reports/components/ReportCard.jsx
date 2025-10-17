import React from 'react';

const ReportCard = ({ label, value, icon }) => (
  <div style={{ background: '#1e293b', padding: '25px', borderRadius: '16px', border: '1px solid #334155' }}>
    <div style={{ color: '#94a3b8', fontSize: '14px', marginBottom: '10px' }}>{label}</div>
    <div style={{ display: 'flex', alignItems: 'baseline', gap: '10px' }}>
      <span style={{ color: 'white', fontSize: '28px', fontWeight: 'bold' }}>{value}</span>
      <span style={{ fontSize: '24px' }}>{icon}</span>
    </div>
  </div>
);

export default ReportCard;