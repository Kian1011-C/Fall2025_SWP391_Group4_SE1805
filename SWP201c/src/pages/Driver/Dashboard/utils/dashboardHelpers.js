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
  
  return userVehicles.map(vehicle => ({
    id: vehicle.vehicleId || vehicle.id,
    plateNumber: vehicle.plateNumber || vehicle.plate_number,
    model: vehicle.vehicleModel || vehicle.model,
    batteryLevel: vehicle.health || vehicle.batteryLevel || 0,
    currentOdometer: vehicle.currentOdometer || vehicle.current_odometer || 0,
    current_odometer: vehicle.currentOdometer || vehicle.current_odometer || 0,
    batteryId: vehicle.batteryId || vehicle.battery_id,
    batteryModel: vehicle.batteryModel || vehicle.battery_model,
    batteryType: vehicle.batteryType || vehicle.battery_type,
    vinNumber: vehicle.vinNumber || vehicle.vin_number,
    compatibleBatteryTypes: vehicle.compatibleBatteryTypes || vehicle.compatible_battery_types,
    ...vehicle
  }));
};

/**
 * Update vehicles with session storage data
 */
export const updateVehiclesFromSession = (processedVehicles) => {
  const updatedVehicleStr = sessionStorage.getItem('selectedVehicle');
  const localVehicleStr = localStorage.getItem('selectedVehicle');
  const vehiclesStr = localStorage.getItem('vehicles');
  console.log('🔍 Session storage selectedVehicle:', updatedVehicleStr);
  console.log('🔍 Local storage selectedVehicle:', localVehicleStr);
  console.log('🔍 Local storage vehicles:', vehiclesStr);
  console.log('🔍 Input processedVehicles:', processedVehicles);
  if (!updatedVehicleStr && !localVehicleStr && !vehiclesStr) return processedVehicles;

  try {
    // If we have vehicles in localStorage, use them instead of processed vehicles
    if (vehiclesStr) {
      const storedVehicles = JSON.parse(vehiclesStr);
      console.log('🚗 Found vehicles in localStorage:', storedVehicles);
      return Array.isArray(storedVehicles) ? storedVehicles : processedVehicles;
    }
    
    // Try sessionStorage first, then localStorage for selected vehicle
    const vehicleStr = updatedVehicleStr || localVehicleStr;
    if (vehicleStr) {
      const updatedVehicle = JSON.parse(vehicleStr);
      console.log('🔄 Found updated vehicle in storage:', updatedVehicle);
      
      return processedVehicles.map(vehicle => {
        const idMatch = vehicle.id === updatedVehicle.id;
        const plateMatch = vehicle.plateNumber === updatedVehicle.plateNumber;
        
        if (idMatch || plateMatch) {
          console.log('✅ MATCH! Updating vehicle battery:', vehicle.plateNumber, 
                     'from', vehicle.batteryLevel, 'to', updatedVehicle.batteryLevel);
          return {
            ...vehicle,
            batteryLevel: updatedVehicle.batteryLevel || updatedVehicle.health,
            health: updatedVehicle.batteryLevel || updatedVehicle.health
          };
        }
        return vehicle;
      });
    }
    
    return processedVehicles;
  } catch (err) {
    console.warn('⚠️ Failed to parse stored data:', err);
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
    console.warn('⚠️ Failed to get updated vehicle from session:', err);
  }
  return null;
};

/**
 * Save selected vehicle to session storage
 */
export const saveSelectedVehicleToSession = (vehicle) => {
  if (vehicle) {
    sessionStorage.setItem('selectedVehicle', JSON.stringify(vehicle));
    console.log('💾 Saved selected vehicle to session:', vehicle);
  } else {
    sessionStorage.removeItem('selectedVehicle');
    console.log('🗑️ Removed selected vehicle from session');
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
        console.log('🔄 Updating selected vehicle with new battery:', updatedVehicle);
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
