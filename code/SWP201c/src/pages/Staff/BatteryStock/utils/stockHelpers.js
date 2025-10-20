// Staff/BatteryStock/utils/stockHelpers.js
// Pure helper functions for battery stock management

/**
 * Get status color
 */
export const getStatusColor = (status) => {
  const colors = {
    'Available': '#19c37d',
    'In Use': '#6ab7ff',
    'Charging': '#ffa500',
    'Maintenance': '#ff4757'
  };
  return colors[status] || '#6c757d';
};

/**
 * Get status label in Vietnamese
 */
export const getStatusLabel = (status) => {
  const labels = {
    'Available': 'Sẵn sàng',
    'In Use': 'Đang dùng',
    'Charging': 'Đang sạc',
    'Maintenance': 'Bảo trì'
  };
  return labels[status] || status;
};

/**
 * Filter batteries by status
 */
export const filterBatteriesByStatus = (batteries, filterStatus) => {
  if (filterStatus === 'all') return batteries;
  return batteries.filter(battery => battery.status === filterStatus);
};

/**
 * Calculate battery statistics
 */
export const calculateBatteryStats = (batteries) => {
  return {
    total: batteries.length,
    available: batteries.filter(b => b.status === 'Available').length,
    inUse: batteries.filter(b => b.status === 'In Use').length,
    charging: batteries.filter(b => b.status === 'Charging').length,
    maintenance: batteries.filter(b => b.status === 'Maintenance').length
  };
};

/**
 * Get stat cards configuration
 */
export const getStatCards = (stats) => [
  { label: 'Tổng số pin', value: stats.total, color: '#6ab7ff' },
  { label: 'Sẵn sàng', value: stats.available, color: '#19c37d' },
  { label: 'Đang dùng', value: stats.inUse, color: '#6ab7ff' },
  { label: 'Đang sạc', value: stats.charging, color: '#ffa500' },
  { label: 'Bảo trì', value: stats.maintenance, color: '#ff4757' }
];

/**
 * Get filter options
 */
export const getFilterOptions = () => [
  { value: 'all', label: 'Tất cả' },
  { value: 'Available', label: 'Sẵn sàng' },
  { value: 'In Use', label: 'Đang dùng' },
  { value: 'Charging', label: 'Đang sạc' },
  { value: 'Maintenance', label: 'Bảo trì' }
];

/**
 * Format battery ID
 */
export const formatBatteryId = (battery) => {
  return battery.batteryId || battery.id || 'N/A';
};

/**
 * Get battery SOC (State of Charge)
 */
export const getBatterySOC = (battery) => {
  return battery.soc || battery.chargeLevel || 0;
};

/**
 * Get battery SOH (State of Health)
 */
export const getBatterySOH = (battery) => {
  return battery.soh || battery.health || 0;
};

/**
 * Get battery location
 */
export const getBatteryLocation = (battery) => {
  return battery.stationName || battery.currentStationId || 'N/A';
};

/**
 * Get battery cycle count
 */
export const getBatteryCycles = (battery) => {
  return battery.cycleCount || battery.cycles || 0;
};

/**
 * Get SOC color based on level
 */
export const getSOCColor = (soc) => {
  if (soc >= 80) return '#19c37d';
  if (soc >= 50) return '#ffa500';
  return '#ff4757';
};

/**
 * Get SOH color based on health
 */
export const getSOHColor = (soh) => {
  if (soh >= 90) return '#19c37d';
  if (soh >= 70) return '#6ab7ff';
  return '#ff4757';
};
