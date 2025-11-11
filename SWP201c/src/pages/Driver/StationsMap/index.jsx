// Driver/StationsMap/index.jsx
// Container component for StationsMap page - orchestrates stations display with Google Maps

import React from 'react';
import DashboardLayout from '../../../layouts/DashboardLayout';
import { useStationsData, useStationSelection } from './hooks';
import stationService from '../../../assets/js/services/stationService';
import {
  StationsMapHeader,
  StationsList,
  StationsMapView
} from './components';

const StationsMap = () => {
  // Data fetching
  const { stations, loading, error, refetch } = useStationsData();

  // Station selection (for future map integration)
  const { selectedStation, selectStation } = useStationSelection();
  const [towers, setTowers] = React.useState([]);
  const [showTowers, setShowTowers] = React.useState(false);

  const handleSelect = async (station) => {
    console.log('🔍 Selecting station:', station);
    selectStation(station);
    try {
      console.log('📡 Calling GET /api/stations/' + station.id + ' for station details...');
      
      // Sử dụng API mới GET /api/stations/{id} để lấy chi tiết trạm
      const stationDetail = await stationService.getStationById(station.id);
      console.log('📡 Station detail API Response:', stationDetail);
      
      if (stationDetail.success && stationDetail.data) {
        const towers = stationDetail.data.towers || stationDetail.data.cabinets || [];
        setTowers(towers);
        console.log('✅ Towers set from station detail:', towers);
        
        // Log thông tin chi tiết trạm
        console.log('🏢 Station details:', {
          id: stationDetail.data.id,
          name: stationDetail.data.name,
          address: stationDetail.data.address,
          status: stationDetail.data.status,
          availableSlots: stationDetail.data.availableSlots,
          totalSlots: stationDetail.data.totalSlots,
          towers: towers.length
        });
      } else {
        console.log('❌ Station detail API failed:', stationDetail.message);
        setTowers([]);
      }
      setShowTowers(true);
    } catch (error) {
      console.error('💥 Station detail API Error:', error);
      setTowers([]);
      setShowTowers(true);
    }
  };

  // SỬ DỤNG STATS TỪ API THAY VÌ TÍNH TOÁN
  // const stats = getStationsStats(stations); // Đã loại bỏ

  // Loading state
  if (loading) {
    return (
      <DashboardLayout role="driver">
        <div style={{ 
          padding: '20px', 
          textAlign: 'center',
          color: '#FFFFFF' 
        }}>
          <div style={{
            fontSize: '3rem',
            marginBottom: '15px',
            animation: 'pulse 1.5s ease-in-out infinite'
          }}>
            🗺️
          </div>
          <p style={{ fontSize: '1.125rem' }}>Đang tải bản đồ trạm...</p>
          <style>
            {`
              @keyframes pulse {
                0%, 100% { opacity: 1; transform: scale(1); }
                50% { opacity: 0.7; transform: scale(1.1); }
              }
            `}
          </style>
        </div>
      </DashboardLayout>
    );
  }

  // Error state
  if (error) {
    return (
      <DashboardLayout role="driver">
        <div style={{ 
          padding: '20px',
          textAlign: 'center'
        }}>
          <div style={{
            background: 'rgba(255, 107, 107, 0.1)',
            border: '1px solid rgba(255, 107, 107, 0.3)',
            borderRadius: '12px',
            padding: '30px',
            maxWidth: '500px',
            margin: '0 auto'
          }}>
            <div style={{ fontSize: '3rem', marginBottom: '15px' }}>⚠️</div>
            <h3 style={{ color: '#ff6b6b', marginBottom: '10px' }}>
              Lỗi tải dữ liệu
            </h3>
            <p style={{ color: '#ff6b6b', marginBottom: '20px' }}>
              {error}
            </p>
            <button
              onClick={refetch}
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
              Thử lại
            </button>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout role="driver">
      <div style={{ padding: '20px' }}>
        {/* Header */}
        <StationsMapHeader />

        {/* Google Maps View - Hiển thị bản đồ với các trạm */}
        <div style={{ marginTop: '20px' }}>
          <StationsMapView 
            stations={stations} 
            onStationSelect={handleSelect}
          />
        </div>

        {/* Danh sách trạm dạng thẻ (bên dưới map) */}
        <div style={{ marginTop: '20px' }}>
          <h3 style={{ color: '#FFFFFF', marginBottom: '15px' }}>
            📋 Danh sách Trạm
          </h3>
          <StationsList
            stations={stations}
            onSelect={handleSelect}
          />
        </div>

        {/* Debug info for selected station */}
        {selectedStation && import.meta.env.VITE_ENABLE_DEBUG === 'true' && (
          <div style={{
            marginTop: '20px',
            padding: '15px',
            background: 'rgba(255, 165, 0, 0.1)',
            border: '1px solid rgba(255, 165, 0, 0.3)',
            borderRadius: '10px',
            color: '#ffa500',
            fontSize: '0.875rem'
          }}>
            <strong>🔧 Selected Station:</strong> {selectedStation.name}
          </div>
        )}

        {showTowers && (
          <div 
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'rgba(0, 0, 0, 0.7)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 1000
            }}
            onClick={() => setShowTowers(false)}
          >
            <div 
              onClick={(e) => e.stopPropagation()} 
              style={{
                maxWidth: '500px',
                width: '90vw',
                background: 'rgba(11, 17, 33, 0.95)',
                borderRadius: '12px',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                boxShadow: '0 20px 40px rgba(0, 0, 0, 0.3)'
              }}
            >
              <div style={{ 
                padding: '20px', 
                borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <h3 style={{ margin: 0, color: '#FFFFFF', fontSize: '1.25rem' }}>
                  Trụ tại {selectedStation?.name}
                </h3>
                <button
                  onClick={() => setShowTowers(false)}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#B0B0B0',
                    fontSize: '1.5rem',
                    cursor: 'pointer',
                    padding: '4px'
                  }}
                >
                  ×
                </button>
              </div>
              <div style={{ padding: '20px' }}>
                {towers.length === 0 ? (
                  <div style={{ 
                    color: '#B0B0B0', 
                    textAlign: 'center',
                    padding: '20px'
                  }}>
                    Chưa có dữ liệu trụ.
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {towers.map((tower, index) => (
                      <div 
                        key={tower.id || tower.towerId || `tower-${index}`} 
                        style={{
                          background: 'rgba(255, 255, 255, 0.05)',
                          border: '1px solid rgba(255, 255, 255, 0.1)',
                          borderRadius: '8px',
                          padding: '16px',
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center'
                        }}
                      >
                        <div>
                          <div style={{ color: '#FFFFFF', fontWeight: '600', marginBottom: '4px' }}>
                            Trụ #{tower.id}
                          </div>
                          <div style={{ color: '#B0B0B0', fontSize: '0.9rem' }}>
                            {tower.name || tower.code || 'N/A'}
                          </div>
                        </div>
                        <div style={{
                          padding: '6px 12px',
                          borderRadius: '20px',
                          fontSize: '0.8rem',
                          fontWeight: '600',
                          backgroundColor: tower.status === 'active' && tower.available ? 
                            'rgba(25, 195, 125, 0.2)' : 'rgba(255, 107, 107, 0.2)',
                          color: tower.status === 'active' && tower.available ? 
                            '#19c37d' : '#ff6b6b'
                        }}>
                          {tower.status === 'active' && tower.available ? 'Sẵn sàng' : 'Bận'}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default StationsMap;
