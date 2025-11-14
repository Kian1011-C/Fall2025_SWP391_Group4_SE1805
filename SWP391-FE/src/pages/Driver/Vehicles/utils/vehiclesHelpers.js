// Driver/Vehicles/utils/vehiclesHelpers.js
// Pure helper functions for vehicles management

/**
 * Get user ID from user object
 */
export const getUserId = (user) => {
  if (!user) return null;
  return user.id || user.user_id || user.userId;
};

/**
 * Normalize vehicle data with ID
 */
export const normalizeVehicle = (vehicle, index) => {
  return {
    ...vehicle,
    id: vehicle.id || vehicle.vehicleId || vehicle.vehicle_id || (index + 1)
  };
};

/**
 * Normalize contract data
 */
export const normalizeContract = (contractData) => {
  return {
    id: contractData.contractId || contractData.id || contractData.contractNumber,
    contractNumber: contractData.contractNumber,
    planName: contractData.planName || contractData.plan || `Contract ${contractData.contractNumber}`,
    status: contractData.status || 'active',
    startDate: contractData.startDate,
    endDate: contractData.endDate,
    monthlyFee: contractData.monthlyFee || contractData.monthlyBaseFee,
    monthlyTotalFee: contractData.monthlyTotalFee,
    monthlyDistance: contractData.monthlyDistance || contractData.distance,
    vehiclePlate: contractData.vehiclePlate || contractData.vehicleLicensePlate,
    vehicleId: contractData.vehicleId || contractData.vehicle_id
  };
};

/**
 * Normalize plate number (remove spaces, dots, hyphens)
 */
export const normalizePlateNumber = (plate) => {
  if (!plate) return '';
  return plate.toString().replace(/[\s.-]/g, '').toUpperCase();
};

/**
 * Find contract for vehicle
 */
export const findVehicleContract = (vehicle, contracts) => {
  if (!vehicle || !contracts || contracts.length === 0) return null;

  const foundContract = contracts.find(contract => {
    // Match by ID (if both exist)
    const matchById = vehicle.id && contract.vehicleId && 
                     (contract.vehicleId === vehicle.id || 
                      contract.vehicleId === parseInt(vehicle.id));

    // Match by plate number (normalized)
    const vehiclePlateNorm = normalizePlateNumber(vehicle.plateNumber);
    const contractPlateNorm = normalizePlateNumber(contract.vehiclePlate);
    const matchByPlate = vehiclePlateNorm && contractPlateNorm && 
                        vehiclePlateNorm === contractPlateNorm;

    return matchById || matchByPlate;
  });

  return foundContract;
};

/**
 * Get updated vehicle from session storage
 */
export const getUpdatedVehicleFromSession = () => {
  try {
    const updatedVehicleStr = sessionStorage.getItem('selectedVehicle');
    if (updatedVehicleStr) {
      const updatedVehicle = JSON.parse(updatedVehicleStr);
      console.log(' Found updated vehicle in session:', updatedVehicle);
      return updatedVehicle;
    }
  } catch (err) {
    console.warn(' Failed to parse updated vehicle from session:', err);
  }
  return null;
};

/**
 * Update vehicle battery level from session data
 */
export const updateVehicleBatteryLevel = (vehicle, updatedVehicle) => {
  if (!updatedVehicle) return vehicle;

  if (vehicle.id === updatedVehicle.id || 
      vehicle.plateNumber === updatedVehicle.plateNumber) {
    console.log(' Updating vehicle battery:', vehicle.plateNumber, 
               'from', vehicle.batteryLevel, 'to', updatedVehicle.batteryLevel);
    return {
      ...vehicle,
      batteryLevel: updatedVehicle.batteryLevel || updatedVehicle.health,
      health: updatedVehicle.batteryLevel || updatedVehicle.health
    };
  }
  return vehicle;
};

/**
 * Process vehicles list with session updates
 */
export const processVehiclesList = (vehiclesList) => {
  // Normalize vehicles
  let processed = vehiclesList.map((vehicle, index) => 
    normalizeVehicle(vehicle, index)
  );

  // Check for updated vehicle in session
  const updatedVehicle = getUpdatedVehicleFromSession();
  if (updatedVehicle) {
    processed = processed.map(vehicle => 
      updateVehicleBatteryLevel(vehicle, updatedVehicle)
    );
  }

  return processed;
};

/**
 * Extract vehicles from API response
 */
export const extractVehiclesFromResponse = (response) => {
  if (!response.success) return [];

  if (response.vehicles) {
    return response.vehicles;
  } else if (response.data && response.data.vehicles) {
    return response.data.vehicles;
  }

  return [];
};

/**
 * Get battery type options
 */
export const getBatteryTypeOptions = () => [
  { value: 'LiFePO4-60kWh', label: 'LiFePO4 - 60kWh' },
  { value: 'LiFePO4-80kWh', label: 'LiFePO4 - 80kWh' },
  { value: 'Li-ion-60kWh', label: 'Li-ion - 60kWh' },
  { value: 'Li-ion-80kWh', label: 'Li-ion - 80kWh' }
];

/**
 * Get battery health color
 */
export const getBatteryHealthColor = (batteryLevel) => {
  if (batteryLevel >= 80) return '#19c37d'; // Green
  if (batteryLevel >= 50) return '#6ab7ff'; // Blue
  if (batteryLevel >= 20) return '#ffa500'; // Orange
  return '#ff6b6b'; // Red
};

/**
 * Get battery health status
 */
export const getBatteryHealthStatus = (batteryLevel) => {
  if (batteryLevel >= 80) return 'Tốt';
  if (batteryLevel >= 50) return 'Khá';
  if (batteryLevel >= 20) return 'Thấp';
  return 'Rất thấp';
};

/**
 * Validate vehicle form data
 */
export const validateVehicleForm = (formData) => {
  const errors = {};

  if (!formData.plateNumber || formData.plateNumber.trim() === '') {
    errors.plateNumber = 'Vui lòng nhập biển số xe';
  }

  if (!formData.vehicleModel || formData.vehicleModel.trim() === '') {
    errors.vehicleModel = 'Vui lòng nhập mẫu xe';
  }

  if (!formData.vinNumber || formData.vinNumber.trim() === '') {
    errors.vinNumber = 'Vui lòng nhập số VIN';
  } else if (formData.vinNumber.length !== 17) {
    errors.vinNumber = 'Số VIN phải có 17 ký tự';
  }

  if (!formData.batteryType) {
    errors.batteryType = 'Vui lòng chọn loại pin';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

/**
 * Get initial form data
 */
export const getInitialFormData = () => ({
  plateNumber: '',
  vehicleModel: '',
  vinNumber: '',
  batteryType: 'LiFePO4-60kWh'
});

/**
 * Create vehicle data for API
 */
export const createVehicleData = (formData, userId) => {
  return {
    plateNumber: formData.plateNumber.trim(),
    vehicleModel: formData.vehicleModel.trim(),
    vinNumber: formData.vinNumber.trim(),
    batteryType: formData.batteryType,
    userId: userId
  };
};
