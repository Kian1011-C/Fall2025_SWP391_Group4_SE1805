// Utility helper functions

// Show toast notification
export const showToast = (message, type = 'success') => {
  const toast = document.createElement('div');
  toast.className = `toast ${type} show`;
  toast.textContent = message;
  document.body.appendChild(toast);
  setTimeout(() => {
    document.body.removeChild(toast);
  }, 3000);
};

// Format currency
export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount);
};

// Get battery status color
export const getStatusColor = (status) => {
  switch(status) {
    case 'Full': return '#19c37d';
    case 'Charging': return '#ffa500';
    case 'Maintenance': return '#6c757d';
    case 'Error': return '#ff4757';
    default: return '#6c757d';
  }
};

// Get battery status icon
export const getStatusIcon = (status) => {
  switch(status) {
    case 'Full': return '';
    case 'Charging': return '';
    case 'Maintenance': return '';
    case 'Error': return '';
    default: return '';
  }
};

// Get SOH (State of Health) color
export const getSOHColor = (soh) => {
  if (soh >= 80) return '#19c37d';
  if (soh >= 60) return '#ffa500';
  return '#ff4757';
};

// Get payment status color
export const getPaymentStatusColor = (status) => {
  switch(status) {
    case 'Success': return '#19c37d';
    case 'Pending': return '#ffa500';
    case 'Failed': return '#ff4757';
    default: return '#6c757d';
  }
};

// Get payment status icon
export const getPaymentStatusIcon = (status) => {
  switch(status) {
    case 'Success': return '';
    case 'Pending': return '⏳';
    case 'Failed': return '';
    default: return '';
  }
};

// Get issue status color
export const getIssueStatusColor = (status) => {
  switch(status) {
    case 'Pending': return '#ffa500';
    case 'In Progress': return '#4F8CFF';
    case 'Done': return '#19c37d';
    default: return '#6c757d';
  }
};

// Get issue status icon
export const getIssueStatusIcon = (status) => {
  switch(status) {
    case 'Pending': return '⏳';
    case 'In Progress': return '';
    case 'Done': return '';
    default: return '';
  }
};

// Get priority color
export const getPriorityColor = (priority) => {
  switch(priority) {
    case 'Critical': return '#ff4757';
    case 'High': return '#ff6348';
    case 'Medium': return '#ffa500';
    case 'Low': return '#4F8CFF';
    default: return '#6c757d';
  }
};

// Get priority icon
export const getPriorityIcon = (priority) => {
  switch(priority) {
    case 'Critical': return '';
    case 'High': return '';
    case 'Medium': return '';
    case 'Low': return '';
    default: return '';
  }
};

// Calculate distance between two coordinates
export const calculateDistance = (lat1, lng1, lat2, lng2) => {
  const R = 6371; // Earth's radius in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
            Math.sin(dLng/2) * Math.sin(dLng/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  const distance = R * c;
  return distance < 1 ? `${Math.round(distance * 1000)}m` : `${distance.toFixed(1)}km`;
};

// Get stations for user based on permissions
export const getStationsForUser = (user) => {
  const allStations = [
    {
      id: 'station_1',
      name: 'Trạm đổi pin Quận 1',
      address: '123 Nguyễn Huệ, Quận 1, TP.HCM',
      capacity: '15/20',
      status: 'Hoạt động',
      transactions: 45,
      manager: 'Nguyễn Văn A',
      phone: '028-1234-5678',
      hours: '24/7',
      rating: '4.8',
      batteries: 18,
      ready: 15
    },
    {
      id: 'station_2',
      name: 'Trạm đổi pin Quận 2',
      address: '456 Lê Văn Việt, Quận 2, TP.HCM',
      capacity: '8/15',
      status: 'Hoạt động',
      transactions: 32,
      manager: 'Trần Thị B',
      phone: '028-2345-6789',
      hours: '6:00-22:00',
      rating: '4.6',
      batteries: 12,
      ready: 8
    },
    {
      id: 'station_3',
      name: 'Trạm đổi pin Quận 3',
      address: '789 Võ Văn Tần, Quận 3, TP.HCM',
      capacity: '0/12',
      status: 'Bảo trì',
      transactions: 0,
      manager: 'Lê Văn C',
      phone: '028-3456-7890',
      hours: '24/7',
      rating: '4.5',
      batteries: 12,
      ready: 0
    },
    {
      id: 'station_4',
      name: 'Trạm đổi pin Quận 7',
      address: '321 Nguyễn Thị Thập, Quận 7, TP.HCM',
      capacity: '12/25',
      status: 'Hoạt động',
      transactions: 69,
      manager: 'Phạm Văn D',
      phone: '028-4567-8901',
      hours: '24/7',
      rating: '4.9',
      batteries: 25,
      ready: 12
    }
  ];

  if (user.level === 'admin') {
    return allStations;
  } else if (user.level === 'senior') {
    // Senior staff can see their station + other active stations
    return allStations.filter(station => 
      station.id === user.stationId || station.status === 'Hoạt động'
    );
  } else {
    // Junior staff can only see their assigned station
    return allStations.filter(station => station.id === user.stationId);
  }
};

