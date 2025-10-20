import React from 'react';

const BatteryCard = ({ battery, getStatusColor, getStatusLabel }) => (
  <div style={{ background: 'rgba(26, 32, 44, 0.8)', borderRadius: '15px', padding: '20px', border: '1px solid rgba(255, 255, 255, 0.1)', transition: 'all 0.3s ease' }}>
    <div style={{ fontSize: '3rem', textAlign: 'center', marginBottom: '15px' }}>🔋</div>
    <div style={{ textAlign: 'center', marginBottom: '15px' }}>
      <h3 style={{ color: '#FFFFFF', margin: '0 0 10px 0' }}>{battery.batteryId || battery.id}</h3>
      <div style={{ display: 'inline-block', padding: '6px 15px', borderRadius: '20px', fontSize: '0.85rem', fontWeight: '600', background: `${getStatusColor(battery.status)}20`, color: getStatusColor(battery.status), border: `1px solid ${getStatusColor(battery.status)}40` }}>
        {getStatusLabel(battery.status)}
      </div>
    </div>
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', color: '#E0E0E0', fontSize: '0.9rem' }}>
      <div>
        <div style={{ color: '#B0B0B0', fontSize: '0.8rem' }}>SOC</div>
        <div style={{ fontWeight: '600', color: '#19c37d' }}>{battery.soc || battery.chargeLevel || 0}%</div>
      </div>
      <div>
        <div style={{ color: '#B0B0B0', fontSize: '0.8rem' }}>SOH</div>
        <div style={{ fontWeight: '600', color: '#6ab7ff' }}>{battery.soh || battery.health || 0}%</div>
      </div>
      <div>
        <div style={{ color: '#B0B0B0', fontSize: '0.8rem' }}>Vị trí</div>
        <div style={{ fontWeight: '600' }}>{battery.stationName || battery.currentStationId || 'N/A'}</div>
      </div>
      <div>
        <div style={{ color: '#B0B0B0', fontSize: '0.8rem' }}>Chu kỳ</div>
        <div style={{ fontWeight: '600' }}>{battery.cycleCount || battery.cycles || 0}</div>
      </div>
    </div>
  </div>
);

const BatteryCardGrid = ({ batteries, getStatusColor, getStatusLabel }) => (
  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' }}>
    {batteries.map((b) => (
      <BatteryCard key={b.id} battery={b} getStatusColor={getStatusColor} getStatusLabel={getStatusLabel} />
    ))}
  </div>
);

export default BatteryCardGrid;


