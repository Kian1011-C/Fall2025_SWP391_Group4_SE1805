// Vehicle Card Component
import React from 'react';

const VehicleCard = ({ vehicle, isSelected, onClick, contracts }) => {
  // Filter contracts for this vehicle
  const vehicleContracts = contracts.filter(
    contract => contract.vehiclePlate === vehicle.plateNumber || 
               contract.vehicleId === vehicle.id ||
               (contracts.length === 1) // Single vehicle case
  );

  const getBatteryColor = (level) => {
    if (level > 70) return { bg: 'rgba(25, 195, 125, 0.2)', color: '#19c37d' };
    if (level > 30) return { bg: 'rgba(255, 165, 0, 0.2)', color: '#ffa500' };
    return { bg: 'rgba(255, 107, 107, 0.2)', color: '#ff6b6b' };
  };

  const batteryColor = getBatteryColor(vehicle.batteryLevel);

  return (
    <div
      onClick={onClick}
      style={{
        background: isSelected ? 'rgba(25, 195, 125, 0.1)' : 'rgba(255, 255, 255, 0.05)',
        border: isSelected ? '2px solid rgba(25, 195, 125, 0.5)' : '1px solid rgba(255, 255, 255, 0.1)',
        borderRadius: '12px',
        padding: '15px',
        cursor: 'pointer',
        transition: 'all 0.3s ease'
      }}
      onMouseEnter={(e) => {
        if (!isSelected) {
          e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)';
          e.currentTarget.style.border = '1px solid rgba(255, 255, 255, 0.2)';
        }
      }}
      onMouseLeave={(e) => {
        if (!isSelected) {
          e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
          e.currentTarget.style.border = '1px solid rgba(255, 255, 255, 0.1)';
        }
      }}
    >
      {/* Vehicle Info */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '10px'
      }}>
        <div>
          <div style={{ 
            color: isSelected ? '#19c37d' : '#FFFFFF', 
            fontSize: '1rem', 
            fontWeight: '600',
            marginBottom: '3px'
          }}>
            {isSelected ? '⭐ ' : ''}{vehicle.model}
          </div>
          <div style={{ 
            color: '#19c37d', 
            fontSize: '0.9rem', 
            fontWeight: '500' 
          }}>
            {vehicle.plateNumber}
          </div>
        </div>
        <div style={{
          background: batteryColor.bg,
          color: batteryColor.color,
          padding: '4px 10px',
          borderRadius: '12px',
          fontSize: '0.8rem',
          fontWeight: '600'
        }}>
          🔋 {vehicle.batteryLevel}%
        </div>
      </div>

      {/* Odometer */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        color: '#B0B0B0', 
        fontSize: '0.8rem',
        marginBottom: '8px'
      }}>
        <span>📏 Quãng đường:</span>
        <span>{(vehicle.current_odometer || vehicle.currentOdometer || 0)?.toLocaleString()} km</span>
      </div>
      
      {/* Contracts */}
      {vehicleContracts.length > 0 && (
        <div style={{ 
          borderTop: '1px solid rgba(255, 255, 255, 0.1)', 
          paddingTop: '8px',
          marginTop: '8px'
        }}>
          <div style={{ 
            color: '#B0B0B0', 
            fontSize: '0.8rem',
            marginBottom: '5px',
            fontWeight: '600'
          }}>
            💎 Gói dịch vụ ({vehicleContracts.length})
          </div>
          {vehicleContracts.slice(0, 2).map((contract, contractIndex) => (
            <div key={contract.id || contractIndex} style={{
              background: 'rgba(255, 255, 255, 0.05)',
              borderRadius: '6px',
              padding: '6px 8px',
              marginBottom: '4px',
              fontSize: '0.7rem'
            }}>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <span style={{ color: '#FFFFFF', fontWeight: '500' }}>
                  {contract.planName}
                </span>
                <span style={{
                  background: contract.status === 'active' ? 'rgba(25, 195, 125, 0.3)' : 'rgba(255, 165, 0, 0.3)',
                  color: contract.status === 'active' ? '#19c37d' : '#ffa500',
                  padding: '2px 6px',
                  borderRadius: '8px',
                  fontSize: '0.6rem',
                  fontWeight: '600'
                }}>
                  {contract.status === 'active' ? '✅' : '⏳'}
                </span>
              </div>
              <div style={{ 
                color: '#19c37d', 
                fontSize: '0.6rem',
                marginTop: '2px'
              }}>
                {contract.monthlyFee ? `${contract.monthlyFee.toLocaleString()} VND/tháng` : 'Liên hệ để biết giá'}
              </div>
            </div>
          ))}
          {vehicleContracts.length > 2 && (
            <div style={{
              color: '#B0B0B0',
              fontSize: '0.6rem',
              textAlign: 'center',
              marginTop: '4px'
            }}>
              +{vehicleContracts.length - 2} gói khác
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default VehicleCard;
