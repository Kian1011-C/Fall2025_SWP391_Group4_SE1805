import React from 'react';
const StationRow = ({ station, onSelect }) => (
  <tr onClick={() => onSelect(station)} style={{ cursor: 'pointer', borderTop: '1px solid #334155' }}>
    <td style={{ padding: '15px 20px', fontWeight: 'bold', color: 'white' }}>{station.id}</td>
    <td style={{ padding: '15px 20px' }}>{station.name}</td>
    <td style={{ padding: '15px 20px' }}>{station.status}</td>
    <td style={{ padding: '15px 20px' }}>{station.availableBatteries ?? 0} / {station.totalSlots ?? 0}</td>
  </tr>
);
const StationListView = ({ stations, onSelectStation }) => (
  <div style={{ background: '#1e293b', borderRadius: '12px', overflowX: 'auto' }}>
    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
      <thead>
        <tr style={{ background: '#334155' }}>
          <th style={{ padding: '15px 20px' }}>ID Trạm</th>
          <th style={{ padding: '15px 20px' }}>Tên Trạm</th>
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