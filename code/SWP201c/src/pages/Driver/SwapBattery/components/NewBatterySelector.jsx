// New Battery Selector Component - Step 3
import React from 'react';
import StaffAssistanceButton from './StaffAssistanceButton';

const NewBatterySelector = ({
  fullSlots,
  selectedStation,
  selectedTower,
  selectedNewBatterySlot,
  loadingSlots,
  onSelectSlot,
  onGoBack,
  onRequestStaffAssistance
}) => {
  if (loadingSlots) {
    return (
      <div style={{ textAlign: 'center', padding: '40px' }}>
        <div className="loading-spinner" style={{ margin: '0 auto' }}></div>
        <p style={{ marginTop: '16px', color: '#666' }}>Đang tải danh sách pin...</p>
      </div>
    );
  }

  if (fullSlots.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '40px' }}>
        <p style={{ color: '#666', marginBottom: '16px' }}>
          Không có pin nào khả dụng tại trụ này.
        </p>
        <button onClick={onGoBack} className="btn-swap">
          ← Chọn trụ khác
        </button>
      </div>
    );
  }

  return (
    <div>
      <h3 style={{ marginBottom: '24px', fontSize: '20px', fontWeight: '600', color: '#333' }}>
        🔋 Chọn pin mới
      </h3>

      <div style={{ marginBottom: '20px', padding: '12px', background: '#e3f2fd', borderRadius: '8px' }}>
        <p style={{ margin: 0, fontSize: '14px', color: '#1976d2' }}>
          📍 Trạm: {selectedStation?.name} - 🔌 Trụ {selectedTower?.towerNumber}
        </p>
      </div>

      <p style={{ marginBottom: '20px', fontSize: '14px', color: '#666' }}>
        Chọn slot có pin đầy để lấy pin mới:
      </p>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
          gap: '16px'
        }}
      >
        {fullSlots.map((slot) => (
          <div
            key={slot.id}
            className={`slot-card ${selectedNewBatterySlot?.id === slot.id ? 'selected' : ''}`}
            onClick={() => onSelectSlot(slot)}
            style={{
              padding: '20px',
              border:
                selectedNewBatterySlot?.id === slot.id ? '2px solid #19c37d' : '1px solid #e0e0e0',
              borderRadius: '12px',
              background: selectedNewBatterySlot?.id === slot.id ? '#f0f9f4' : '#fff',
              cursor: 'pointer',
              textAlign: 'center',
              transition: 'all 0.2s'
            }}
          >
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>🔋</div>
            <div style={{ fontSize: '16px', fontWeight: '600', color: '#333', marginBottom: '8px' }}>
              Slot {slot.slotNumber}
            </div>
            <div
              style={{ fontSize: '14px', color: '#19c37d', fontWeight: '600', marginBottom: '8px' }}
            >
              {slot.status === 'full' ? '⚡ 100% pin' : 
               slot.batteryLevel ? `⚡ ${slot.batteryLevel}% pin` : '⚡ Pin có sẵn'}
            </div>
            <div style={{ fontSize: '12px', color: slot.status === 'full' ? '#19c37d' : '#666' }}>
              {slot.status === 'full' ? '✅ Sẵn sàng lấy' : 
               slot.status === 'charging' ? '🔄 Đang sạc' : 
               slot.status === 'empty' ? '❌ Trống' : slot.status}
            </div>
          </div>
        ))}
      </div>

      <StaffAssistanceButton
        selectedStation={selectedStation}
        onRequestAssistance={onRequestStaffAssistance}
        position="bottom"
      />
    </div>
  );
};

export default NewBatterySelector;
