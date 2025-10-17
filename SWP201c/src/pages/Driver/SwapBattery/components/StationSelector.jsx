// Station Selector Component - Step 1
import React from 'react';
import { getBatteryLevel, getVehiclePlate } from '../utils/swapHelpers';

const StationSelector = ({
  stations,
  selectedStation,
  selectedVehicle,
  currentBatteryLevel,
  loading,
  error,
  onSelectStation,
  onRetry,
  onRequestStaffAssistance
}) => {
  console.log('🏪 StationSelector render:', { loading, error, stationsCount: stations.length });
  
  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '40px' }}>
        <div className="loading-spinner" style={{ margin: '0 auto' }}></div>
        <p style={{ marginTop: '16px', color: '#666' }}>Đang tải danh sách trạm...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ textAlign: 'center', padding: '40px' }}>
        <p style={{ color: '#f44336', marginBottom: '16px' }}>⚠️ {error}</p>
        <button onClick={onRetry} className="btn-swap btn-next" style={{ display: 'inline-block' }}>
          Thử lại
        </button>
      </div>
    );
  }

  if (stations.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '40px' }}>
        <p style={{ color: '#666' }}>Không có trạm sạc nào khả dụng.</p>
      </div>
    );
  }

  const vehiclePlate = getVehiclePlate(selectedVehicle);
  const batteryLevel = getBatteryLevel(selectedVehicle, currentBatteryLevel);

  console.log('🏪 Stations data:', stations.map(s => ({ 
    name: s.name, 
    status: s.status, 
    statusType: typeof s.status 
  })));

  return (
    <div>
      <h3 style={{ marginBottom: '24px', fontSize: '20px', fontWeight: '600', color: '#333' }}>
        📍 Chọn trạm sạc gần bạn
      </h3>

      {/* DEBUG: Test button */}
      <button 
        onClick={() => {
          console.log('🧪 Test button clicked!');
          if (stations.length > 0) {
            console.log('🧪 First station:', stations[0]);
            console.log('🧪 Calling onSelectStation with:', stations[0].name);
            onSelectStation(stations[0]);
          }
        }}
        style={{
          padding: '10px 20px',
          background: 'red',
          color: 'white',
          border: 'none',
          borderRadius: '8px',
          marginBottom: '20px',
          cursor: 'pointer',
          zIndex: 9999
        }}
      >
        🧪 TEST: Click trạm đầu tiên
      </button>

      {selectedVehicle && (
        <div style={{ marginBottom: '20px', padding: '12px', background: '#e3f2fd', borderRadius: '8px' }}>
          <p style={{ margin: 0, fontSize: '14px', color: '#1976d2' }}>
            🚗 Xe: {vehiclePlate} | 🔋 Pin hiện tại: {batteryLevel}%
          </p>
        </div>
      )}

      <div className="station-list">
        {stations.map((station, index) => {
          // Smart status checking - support multiple formats
          console.log(`🏪 [${index}] Station:`, station.name, 'Raw status:', station.status, 'Type:', typeof station.status);

          let isActive = false;
          let isMaintenance = false;
          let statusDisplay = '';

          // Check different status formats
          if (station.status === undefined || station.status === null) {
            // No status provided - default to active
            console.log('⚠️ No status found, defaulting to ACTIVE');
            isActive = true;
            statusDisplay = '🟢 Hoạt động';
          } else if (typeof station.status === 'string') {
            // String format: 'active', 'Active', 'ACTIVE', 'maintenance', etc.
            const statusLower = station.status.toLowerCase().trim();
            isActive = statusLower === 'active' || statusLower === 'hoạt động' || statusLower === 'available';
            isMaintenance = statusLower === 'maintenance' || statusLower === 'bảo trì' || statusLower === 'inactive';
            statusDisplay = isActive ? '🟢 Hoạt động' : '🔧 Bảo trì';
          } else if (typeof station.status === 'number') {
            // Number format: 1 = active, 0 = inactive
            isActive = station.status === 1 || station.status > 0;
            isMaintenance = station.status === 0 || station.status < 0;
            statusDisplay = isActive ? '🟢 Hoạt động' : '🔧 Bảo trì';
          } else if (typeof station.status === 'boolean') {
            // Boolean format: true = active, false = inactive
            isActive = station.status === true;
            isMaintenance = station.status === false;
            statusDisplay = isActive ? '🟢 Hoạt động' : '🔧 Bảo trì';
          } else {
            // Unknown format - log and default to active
            console.warn('⚠️ Unknown status format:', station.status);
            isActive = true;
            statusDisplay = '🟢 Hoạt động';
          }

          console.log(`✅ Status check result - Active: ${isActive}, Maintenance: ${isMaintenance}`);

          return (
            <div
              key={station.id || index}
              className={`station-card ${selectedStation?.id === station.id ? 'selected' : ''} ${
                isMaintenance ? 'disabled' : ''
              }`}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                
                console.log('🖱️ STATION CLICKED:', station.name);
                console.log('� Click details:', {
                  isActive,
                  isMaintenance,
                  originalStatus: station.status,
                  canSelect: isActive && !isMaintenance
                });
                
                if (isActive && !isMaintenance) {
                  console.log('✅ Station is active, calling onSelectStation');
                  onSelectStation(station);
                } else {
                  console.log('❌ Station is not active, click ignored');
                  alert('Trạm này đang bảo trì. Vui lòng chọn trạm khác.');
                }
              }}
              style={{
                opacity: isMaintenance ? 0.5 : 1,
                cursor: (isActive && !isMaintenance) ? 'pointer' : 'not-allowed',
                pointerEvents: 'auto',
                userSelect: 'none',
                position: 'relative',
                zIndex: 1
              }}
            >
              <div className="station-name">{station.name}</div>
              <div className="station-location">📍 {station.location}</div>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginTop: '12px'
                }}
              >
                <span className={`station-status ${isActive ? 'active' : 'maintenance'}`}>
                  {statusDisplay}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Assistance button chuyển xuống cuối trang (SwapBatteryContainer) */}
    </div>
  );
};

export default StationSelector;
