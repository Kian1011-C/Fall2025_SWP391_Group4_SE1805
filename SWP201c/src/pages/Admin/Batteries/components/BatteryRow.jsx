import React from 'react';

const getStatusStyle = (status) => {
    const s = status ? status.toLowerCase() : '';
    const style = { padding: '5px 12px', borderRadius: '15px', fontSize: '12px', fontWeight: 'bold', display: 'inline-block' };
    if (s === 'available' || s === 'đầy') return { ...style, background: '#166534', color: '#86efac' };
    if (s === 'charging' || s === 'đang sạc') return { ...style, background: '#1e40af', color: '#93c5fd' };
    if (s === 'maintenance' || s === 'bảo trì') return { ...style, background: '#9a3412', color: '#fdba74' };
    return { ...style, background: '#4b5563', color: '#e5e7eb' };
};

const BatteryRow = ({ battery, onEdit, onDelete }) => {
  return (
    <tr style={{ borderTop: '1px solid #374151' }}>
      <td style={{ padding: '15px 20px', fontWeight: 'bold', color: 'white' }}>BAT{battery.batteryId}</td>
      <td style={{ padding: '15px 20px' }}>{battery.model}</td>
      <td style={{ padding: '15px 20px' }}><span style={getStatusStyle(battery.status)}>{battery.status?.toLowerCase() || battery.status}</span></td>
      <td style={{ padding: '15px 20px' }}>{battery.stateOfHealth}%</td>
      <td style={{ padding: '15px 20px' }}>{battery.cycleCount}</td>
      <td style={{ padding: '15px 20px', display: 'flex', gap: '10px' }}>
        <button 
          onClick={() => onEdit(battery)} 
          style={{ background: '#3b82f6', color: 'white', border: 'none', padding: '8px 12px', borderRadius: '6px', cursor: 'pointer', fontWeight: '500' }}>
          ✏️ Sửa
        </button>
        <button 
          onClick={() => onDelete(battery)} 
          style={{ background: '#ef4444', color: 'white', border: 'none', padding: '8px 12px', borderRadius: '6px', cursor: 'pointer', fontWeight: '500' }}>
          🗑️ Xóa
        </button>
      </td>
    </tr>
  );
};

export default BatteryRow;