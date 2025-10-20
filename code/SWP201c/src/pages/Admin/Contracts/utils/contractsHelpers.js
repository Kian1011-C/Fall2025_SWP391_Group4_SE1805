// Admin/Contracts/utils/contractsHelpers.js
// Pure helper functions for contract management

/**
 * Get Vietnamese label for contract status
 */
export const getStatusLabel = (status) => {
  const statusMap = {
    'active': 'Đang hoạt động',
    'pending': 'Chờ xử lý',
    'expired': 'Hết hạn',
    'cancelled': 'Đã hủy'
  };
  return statusMap[status] || status;
};

/**
 * Get color for contract status badge
 */
export const getStatusColor = (status) => {
  const colorMap = {
    'active': '#27ae60',
    'pending': '#f39c12',
    'expired': '#e74c3c',
    'cancelled': '#95a5a6'
  };
  return colorMap[status] || '#95a5a6';
};

/**
 * Get Vietnamese label for contract type
 */
export const getTypeLabel = (type) => {
  const typeMap = {
    'monthly': 'Hàng tháng',
    'annual': 'Hàng năm',
    'pay-per-use': 'Trả theo lần'
  };
  return typeMap[type] || type;
};

/**
 * Get color for payment status
 */
export const getPaymentStatusColor = (status) => {
  const colorMap = {
    'paid': '#27ae60',
    'pending': '#f39c12',
    'failed': '#e74c3c'
  };
  return colorMap[status] || '#95a5a6';
};

/**
 * Format currency to Vietnamese Dong
 */
export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND'
  }).format(amount);
};

/**
 * Calculate contract statistics
 */
export const calculateContractStats = (contracts) => {
  if (!contracts || contracts.length === 0) {
    return {
      total: 0,
      active: 0,
      pending: 0,
      expired: 0,
      totalRevenue: 0
    };
  }

  const total = contracts.length;
  const active = contracts.filter(c => c.status === 'active').length;
  const pending = contracts.filter(c => c.status === 'pending').length;
  const expired = contracts.filter(c => c.status === 'expired').length;
  
  const totalRevenue = contracts
    .filter(c => c.paymentStatus === 'paid')
    .reduce((sum, c) => sum + (c.amount || 0), 0);

  return {
    total,
    active,
    pending,
    expired,
    totalRevenue
  };
};

/**
 * Filter contracts by search term, status, and type
 */
export const filterContracts = (contracts, searchTerm, selectedStatus, selectedType) => {
  return contracts.filter(contract => {
    // Search filter
    const matchesSearch = 
      contract.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contract.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contract.userEmail.toLowerCase().includes(searchTerm.toLowerCase());

    // Status filter
    const matchesStatus = selectedStatus === 'all' || contract.status === selectedStatus;

    // Type filter
    const matchesType = selectedType === 'all' || contract.type === selectedType;

    return matchesSearch && matchesStatus && matchesType;
  });
};

/**
 * Get status filter options
 */
export const getStatusOptions = () => {
  return [
    { value: 'all', label: 'Tất cả trạng thái' },
    { value: 'active', label: 'Đang hoạt động' },
    { value: 'pending', label: 'Chờ xử lý' },
    { value: 'expired', label: 'Hết hạn' },
    { value: 'cancelled', label: 'Đã hủy' }
  ];
};

/**
 * Get type filter options
 */
export const getTypeOptions = () => {
  return [
    { value: 'all', label: 'Tất cả loại' },
    { value: 'monthly', label: 'Hàng tháng' },
    { value: 'annual', label: 'Hàng năm' },
    { value: 'pay-per-use', label: 'Trả theo lần' }
  ];
};

/**
 * Calculate usage percentage
 */
export const calculateUsagePercentage = (used, total) => {
  if (!total || total === 0) return 0;
  return (used / total) * 100;
};

/**
 * Get remaining swaps
 */
export const getRemainingSwaps = (contract) => {
  return (contract.totalSwaps || 0) - (contract.usedSwaps || 0);
};
