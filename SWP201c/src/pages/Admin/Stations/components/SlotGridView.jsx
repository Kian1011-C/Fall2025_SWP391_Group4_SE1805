import React from 'react';

const getSlotStatus = (slot) => {
  const hasBattery = !!slot.batteryId;
  if (!hasBattery) return 'empty';
  
  const status = slot.batteryStatus ? slot.batteryStatus.toLowerCase() : 'empty';
  return status;
};

const getStatusIcon = (status) => {
  switch(status) {
    case 'empty': return '⚪';
    case 'available':
    case 'full': return '🟢';
    case 'charging': return '⚡';
    case 'maintenance': return '🔴';
    default: return '⚫';
  }
};

const getBatteryLevelClass = (level) => {
  if (level >= 80) return '';
  if (level >= 40) return 'medium';
  return 'low';
};

const SlotCard = ({ slot, onAddBattery }) => {
  const hasBattery = !!slot.batteryId;
  const status = getSlotStatus(slot);
  
  const handleAddBattery = (e) => {
    e.stopPropagation();
    if (onAddBattery) {
      onAddBattery(slot);
    }
  };
  
  return (
    <div className={`slot-card ${status}`}>
      <div className="slot-card-header">
        <div className="slot-number">Hộc {slot.slotNumber}</div>
        <div className="slot-status-icon">{getStatusIcon(status)}</div>
      </div>
      
      {hasBattery ? (
        <div className="slot-info">
          <div className="slot-info-row">
            <span className="slot-info-label">Pin ID:</span>
            <span className="slot-info-value">BAT{slot.batteryId}</span>
          </div>
          <div className="slot-info-row">
            <span className="slot-info-label">Mẫu pin:</span>
            <span className="slot-info-value">{slot.batteryModel || 'N/A'}</span>
          </div>
          <div className="slot-info-row">
            <span className="slot-info-label">Mức pin:</span>
            <span className="slot-info-value">{slot.batteryLevel}%</span>
          </div>
          <div className="slot-info-row">
            <span className="slot-info-label">Trạng thái:</span>
            <span className="slot-info-value">{slot.batteryStatus}</span>
          </div>
          
          {slot.batteryLevel !== undefined && (
            <div className="battery-level-bar">
              <div 
                className={`battery-level-fill ${getBatteryLevelClass(slot.batteryLevel)}`}
                style={{ width: `${slot.batteryLevel}%` }}
              ></div>
            </div>
          )}
        </div>
      ) : (
        <div className="slot-empty-text">Không có pin</div>
      )}
    </div>
  );
};

const SlotGridView = ({ slots, onAddBattery }) => {
  if (!slots || slots.length === 0) {
    return (
      <div className="station-empty">
        <div className="station-empty-icon">🔋</div>
        <div className="station-empty-text">Không có hộc sạc nào</div>
        <div className="station-empty-subtext">Trụ này chưa có hộc sạc nào</div>
      </div>
    );
  }

  return (
    <div className="slot-grid">
      {slots.map(slot => (
        <SlotCard 
          key={slot.id || slot.slotId} 
          slot={slot} 
          onAddBattery={onAddBattery}
        />
      ))}
    </div>
  );
};

export default SlotGridView;