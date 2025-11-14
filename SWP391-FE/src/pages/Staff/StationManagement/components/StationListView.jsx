import React from 'react';

const getStatusClass = (status = '') => {
  const s = status.toLowerCase().replace(/\s+/g, '-');
  return s || 'unknown';
};

const StationRow = ({ station, onSelect }) => (
  <tr onClick={() => onSelect(station)}>
    <td>{station.id}</td>
    <td>{station.name}</td>
    <td>
      <span className={`station-status-badge ${getStatusClass(station.status)}`}>
        {station.status}
      </span>
    </td>
    <td>
      <span style={{ fontWeight: 'bold', color: '#10b981' }}>
        {station.availableBatteries ?? 0}
      </span>
      {' / '}
      <span style={{ color: '#94a3b8' }}>
        {station.totalSlots ?? 0}
      </span>
    </td>
  </tr>
);

const StationListView = ({ stations, onSelectStation }) => {
  if (!stations || stations.length === 0) {
    return (
      <div className="station-empty">
        <div className="station-empty-icon"></div>
        <div className="station-empty-text">Không có trạm nào</div>
        <div className="station-empty-subtext">Hiện tại chưa có trạm sạc nào trong hệ thống</div>
      </div>
    );
  }

  return (
    <div className="station-table-container">
      <table className="station-table">
        <thead>
          <tr>
            <th>ID Trạm</th>
            <th>Tên Trạm</th>
            <th>Trạng thái</th>
            <th>Pin (Sẵn/Tổng)</th>
          </tr>
        </thead>
        <tbody>
          {stations.map(station => (
            <StationRow 
              key={station.id} 
              station={station} 
              onSelect={onSelectStation} 
            />
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default StationListView;