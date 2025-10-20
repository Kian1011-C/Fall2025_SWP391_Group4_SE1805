// Driver/StationsMap/components/StationDetail.jsx
// Component for displaying detailed station information with towers and slots

import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import stationService from '../../../../assets/js/services/stationService';
import batteryService from '../../../../assets/js/services/batteryService';

const StationDetail = ({ stationId, onClose, onGoToStation }) => {
  const [stationDetail, setStationDetail] = useState(null);
  const [batteries, setBatteries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStationDetail = async () => {
      try {
        setLoading(true);
        setError(null);
        
        console.log('🔍 Fetching station detail for ID:', stationId);
        
        // Fetch station details and batteries in parallel
        const [stationResult, batteriesResult] = await Promise.all([
          stationService.getStationById(stationId),
          batteryService.getBatteriesByStation(stationId)
        ]);
        
        if (stationResult.success) {
          console.log('✅ Station detail loaded:', stationResult.data);
          console.log('🔍 Station detail structure:', {
            status: stationResult.data.status,
            totalBatteries: stationResult.data.totalBatteries,
            chargingBatteries: stationResult.data.chargingBatteries,
            availableBatteries: stationResult.data.availableBatteries,
            towers: stationResult.data.towers
          });
          
          // Set initial station detail (will be updated with battery stats later)
          setStationDetail({
            ...stationResult.data,
            totalBatteries: 0,
            chargingBatteries: 0,
            availableBatteries: 0
          });
        } else {
          throw new Error(stationResult.message || 'Không thể tải thông tin trạm');
        }

        if (batteriesResult.success) {
          console.log('✅ Batteries loaded:', batteriesResult.data);
          const batteriesData = batteriesResult.data || [];
          setBatteries(batteriesData);
          
          // Calculate battery statistics from batteries data
          const totalBatteries = batteriesData.length;
          const chargingBatteries = batteriesData.filter(b => b.status === 'charging' || b.status === 'CHARGING').length;
          const availableBatteries = batteriesData.filter(b => b.status === 'available' || b.status === 'AVAILABLE').length;
          
          console.log('📊 Calculated battery stats:', {
            totalBatteries,
            chargingBatteries,
            availableBatteries
          });
          
          // Update station detail with calculated stats
          setStationDetail(prev => ({
            ...prev,
            totalBatteries,
            chargingBatteries,
            availableBatteries
          }));
        } else {
          console.warn('⚠️ Could not load batteries:', batteriesResult.message);
          setBatteries([]);
          // Keep station detail with 0 stats if batteries API fails
        }
      } catch (err) {
        console.error('❌ Error fetching station detail:', err);
        setError(err.message || 'Lỗi khi tải thông tin trạm');
      } finally {
        setLoading(false);
      }
    };

    if (stationId) {
      fetchStationDetail();
    }
  }, [stationId]);

  if (loading) {
    return (
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'rgba(0, 0, 0, 0.8)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000
      }}>
        <div style={{
          background: 'rgba(26, 32, 44, 0.95)',
          padding: '40px',
          borderRadius: '15px',
          textAlign: 'center',
          color: '#FFFFFF',
          maxWidth: '400px',
          width: '90%'
        }}>
          <div style={{
            fontSize: '3rem',
            marginBottom: '20px',
            animation: 'pulse 1.5s ease-in-out infinite'
          }}>
            🏢
          </div>
          <h3 style={{ marginBottom: '10px', color: '#FFFFFF' }}>
            Đang tải thông tin trạm...
          </h3>
          <p style={{ color: '#B0B0B0', fontSize: '0.95rem' }}>
            Vui lòng chờ trong giây lát
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'rgba(0, 0, 0, 0.8)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000
      }}>
        <div style={{
          background: 'rgba(26, 32, 44, 0.95)',
          padding: '40px',
          borderRadius: '15px',
          textAlign: 'center',
          color: '#FFFFFF',
          maxWidth: '500px',
          width: '90%'
        }}>
          <div style={{ fontSize: '3rem', marginBottom: '20px' }}>⚠️</div>
          <h3 style={{ marginBottom: '10px', color: '#ff6b6b' }}>
            Lỗi tải dữ liệu
          </h3>
          <p style={{ color: '#ff6b6b', marginBottom: '20px' }}>
            {error}
          </p>
          <button
            onClick={onClose}
            style={{
              padding: '10px 20px',
              background: '#19c37d',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '1rem',
              fontWeight: '600'
            }}
          >
            Đóng
          </button>
        </div>
      </div>
    );
  }

  if (!stationDetail) {
    return null;
  }

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0, 0, 0, 0.8)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      padding: '20px'
    }}>
      <div style={{
        background: 'rgba(26, 32, 44, 0.95)',
        borderRadius: '15px',
        padding: '30px',
        maxWidth: '800px',
        width: '100%',
        maxHeight: '90vh',
        overflowY: 'auto',
        color: '#FFFFFF'
      }}>
        {/* Header */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '25px',
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
          paddingBottom: '20px'
        }}>
          <div>
            <h2 style={{ margin: 0, fontSize: '1.5rem', fontWeight: '700' }}>
              {stationDetail.stationName || stationDetail.name}
            </h2>
            <p style={{ margin: '5px 0 0 0', color: '#B0B0B0', fontSize: '0.95rem' }}>
              📍 {stationDetail.address}
            </p>
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'rgba(255, 107, 107, 0.2)',
              border: '1px solid rgba(255, 107, 107, 0.3)',
              color: '#ff6b6b',
              padding: '8px 16px',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '0.9rem',
              fontWeight: '600'
            }}
          >
            ✕ Đóng
          </button>
        </div>

        {/* Station Info */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '20px',
          marginBottom: '30px'
        }}>
          <div style={{
            background: 'rgba(25, 195, 125, 0.1)',
            border: '1px solid rgba(25, 195, 125, 0.3)',
            borderRadius: '10px',
            padding: '15px',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '1.5rem', marginBottom: '8px' }}>🏢</div>
            <div style={{ fontSize: '0.9rem', color: '#B0B0B0', marginBottom: '5px' }}>Trạng thái</div>
            <div style={{ fontSize: '1.1rem', fontWeight: '600', color: '#19c37d' }}>
              {stationDetail.status === 'active' || stationDetail.status === 'Hoạt động' ? 'Đang hoạt động' : 'Ngưng hoạt động'}
            </div>
          </div>

          <div style={{
            background: 'rgba(0, 123, 255, 0.1)',
            border: '1px solid rgba(0, 123, 255, 0.3)',
            borderRadius: '10px',
            padding: '15px',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '1.5rem', marginBottom: '8px' }}>🔋</div>
            <div style={{ fontSize: '0.9rem', color: '#B0B0B0', marginBottom: '5px' }}>Tổng pin</div>
            <div style={{ fontSize: '1.1rem', fontWeight: '600', color: '#007bff' }}>
              {stationDetail.totalBatteries || stationDetail.totalBatteryCount || stationDetail.batteryCount || 0}
            </div>
          </div>

          <div style={{
            background: 'rgba(255, 165, 0, 0.1)',
            border: '1px solid rgba(255, 165, 0, 0.3)',
            borderRadius: '10px',
            padding: '15px',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '1.5rem', marginBottom: '8px' }}>⚡</div>
            <div style={{ fontSize: '0.9rem', color: '#B0B0B0', marginBottom: '5px' }}>Đang sạc</div>
            <div style={{ fontSize: '1.1rem', fontWeight: '600', color: '#ffa500' }}>
              {stationDetail.chargingBatteries || stationDetail.chargingBatteryCount || stationDetail.batteriesCharging || 0}
            </div>
          </div>

          <div style={{
            background: 'rgba(40, 167, 69, 0.1)',
            border: '1px solid rgba(40, 167, 69, 0.3)',
            borderRadius: '10px',
            padding: '15px',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '1.5rem', marginBottom: '8px' }}>✅</div>
            <div style={{ fontSize: '0.9rem', color: '#B0B0B0', marginBottom: '5px' }}>Sẵn sàng</div>
            <div style={{ fontSize: '1.1rem', fontWeight: '600', color: '#28a745' }}>
              {stationDetail.availableBatteries || stationDetail.availableBatteryCount || stationDetail.batteriesAvailable || 0}
            </div>
          </div>
        </div>

        {/* Towers and Slots */}
        {stationDetail.towers && stationDetail.towers.length > 0 && (
          <div style={{ marginBottom: '30px' }}>
            <h3 style={{ 
              fontSize: '1.2rem', 
              fontWeight: '600', 
              marginBottom: '20px',
              color: '#FFFFFF'
            }}>
              🏗️ Danh sách trụ sạc
            </h3>
            <div style={{
              display: 'grid',
              gap: '15px'
            }}>
              {stationDetail.towers.map((tower, index) => (
                <div key={tower.id || index} style={{
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: '10px',
                  padding: '20px'
                }}>
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '15px'
                  }}>
                    <h4 style={{ 
                      margin: 0, 
                      fontSize: '1.1rem', 
                      fontWeight: '600',
                      color: '#FFFFFF'
                    }}>
                      Trụ {tower.towerNumber || tower.id}
                    </h4>
                    <span style={{
                      padding: '4px 12px',
                      borderRadius: '12px',
                      fontSize: '0.8rem',
                      fontWeight: '600',
                      backgroundColor: tower.status === 'active' ? 'rgba(25, 195, 125, 0.2)' : 'rgba(255, 107, 107, 0.2)',
                      color: tower.status === 'active' ? '#19c37d' : '#ff6b6b'
                    }}>
                      {tower.status === 'active' ? 'Hoạt động' : 'Ngưng hoạt động'}
                    </span>
                  </div>

                  {/* Tower Stats */}
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
                    gap: '10px',
                    marginBottom: '15px'
                  }}>
                    <div style={{ textAlign: 'center' }}>
                      <div style={{ fontSize: '0.9rem', color: '#B0B0B0' }}>Tổng slot</div>
                      <div style={{ fontSize: '1.1rem', fontWeight: '600', color: '#007bff' }}>
                        {tower.totalSlots || 0}
                      </div>
                    </div>
                    <div style={{ textAlign: 'center' }}>
                      <div style={{ fontSize: '0.9rem', color: '#B0B0B0' }}>Trống</div>
                      <div style={{ fontSize: '1.1rem', fontWeight: '600', color: '#28a745' }}>
                        {tower.availableSlots || 0}
                      </div>
                    </div>
                    <div style={{ textAlign: 'center' }}>
                      <div style={{ fontSize: '0.9rem', color: '#B0B0B0' }}>SOH trung bình</div>
                      <div style={{ fontSize: '1.1rem', fontWeight: '600', color: '#ffa500' }}>
                        {tower.averageSOH || 0}%
                      </div>
                    </div>
                  </div>

                  {/* Slots */}
                  {tower.slots && tower.slots.length > 0 && (
                    <div>
                      <h5 style={{ 
                        fontSize: '0.95rem', 
                        fontWeight: '600', 
                        marginBottom: '10px',
                        color: '#B0B0B0'
                      }}>
                        📍 Slots:
                      </h5>
                      <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fill, minmax(80px, 1fr))',
                        gap: '8px'
                      }}>
                        {tower.slots.map((slot, slotIndex) => (
                          <div key={slot.id || slotIndex} style={{
                            background: slot.status === 'available' ? 'rgba(25, 195, 125, 0.1)' : 
                                       slot.status === 'charging' ? 'rgba(255, 165, 0, 0.1)' : 
                                       'rgba(255, 107, 107, 0.1)',
                            border: slot.status === 'available' ? '1px solid rgba(25, 195, 125, 0.3)' : 
                                   slot.status === 'charging' ? '1px solid rgba(255, 165, 0, 0.3)' : 
                                   '1px solid rgba(255, 107, 107, 0.3)',
                            borderRadius: '6px',
                            padding: '8px',
                            textAlign: 'center',
                            fontSize: '0.8rem'
                          }}>
                            <div style={{ fontWeight: '600' }}>
                              Slot {slot.slotNumber || slot.id}
                            </div>
                            <div style={{ 
                              color: slot.status === 'available' ? '#19c37d' : 
                                     slot.status === 'charging' ? '#ffa500' : '#ff6b6b',
                              fontSize: '0.75rem'
                            }}>
                              {slot.status === 'available' ? '✅ Sẵn sàng' : 
                               slot.status === 'charging' ? '🔄 Sạc' : '❌ Trống'}
                            </div>
                            {slot.batteryLevel && (
                              <div style={{ fontSize: '0.7rem', color: '#B0B0B0' }}>
                                {slot.batteryLevel}%
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Batteries List */}
        {batteries && batteries.length > 0 && (
          <div style={{ marginBottom: '30px' }}>
            <h3 style={{ 
              fontSize: '1.2rem', 
              fontWeight: '600', 
              marginBottom: '20px',
              color: '#FFFFFF'
            }}>
              🔋 Danh sách pin tại trạm
            </h3>
            <div style={{
              display: 'grid',
              gap: '15px'
            }}>
              {batteries.map((battery, index) => (
                <div key={battery.id || index} style={{
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: '10px',
                  padding: '20px'
                }}>
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '15px'
                  }}>
                    <h4 style={{ 
                      margin: 0, 
                      fontSize: '1.1rem', 
                      fontWeight: '600',
                      color: '#FFFFFF'
                    }}>
                      Pin {battery.batteryId || battery.id}
                    </h4>
                    <span style={{
                      padding: '4px 12px',
                      borderRadius: '12px',
                      fontSize: '0.8rem',
                      fontWeight: '600',
                      backgroundColor: battery.status === 'available' ? 'rgba(25, 195, 125, 0.2)' : 
                                     battery.status === 'charging' ? 'rgba(255, 165, 0, 0.2)' : 
                                     'rgba(255, 107, 107, 0.2)',
                      color: battery.status === 'available' ? '#19c37d' : 
                             battery.status === 'charging' ? '#ffa500' : '#ff6b6b'
                    }}>
                      {battery.status === 'available' ? 'Sẵn sàng' : 
                       battery.status === 'charging' ? 'Đang sạc' : 
                       battery.status === 'in_use' ? 'Đang sử dụng' : battery.status}
                    </span>
                  </div>

                  {/* Battery Info */}
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
                    gap: '10px',
                    marginBottom: '15px'
                  }}>
                    <div style={{ textAlign: 'center' }}>
                      <div style={{ fontSize: '0.9rem', color: '#B0B0B0' }}>Mức pin</div>
                      <div style={{ fontSize: '1.1rem', fontWeight: '600', color: '#007bff' }}>
                        {battery.batteryLevel || battery.level || 0}%
                      </div>
                    </div>
                    <div style={{ textAlign: 'center' }}>
                      <div style={{ fontSize: '0.9rem', color: '#B0B0B0' }}>SOH</div>
                      <div style={{ fontSize: '1.1rem', fontWeight: '600', color: '#ffa500' }}>
                        {battery.batterySOH || battery.soh || 0}%
                      </div>
                    </div>
                    <div style={{ textAlign: 'center' }}>
                      <div style={{ fontSize: '0.9rem', color: '#B0B0B0' }}>Model</div>
                      <div style={{ fontSize: '1.1rem', fontWeight: '600', color: '#28a745' }}>
                        {battery.batteryModel || battery.model || 'N/A'}
                      </div>
                    </div>
                  </div>

                  {/* Slot and Tower Info */}
                  {(battery.slotId || battery.towerId) && (
                    <div style={{
                      background: 'rgba(255, 255, 255, 0.05)',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      borderRadius: '8px',
                      padding: '12px',
                      marginTop: '10px'
                    }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem' }}>
                        <span style={{ color: '#B0B0B0' }}>
                          📍 Slot: {battery.slotId || battery.slotNumber || 'N/A'}
                        </span>
                        <span style={{ color: '#B0B0B0' }}>
                          🏗️ Trụ: {battery.towerId || battery.towerNumber || 'N/A'}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Operating Hours */}
        {stationDetail.operatingHours && (
          <div style={{
            background: 'rgba(255, 255, 255, 0.05)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '10px',
            padding: '15px',
            marginBottom: '20px'
          }}>
            <h4 style={{ 
              margin: '0 0 10px 0', 
              fontSize: '1rem', 
              fontWeight: '600',
              color: '#FFFFFF'
            }}>
              🕒 Giờ hoạt động
            </h4>
            <p style={{ margin: 0, color: '#B0B0B0' }}>
              {stationDetail.operatingHours}
            </p>
          </div>
        )}

        {/* Action Buttons */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '15px',
          marginTop: '30px'
        }}>
          {onGoToStation && (
            <button
              onClick={() => onGoToStation(stationDetail)}
              style={{
                padding: '12px 24px',
                background: 'linear-gradient(135deg, #007bff 0%, #0056b3 100%)',
                color: '#fff',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '1rem',
                fontWeight: '600',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                boxShadow: '0 4px 12px rgba(0, 123, 255, 0.3)',
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={(e) => {
                e.target.style.transform = 'translateY(-2px)';
                e.target.style.boxShadow = '0 6px 16px rgba(0, 123, 255, 0.4)';
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = '0 4px 12px rgba(0, 123, 255, 0.3)';
              }}
            >
              🗺️ Đi đến trạm
            </button>
          )}
          <button
            onClick={onClose}
            style={{
              padding: '12px 24px',
              background: '#6c757d',
              color: '#fff',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '1rem',
              fontWeight: '600'
            }}
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
};

StationDetail.propTypes = {
  stationId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  onClose: PropTypes.func.isRequired,
  onGoToStation: PropTypes.func
};

export default StationDetail;
