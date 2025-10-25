import React from 'react';

const TowerRow = ({ tower, onSelect }) => (
  <tr onClick={() => onSelect(tower)} style={{ cursor: 'pointer', borderTop: '1px solid #374151' }}>
    <td style={{ padding: '15px 20px', fontWeight: 'bold', color: 'white' }}>{tower.id || tower.towerId}</td>
    <td style={{ padding: '15px 20px' }}>{tower.towerNumber || 'N/A'}</td>
    <td style={{ padding: '15px 20px' }}>{tower.status}</td>
    <td style={{ padding: '15px 20px' }}>{tower.availableSlots ?? 0} / {tower.totalSlots ?? 0}</td>
  </tr>
);

const TowerListView = ({ towers, onSelectTower }) => (
  <div style={{ background: '#1f2937', borderRadius: '12px', overflowX: 'auto' }}>
    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
      <thead>
        <tr style={{ background: '#374151' }}>
          <th style={{ padding: '15px 20px' }}>ID Trụ</th>
          <th style={{ padding: '15px 20px' }}>Số hiệu Trụ</th>
          <th style={{ padding: '15px 20px' }}>Trạng thái</th>
          <th style={{ padding: '15px 20px' }}>Hộc (Trống/Tổng)</th>
        </tr>
      </thead>
      <tbody>
        {towers.map(tower => <TowerRow key={tower.id || tower.towerId} tower={tower} onSelect={onSelectTower} />)}
      </tbody>
    </table>
  </div>
);

export default TowerListView;