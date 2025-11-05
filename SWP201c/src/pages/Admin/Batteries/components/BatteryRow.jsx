import React from 'react';

const BatteryRow = ({ battery, onEdit, onDelete }) => {
  // Get health class
  const getHealthClass = (health) => {
    if (health >= 80) return 'high';
    if (health >= 50) return 'medium';
    return 'low';
  };
  
  // Get degradation info based on cycle count
  const getDegradationInfo = (cycleCount) => {
    if (cycleCount >= 1000) return { level: 'high', text: 'Chai nhiều', color: '#dc2626' };
    if (cycleCount >= 500) return { level: 'medium', text: 'Chai vừa', color: '#f59e0b' };
    return { level: 'low', text: 'Tốt', color: '#16a34a' };
  };

  // Format status for display
  const formatStatus = (status) => {
    const statusMap = {
      'available': 'available',
      'in_stock': 'in_stock',
      'charging': 'charging',
      'maintenance': 'maintenance',
      'in_use': 'in_use',
      'low': 'low'
    };
    return statusMap[status?.toLowerCase()] || status?.toLowerCase() || 'unknown';
  };

  const displayStatus = (status) => {
    const statusDisplay = {
      'available': 'Sẵn sàng',
      'in_stock': 'Trong kho',
      'charging': 'Đang sạc',
      'maintenance': 'Bảo trì',
      'in_use': 'Đang dùng',
      'low': 'Yếu'
    };
    return statusDisplay[formatStatus(status)] || status;
  };

  return (
    <tr>
      {/* Battery ID */}
      <td>
        <div className="admin-battery-id">
          <span className="admin-battery-id-icon">🔋</span>
          <span className="admin-battery-id-text">BAT{battery.batteryId}</span>
        </div>
      </td>

      {/* Model */}
      <td>
        <span className="admin-battery-model">{battery.model}</span>
      </td>

      {/* Status */}
      <td>
        <span className={`admin-battery-status ${formatStatus(battery.status)}`}>
          {displayStatus(battery.status)}
        </span>
      </td>

      {/* Health */}
      <td>
        <div className="admin-battery-health">
          <div className="admin-battery-health-bar">
            <div 
              className={`admin-battery-health-fill ${getHealthClass(battery.stateOfHealth)}`}
              style={{ width: `${battery.stateOfHealth}%` }}
            ></div>
          </div>
          <span className="admin-battery-health-text">{battery.stateOfHealth}%</span>
        </div>
      </td>

      {/* Cycles */}
      <td>
        <div className="admin-battery-cycles">
          <span className="admin-battery-cycles-icon">🔄</span>
          <span className="admin-battery-cycles-text">{battery.cycleCount || 0}</span>
          <span 
            className="admin-battery-degradation-badge"
            style={{ 
              marginLeft: '8px',
              fontSize: '11px',
              padding: '2px 6px',
              borderRadius: '4px',
              background: getDegradationInfo(battery.cycleCount || 0).color + '22',
              color: getDegradationInfo(battery.cycleCount || 0).color,
              fontWeight: '600'
            }}
          >
            {getDegradationInfo(battery.cycleCount || 0).text}
          </span>
        </div>
      </td>

      {/* Actions */}
      <td>
        <div className="admin-battery-actions">
          <button 
            onClick={() => onEdit(battery)} 
            className="admin-battery-action-btn edit"
          >
            ✏️ Sửa
          </button>
          <button 
            onClick={() => onDelete(battery)} 
            className="admin-battery-action-btn delete"
          >
            🗑️ Xóa
          </button>
        </div>
      </td>
    </tr>
  );
};

export default BatteryRow;