import React from 'react';

const getBatteryColor = (battery) => {
  if (!battery) return '#4b5563'; // Trống
  if (battery.stateOfHealth < 20) return '#991b1b'; // Hỏng
  if (battery.stateOfHealth > 95) return '#166534'; // Đầy
  return '#1e40af'; // Đang sạc
};

const SlotCard = ({ slot }) => (
  <div style={{ 
    background: '#374151', 
    borderLeft: `5px solid ${getBatteryColor(slot.battery)}`,
    padding: '15px', 
    borderRadius: '8px' 
  }}>
    <div style={{ color: 'white', fontWeight: 'bold', fontSize: '18px' }}>Hộc {slot.slotNumber}</div>
    {slot.battery ? (
      <>
        <div style={{ fontSize: '14px', color: '#e5e7eb' }}>Pin: BAT{slot.battery.batteryId}</div>
        <div style={{ fontSize: '14px', color: '#e5e7eb' }}>Sức khỏe: {slot.battery.stateOfHealth}%</div>
      </>
    ) : (
      <div style={{ fontSize: '14px', color: '#9ca3af' }}>Trống</div>
    )}
  </div>
);

const SlotGridView = ({ slots }) => (
  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '20px' }}>
    {slots.map(slot => <SlotCard key={slot.id || slot.slotId} slot={slot} />)}
  </div>
);

export default SlotGridView;