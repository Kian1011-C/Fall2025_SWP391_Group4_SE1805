// Driver/Contracts/utils/contractsHelpers.js
// Pure helper functions for contracts management

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
 * Format date to Vietnamese locale
 */
export const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  return new Date(dateString).toLocaleDateString('vi-VN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

/**
 * Format short date
 */
export const formatShortDate = (dateString) => {
  if (!dateString) return 'N/A';
  return new Date(dateString).toLocaleDateString('vi-VN');
};

/**
 * Get status color
 */
export const getStatusColor = (status) => {
  const colors = {
    'active': '#19c37d',
    'pending': '#ffa500',
    'expired': '#ff6b6b',
    'cancelled': '#95a5a6',
    'completed': '#6ab7ff'
  };
  return colors[status?.toLowerCase()] || '#9c88ff';
};

/**
 * Get status label
 */
export const getStatusLabel = (status) => {
  const labels = {
    'active': 'Đang hoạt động',
    'pending': 'Chờ xử lý',
    'expired': 'Hết hạn',
    'cancelled': 'Đã hủy',
    'completed': 'Hoàn thành'
  };
  return labels[status?.toLowerCase()] || status;
};

/**
 * Get payment status color
 */
export const getPaymentStatusColor = (paymentStatus) => {
  const colors = {
    'paid': '#19c37d',
    'unpaid': '#ffa500',
    'pending': '#6ab7ff',
    'failed': '#ff6b6b'
  };
  return colors[paymentStatus?.toLowerCase()] || '#B0B0B0';
};

/**
 * Get payment status label
 */
export const getPaymentStatusLabel = (paymentStatus) => {
  const labels = {
    'paid': 'Đã thanh toán',
    'unpaid': 'Chưa thanh toán',
    'pending': 'Đang xử lý',
    'failed': 'Thất bại'
  };
  return labels[paymentStatus?.toLowerCase()] || paymentStatus;
};

/**
 * Calculate usage percentage
 */
export const calculateUsagePercentage = (used, total) => {
  if (!total || total === 0) return 0;
  return Math.round((used / total) * 100);
};

/**
 * Get usage color based on percentage
 */
export const getUsageColor = (percentage) => {
  if (percentage >= 80) return '#ff6b6b'; // Red - High usage
  if (percentage >= 50) return '#ffa500'; // Orange - Medium usage
  return '#19c37d'; // Green - Low usage
};

/**
 * Check if contract is active
 */
export const isContractActive = (contract) => {
  return contract?.status?.toLowerCase() === 'active';
};

/**
 * Check if contract is expired
 */
export const isContractExpired = (contract) => {
  if (contract?.status?.toLowerCase() === 'expired') return true;
  
  if (contract?.endDate) {
    const endDate = new Date(contract.endDate);
    const now = new Date();
    return endDate < now;
  }
  
  return false;
};

/**
 * Get remaining days
 */
export const getRemainingDays = (endDate) => {
  if (!endDate) return null;
  
  const end = new Date(endDate);
  const now = new Date();
  const diffTime = end - now;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  return diffDays > 0 ? diffDays : 0;
};

/**
 * Get remaining swaps
 */
export const getRemainingSwaps = (contract) => {
  const total = contract?.swapLimit || 0;
  const used = contract?.usedSwaps || 0;
  return Math.max(0, total - used);
};

/**
 * Filter contracts by status
 */
export const filterContractsByStatus = (contracts, status) => {
  if (!status || status === 'all') return contracts;
  return contracts.filter(c => c.status?.toLowerCase() === status.toLowerCase());
};

/**
 * Sort contracts by date
 */
export const sortContractsByDate = (contracts, ascending = false) => {
  return [...contracts].sort((a, b) => {
    const dateA = new Date(a.startDate);
    const dateB = new Date(b.startDate);
    return ascending ? dateA - dateB : dateB - dateA;
  });
};

/**
 * Get contract statistics
 */
export const getContractStats = (contracts) => {
  const total = contracts.length;
  const active = contracts.filter(c => isContractActive(c)).length;
  const expired = contracts.filter(c => isContractExpired(c)).length;
  const pending = contracts.filter(c => c.status?.toLowerCase() === 'pending').length;
  
  const totalSwaps = contracts.reduce((sum, c) => sum + (c.swapLimit || 0), 0);
  const usedSwaps = contracts.reduce((sum, c) => sum + (c.usedSwaps || 0), 0);
  const totalSpent = contracts.reduce((sum, c) => sum + (c.amount || 0), 0);
  
  return {
    total,
    active,
    expired,
    pending,
    totalSwaps,
    usedSwaps,
    remainingSwaps: totalSwaps - usedSwaps,
    totalSpent
  };
};

/**
 * Get filter options
 */
export const getFilterOptions = () => [
  { value: 'all', label: 'Tất cả' },
  { value: 'active', label: 'Đang hoạt động' },
  { value: 'pending', label: 'Chờ xử lý' },
  { value: 'expired', label: 'Hết hạn' },
  { value: 'cancelled', label: 'Đã hủy' }
];
