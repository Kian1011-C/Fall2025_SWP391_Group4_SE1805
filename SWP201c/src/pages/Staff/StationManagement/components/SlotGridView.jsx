import React from 'react';
const getBatteryColor = (status) => {
  const s = status ? status.toLowerCase() : 'empty';
  if (s === 'empty' || s === 'available') return '#4b5563';
  if (s === 'maintenance') return '#991b1b';
  if (s === 'full') return '#166534';
  if (s === 'charging') return '#1e40af';
  return '#4b5563';
};
const SlotCard = ({ slot }) => {
  const hasBattery = !!slot.batteryId;
  const batteryStatus = hasBattery ? slot.batteryStatus : 'empty';
  return (
    <div style={{ background: '#334155', borderLeft: `5px solid ${getBatteryColor(batteryStatus)}`, padding: '15px', borderRadius: '8px' }}>
      <div style={{ color: 'white', fontWeight: 'bold', fontSize: '18px' }}>Hộc {slot.slotNumber}</div>
      {hasBattery ? (
        <>
          <div style={{ fontSize: '14px', color: '#e5e7eb' }}>Pin: BAT{slot.batteryId}</div>
          <div style={{ fontSize: '14px', color: '#e5e7eb' }}>Mức pin: {slot.batteryLevel}%</div>
        </>
      ) : (
        <div style={{ fontSize: '14px', color: '#9ca3af' }}>Trống</div>
      )}
    </div>
  );
};
const SlotGridView = ({ slots }) => (
  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '20px' }}>
    {slots.map(slot => <SlotCard key={slot.id || slot.slotId} slot={slot} />)}
  </div>
);
export default SlotGridView;