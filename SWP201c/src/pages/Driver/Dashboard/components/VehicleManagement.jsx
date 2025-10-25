// Vehicle Management Section Component
import React from 'react';
import SelectedVehicleDisplay from './SelectedVehicleDisplay';
import VehicleList from './VehicleList';

const VehicleManagement = ({ 
  vehicles, 
  contracts, 
  selectedVehicle, 
  onSelectVehicle 
}) => {
  if (vehicles.length === 0 && contracts.length === 0) return null;

  return (
    <div style={{
      background: 'rgba(26, 32, 44, 0.8)',
      borderRadius: '20px',
      padding: '30px',
      border: '1px solid rgba(255, 255, 255, 0.1)',
      marginBottom: '30px'
    }}>
      <h3 style={{ 
        color: '#FFFFFF', 
        marginBottom: '20px',
        fontSize: '1.3rem',
        display: 'flex',
        alignItems: 'center',
        gap: '10px'
      }}>
        🚗 Xe và Gói dịch vụ
      </h3>

      {/* Selected Vehicle Display */}
      <SelectedVehicleDisplay 
        selectedVehicle={selectedVehicle} 
        contracts={contracts} 
      />

      {/* Vehicle List */}
      <VehicleList
        vehicles={vehicles}
        selectedVehicle={selectedVehicle}
        onSelectVehicle={onSelectVehicle}
        contracts={contracts}
      />
    </div>
  );
};

export default VehicleManagement;
