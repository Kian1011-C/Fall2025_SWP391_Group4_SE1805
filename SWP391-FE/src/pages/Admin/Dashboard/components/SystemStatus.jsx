import React from 'react';

const SystemStatus = ({ stats }) => {
  const getStatusColor = (percentage) => {
    if (percentage >= 80) return '#10b981';
    if (percentage >= 50) return '#f59e0b';
    return '#ef4444';
  };

  const batteryUtilization = stats?.activeBatteries && stats?.totalBatteries 
    ? Math.round((stats.activeBatteries / stats.totalBatteries) * 100) 
    : 75;

  const stationOperational = 98;
  const systemUptime = 99.9;
  const userSatisfaction = 94;

  const StatusItem = ({ label, value, unit = '%', icon }) => {
    const color = getStatusColor(value);
    return (
      <div className="status-item">
        <div className="status-item-header">
          <span className="status-icon">{icon}</span>
          <span className="status-label">{label}</span>
        </div>
        <div className="status-bar-container">
          <div className="status-bar">
            <div 
              className="status-bar-fill" 
              style={{ 
                width: `${value}%`,
                backgroundColor: color
              }}
            />
          </div>
          <span className="status-value" style={{ color }}>
            {value}{unit}
          </span>
        </div>
      </div>
    );
  };

  return (
    <div className="system-status">
      <h2>Trạng thái Hệ thống</h2>
      
      <div className="status-list">
        <StatusItem
          label="Pin khả dụng"
          value={batteryUtilization}
          icon="🔋"
        />
        <StatusItem
          label="Trạm hoạt động"
          value={stationOperational}
          icon="🏢"
        />
        <StatusItem
          label="Uptime hệ thống"
          value={systemUptime}
          icon="⚡"
        />
        <StatusItem
          label="Độ hài lòng"
          value={userSatisfaction}
          icon="⭐"
        />
      </div>

      <div className="status-alerts">
        <h3>Cảnh báo</h3>
        <div className="alert-list">
          <div className="alert-item alert-warning">
            <span className="alert-icon">⚠️</span>
            <div className="alert-content">
              <div className="alert-title">Pin tại Trạm #5 cần bảo trì</div>
              <div className="alert-time">2 giờ trước</div>
            </div>
          </div>
          <div className="alert-item alert-info">
            <span className="alert-icon">ℹ️</span>
            <div className="alert-content">
              <div className="alert-title">Cập nhật hệ thống sắp diễn ra</div>
              <div className="alert-time">5 giờ trước</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SystemStatus;
