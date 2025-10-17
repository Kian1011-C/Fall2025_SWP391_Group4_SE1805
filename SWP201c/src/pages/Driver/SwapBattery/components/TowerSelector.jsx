// Tower Selector Component - Step 2
import React from 'react';
import StaffAssistanceButton from './StaffAssistanceButton';

const TowerSelector = ({
  towers,
  selectedStation,
  selectedTower,
  loadingTowers,
  onSelectTower,
  onGoBack,
  onRequestStaffAssistance
}) => {
  if (loadingTowers) {
    return (
      <div style={{ textAlign: 'center', padding: '40px' }}>
        <div className="loading-spinner" style={{ margin: '0 auto' }}></div>
        <p style={{ marginTop: '16px', color: '#666' }}>Đang tải danh sách trụ...</p>
      </div>
    );
  }

  if (towers.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '40px' }}>
        <p style={{ color: '#666' }}>Không có trụ sạc nào khả dụng tại trạm này.</p>
        <button onClick={onGoBack} className="btn-swap">
          ← Chọn trạm khác
        </button>
      </div>
    );
  }

  return (
    <div>
      <h3 style={{ marginBottom: '24px', fontSize: '20px', fontWeight: '600', color: '#333' }}>
        🔌 Chọn trụ sạc
      </h3>

      <div style={{ marginBottom: '20px', padding: '12px', background: '#e3f2fd', borderRadius: '8px' }}>
        <p style={{ margin: 0, fontSize: '14px', color: '#1976d2' }}>
          📍 Trạm: {selectedStation?.name}
        </p>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
          gap: '16px'
        }}
      >
        {towers.map((tower) => (
          <div
            key={tower.id}
            className={`tower-card ${selectedTower?.id === tower.id ? 'selected' : ''} ${
              tower.status === 'maintenance' ? 'disabled' : ''
            }`}
            onClick={() => onSelectTower(tower)}
            style={{
              padding: '24px',
              border: selectedTower?.id === tower.id ? '2px solid #667eea' : '1px solid #e0e0e0',
              borderRadius: '12px',
              background: selectedTower?.id === tower.id ? '#f3f4ff' : '#fff',
              cursor: tower.status === 'active' ? 'pointer' : 'not-allowed',
              opacity: tower.status === 'maintenance' ? 0.5 : 1,
              transition: 'all 0.2s',
              textAlign: 'center'
            }}
          >
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>
              {tower.status === 'active' ? '🔌' : '⚠️'}
            </div>
            <div style={{ fontSize: '18px', fontWeight: '600', color: '#333', marginBottom: '8px' }}>
              Trụ {tower.towerNumber}
            </div>
            <div
              style={{
                fontSize: '14px',
                color: tower.status === 'active' ? '#19c37d' : '#ffa500',
                fontWeight: '500'
              }}
            >
              {tower.status === 'active' ? '✓ Sẵn sàng' : '⏳ Bảo trì'}
            </div>
            {tower.status === 'active' && (
              <div style={{ fontSize: '12px', color: '#666', marginTop: '8px' }}>
                {tower.availableSlots} slot trống
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Assistance button hiển thị ở StationSelector, tránh trùng lặp */}
    </div>
  );
};

export default TowerSelector;
