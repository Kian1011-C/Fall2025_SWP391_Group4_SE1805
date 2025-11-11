// Selected Vehicle Display Component
import React from 'react';
import { useNavigate } from 'react-router-dom';

const SelectedVehicleDisplay = ({ selectedVehicle, contracts }) => {
  const navigate = useNavigate();

  if (!selectedVehicle) return null;

  // Filter contracts for selected vehicle
  const selectedVehicleContracts = contracts.filter(
    contract => contract.vehiclePlate === selectedVehicle.plateNumber || 
               contract.vehicleId === selectedVehicle.id ||
               (contracts.length === 1) // Single vehicle case
  );

  // Lấy odometer - sử dụng dữ liệu từ API, không dùng mock data
  const odometer = selectedVehicle.currentOdometer !== null && selectedVehicle.currentOdometer !== undefined
    ? selectedVehicle.currentOdometer
    : (selectedVehicle.current_odometer !== null && selectedVehicle.current_odometer !== undefined
      ? selectedVehicle.current_odometer
      : null);

  return (
    <div style={{
      background: 'linear-gradient(135deg, rgba(25, 195, 125, 0.1), rgba(106, 183, 255, 0.1))',
      border: '2px solid rgba(25, 195, 125, 0.3)',
      borderRadius: '15px',
      padding: '20px',
      marginBottom: '25px'
    }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '15px'
      }}>
        <div>
          <div style={{ 
            color: '#19c37d', 
            fontSize: '0.9rem', 
            fontWeight: '600',
            marginBottom: '5px'
          }}>
            ⭐ XE ĐANG CHỌN
          </div>
          <div style={{ color: '#FFFFFF', fontSize: '1.3rem', fontWeight: '700' }}>
            {selectedVehicle.model}
          </div>
          <div style={{ color: '#19c37d', fontSize: '1.1rem', fontWeight: '600' }}>
            {selectedVehicle.plateNumber}
          </div>
          <div style={{ color: '#93C5FD', fontSize: '0.95rem', marginTop: '4px' }}>
            ID pin: {selectedVehicle.batteryId || selectedVehicle.battery_id || selectedVehicle.currentBatteryId || selectedVehicle.current_battery_id || selectedVehicle.batteryCode || selectedVehicle.battery_code || 'N/A'}
          </div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ color: '#B0B0B0', fontSize: '0.9rem', marginBottom: '5px' }}>
            📏 {odometer !== null ? `${odometer.toLocaleString()} km` : 'N/A'}
          </div>
          {selectedVehicleContracts.length > 0 && (
            <div style={{ color: '#B0B0B0', fontSize: '0.8rem' }}>
              💎 {selectedVehicleContracts.length} gói dịch vụ
            </div>
          )}
        </div>
      </div>
      <div style={{
        display: 'flex',
        gap: '10px',
        marginTop: '15px'
      }}>
        <button
          onClick={() => {
            console.log('🔋 Navigating to SwapBattery with vehicle:', selectedVehicle);
            
            // LƯU selectedVehicle vào sessionStorage
            try {
              sessionStorage.setItem('selectedVehicle', JSON.stringify(selectedVehicle));
              console.log('✅ Đã lưu selectedVehicle vào sessionStorage:', selectedVehicle);
            } catch (err) {
              console.error('❌ Lỗi khi lưu selectedVehicle:', err);
            }
            
            navigate('/driver/swap-battery', { state: { selectedVehicle } });
          }}
          style={{
            background: 'linear-gradient(135deg, #19c37d, #15a36a)',
            color: 'white',
            border: 'none',
            borderRadius: '10px',
            padding: '12px 20px',
            cursor: 'pointer',
            fontSize: '0.9rem',
            fontWeight: '600',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}
        >
          🔋 Đổi pin xe này
        </button>
        <button
          onClick={() => navigate('/driver/stations-map', { state: { selectedVehicle } })}
          style={{
            background: 'rgba(106, 183, 255, 0.2)',
            color: '#6ab7ff',
            border: '1px solid rgba(106, 183, 255, 0.3)',
            borderRadius: '10px',
            padding: '12px 20px',
            cursor: 'pointer',
            fontSize: '0.9rem',
            fontWeight: '600',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}
        >
          🗺️ Tìm trạm
        </button>
      </div>
    </div>
  );
};

export default SelectedVehicleDisplay;
