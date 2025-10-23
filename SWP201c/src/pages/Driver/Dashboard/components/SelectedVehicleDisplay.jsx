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

  const getBatteryStyle = (level) => {
    if (level > 70) return { bg: 'rgba(25, 195, 125, 0.3)', color: '#19c37d' };
    if (level > 30) return { bg: 'rgba(255, 165, 0, 0.3)', color: '#ffa500' };
    return { bg: 'rgba(255, 107, 107, 0.3)', color: '#ff6b6b' };
  };

  const batteryStyle = getBatteryStyle(selectedVehicle.batteryLevel);

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
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{
            background: batteryStyle.bg,
            color: batteryStyle.color,
            padding: '8px 15px',
            borderRadius: '20px',
            fontSize: '1.1rem',
            fontWeight: '700',
            marginBottom: '10px'
          }}>
            🔋 {selectedVehicle.batteryLevel}%
          </div>
          <div style={{ color: '#B0B0B0', fontSize: '0.9rem', marginBottom: '5px' }}>
            📏 {(selectedVehicle.current_odometer || selectedVehicle.currentOdometer || 0)?.toLocaleString()} km
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
