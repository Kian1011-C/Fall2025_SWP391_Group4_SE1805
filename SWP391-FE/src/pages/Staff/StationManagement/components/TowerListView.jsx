import React from 'react';

const getStatusClass = (status = '') => {
  const s = status.toLowerCase().replace(/\s+/g, '-');
  return s || 'unknown';
};

const TowerRow = ({ tower, onSelect }) => (
  <tr onClick={() => onSelect(tower)}>
    <td>{tower.id || tower.towerId}</td>
    <td>
      <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
        Trụ {tower.towerNumber || 'N/A'}
      </span>
    </td>
    <td>
      <span className={`station-status-badge ${getStatusClass(tower.status)}`}>
        {tower.status}
      </span>
    </td>
  </tr>
);

const TowerListView = ({ towers, onSelectTower }) => {
  if (!towers || towers.length === 0) {
    return (
      <div className="station-empty">
        <div className="station-empty-icon">🏗️</div>
        <div className="station-empty-text">Không có trụ sạc nào</div>
        <div className="station-empty-subtext">Trạm này chưa có trụ sạc nào</div>
      </div>
    );
  }

  return (
    <div className="station-table-container">
      <table className="station-table">
        <thead>
          <tr>
            <th>ID Trụ</th>
            <th>Số hiệu Trụ</th>
            <th>Trạng thái</th>
          </tr>
        </thead>
        <tbody>
          {towers.map(tower => (
            <TowerRow 
              key={tower.id || tower.towerId} 
              tower={tower} 
              onSelect={onSelectTower} 
            />
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TowerListView;