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
        {towers.length > 0 && (
          <div style={{ marginTop: '8px', fontSize: '12px', color: '#666' }}>
            🔌 {towers.length} trụ sạc • 
            🔋 {towers.reduce((sum, t) => sum + (t.availableBatteries || 0), 0)} pin khả dụng • 
            📊 SOH TB: {towers.length > 0 ? Math.round(towers.reduce((sum, t) => sum + (t.averageSOH || 0), 0) / towers.length) : 0}%
          </div>
        )}
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
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
                <div>🔋 {tower.availableBatteries || 0}/{tower.totalSlots || 0} pin</div>
                {tower.averageSOH && (
                  <div>📊 SOH TB: {tower.averageSOH}%</div>
                )}
                {tower.bestBatterySOH && (
                  <div>⭐ SOH tốt nhất: {tower.bestBatterySOH}%</div>
                )}
                {tower.recommendedSlots && tower.recommendedSlots.length > 0 && (
                  <div style={{ marginTop: '4px', padding: '4px', background: '#e8f5e8', borderRadius: '4px' }}>
                    <div style={{ fontSize: '10px', color: '#2e7d32', fontWeight: '600' }}>
                      💡 Khuyến nghị: {tower.recommendedSlots.length} slot
                    </div>
                    {tower.recommendedSlots.slice(0, 2).map((slot, idx) => (
                      <div key={idx} style={{ fontSize: '10px', color: '#4caf50' }}>
                        Slot {slot.slotId}: SOH {slot.batterySOH}%
                      </div>
                    ))}
                    {tower.recommendedSlots.length > 2 && (
                      <div style={{ fontSize: '10px', color: '#666' }}>
                        +{tower.recommendedSlots.length - 2} khác
                      </div>
                    )}
                  </div>
                )}
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
