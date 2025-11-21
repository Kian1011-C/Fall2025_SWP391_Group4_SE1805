// Vehicle List Component
import React from 'react';
import VehicleCard from './VehicleCard';

const VehicleList = ({ vehicles, onViewDetails }) => {
  if (vehicles.length === 0) {
    return null;
  }

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
      gap: '25px'
    }}>
      {vehicles.map((vehicle, index) => (
        <VehicleCard
          key={`vehicle-${vehicle.vehicleId}-${index}`}
          vehicle={vehicle}
          onClick={onViewDetails}
        />
      ))}
    </div>
  );
};

export default VehicleList;
