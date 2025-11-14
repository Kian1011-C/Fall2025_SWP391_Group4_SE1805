import React, { useState, useEffect } from 'react';

const RemoveBatteryModal = ({ isOpen, onClose, onSave, slots, towerName, stationName }) => {
  const [selectedSlotId, setSelectedSlotId] = useState('');

  // Lọc các slot có pin
  const slotsWithBattery = slots ? slots.filter(slot => !!slot.batteryId) : [];

  // Reset khi modal mở
  useEffect(() => {
    if (isOpen) {
      setSelectedSlotId('');
    }
  }, [isOpen]);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!selectedSlotId) {
      alert('Vui lòng chọn hộc!');
      return;
    }

    const selectedSlot = slotsWithBattery.find(s => String(s.slotId || s.id) === String(selectedSlotId));

    onSave({
      slotId: selectedSlotId,
      batteryId: selectedSlot.batteryId,
      slot: selectedSlot
    });
  };

  if (!isOpen) return null;

  return (
    <div className="subscription-modal-overlay" onClick={onClose}>
      <div className="subscription-modal" style={{ maxWidth: '600px' }} onClick={e => e.stopPropagation()}>
        <form onSubmit={handleSubmit}>
          <div className="subscription-modal-header">
            <h2> Tháo Pin khỏi Hộc</h2>
            <p style={{ margin: '8px 0 0 0', fontSize: '14px', color: '#94a3b8' }}>
              {stationName} - {towerName}
            </p>
          </div>
          
          <div className="subscription-modal-body">
            {/* Chọn Hộc */}
            <div className="subscription-form-group">
              <label className="subscription-form-label">Chọn Hộc có Pin *</label>
              {slotsWithBattery.length === 0 ? (
                <div style={{ 
                  padding: '20px', 
                  textAlign: 'center', 
                  background: 'rgba(234, 179, 8, 0.1)',
                  borderRadius: '8px',
                  color: '#fde047'
                }}>
                   Không có hộc nào chứa pin trong trụ này
                </div>
              ) : (
                <select
                  value={selectedSlotId}
                  onChange={(e) => setSelectedSlotId(e.target.value)}
                  className="subscription-form-input"
                  required
                >
                  <option value="">-- Chọn hộc cần tháo pin --</option>
                  {slotsWithBattery.map(slot => (
                    <option key={slot.slotId || slot.id} value={slot.slotId || slot.id}>
                      Hộc {slot.slotNumber} - BAT{slot.batteryId} ({slot.batteryStatus})
                    </option>
                  ))}
                </select>
              )}
            </div>

            {/* Thông tin đã chọn */}
            {selectedSlotId && (
              <div style={{
                marginTop: '20px',
                padding: '16px',
                background: 'rgba(239, 68, 68, 0.1)',
                border: '1px solid rgba(239, 68, 68, 0.3)',
                borderRadius: '10px'
              }}>
                <div style={{ fontSize: '14px', fontWeight: '600', marginBottom: '8px', color: '#ef4444' }}>
                   Xác nhận thao tác:
                </div>
                <div style={{ fontSize: '13px', color: '#cbd5e1', lineHeight: '1.6' }}>
                  {(() => {
                    const slot = slotsWithBattery.find(s => String(s.slotId || s.id) === String(selectedSlotId));
                    return (
                      <>
                        • Hộc: <strong>Hộc {slot?.slotNumber}</strong><br/>
                        • Pin: <strong>BAT{slot?.batteryId}</strong><br/>
                        • Status pin sẽ đổi: <span style={{ color: '#10b981' }}>{slot?.batteryStatus}</span> → <span style={{ color: '#fbbf24' }}>Trong kho</span>
                      </>
                    );
                  })()}
                </div>
              </div>
            )}
          </div>
          
          <div className="subscription-modal-footer">
            <button 
              type="button" 
              onClick={onClose} 
              className="subscription-modal-btn subscription-modal-btn-cancel"
            >
              Hủy
            </button>
            <button 
              type="submit" 
              className="subscription-modal-btn subscription-modal-btn-save"
              style={{ background: 'linear-gradient(135deg, #ef4444 0%, #f87171 100%)' }}
              disabled={slotsWithBattery.length === 0}
            >
               Xác nhận tháo
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RemoveBatteryModal;
