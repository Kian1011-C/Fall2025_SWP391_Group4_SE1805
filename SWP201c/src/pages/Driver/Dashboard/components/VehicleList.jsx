// Vehicle List Component
import React from 'react';
import VehicleCard from './VehicleCard';

const VehicleList = ({ vehicles, selectedVehicle, onSelectVehicle, contracts }) => {
  if (vehicles.length === 0) return null;

  return (
    <div style={{ marginBottom: '25px' }}>
      <h4 style={{ 
        color: '#FFFFFF', 
        marginBottom: '15px',
        fontSize: '1.1rem',
        fontWeight: '600'
      }}>
        🚗 Chọn xe ({vehicles.length} xe)
      </h4>
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: '15px'
      }}>
        {vehicles.map((vehicle, index) => {
          const isSelected = selectedVehicle?.id === vehicle.id || 
                           (selectedVehicle?.plateNumber === vehicle.plateNumber && !vehicle.id);
          return (
            <VehicleCard
              key={vehicle.id || index}
              vehicle={vehicle}
              isSelected={isSelected}
              onClick={() => onSelectVehicle(vehicle)}
              contracts={contracts}
            />
          );
        })}
      </div>
    </div>
  );
};

export default VehicleList;
