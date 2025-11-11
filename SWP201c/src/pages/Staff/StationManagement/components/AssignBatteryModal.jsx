import React, { useState, useEffect } from 'react';
import batteryService from '../../../../assets/js/services/batteryService';

const AssignBatteryModal = ({ isOpen, onClose, onSave, slots, towerName, stationName }) => {
  const [selectedSlotId, setSelectedSlotId] = useState('');
  const [selectedBatteryId, setSelectedBatteryId] = useState('');
  const [availableBatteries, setAvailableBatteries] = useState([]);
  const [isLoadingBatteries, setIsLoadingBatteries] = useState(false);
  const [error, setError] = useState(null);

  // Lọc các slot trống
  const emptySlots = slots ? slots.filter(slot => !slot.batteryId) : [];

  // Load danh sách pin trong kho khi modal mở
  useEffect(() => {
    if (isOpen) {
      fetchAvailableBatteries();
      setSelectedSlotId('');
      setSelectedBatteryId('');
      setError(null);
    }
  }, [isOpen]);

  const fetchAvailableBatteries = async () => {
    try {
      setIsLoadingBatteries(true);
      setError(null);
      
      // Lấy TẤT CẢ pin để kiểm tra
      const response = await batteryService.getAllBatteries();
      
      console.log('🔍 All batteries response:', response);
      console.log('🔍 Battery data:', response.data);
      
      if (response.success && Array.isArray(response.data)) {
        // Log ra status của từng pin để debug
        response.data.forEach(battery => {
          console.log(`Battery ${battery.batteryId}: status = "${battery.status}"`);
        });
        
        // Lọc các pin có status là "in_stock" (trong kho)
        const warehouseBatteries = response.data.filter(battery => {
          const status = battery.status?.toLowerCase();
          return status === 'in_stock' || 
                 status === 'in_warehouse' || 
                 status === 'trong kho';
        });
        
        console.log('🔍 Filtered warehouse batteries:', warehouseBatteries);
        setAvailableBatteries(warehouseBatteries);
      } else {
        throw new Error(response.message || 'Không thể tải danh sách pin');
      }
    } catch (err) {
      console.error('Error fetching batteries:', err);
      setError(err.message || 'Lỗi khi tải danh sách pin trong kho');
      setAvailableBatteries([]);
    } finally {
      setIsLoadingBatteries(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!selectedSlotId) {
      alert('Vui lòng chọn hộc!');
      return;
    }
    
    if (!selectedBatteryId) {
      alert('Vui lòng chọn pin!');
      return;
    }

    const selectedSlot = emptySlots.find(s => String(s.slotId || s.id) === String(selectedSlotId));
    const selectedBattery = availableBatteries.find(b => String(b.batteryId) === String(selectedBatteryId));

    onSave({
      slotId: selectedSlotId,
      batteryId: selectedBatteryId,
      slot: selectedSlot,
      battery: selectedBattery
    });
  };

  if (!isOpen) return null;

  return (
    <div className="subscription-modal-overlay" onClick={onClose}>
      <div className="subscription-modal" style={{ maxWidth: '600px' }} onClick={e => e.stopPropagation()}>
        <form onSubmit={handleSubmit}>
          <div className="subscription-modal-header">
            <h2>🔋 Thêm Pin vào Hộc</h2>
            <p style={{ margin: '8px 0 0 0', fontSize: '14px', color: '#94a3b8' }}>
              {stationName} - {towerName}
            </p>
          </div>
          
          <div className="subscription-modal-body">
            {/* Chọn Hộc */}
            <div className="subscription-form-group">
              <label className="subscription-form-label">Chọn Hộc *</label>
              {emptySlots.length === 0 ? (
                <div style={{ 
                  padding: '20px', 
                  textAlign: 'center', 
                  background: 'rgba(239, 68, 68, 0.1)',
                  borderRadius: '8px',
                  color: '#fca5a5'
                }}>
                  ⚠️ Không có hộc trống trong trụ này
                </div>
              ) : (
                <select
                  value={selectedSlotId}
                  onChange={(e) => setSelectedSlotId(e.target.value)}
                  className="subscription-form-input"
                  required
                >
                  <option value="">-- Chọn hộc --</option>
                  {emptySlots.map(slot => (
                    <option key={slot.slotId || slot.id} value={slot.slotId || slot.id}>
                      Hộc {slot.slotNumber} (ID: {slot.slotId || slot.id})
                    </option>
                  ))}
                </select>
              )}
            </div>

            {/* Chọn Pin */}
            <div className="subscription-form-group">
              <label className="subscription-form-label">Chọn Pin *</label>
              {isLoadingBatteries ? (
                <div style={{ padding: '20px', textAlign: 'center', color: '#94a3b8' }}>
                  Đang tải danh sách pin...
                </div>
              ) : error ? (
                <div style={{ 
                  padding: '20px', 
                  textAlign: 'center', 
                  background: 'rgba(239, 68, 68, 0.1)',
                  borderRadius: '8px',
                  color: '#fca5a5'
                }}>
                  ⚠️ {error}
                  <button 
                    type="button"
                    onClick={fetchAvailableBatteries}
                    style={{
                      marginTop: '10px',
                      padding: '8px 16px',
                      background: '#ef4444',
                      color: 'white',
                      border: 'none',
                      borderRadius: '6px',
                      cursor: 'pointer'
                    }}
                  >
                    🔄 Thử lại
                  </button>
                </div>
              ) : availableBatteries.length === 0 ? (
                <div style={{ 
                  padding: '20px', 
                  textAlign: 'center', 
                  background: 'rgba(234, 179, 8, 0.1)',
                  borderRadius: '8px',
                  color: '#fde047'
                }}>
                  📦 Không có pin nào trong kho
                </div>
              ) : (
                <select
                  value={selectedBatteryId}
                  onChange={(e) => setSelectedBatteryId(e.target.value)}
                  className="subscription-form-input"
                  required
                >
                  <option value="">-- Chọn pin từ kho --</option>
                  {availableBatteries.map(battery => (
                    <option key={battery.batteryId} value={battery.batteryId}>
                      BAT{battery.batteryId} - {battery.model || 'N/A'} - {battery.stateOfHealth}% SOH
                    </option>
                  ))}
                </select>
              )}
            </div>

            {/* Thông tin đã chọn */}
            {selectedSlotId && selectedBatteryId && (
              <div style={{
                marginTop: '20px',
                padding: '16px',
                background: 'rgba(16, 185, 129, 0.1)',
                border: '1px solid rgba(16, 185, 129, 0.3)',
                borderRadius: '10px'
              }}>
                <div style={{ fontSize: '14px', fontWeight: '600', marginBottom: '8px', color: '#10b981' }}>
                  ✅ Xác nhận thao tác:
                </div>
                <div style={{ fontSize: '13px', color: '#cbd5e1', lineHeight: '1.6' }}>
                  • Hộc: <strong>Hộc {emptySlots.find(s => String(s.slotId || s.id) === String(selectedSlotId))?.slotNumber}</strong><br/>
                  • Pin: <strong>BAT{selectedBatteryId}</strong><br/>
                  • Status pin sẽ đổi: <span style={{ color: '#fbbf24' }}>Trong kho</span> → <span style={{ color: '#10b981' }}>Sẵn sàng</span>
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
              disabled={emptySlots.length === 0 || availableBatteries.length === 0 || isLoadingBatteries}
            >
              ✅ Xác nhận thêm
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AssignBatteryModal;
