import React from 'react';

const Filters = ({
  filterStatus, setFilterStatus,
  filterStation, setFilterStation,
  filterDate, setFilterDate,
  statusOptions, stations
}) => {
  return (
    <div style={{ padding: '20px', borderRadius: '8px', background: '#fff', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', marginBottom: '20px' }}>
      <div style={{ display: 'flex', gap: '20px', alignItems: 'center', flexWrap: 'wrap' }}>
        <div>
          <label style={{ fontSize: '12px', color: '#6b7280' }}>Lọc theo trạng thái:</label>
          <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} style={{ padding: '8px 12px', border: '1px solid #e5e7eb', borderRadius: '6px', fontSize: '14px' }}>
            <option value="Tất cả">Tất cả</option>
            {statusOptions.map(status => (
              <option key={status} value={status}>{status}</option>
            ))}
          </select>
        </div>
        <div>
          <label style={{ fontSize: '12px', color: '#6b7280' }}>Lọc theo trạm:</label>
          <select value={filterStation} onChange={(e) => setFilterStation(e.target.value)} style={{ padding: '8px 12px', border: '1px solid #e5e7eb', borderRadius: '6px', fontSize: '14px' }}>
            <option value="Tất cả">Tất cả</option>
            {stations.map(station => (
              <option key={station} value={station}>{station}</option>
            ))}
          </select>
        </div>
        <div>
          <label style={{ fontSize: '12px', color: '#6b7280' }}>Lọc theo ngày:</label>
          <input type="date" value={filterDate} onChange={(e) => setFilterDate(e.target.value)} style={{ padding: '8px 12px', border: '1px solid #e5e7eb', borderRadius: '6px', fontSize: '14px' }} />
        </div>
      </div>
    </div>
  );
};

export default Filters;


