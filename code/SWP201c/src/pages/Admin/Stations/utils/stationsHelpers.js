// Admin/Stations/utils/stationsHelpers.js
// Pure helper functions for stations management

/**
 * Format station availability status
 */
export const getAvailabilityStatus = (available, total) => {
  const percentage = total > 0 ? (available / total) * 100 : 0;
  
  if (percentage >= 70) return { label: 'Nhiều slot', color: '#10B981' };
  if (percentage >= 30) return { label: 'Trung bình', color: '#F59E0B' };
  return { label: 'Ít slot', color: '#EF4444' };
};

/**
 * Calculate utilization percentage
 */
export const calculateUtilization = (available, total) => {
  if (total === 0) return 0;
  return Math.round(((total - available) / total) * 100);
};

/**
 * Get utilization color based on percentage
 */
export const getUtilizationColor = (utilization) => {
  if (utilization >= 80) return '#EF4444'; // Red - High utilization
  if (utilization >= 60) return '#F59E0B'; // Orange - Medium utilization
  return '#10B981'; // Green - Low utilization
};

/**
 * Calculate statistics for all stations
 */
export const calculateStationsStats = (stations) => {
  if (!stations || stations.length === 0) {
    return {
      totalStations: 0,
      activeStations: 0,
      totalSlots: 0,
      availableSlots: 0,
      avgUtilization: 0
    };
  }

  const totalStations = stations.length;
  const activeStations = stations.filter(s => s.status === 'active').length;
  const totalSlots = stations.reduce((sum, s) => sum + (s.totalSlots || 0), 0);
  const availableSlots = stations.reduce((sum, s) => sum + (s.availableBatteries || 0), 0);
  const usedSlots = totalSlots - availableSlots;
  const avgUtilization = totalSlots > 0 ? Math.round((usedSlots / totalSlots) * 100) : 0;

  return {
    totalStations,
    activeStations,
    totalSlots,
    availableSlots,
    avgUtilization
  };
};

/**
 * Filter stations by search query
 */
export const filterStations = (stations, searchQuery) => {
  if (!searchQuery || searchQuery.trim() === '') return stations;
  
  const query = searchQuery.toLowerCase().trim();
  return stations.filter(station => 
    station.name?.toLowerCase().includes(query) ||
    station.address?.toLowerCase().includes(query) ||
    station.manager?.toLowerCase().includes(query) ||
    station.phone?.includes(query)
  );
};

/**
 * Sort stations by different criteria
 */
export const sortStations = (stations, sortBy) => {
  const stationsCopy = [...stations];
  
  switch (sortBy) {
    case 'name':
      return stationsCopy.sort((a, b) => a.name.localeCompare(b.name));
    
    case 'availability':
      return stationsCopy.sort((a, b) => 
        (b.availableBatteries || 0) - (a.availableBatteries || 0)
      );
    
    case 'utilization':
      return stationsCopy.sort((a, b) => {
        const utilA = calculateUtilization(a.availableBatteries || 0, a.totalSlots || 0);
        const utilB = calculateUtilization(b.availableBatteries || 0, b.totalSlots || 0);
        return utilB - utilA;
      });
    
    default:
      return stationsCopy;
  }
};

/**
 * Validate station form data
 */
export const validateStationForm = (formData) => {
  const errors = {};

  if (!formData.name || formData.name.trim() === '') {
    errors.name = 'Tên trạm là bắt buộc';
  }

  if (!formData.address || formData.address.trim() === '') {
    errors.address = 'Địa chỉ là bắt buộc';
  }

  if (!formData.manager || formData.manager.trim() === '') {
    errors.manager = 'Tên quản lý là bắt buộc';
  }

  if (!formData.phone || formData.phone.trim() === '') {
    errors.phone = 'Số điện thoại là bắt buộc';
  } else if (!/^[0-9]{10,11}$/.test(formData.phone.replace(/[\s-]/g, ''))) {
    errors.phone = 'Số điện thoại không hợp lệ (10-11 chữ số)';
  }

  if (!formData.totalSlots || formData.totalSlots < 1) {
    errors.totalSlots = 'Số slots phải lớn hơn 0';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

/**
 * Get initial form data for creating new station
 */
export const getInitialFormData = () => ({
  name: '',
  address: '',
  phone: '',
  manager: '',
  totalSlots: 20
});

/**
 * Convert station to form data for editing
 */
export const stationToFormData = (station) => ({
  name: station.name || '',
  address: station.address || '',
  phone: station.phone || '',
  manager: station.manager || '',
  totalSlots: station.totalSlots || 20
});

/**
 * Format phone number for display
 */
export const formatPhoneNumber = (phone) => {
  if (!phone) return '';
  const cleaned = phone.replace(/\D/g, '');
  
  if (cleaned.length === 10) {
    return cleaned.replace(/(\d{4})(\d{3})(\d{3})/, '$1 $2 $3');
  }
  if (cleaned.length === 11) {
    return cleaned.replace(/(\d{4})(\d{3})(\d{4})/, '$1 $2 $3');
  }
  return phone;
};

/**
 * Get sort options for dropdown
 */
export const getSortOptions = () => [
  { value: 'name', label: 'Tên trạm (A-Z)' },
  { value: 'availability', label: 'Slots khả dụng' },
  { value: 'utilization', label: 'Tỷ lệ sử dụng' }
];
