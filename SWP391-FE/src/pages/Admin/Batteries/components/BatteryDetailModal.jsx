import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import './BatteryDetailModal.css';

// Component hiển thị lịch sử swap
const HistoryItem = ({ swap }) => {
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      const date = new Date(dateString);
      return date.toLocaleString('vi-VN', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (e) {
      return dateString;
    }
  };

  const getRoleBadge = (role) => {
    if (role === 'INSTALLED') {
      return <span style={{ background: '#166534', color: '#86efac', padding: '2px 8px', borderRadius: '10px', fontSize: '10px' }}>Đã gắn</span>;
    } else if (role === 'REMOVED') {
      return <span style={{ background: '#dc2626', color: '#fecaca', padding: '2px 8px', borderRadius: '10px', fontSize: '10px' }}>Đã tháo</span>;
    }
    return null;
  };

  return (
    <div style={{ 
      padding: '12px', 
      background: '#0f172a', 
      borderRadius: '8px', 
      marginBottom: '8px',
      border: '1px solid #334155'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
        <div style={{ fontWeight: '600', color: 'white' }}>
          {swap.userName || 'N/A'}
        </div>
        {getRoleBadge(swap.batteryRole)}
      </div>
      <div style={{ fontSize: '12px', color: '#94a3b8', marginBottom: '4px' }}>
        Trạm: {swap.stationName || 'N/A'}
      </div>
      <div style={{ fontSize: '12px', color: '#94a3b8', marginBottom: '4px' }}>
        Thời gian: {formatDate(swap.swapDate)}
      </div>
      <div style={{ fontSize: '12px', color: '#94a3b8' }}>
        Trạng thái: {swap.swapStatus || 'N/A'}
      </div>
    </div>
  );
};

const BatteryDetailModal = ({ isOpen, onClose, battery }) => {
  const [chargingHistory, setChargingHistory] = useState(null);
  const [swapHistory, setSwapHistory] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isOpen && battery) {
      setIsLoading(true);
      // Simulate API call delay với mock data
      setTimeout(() => {
        loadMockData();
        setIsLoading(false);
      }, 500);
    } else {
      // Reset data when modal closes
      setSwapHistory([]);
      setCurrentUser(null);
    }
  }, [isOpen, battery]);

  const loadMockData = () => {
    if (!battery) return;
    
    const batteryId = battery.batteryId || battery.id;
    const status = battery.status?.toLowerCase();

    // Mock lịch sử swap
    const mockHistory = [
      {
        swapId: 101,
        stationId: 1,
        stationName: 'Trạm Sạc Quận 1',
        userName: 'Nguyễn Văn A',
        vehicleId: 5,
        oldBatteryId: batteryId === 1 ? 2 : batteryId - 1,
        newBatteryId: batteryId,
        swapDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
        swapStatus: 'COMPLETED',
        batteryRole: 'INSTALLED'
      },
      {
        swapId: 98,
        stationId: 2,
        stationName: 'Trạm Sạc Quận 3',
        userName: 'Trần Thị B',
        vehicleId: 8,
        oldBatteryId: batteryId,
        newBatteryId: batteryId === 1 ? 2 : batteryId - 1,
        swapDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
        swapStatus: 'COMPLETED',
        batteryRole: 'REMOVED'
      },
      {
        swapId: 95,
        stationId: 1,
        stationName: 'Trạm Sạc Quận 1',
        userName: 'Lê Văn C',
        vehicleId: 3,
        oldBatteryId: batteryId === 1 ? 5 : batteryId - 3,
        newBatteryId: batteryId,
        swapDate: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
        swapStatus: 'COMPLETED',
        batteryRole: 'INSTALLED'
      },
      {
        swapId: 92,
        stationId: 3,
        stationName: 'Trạm Sạc Quận 7',
        userName: 'Phạm Thị D',
        vehicleId: 12,
        oldBatteryId: batteryId,
        newBatteryId: batteryId === 1 ? 3 : batteryId - 2,
        swapDate: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000).toISOString(),
        swapStatus: 'COMPLETED',
        batteryRole: 'REMOVED'
      },
      {
        swapId: 88,
        stationId: 1,
        stationName: 'Trạm Sạc Quận 1',
        userName: 'Hoàng Văn E',
        vehicleId: 7,
        oldBatteryId: batteryId === 1 ? 8 : batteryId - 4,
        newBatteryId: batteryId,
        swapDate: new Date(Date.now() - 35 * 24 * 60 * 60 * 1000).toISOString(),
        swapStatus: 'COMPLETED',
        batteryRole: 'INSTALLED'
      }
    ];

    // Mock thông tin user đang sử dụng (chỉ khi status là IN_USE)
    const mockCurrentUser = (status === 'in_use' || status === 'in-use') ? {
      userId: 'USER' + (batteryId * 10),
      firstName: 'Nguyễn',
      lastName: 'Văn A',
      fullName: 'Nguyễn Văn A',
      email: `user${batteryId}@example.com`,
      phone: '090' + String(batteryId).padStart(7, '0'),
      vehicle: {
        vehicleId: batteryId * 2,
        plateNumber: `51A-${String(batteryId * 100).padStart(5, '0')}`,
        model: 'VinFast VF8'
      },
      contractId: batteryId * 10
    } : null;

    setSwapHistory(mockHistory);
    setCurrentUser(mockCurrentUser);
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

            {/* Thông tin người dùng đang sử dụng */}
            {(battery.status?.toLowerCase() === 'in_use' || battery.status?.toLowerCase() === 'in-use') && (
              <div className="battery-detail-section" style={{ background: '#0f172a', border: '1px solid #334155', borderRadius: '8px', padding: '16px' }}>
                <h3 className="section-title">Người dùng đang sử dụng</h3>
                {isLoading ? (
                  <div style={{ color: '#94a3b8', fontSize: '14px' }}>Đang tải...</div>
                ) : currentUser ? (
                  <div className="battery-detail-info-grid">
                    <div className="info-item">
                      <span className="info-label">Tên người dùng:</span>
                      <span className="info-value">{currentUser.fullName || `${currentUser.firstName || ''} ${currentUser.lastName || ''}`.trim()}</span>
                    </div>
                    <div className="info-item">
                      <span className="info-label">Email:</span>
                      <span className="info-value">{currentUser.email || 'N/A'}</span>
                    </div>
                    <div className="info-item">
                      <span className="info-label">Số điện thoại:</span>
                      <span className="info-value">{currentUser.phone || 'N/A'}</span>
                    </div>
                    {currentUser.vehicle && (
                      <>
                        <div className="info-item">
                          <span className="info-label">Biển số xe:</span>
                          <span className="info-value">{currentUser.vehicle.plateNumber || 'N/A'}</span>
                        </div>
                        <div className="info-item">
                          <span className="info-label">Mẫu xe:</span>
                          <span className="info-value">{currentUser.vehicle.model || 'N/A'}</span>
                        </div>
                      </>
                    )}
                  </div>
                ) : (
                  <div style={{ color: '#94a3b8', fontSize: '14px' }}>Không tìm thấy thông tin người dùng</div>
                )}
              </div>
            )}

            {/* Lịch sử swap */}
            <div className="battery-detail-section">
              <h3 className="section-title">Lịch sử đổi pin ({swapHistory.length})</h3>
              {isLoading ? (
                <div style={{ color: '#94a3b8', fontSize: '14px', padding: '20px', textAlign: 'center' }}>Đang tải lịch sử...</div>
              ) : swapHistory.length > 0 ? (
                <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
                  {swapHistory.map((swap, index) => (
                    <HistoryItem key={swap.swapId || index} swap={swap} />
                  ))}
                </div>
              ) : (
                <div style={{ 
                  padding: '20px', 
                  textAlign: 'center', 
                  color: '#94a3b8', 
                  fontSize: '14px',
                  background: '#0f172a',
                  borderRadius: '8px',
                  border: '1px solid #334155'
                }}>
                  Chưa có lịch sử đổi pin
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
};

export default BatteryDetailModal;
