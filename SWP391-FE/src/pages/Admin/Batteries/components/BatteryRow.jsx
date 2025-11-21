import React from 'react';

const BatteryRow = ({ battery, onEdit, onDelete, onViewDetail }) => {
  // Get health class
  const getHealthClass = (health) => {
    if (health >= 80) return 'high';
    if (health >= 50) return 'medium';
    return 'low';
  };

  // Format status for display
  const formatStatus = (status) => {
    const statusMap = {
      'available': 'available',
      'in_stock': 'in_stock',
      'charging': 'charging',
      'faulty': 'maintenance',
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
          <span className="admin-battery-id-icon"></span>
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
              className={`admin-battery-health-fill ${getHealthClass(battery.capacity)}`}
              style={{ width: `${battery.capacity}%` }}
            ></div>
          </div>
          <span className="admin-battery-health-text">{battery.capacity}%</span>
        </div>
      </td>

      {/* Cycles */}
      <td>
        <div className="admin-battery-cycles">
          <span className="admin-battery-cycles-icon"></span>
          <div className="admin-battery-cycles-info">
            <span className="admin-battery-cycles-text">{battery.cycleCount || 0}</span>
            {battery.cycleCount > 2000 && (
              <span className="admin-battery-cycles-warning" title="Pin đã qua nhiều chu kỳ sạc"></span>
            )}
            {battery.cycleCount > 2500 && (
              <span className="admin-battery-cycles-critical" title="Nên thay pin sớm"></span>
            )}
          </div>
        </div>
      </td>

      {/* Actions */}
      <td>
        <div className="admin-battery-actions">
          <button 
            onClick={() => onViewDetail(battery)} 
            className="admin-battery-action-btn view"
            title="Xem chi tiết"
          >
             Chi tiết
          </button>
          <button 
            onClick={() => onEdit(battery)} 
            className="admin-battery-action-btn edit"
          >
             Sửa
          </button>
          <button 
            onClick={() => onDelete(battery)} 
            className="admin-battery-action-btn delete"
          >
             Xóa
          </button>
        </div>
      </td>
    </tr>
  );
};

export default BatteryRow;