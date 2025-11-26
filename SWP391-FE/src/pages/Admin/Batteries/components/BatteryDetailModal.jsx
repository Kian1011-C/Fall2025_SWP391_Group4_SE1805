import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import './BatteryDetailModal.css';

// Component hiển thị lịch sử swap
const HistoryItem = ({ swap }) => {
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      const date = new Date(dateString);
      const hours = String(date.getHours()).padStart(2, '0');
      const minutes = String(date.getMinutes()).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const year = date.getFullYear();
      return `${hours}:${minutes} ${day}/${month}/${year}`;
    } catch {
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
        Thời gian: {formatDate(swap.swapTime || swap.swapDate)}
      </div>
      <div style={{ fontSize: '12px', color: '#94a3b8' }}>
        Trạng thái: {swap.status || swap.swapStatus || 'N/A'}
      </div>
    </div>
  );
};

const BatteryDetailModal = ({ isOpen, onClose, battery }) => {
  const [swapHistory, setSwapHistory] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const loadBatteryData = async () => {
      if (!isOpen || !battery) {
        setSwapHistory([]);
        setCurrentUser(null);
        return;
      }
      
      const batteryId = battery.batteryId || battery.id;
      
      try {
        setIsLoading(true);
        
        // Import apiUtils
        const { apiUtils } = await import('../../../../assets/js/config/api.js');
        
        // Gọi API GET /api/batteries/{id}/history
        const response = await apiUtils.get(`/api/batteries/${batteryId}/history`);
        
        if (response.success && response.data) {
          // Normalize data
          const normalizedData = response.data.map(swap => ({
            ...swap,
            swapTime: swap.swapTime || swap.swapDate,
            status: swap.status || swap.swapStatus
          }));
          
          // Sắp xếp theo thời gian mới nhất trước
          const sortedHistory = normalizedData.sort((a, b) => {
            const dateA = new Date(a.swapTime);
            const dateB = new Date(b.swapTime);
            return dateB - dateA;
          });
          
          setSwapHistory(sortedHistory);

          // Nếu pin đang IN_USE, lấy thông tin user từ lịch sử swap gần nhất
          const batteryStatus = battery.status?.toLowerCase();
          const isInUse = batteryStatus === 'in_use' || batteryStatus === 'in-use';
          
          if (isInUse && sortedHistory.length > 0) {
            const latestInstalled = sortedHistory.find(swap => {
              const isNewBattery = (swap.newBatteryId == batteryId);
              const isInstalled = swap.batteryRole === 'INSTALLED';
              const isCompleted = swap.status === 'COMPLETED' || swap.swapStatus === 'COMPLETED';
              return isNewBattery && isInstalled && isCompleted;
            });
            
            if (latestInstalled) {
              setCurrentUser({
                fullName: latestInstalled.userName,
                vehicle: {
                  plateNumber: latestInstalled.vehiclePlateNumber || 'N/A',
                  model: latestInstalled.vehicleModel || 'N/A'
                }
              });
            } else {
              const latestSwap = sortedHistory.find(swap => swap.userName);
              if (latestSwap) {
                setCurrentUser({
                  fullName: latestSwap.userName,
                  vehicle: latestSwap.vehiclePlateNumber ? {
                    plateNumber: latestSwap.vehiclePlateNumber,
                    model: latestSwap.vehicleModel || 'N/A'
                  } : null
                });
              } else {
                setCurrentUser(null);
              }
            }
          } else {
            setCurrentUser(null);
          }
        } else {
          setSwapHistory([]);
          setCurrentUser(null);
        }
      } catch (error) {
        console.error('Error loading battery history:', error);
        setSwapHistory([]);
        setCurrentUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    loadBatteryData();
  }, [isOpen, battery]);

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
                  <span className="stat-label">Độ chai pin</span>
                  <h3 className="stat-value">
                    {battery.capacity?.toFixed(1)}%
                  </h3>
                  <span className="stat-subtitle">Tình trạng sức khỏe</span>
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

            {/* Battery Health Info */}
            <div className="battery-detail-section degradation-info">
              <h3 className="section-title"> Thông tin độ chai pin</h3>
              <p className="degradation-text">
                 <strong>Dung lượng (State of Health):</strong> Mức pin hiện tại, thể hiện phần trăm năng lượng còn lại trong pin.
              </p>
              <p className="degradation-text">
                 <strong>Độ chai (Capacity):</strong> Tình trạng sức khỏe của pin, giảm dần qua mỗi chu kỳ sạc.
              </p>
              <p className="degradation-text">
                ⚠️ <strong>Bảo trì:</strong> Khi độ chai pin (Capacity) ≤ 85%, pin tự động chuyển sang trạng thái bảo trì.
              </p>
              <p className="degradation-text">
                 <strong>Chu kỳ sạc:</strong> Số lần pin đã được sạc đầy, ảnh hưởng đến độ bền của pin.
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
