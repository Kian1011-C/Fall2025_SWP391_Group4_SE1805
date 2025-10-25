import React from 'react';

// Cập nhật hàm getBatteryColor để đọc 'batteryStatus'
const getBatteryColor = (status) => {
  const s = status ? status.toLowerCase() : 'empty';
  if (s === 'empty') return '#4b5563'; // Trống
  if (s === 'maintenance') return '#991b1b'; // Hỏng/Bảo trì
  if (s === 'available' || s === 'full') return '#166534'; // Đầy
  if (s === 'charging') return '#1e40af'; // Đang sạc
  return '#4b5563';
};

const SlotCard = ({ slot }) => {
  // Đọc dữ liệu từ API /api/driver/slots
  const hasBattery = !!slot.batteryId;
  
  return (
    <div style={{ 
      background: '#374151', 
      borderLeft: `5px solid ${getBatteryColor(hasBattery ? slot.batteryStatus : 'empty')}`,
      padding: '15px', 
      borderRadius: '8px' 
    }}>
      <div style={{ color: 'white', fontWeight: 'bold', fontSize: '18px' }}>Hộc {slot.slotNumber}</div>
      {hasBattery ? (
        <>
          <div style={{ fontSize: '14px', color: '#e5e7eb' }}>Pin: BAT{slot.batteryId}</div>
          <div style={{ fontSize: '14px', color: '#e5e7eb' }}>Mẫu: {slot.batteryModel || 'N/A'}</div>
          <div style={{ fontSize: '14px', color: '#e5e7eb' }}>Mức pin: {slot.batteryLevel}%</div>
          <div style={{ fontSize: '14px', color: '#e5e7eb' }}>Trạng thái pin: {slot.batteryStatus}</div>
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