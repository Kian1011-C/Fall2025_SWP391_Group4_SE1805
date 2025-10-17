// Swap Battery Helper Functions

/**
 * Get battery level from vehicle object (handles different property names)
 */
export const getBatteryLevel = (vehicle, fallback = 50) => {
  if (!vehicle) return fallback;
  
  // Try different property names - prioritize health as it comes from API
  const level = vehicle.health || vehicle.batteryLevel || vehicle.battery_level;
  
  // If we got a valid number, return it
  if (typeof level === 'number' && level >= 0 && level <= 100) {
    return level;
  }
  
  // Otherwise return fallback (changed from 15 to 50 for better UX)
  console.warn('⚠️ Could not find valid battery level in vehicle:', vehicle);
  return fallback;
};

/**
 * Get vehicle plate number (handles different property names)
 */
export const getVehiclePlate = (vehicle) => {
  if (!vehicle) return 'N/A';
  return vehicle.plateNumber || vehicle.license_plate || vehicle.licensePlate || 'N/A';
};

/**
 * Get vehicle ID (handles different property names)
 */
export const getVehicleId = (vehicle) => {
  if (!vehicle) return null;
  return vehicle.vehicle_id || vehicle.vehicleId || vehicle.id;
};

/**
 * Get user ID (handles different property names)
 */
export const getUserId = (user) => {
  if (!user) return null;
  return user.id || user.user_id;
};

/**
 * Get contract ID (handles different property names)
 */
export const getContractId = (contract) => {
  if (!contract) return null;
  return contract.contract_id || contract.contractId || contract.id;
};

/**
 * Get priority level based on battery percentage
 */
export const getPriorityLevel = (batteryLevel) => {
  if (batteryLevel <= 10) return 'HIGH';
  if (batteryLevel <= 20) return 'MEDIUM';
  return 'LOW';
};

/**
 * Get priority label for display
 */
export const getPriorityLabel = (batteryLevel) => {
  if (batteryLevel <= 10) return 'Cao (Pin yếu)';
  if (batteryLevel <= 20) return 'Trung bình';
  return 'Thấp';
};

/**
 * Format vehicle info for display
 */
export const formatVehicleInfo = (vehicle, batteryLevel) => {
  return {
    plate: getVehiclePlate(vehicle),
    battery: getBatteryLevel(vehicle, batteryLevel),
    model: vehicle?.model || vehicle?.vehicleModel || 'N/A'
  };
};

/**
 * Create QR data for battery swap
 */
export const createSwapQRData = (data) => {
  const { currentUser, selectedVehicle, selectedStation, selectedTower, userContract, currentBatteryLevel, swapResult, isInProgress } = data;
  
  if (isInProgress) {
    return {
      type: 'SWAP_IN_PROGRESS',
      swapId: swapResult?.swapId || `TEMP_${Date.now()}`,
      userId: getUserId(currentUser),
      vehicleId: getVehicleId(selectedVehicle),
      vehiclePlate: getVehiclePlate(selectedVehicle),
      stationId: selectedStation?.id,
      stationName: selectedStation?.name,
      towerId: selectedTower?.id,
      towerNumber: selectedTower?.towerNumber,
      status: 'IN_PROGRESS',
      initiatedAt: new Date().toISOString()
    };
  }
  
  return {
    type: 'BATTERY_SWAP',
    userId: getUserId(currentUser),
    vehicleId: getVehicleId(selectedVehicle),
    vehiclePlate: getVehiclePlate(selectedVehicle),
    stationId: selectedStation?.id,
    stationName: selectedStation?.name,
    towerId: selectedTower?.id,
    towerNumber: selectedTower?.towerNumber,
    contractId: getContractId(userContract),
    batteryLevel: getBatteryLevel(selectedVehicle, currentBatteryLevel),
    timestamp: new Date().toISOString()
  };
};

/**
 * Create staff assistance request data
 */
export const createAssistanceData = (data) => {
  const { currentUser, selectedVehicle, selectedStation, currentBatteryLevel, userContract } = data;
  
  return {
    userId: getUserId(currentUser),
    userName: currentUser?.name || currentUser?.full_name || 'Người dùng',
    userPhone: currentUser?.phone || currentUser?.phoneNumber || '',
    vehicleId: getVehicleId(selectedVehicle),
    vehiclePlate: getVehiclePlate(selectedVehicle),
    vehicleModel: selectedVehicle?.model || selectedVehicle?.vehicleModel || '',
    currentBatteryLevel: getBatteryLevel(selectedVehicle, currentBatteryLevel),
    stationId: selectedStation.id,
    stationName: selectedStation.name,
    stationLocation: selectedStation.location,
    requestType: 'MANUAL_SWAP_ASSISTANCE',
    priority: getPriorityLevel(getBatteryLevel(selectedVehicle, currentBatteryLevel)),
    note: `Khách hàng yêu cầu hỗ trợ đổi pin thủ công tại ${selectedStation.name}. Pin hiện tại: ${getBatteryLevel(selectedVehicle, currentBatteryLevel)}%`,
    requestedAt: new Date().toISOString(),
    contractId: getContractId(userContract)
  };
};

/**
 * Filter slots by status
 */
export const filterSlotsByStatus = (slots) => {
  const fullSlots = [];
  const emptySlots = [];
  
  slots.forEach(slot => {
    if (slot.status === 'occupied' || slot.status === 'full') {
      fullSlots.push(slot);
    } else if (slot.status === 'empty' || slot.status === 'available') {
      emptySlots.push(slot);
    }
  });
  
  return { fullSlots, emptySlots };
};
