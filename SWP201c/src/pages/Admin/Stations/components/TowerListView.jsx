import React from 'react';

const getStatusClass = (status = '') => {
  const s = status.toLowerCase().replace(/\s+/g, '-');
  return s || 'unknown';
};

const TowerRow = ({ tower, onSelect, onEdit, onDelete }) => (
  <tr>
    <td onClick={() => onSelect(tower)} style={{ cursor: 'pointer' }}>
      {tower.towerId || tower.id}
    </td>
    <td onClick={() => onSelect(tower)} style={{ cursor: 'pointer' }}>
      <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
        Trụ {tower.towerNumber || 'N/A'}
      </span>
    </td>
    <td onClick={() => onSelect(tower)} style={{ cursor: 'pointer' }}>
      <span className={`station-status-badge ${getStatusClass(tower.status)}`}>
        {tower.status}
      </span>
    </td>
    <td>
      <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onEdit(tower);
          }}
          style={{
            background: 'linear-gradient(135deg, #3b82f6 0%, #60a5fa 100%)',
            color: 'white',
            border: 'none',
            padding: '6px 12px',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '14px'
          }}
          title="Sửa"
        >
          ✏️ Sửa
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete(tower.towerId || tower.id);
          }}
          style={{
            background: '#ef4444',
            color: 'white',
            border: 'none',
            padding: '6px 12px',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '14px'
          }}
          title="Xóa"
        >
          🗑️ Xóa
        </button>
      </div>
    </td>
  </tr>
);

const TowerListView = ({ towers, onSelectTower, onEditTower, onDeleteTower }) => {
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
            <th style={{ width: '100px' }}>Thao tác</th>
          </tr>
        </thead>
        <tbody>
          {towers.map(tower => (
            <TowerRow 
              key={tower.towerId || tower.id} 
              tower={tower} 
              onSelect={onSelectTower}
              onEdit={onEditTower}
              onDelete={onDeleteTower}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TowerListView;