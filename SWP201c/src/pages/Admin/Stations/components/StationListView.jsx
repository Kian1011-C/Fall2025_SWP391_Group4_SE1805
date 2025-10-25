import React from 'react';

const getStatusStyle = (status = '') => {
    const s = status.toLowerCase();
    const style = { padding: '5px 12px', borderRadius: '15px', fontSize: '12px', fontWeight: 'bold', display: 'inline-block' };
    if (s === 'active' || s === 'hoạt động') return { ...style, background: '#166534', color: '#86efac' };
    if (s === 'maintenance' || s === 'bảo trì') return { ...style, background: '#9a3412', color: '#fdba74' };
    if (s === 'offline' || s === 'ngoại tuyến') return { ...style, background: '#991b1b', color: '#fca5a5' };
    return { ...style, background: '#4b5563', color: '#e5e7eb' };
};

const StationRow = ({ station, onSelect }) => (
  <tr onClick={() => onSelect(station)} style={{ cursor: 'pointer', borderTop: '1px solid #374151' }}>
    <td style={{ padding: '15px 20px', fontWeight: 'bold', color: 'white' }}>{station.id}</td>
    <td style={{ padding: '15px 20px' }}>{station.name}</td>
    <td style={{ padding: '15px 20px', maxWidth: '300px' }}>{station.address}</td>
    <td style={{ padding: '15px 20px' }}><span style={getStatusStyle(station.status)}>{station.status}</span></td>
    <td style={{ padding: '15px 20px' }}>{station.availableBatteries ?? 0} / {station.totalSlots ?? 0}</td>
  </tr>
);

const StationListView = ({ stations, onSelectStation }) => (
  <div style={{ background: '#1f2937', borderRadius: '12px', overflowX: 'auto' }}>
    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
      <thead>
        <tr style={{ background: '#374151' }}>
          <th style={{ padding: '15px 20px' }}>ID</th>
          <th style={{ padding: '15px 20px' }}>Tên Trạm</th>
          <th style={{ padding: '15px 20px' }}>Địa chỉ</th>
          <th style={{ padding: '15px 20px' }}>Trạng thái</th>
          <th style={{ padding: '15px 20px' }}>Pin (Sẵn/Tổng)</th>
        </tr>
      </thead>
      <tbody>
        {stations.map(station => <StationRow key={station.id} station={station} onSelect={onSelectStation} />)}
      </tbody>
    </table>
  </div>
);

export default StationListView;