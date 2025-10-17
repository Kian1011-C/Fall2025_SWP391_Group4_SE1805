// Admin/Batteries/utils/batteriesHelpers.js
// Pure helper functions for battery management

/**
 * Get Vietnamese label for battery status
 */
export const getStatusLabel = (status) => {
  const statusMap = {
    'available': 'Sẵn sàng',
    'charging': 'Đang sạc',
    'in-use': 'Đang sử dụng',
    'maintenance': 'Bảo trì',
    'low-battery': 'Pin yếu',
    'faulty': 'Hỏng hóc'
  };
  return statusMap[status] || status;
};

/**
 * Get color for battery status badge
 */
export const getStatusColor = (status) => {
  const colorMap = {
    'available': '#27ae60',
    'charging': '#f39c12',
    'in-use': '#3498db',
    'maintenance': '#9b59b6',
    'low-battery': '#e67e22',
    'faulty': '#e74c3c'
  };
  return colorMap[status] || '#95a5a6';
};

/**
 * Get color based on battery health percentage
 */
export const getHealthColor = (health) => {
  if (health >= 80) return '#27ae60';
  if (health >= 60) return '#f39c12';
  return '#e74c3c';
};

/**
 * Get color based on battery charge percentage
 */
export const getChargeColor = (charge) => {
  if (charge >= 60) return '#27ae60';
  if (charge >= 30) return '#f39c12';
  return '#e74c3c';
};

/**
 * Calculate battery statistics from battery array
 */
export const calculateBatteryStats = (batteries) => {
  if (!batteries || batteries.length === 0) {
    return {
      total: 0,
      available: 0,
      charging: 0,
      inUse: 0,
      maintenance: 0,
      avgHealth: 0
    };
  }

  const total = batteries.length;
  const available = batteries.filter(b => b.status === 'available').length;
  const charging = batteries.filter(b => b.status === 'charging').length;
  const inUse = batteries.filter(b => b.status === 'in-use').length;
  const maintenance = batteries.filter(b => b.status === 'maintenance').length;
  
  const avgHealth = Math.round(
    batteries.reduce((sum, b) => sum + (b.health || 0), 0) / total
  );

  return {
    total,
    available,
    charging,
    inUse,
    maintenance,
    avgHealth
  };
};

/**
 * Filter batteries by search term and status
 */
export const filterBatteries = (batteries, searchTerm, selectedStatus) => {
  return batteries.filter(battery => {
    // Search filter
    const matchesSearch = 
      battery.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      battery.serialNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      battery.station.toLowerCase().includes(searchTerm.toLowerCase());

    // Status filter
    const matchesStatus = selectedStatus === 'all' || battery.status === selectedStatus;

    return matchesSearch && matchesStatus;
  });
};

/**
 * Get station options for dropdown
 */
export const getStationOptions = () => {
  return [
    { value: 'Trạm Quận 1', label: 'Trạm Quận 1' },
    { value: 'Trạm Quận 3', label: 'Trạm Quận 3' },
    { value: 'Trạm Bình Thạnh', label: 'Trạm Bình Thạnh' },
    { value: 'Trạm Phú Nhuận', label: 'Trạm Phú Nhuận' }
  ];
};

/**
 * Get status options for filter dropdown
 */
export const getStatusOptions = () => {
  return [
    { value: 'all', label: 'Tất cả trạng thái' },
    { value: 'available', label: 'Sẵn sàng' },
    { value: 'charging', label: 'Đang sạc' },
    { value: 'in-use', label: 'Đang sử dụng' },
    { value: 'maintenance', label: 'Bảo trì' },
    { value: 'low-battery', label: 'Pin yếu' },
    { value: 'faulty', label: 'Hỏng hóc' }
  ];
};
