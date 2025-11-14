import React from 'react';

const getStatusClass = (status = '') => {
  const s = status.toLowerCase().replace(/\s+/g, '-');
  return s || 'unknown';
};

const StationRow = ({ station, onSelect, onEdit }) => (
  <tr>
    <td onClick={() => onSelect(station)} style={{ cursor: 'pointer' }}>
      {station.id || station.stationId}
    </td>
    <td onClick={() => onSelect(station)} style={{ cursor: 'pointer' }}>
      {station.name}
    </td>
    <td onClick={() => onSelect(station)} style={{ cursor: 'pointer', maxWidth: '350px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
      {station.address || station.location}
    </td>
    <td onClick={() => onSelect(station)} style={{ cursor: 'pointer' }}>
      <span className={`station-status-badge ${getStatusClass(station.status)}`}>
        {station.status}
      </span>
    </td>
    <td onClick={() => onSelect(station)} style={{ cursor: 'pointer' }}>
      <span style={{ fontWeight: 'bold', color: '#10b981' }}>
        {station.availableBatteries ?? 0}
      </span>
      {' / '}
      <span style={{ color: '#94a3b8' }}>
        {station.totalSlots ?? 0}
      </span>
    </td>
    <td>
      <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onEdit(station);
          }}
          style={{
            background: '#3b82f6',
            color: 'white',
            border: 'none',
            padding: '6px 12px',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '14px'
          }}
          title="Chỉnh sửa"
        >
           Sửa
        </button>
      </div>
    </td>
  </tr>
);

const StationListView = ({ stations, onSelectStation, onEditStation }) => {
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
            <th>ID</th>
            <th>Tên Trạm</th>
            <th>Địa chỉ</th>
            <th>Trạng thái</th>
            <th>Pin (Sẵn/Tổng)</th>
            <th style={{ width: '100px' }}>Thao tác</th>
          </tr>
        </thead>
        <tbody>
          {stations.map(station => (
            <StationRow 
              key={station.id || station.stationId} 
              station={station} 
              onSelect={onSelectStation}
              onEdit={onEditStation}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default StationListView;