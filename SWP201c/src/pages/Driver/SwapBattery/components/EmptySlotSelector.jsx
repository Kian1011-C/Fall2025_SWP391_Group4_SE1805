// Empty Slot Selector Component - Step 4
import React from 'react';
import StaffAssistanceButton from './StaffAssistanceButton';

const EmptySlotSelector = ({
  emptySlots,
  selectedStation,
  selectedTower,
  selectedNewBatterySlot,
  selectedEmptySlot,
  loadingSlots,
  onSelectSlot,
  onGoBack,
  onRequestStaffAssistance
}) => {
  if (loadingSlots) {
    return (
      <div style={{ textAlign: 'center', padding: '40px' }}>
        <div className="loading-spinner" style={{ margin: '0 auto' }}></div>
        <p style={{ marginTop: '16px', color: '#666' }}>Đang tải danh sách slot...</p>
      </div>
    );
  }

  if (emptySlots.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '40px' }}>
        <p style={{ color: '#666', marginBottom: '16px' }}>
          Không có slot trống nào tại trụ này.
        </p>
        <button onClick={onGoBack} className="btn-swap">
          ← Chọn lại pin mới
        </button>
      </div>
    );
  }

  return (
    <div>
      <h3 style={{ marginBottom: '24px', fontSize: '20px', fontWeight: '600', color: '#333' }}>
        📦 Chọn slot trống
      </h3>

      <div style={{ marginBottom: '20px', padding: '12px', background: '#e3f2fd', borderRadius: '8px' }}>
        <p style={{ margin: 0, fontSize: '14px', color: '#1976d2' }}>
          📍 Trạm: {selectedStation?.name} - 🔌 Trụ {selectedTower?.towerNumber}
        </p>
        <p style={{ margin: '5px 0 0 0', fontSize: '14px', color: '#1976d2' }}>
          🔋 Pin mới đã chọn: Slot {selectedNewBatterySlot?.slotNumber}
        </p>
      </div>

      <p style={{ marginBottom: '20px', fontSize: '14px', color: '#666' }}>
        Chọn slot trống để đặt pin cũ của bạn:
      </p>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
          gap: '16px'
        }}
      >
        {emptySlots.map((slot) => (
          <div
            key={slot.id}
            className={`slot-card ${selectedEmptySlot?.id === slot.id ? 'selected' : ''}`}
            onClick={() => onSelectSlot(slot)}
            style={{
              padding: '20px',
              border: selectedEmptySlot?.id === slot.id ? '2px solid #ff9800' : '1px solid #e0e0e0',
              borderRadius: '12px',
              background: selectedEmptySlot?.id === slot.id ? '#fff3e0' : '#fff',
              cursor: 'pointer',
              textAlign: 'center',
              transition: 'all 0.2s'
            }}
          >
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>📦</div>
            <div style={{ fontSize: '16px', fontWeight: '600', color: '#333', marginBottom: '8px' }}>
              Slot {slot.slotNumber}
            </div>
            <div
              style={{ fontSize: '14px', color: '#ff9800', fontWeight: '600', marginBottom: '8px' }}
            >
              📭 Slot trống
            </div>
            <div style={{ fontSize: '12px', color: '#666' }}>Sẵn sàng để đặt pin cũ</div>
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

export default EmptySlotSelector;
