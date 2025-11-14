// Driver/Dashboard/utils/dashboardHelpers.js
// Pure helper functions for dashboard

/**
 * Format currency to VND
 */
export const formatCurrency = (amount) => {
  if (!amount) return '0₫';
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    minimumFractionDigits: 0
  }).format(amount);
};

/**
 * Format number with thousand separators
 */
export const formatNumber = (number) => {
  if (!number) return '0';
  return new Intl.NumberFormat('vi-VN').format(number);
};

/**
 * Get user ID from various user object formats
 */
export const getUserId = (user) => {
  return user?.id || user?.user_id || user?.userId;
};

/**
 * Process vehicles from API response
 */
export const processVehicles = (userVehicles) => {
  if (!userVehicles || !Array.isArray(userVehicles)) return [];
  // Deduplicate by id or plateNumber to avoid duplicate cards
  const seen = new Set();
  const unique = [];
  for (const vehicle of userVehicles) {
    const key = `${vehicle.vehicleId || vehicle.id || ''}::${vehicle.plateNumber || vehicle.plate_number || ''}`;
    if (seen.has(key)) continue;
    seen.add(key);
    unique.push(vehicle);
  }
  
  return unique.map(vehicle => {
    // Lấy batteryLevel - ưu tiên từ API, không dùng 0 làm mock
    const batteryLevel = vehicle.health !== null && vehicle.health !== undefined 
      ? vehicle.health 
      : (vehicle.batteryLevel !== null && vehicle.batteryLevel !== undefined 
        ? vehicle.batteryLevel 
        : null);
    
    // Lấy odometer - ưu tiên từ API, không dùng 0 làm mock
    const currentOdometer = vehicle.currentOdometer !== null && vehicle.currentOdometer !== undefined
      ? vehicle.currentOdometer
      : (vehicle.current_odometer !== null && vehicle.current_odometer !== undefined
        ? vehicle.current_odometer
        : null);
    
    return {
      id: vehicle.vehicleId || vehicle.id,
      plateNumber: vehicle.plateNumber || vehicle.plate_number,
      model: vehicle.vehicleModel || vehicle.model,
      batteryLevel: batteryLevel,
      currentOdometer: currentOdometer,
      current_odometer: currentOdometer,
      batteryId: vehicle.batteryId || vehicle.battery_id || vehicle.current_battery_id,
      batteryModel: vehicle.batteryModel || vehicle.battery_model,
      batteryType: vehicle.batteryType || vehicle.battery_type,
      vinNumber: vehicle.vinNumber || vehicle.vin_number,
      compatibleBatteryTypes: vehicle.compatibleBatteryTypes || vehicle.compatible_battery_types,
      ...vehicle
    };
  });
};

/**
 * Update vehicles with session storage data
 */
export const updateVehiclesFromSession = (processedVehicles) => {
  const updatedVehicleStr = sessionStorage.getItem('selectedVehicle');
  if (!updatedVehicleStr) return processedVehicles;

  try {
    const updatedVehicle = JSON.parse(updatedVehicleStr);
    console.log(' Found updated vehicle in session:', updatedVehicle);
    
    return processedVehicles.map(vehicle => {
      const idMatch = vehicle.id === updatedVehicle.id;
      const plateMatch = vehicle.plateNumber === updatedVehicle.plateNumber;
      
      if (idMatch || plateMatch) {
        console.log(' MATCH! Updating vehicle battery:', vehicle.plateNumber, 
                   'from', vehicle.batteryLevel, 'to', updatedVehicle.batteryLevel);
        return {
          ...vehicle,
          batteryLevel: updatedVehicle.batteryLevel || updatedVehicle.health,
          health: updatedVehicle.batteryLevel || updatedVehicle.health
        };
      }
      return vehicle;
    });
  } catch (err) {
    console.warn(' Failed to parse updated vehicle:', err);
    return processedVehicles;
  }
};

/**
 * Process contracts from API response
 */
export const processContracts = (contractsData, userDashboard) => {
  if (!contractsData || contractsData.length === 0) {
    // Fallback to dashboard data
    if (userDashboard?.contractNumber) {
      return [{
        id: userDashboard.contractNumber,
        contractNumber: userDashboard.contractNumber,
        planName: 'Contract ' + userDashboard.contractNumber,
        status: userDashboard.contractStatus || 'active',
        startDate: userDashboard.contractStartDate,
        endDate: userDashboard.contractEndDate,
        monthlyTotalFee: null,
        monthlyDistance: null,
        vehiclePlate: userDashboard.vehiclePlate
      }];
    }
    return [];
  }

  return contractsData.map(contractData => ({
    id: contractData.contractId || contractData.id || contractData.contractNumber,
    contractNumber: contractData.contractNumber,
    planName: contractData.planName || contractData.plan || `Contract ${contractData.contractNumber}`,
    status: contractData.status || 'active',
    startDate: contractData.startDate,
    endDate: contractData.endDate,
    monthlyFee: contractData.monthlyFee || contractData.monthlyBaseFee,
    monthlyTotalFee: contractData.monthlyTotalFee,
    monthlyDistance: contractData.monthlyDistance || contractData.distance,
    vehiclePlate: contractData.vehiclePlate,
    vehicleId: contractData.vehicleId
  }));
};

/**
 * Get updated vehicle from session storage
 */
export const getUpdatedVehicleFromSession = () => {
  try {
    const updatedVehicleStr = sessionStorage.getItem('selectedVehicle');
    if (updatedVehicleStr) {
      return JSON.parse(updatedVehicleStr);
    }
  } catch (err) {
    console.warn(' Failed to get updated vehicle from session:', err);
  }
  return null;
};

/**
 * Save selected vehicle to session storage
 */
export const saveSelectedVehicleToSession = (vehicle) => {
  if (vehicle) {
    sessionStorage.setItem('selectedVehicle', JSON.stringify(vehicle));
    console.log(' Saved selected vehicle to session:', vehicle);
  } else {
    sessionStorage.removeItem('selectedVehicle');
    console.log(' Removed selected vehicle from session');
  }
};

/**
 * Find vehicle in list by ID or plate number
 */
export const findVehicle = (vehicles, targetVehicle) => {
  if (!vehicles || !targetVehicle) return null;
  
  return vehicles.find(v => 
    v.id === targetVehicle.id || 
    v.plateNumber === targetVehicle.plateNumber
  );
};

/**
 * Auto-select vehicle logic
 */
export const getAutoSelectedVehicle = (vehicles, currentSelected, sessionVehicle) => {
  // If there's an updated vehicle in session and it matches current selection, use updated data
  if (sessionVehicle && currentSelected) {
    if (currentSelected.id === sessionVehicle.id || 
        currentSelected.plateNumber === sessionVehicle.plateNumber) {
      const updatedVehicle = findVehicle(vehicles, sessionVehicle);
      if (updatedVehicle) {
        console.log(' Updating selected vehicle with new battery:', updatedVehicle);
        return updatedVehicle;
      }
    }
  }
  
  // Auto-select first vehicle if no vehicle selected
  if (vehicles.length > 0 && !currentSelected) {
    return vehicles[0];
  }
  
  return currentSelected;
};

/**
 * Validate user object
 */
export const validateUser = (user) => {
  if (!user) {
    return {
      isValid: false,
      error: 'Không thể tải thông tin người dùng. Vui lòng đăng nhập lại.'
    };
  }
  
  const userId = getUserId(user);
  if (!userId) {
    return {
      isValid: false,
      error: 'Không tìm thấy User ID hợp lệ'
    };
  }
  
  return { isValid: true, userId };
};
