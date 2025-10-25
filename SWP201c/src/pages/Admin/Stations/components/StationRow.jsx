import React from 'react';

const getStatusStyle = (status) => {
    const s = status ? status.toLowerCase() : '';
    const style = { padding: '5px 12px', borderRadius: '15px', fontSize: '12px', fontWeight: 'bold', display: 'inline-block' };
    if (s === 'active' || s === 'hoạt động') return { ...style, background: '#166534', color: '#86efac' };
    if (s === 'maintenance' || s === 'bảo trì') return { ...style, background: '#9a3412', color: '#fdba74' };
    if (s === 'offline' || s === 'ngoại tuyến') return { ...style, background: '#991b1b', color: '#fca5a5' };
    return { ...style, background: '#4b5563', color: '#e5e7eb' };
};

const StationRow = ({ station, onEdit }) => {
  return (
    <tr style={{ borderTop: '1px solid #374151' }}>
      <td style={{ padding: '15px 20px', fontWeight: 'bold', color: 'white' }}>{station.id}</td>
      <td style={{ padding: '15px 20px' }}>{station.name}</td>
      <td style={{ padding: '15px 20px', maxWidth: '300px' }}>{station.address}</td>
      <td style={{ padding: '15px 20px' }}><span style={getStatusStyle(station.status)}>{station.status}</span></td>
      <td style={{ padding: '15px 20px' }}>{station.totalSlots}</td>
      <td style={{ padding: '15px 20px' }}>{station.availableBatteries}</td>
      <td style={{ padding: '15px 20px' }}>
        <button 
          onClick={() => onEdit(station)} 
          style={{ background: '#374151', color: 'white', border: 'none', padding: '8px 12px', borderRadius: '6px', cursor: 'pointer', marginRight: '10px' }}>
          Sửa
        </button>
      </td>
    </tr>
  );
};

export default StationRow;