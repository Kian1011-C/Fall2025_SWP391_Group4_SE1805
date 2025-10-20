import React from 'react';

const FilterBar = ({ filterStatus, setFilterStatus }) => (
  <div style={{ background: 'rgba(26, 32, 44, 0.8)', borderRadius: '12px', padding: '20px', marginBottom: '20px', border: '1px solid rgba(255, 255, 255, 0.1)' }}>
    <label style={{ color: '#E0E0E0', marginRight: '10px' }}>Lọc theo trạng thái:</label>
    <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} style={{ padding: '10px', borderRadius: '8px', border: '1px solid rgba(255, 255, 255, 0.2)', background: 'rgba(255, 255, 255, 0.1)', color: '#FFFFFF', fontSize: '14px' }}>
      <option value="all">Tất cả</option>
      <option value="Available">Sẵn sàng</option>
      <option value="In Use">Đang dùng</option>
      <option value="Charging">Đang sạc</option>
      <option value="Maintenance">Bảo trì</option>
    </select>
  </div>
);

export default FilterBar;


