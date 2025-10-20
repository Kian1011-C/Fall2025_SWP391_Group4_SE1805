// Staff/BatteryInventory/utils/batteryHelpers.js
// Pure helper functions for battery inventory management

/**
 * Get status color
 */
export const getStatusColor = (status) => {
  const colors = {
    'Sẵn sàng': '#19c37d',
    'Đang sạc': '#6ab7ff',
    'Đang dùng': '#ffa500',
    'Hỏng': '#ff4757',
    'Bảo trì': '#9c88ff'
  };
  return colors[status] || '#6c757d';
};

/**
 * Get health color based on percentage
 */
export const getHealthColor = (health) => {
  if (health >= 90) return '#19c37d';
  if (health >= 70) return '#ffa500';
  return '#ff4757';
};

/**
 * Get status options
 */
export const getStatusOptions = () => [
  'Sẵn sàng',
  'Đang sạc',
  'Đang dùng',
  'Hỏng',
  'Bảo trì'
];

/**
 * Get unique station names from batteries
 */
export const getUniqueStations = (batteries) => {
  return [...new Set(batteries.map(b => b.stationName))];
};

/**
 * Filter batteries by status and station
 */
export const filterBatteries = (batteries, filterStatus, filterStation) => {
  return batteries.filter(battery => {
    const statusMatch = filterStatus === 'Tất cả' || battery.status === filterStatus;
    const stationMatch = filterStation === 'Tất cả' || battery.stationName === filterStation;
    return statusMatch && stationMatch;
  });
};

/**
 * Get status statistics
 */
export const getStatusStats = (batteries) => {
  const stats = {
    'Sẵn sàng': 0,
    'Đang sạc': 0,
    'Đang dùng': 0,
    'Hỏng': 0,
    'Bảo trì': 0
  };
  
  batteries.forEach(battery => {
    if (stats[battery.status] !== undefined) {
      stats[battery.status]++;
    }
  });
  
  return stats;
};

/**
 * Format battery ID
 */
export const formatBatteryId = (id) => {
  if (!id) return 'N/A';
  return id.toString().toUpperCase();
};

/**
 * Format voltage
 */
export const formatVoltage = (voltage) => {
  if (!voltage && voltage !== 0) return 'N/A';
  return `${voltage.toFixed(1)}V`;
};

/**
 * Format temperature
 */
export const formatTemperature = (temp) => {
  if (!temp && temp !== 0) return 'N/A';
  return `${temp}°C`;
};

/**
 * Format capacity
 */
export const formatCapacity = (capacity) => {
  return capacity || 'N/A';
};

/**
 * Validate battery update data
 */
export const validateBatteryUpdate = (data) => {
  const errors = {};

  if (!data.status) {
    errors.status = 'Vui lòng chọn trạng thái';
  }

  if (data.health < 0 || data.health > 100) {
    errors.health = 'Sức khỏe pin phải từ 0-100%';
  }

  if (data.temperature < -20 || data.temperature > 80) {
    errors.temperature = 'Nhiệt độ không hợp lệ';
  }

  if (data.voltage < 0) {
    errors.voltage = 'Điện áp không hợp lệ';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

/**
 * Create battery update request
 */
export const createBatteryUpdateRequest = (batteryId, updateData) => {
  return {
    batteryId,
    status: updateData.status,
    health: parseFloat(updateData.health),
    temperature: parseFloat(updateData.temperature),
    voltage: parseFloat(updateData.voltage)
  };
};
