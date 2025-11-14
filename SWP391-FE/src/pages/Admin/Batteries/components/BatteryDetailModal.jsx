import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import './BatteryDetailModal.css';

const BatteryDetailModal = ({ isOpen, onClose, battery }) => {
  const [chargingHistory, setChargingHistory] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isOpen && battery) {
      fetchChargingHistory();
    }
  }, [isOpen, battery]);

  const fetchChargingHistory = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`http://localhost:8080/api/batteries/${battery.batteryId}/charging-history`);
      const data = await response.json();
      if (data.success) {
        setChargingHistory(data.data);
      }
    } catch (error) {
      console.error('Error fetching charging history:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen || !battery) return null;

  const getHealthColor = (health) => {
    if (health >= 90) return '#4ade80';
    if (health >= 75) return '#fbbf24';
    if (health >= 50) return '#fb923c';
    return '#ef4444';
  };

  const getCycleStatus = (cycles) => {
    if (cycles < 1000) return { text: 'Mới', color: '#4ade80' };
    if (cycles < 2000) return { text: 'Tốt', color: '#fbbf24' };
    if (cycles < 2500) return { text: 'Cần chú ý', color: '#fb923c' };
    return { text: 'Cần thay', color: '#ef4444' };
  };

  const modalContent = (
    <div className="battery-detail-overlay" onClick={onClose}>
      <div className="battery-detail-content" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="battery-detail-header">
          <div>
            <h2> Chi tiết Pin BAT{battery.batteryId}</h2>
            <p className="battery-detail-model">{battery.model}</p>
          </div>
          <button onClick={onClose} className="battery-detail-close"></button>
        </div>

        {isLoading ? (
          <div className="battery-detail-loading">
            <div className="spinner"></div>
            <p>Đang tải dữ liệu...</p>
          </div>
        ) : (
          <div className="battery-detail-body">
            {/* Main Stats */}
            <div className="battery-detail-stats-grid">
              <div className="battery-detail-stat-card">
                <div className="stat-icon"></div>
                <div className="stat-content">
                  <span className="stat-label">Dung lượng hiện tại</span>
                  <h3 className="stat-value" style={{ color: getHealthColor(battery.stateOfHealth) }}>
                    {battery.stateOfHealth}%
                  </h3>
                  <div className="stat-bar">
                    <div 
                      className="stat-bar-fill" 
                      style={{ 
                        width: `${battery.stateOfHealth}%`,
                        backgroundColor: getHealthColor(battery.stateOfHealth)
                      }}
                    ></div>
                  </div>
                </div>
              </div>

              <div className="battery-detail-stat-card">
                <div className="stat-icon"></div>
                <div className="stat-content">
                  <span className="stat-label">Chu kỳ sạc</span>
                  <h3 className="stat-value">{battery.cycleCount || 0}</h3>
                  <span 
                    className="stat-badge"
                    style={{ backgroundColor: getCycleStatus(battery.cycleCount || 0).color }}
                  >
                    {getCycleStatus(battery.cycleCount || 0).text}
                  </span>
                </div>
              </div>

              <div className="battery-detail-stat-card">
                <div className="stat-icon"></div>
                <div className="stat-content">
                  <span className="stat-label">Dung lượng tối đa</span>
                  <h3 className="stat-value">
                    {chargingHistory ? 
                      `${(100 - (chargingHistory.capacityDegradation || 0)).toFixed(1)}%` : 
                      `${((battery.capacity / 100) * 100).toFixed(1)}%`
                    }
                  </h3>
                  <span className="stat-subtitle">Còn lại so với ban đầu</span>
                </div>
              </div>

              <div className="battery-detail-stat-card">
                <div className="stat-icon"></div>
                <div className="stat-content">
                  <span className="stat-label">Trạng thái</span>
                  <h3 className="stat-value">
                    <span className={`status-badge ${battery.status?.toLowerCase()}`}>
                      {battery.status}
                    </span>
                  </h3>
                </div>
              </div>
            </div>

            {/* Charging History Data */}
            {chargingHistory && (
              <div className="battery-detail-section">
                <h3 className="section-title"> Thông tin chu kỳ sạc</h3>
                <div className="battery-detail-info-grid">
                  <div className="info-item">
                    <span className="info-label">Tổng chu kỳ sạc:</span>
                    <span className="info-value">{chargingHistory.totalChargingCycles}</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">Tổng lần thay pin:</span>
                    <span className="info-value">{chargingHistory.totalSwaps}</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">Độ chai pin:</span>
                    <span className="info-value text-warning">
                      {chargingHistory.capacityDegradation?.toFixed(2)}%
                    </span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">Dung lượng còn lại:</span>
                    <span className="info-value text-success">
                      {(100 - chargingHistory.capacityDegradation).toFixed(2)}%
                    </span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">Dung lượng thực tế:</span>
                    <span className="info-value">{chargingHistory.currentCapacity} kWh</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">Dung lượng ước tính ban đầu:</span>
                    <span className="info-value">{chargingHistory.estimatedOriginalCapacity} kWh</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">Chu kỳ còn lại:</span>
                    <span className="info-value text-success">{chargingHistory.remainingCycles}</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">Tiến độ tuổi thọ:</span>
                    <span className="info-value">{chargingHistory.lifecycleProgress}%</span>
                  </div>
                </div>

                {/* Lifecycle Progress Bar */}
                <div className="lifecycle-progress">
                  <div className="progress-header">
                    <span>Vòng đời pin</span>
                    <span>{chargingHistory.totalChargingCycles} / 3000 chu kỳ</span>
                  </div>
                  <div className="progress-bar-container">
                    <div 
                      className="progress-bar-fill"
                      style={{ 
                        width: `${Math.min(100, chargingHistory.lifecycleProgress)}%`,
                        backgroundColor: chargingHistory.lifecycleProgress > 80 ? '#ef4444' : 
                                       chargingHistory.lifecycleProgress > 60 ? '#fb923c' : 
                                       chargingHistory.lifecycleProgress > 40 ? '#fbbf24' : '#4ade80'
                      }}
                    ></div>
                  </div>
                </div>
              </div>
            )}

            {/* Degradation Info */}
            <div className="battery-detail-section degradation-info">
              <h3 className="section-title"> Thông tin độ chai pin</h3>
              <p className="degradation-text">
                 <strong>Cơ chế độ chai:</strong> Mỗi chu kỳ sạc đầy (100%), pin giảm <strong>0.00667%</strong> dung lượng.
              </p>
              <p className="degradation-text">
                 <strong>Ước tính:</strong> Sau khoảng <strong>3000 chu kỳ</strong>, pin còn ~80% dung lượng ban đầu.
              </p>
              <p className="degradation-text">
                ⏰ <strong>Chu kỳ sạc:</strong> Được tính tự động mỗi khi pin đạt 100% SOH (State of Health).
              </p>
              <p className="degradation-text">
                 <strong>Hệ thống tự động:</strong> Service chạy mỗi 6 giây để cập nhật trạng thái sạc và tính toán độ chai.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
};

export default BatteryDetailModal;
