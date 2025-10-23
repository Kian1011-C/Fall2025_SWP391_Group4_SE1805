// API Data Helpers
// Utility functions to process and normalize API responses

// Normalize user data from different sources
export const normalizeUserData = (userData) => {
  if (!userData) return null;
  
  return {
    id: userData.id || userData.user_id || userData.userId,
    email: userData.email,
    name: userData.name || `${userData.firstName || ''} ${userData.lastName || ''}`.trim(),
    firstName: userData.firstName || userData.first_name,
    lastName: userData.lastName || userData.last_name,
    role: userData.role,
    phone: userData.phone,
    cccd: userData.cccd,
    status: userData.status,
    createdAt: userData.createdAt || userData.created_at
  };
};

// Normalize vehicle data from API
export const normalizeVehicleData = (vehicleData) => {
  if (!Array.isArray(vehicleData)) return [];
  
  return vehicleData.map(vehicle => ({
    id: vehicle.vehicleId || vehicle.id,
    plateNumber: vehicle.plateNumber || vehicle.plate_number,
    model: vehicle.model,
    batteryLevel: vehicle.batteryStateOfHealth || vehicle.stateOfHealth || vehicle.battery_level || 85,
    currentOdometer: vehicle.currentOdometer || vehicle.current_odometer || 0,
    batteryId: vehicle.batteryId || vehicle.battery_id,
    batteryModel: vehicle.batteryModel || vehicle.battery_model,
    batteryType: vehicle.batteryType || vehicle.battery_type,
    vinNumber: vehicle.vinNumber || vehicle.vin_number,
    compatibleBatteryTypes: vehicle.compatibleBatteryTypes || vehicle.compatible_battery_types
  }));
};

// Normalize contract data from API
export const normalizeContractData = (contractData) => {
  if (!Array.isArray(contractData)) return [];
  
  return contractData.map(contract => ({
    id: contract.contractId || contract.id,
    contractNumber: contract.contractNumber || contract.contract_number,
    vehicleId: contract.vehicleId || contract.vehicle_id,
    planId: contract.planId || contract.plan_id,
    planName: contract.planName || contract.plan_name,
    planType: contract.planType || contract.plan_type,
    status: contract.status,
    startDate: contract.startDate || contract.start_date,
    endDate: contract.endDate || contract.end_date,
    monthlyTotalFee: contract.monthlyTotalFee || contract.monthly_total_fee || contract.monthlyFee,
    monthlyDistance: contract.monthlyDistance || contract.monthly_distance || 0,
    monthlyBaseFee: contract.monthlyBaseFee || contract.monthly_base_fee,
    monthlyOverageFee: contract.monthlyOverageFee || contract.monthly_overage_fee,
    currentMonth: contract.currentMonth || contract.current_month,
    baseDistance: contract.baseDistance || contract.base_distance,
    depositFee: contract.depositFee || contract.deposit_fee,
    description: contract.description,
    isUnlimited: contract.isUnlimited || contract.is_unlimited || false
  }));
};

// Normalize swap data from API
export const normalizeSwapData = (swapData) => {
  if (!Array.isArray(swapData)) return [];
  
  return swapData.map(swap => ({
    id: swap.swapId || swap.id,
    contractId: swap.contractId || swap.contract_id,
    stationId: swap.stationId || swap.station_id,
    stationName: swap.stationName || swap.station_name || 'Trạm không xác định',
    towerId: swap.towerId || swap.tower_id,
    staffId: swap.staffId || swap.staff_id,
    oldBatteryId: swap.oldBatteryId || swap.old_battery_id,
    newBatteryId: swap.newBatteryId || swap.new_battery_id,
    oldBatteryLevel: swap.oldBatteryLevel || swap.old_battery_level || 20,
    newBatteryLevel: swap.newBatteryLevel || swap.new_battery_level || 95,
    swapDate: swap.swapDate || swap.swap_date,
    status: swap.status,
    odometerBefore: swap.odometerBefore || swap.odometer_before,
    odometerAfter: swap.odometerAfter || swap.odometer_after,
    distanceUsed: swap.distanceUsed || swap.distance_used,
    paymentId: swap.paymentId || swap.payment_id
  }));
};

// Normalize dashboard statistics
export const normalizeDashboardStats = (userDashboard, vehicles, contracts, swaps) => {
  // Ưu tiên lấy từ userDashboard (API thật), nếu không có thì tính từ swaps array
  const totalSwaps = userDashboard?.totalSwaps ?? 
                    userDashboard?.totalBatterySwaps ?? 
                    swaps?.length ?? 0;
                    
  const activeContracts = contracts.filter(contract => contract.status === 'active');
  const currentPlans = activeContracts.length > 0 ? 
    activeContracts.map(contract => contract.planName || 'Unknown Plan') : 
    ['Chưa có gói'];
  
  const monthlySpent = activeContracts
    .reduce((total, contract) => total + (contract.monthlyTotalFee || 0), 0);
    
  // Ưu tiên lấy từ userDashboard (API thật), nếu không có thì tính từ vehicles
  const totalDistance = userDashboard?.totalDistance ?? 
                       userDashboard?.totalKilometers ?? 
                       vehicles.reduce((total, vehicle) => total + (vehicle.currentOdometer || 0), 0);

  return {
    totalSwaps: Math.max(0, totalSwaps), // Đảm bảo không âm
    currentPlans,
    activeVehicles: vehicles.length,
    monthlySpent,
    totalDistance: Math.round(Math.max(0, totalDistance)) // Đảm bảo không âm và làm tròn
  };
};

// Format currency for Vietnamese locale
export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    minimumFractionDigits: 0
  }).format(amount);
};

// Format date for Vietnamese locale
export const formatDate = (date) => {
  if (!date) return '';
  return new Date(date).toLocaleDateString('vi-VN');
};

// Format datetime for Vietnamese locale
export const formatDateTime = (datetime) => {
  if (!datetime) return '';
  return new Date(datetime).toLocaleString('vi-VN');
};

// Validate API response structure
export const validateApiResponse = (response, requiredFields = []) => {
  if (!response) return false;
  
  if (requiredFields.length === 0) {
    return response.success === true;
  }
  
  return response.success === true && 
         requiredFields.every(field => response.hasOwnProperty(field));
};

// Extract error message from API response
export const extractErrorMessage = (error) => {
  if (error.response?.data?.message) {
    return error.response.data.message;
  }
  
  if (error.message) {
    return error.message;
  }
  
  if (error.response?.status) {
    const statusMessages = {
      400: 'Yêu cầu không hợp lệ',
      401: 'Không có quyền truy cập',
      403: 'Bị từ chối truy cập', 
      404: 'Không tìm thấy dữ liệu',
      500: 'Lỗi server nội bộ'
    };
    return statusMessages[error.response.status] || `HTTP Error ${error.response.status}`;
  }
  
  return 'Lỗi không xác định';
};

export default {
  normalizeUserData,
  normalizeVehicleData,
  normalizeContractData,
  normalizeSwapData,
  normalizeDashboardStats,
  formatCurrency,
  formatDate,
  formatDateTime,
  validateApiResponse,
  extractErrorMessage
};