// Driver/StationsMap/utils/stationsMapHelpers.js
// Pure helper functions for stations map management

/**
 * Calculate distance between two coordinates (Haversine formula)
 */
export const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // Earth radius in km
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;
  
  return distance;
};

const toRad = (degrees) => {
  return degrees * (Math.PI / 180);
};

/**
 * Format distance with unit
 */
export const formatDistance = (distance) => {
  if (distance < 1) {
    return `${Math.round(distance * 1000)}m`;
  }
  return `${distance.toFixed(1)}km`;
};

/**
 * Get availability status
 */
export const getAvailabilityStatus = (availableSlots, totalSlots) => {
  if (!totalSlots || totalSlots === 0) {
    return { status: 'unknown', color: '#B0B0B0', label: 'Không rõ' };
  }
  
  const percentage = (availableSlots / totalSlots) * 100;
  
  if (percentage >= 50) {
    return { status: 'available', color: '#19c37d', label: 'Còn nhiều chỗ' };
  } else if (percentage >= 20) {
    return { status: 'limited', color: '#ffa500', label: 'Còn ít chỗ' };
  } else if (percentage > 0) {
    return { status: 'almost-full', color: '#ff6b6b', label: 'Gần hết chỗ' };
  } else {
    return { status: 'full', color: '#ff6b6b', label: 'Hết chỗ' };
  }
};

/**
 * Get operating status
 */
export const getOperatingStatus = (station) => {
  console.log('🔍 getOperatingStatus - station:', station);
  console.log('🔍 getOperatingStatus - station.status:', station.status);
  console.log('🔍 getOperatingStatus - typeof station.status:', typeof station.status);
  
  // Kiểm tra nhiều trường hợp có thể có của status
  const status = station.status || station.Status || station.state || station.State || 'unknown';
  console.log('🔍 getOperatingStatus - normalized status:', status);
  
  if (status === 'active' || status === 'Active' || status === 'ACTIVE') {
    return { status: 'active', color: '#19c37d', label: 'Đang hoạt động' };
  } else if (status === 'maintenance' || status === 'Maintenance' || status === 'MAINTENANCE') {
    return { status: 'maintenance', color: '#ffa500', label: 'Bảo trì' };
  } else if (status === 'inactive' || status === 'Inactive' || status === 'INACTIVE') {
    return { status: 'inactive', color: '#ff6b6b', label: 'Ngưng hoạt động' };
  } else {
    // Nếu không có status hoặc status không rõ, mặc định là active nếu có availableSlots
    console.log('⚠️ Unknown status, defaulting to active if has slots');
    if (station.availableSlots > 0) {
      return { status: 'active', color: '#19c37d', label: 'Đang hoạt động' };
    } else {
      return { status: 'inactive', color: '#ff6b6b', label: 'Ngưng hoạt động' };
    }
  }
};

/**
 * Sort stations by distance
 */
export const sortStationsByDistance = (stations, userLat, userLon) => {
  if (!userLat || !userLon) return stations;
  
  return [...stations].sort((a, b) => {
    const distA = calculateDistance(userLat, userLon, a.latitude, a.longitude);
    const distB = calculateDistance(userLat, userLon, b.latitude, b.longitude);
    return distA - distB;
  });
};

/**
 * Filter stations by availability
 */
export const filterStationsByAvailability = (stations, minSlots = 1) => {
  return stations.filter(station => 
    (station.availableSlots || 0) >= minSlots
  );
};

/**
 * Filter stations by operating status
 */
export const filterStationsByStatus = (stations, status = 'active') => {
  return stations.filter(station => 
    station.status?.toLowerCase() === status.toLowerCase()
  );
};

/**
 * Search stations by name or address
 */
export const searchStations = (stations, query) => {
  if (!query || query.trim() === '') return stations;
  
  const searchTerm = query.toLowerCase().trim();
  
  return stations.filter(station => 
    station.name?.toLowerCase().includes(searchTerm) ||
    station.address?.toLowerCase().includes(searchTerm)
  );
};

/**
 * Get station statistics
 */
export const getStationsStats = (stations) => {
  const total = stations.length;
  const active = stations.filter(s => s.status === 'active' || s.status === 'Active').length;
  const totalSlots = stations.reduce((sum, s) => sum + (s.totalSlots || 0), 0);
  const availableSlots = stations.reduce((sum, s) => sum + (s.availableSlots || 0), 0);
  const occupancyRate = totalSlots > 0 ? ((totalSlots - availableSlots) / totalSlots * 100) : 0;
  
  return {
    total,
    active,
    totalSlots,
    availableSlots,
    occupancyRate: Math.round(occupancyRate)
  };
};

/**
 * Create booking request data
 */
export const createBookingRequest = (stationId, date, timeSlot) => {
  return {
    stationId,
    date: date || new Date().toISOString(),
    timeSlot: timeSlot || '09:00'
  };
};

/**
 * Get default time slots
 */
export const getTimeSlots = () => [
  '08:00', '09:00', '10:00', '11:00',
  '13:00', '14:00', '15:00', '16:00',
  '17:00', '18:00', '19:00', '20:00'
];

/**
 * Format operating hours
 */
export const formatOperatingHours = (openTime, closeTime) => {
  if (!openTime || !closeTime) return '24/7';
  return `${openTime} - ${closeTime}`;
};

/**
 * Check if station is open now
 */
export const isStationOpen = (station) => {
  if (!station.openTime || !station.closeTime) return true; // 24/7
  
  const now = new Date();
  const currentHour = now.getHours();
  const currentMinute = now.getMinutes();
  const currentTime = currentHour * 60 + currentMinute;
  
  const [openHour, openMinute] = (station.openTime || '00:00').split(':').map(Number);
  const openTimeInMinutes = openHour * 60 + openMinute;
  
  const [closeHour, closeMinute] = (station.closeTime || '23:59').split(':').map(Number);
  const closeTimeInMinutes = closeHour * 60 + closeMinute;
  
  return currentTime >= openTimeInMinutes && currentTime <= closeTimeInMinutes;
};

/**
 * Get filter options
 */
export const getFilterOptions = () => ({
  availability: [
    { value: 'all', label: 'Tất cả' },
    { value: 'available', label: 'Còn chỗ' },
    { value: 'full', label: 'Hết chỗ' }
  ],
  status: [
    { value: 'all', label: 'Tất cả' },
    { value: 'active', label: 'Hoạt động' },
    { value: 'maintenance', label: 'Bảo trì' }
  ]
});
