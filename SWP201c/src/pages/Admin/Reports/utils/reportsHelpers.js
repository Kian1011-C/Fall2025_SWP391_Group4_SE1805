// Admin/Reports/utils/reportsHelpers.js
// Pure helper functions for reports management

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
 * Format number with thousand separators
 */
export const formatNumber = (number) => {
  return new Intl.NumberFormat('vi-VN').format(number);
};

/**
 * Get color based on growth percentage
 */
export const getGrowthColor = (growth) => {
  return growth >= 0 ? '#19c37d' : '#ff6b6b';
};

/**
 * Get color based on utilization percentage
 */
export const getUtilizationColor = (utilization) => {
  if (utilization >= 80) return '#ff6b6b';
  if (utilization >= 60) return '#ffa500';
  return '#19c37d';
};

/**
 * Get date range options
 */
export const getDateRangeOptions = () => {
  return [
    { value: 'week', label: '7 ngày qua' },
    { value: 'month', label: '30 ngày qua' },
    { value: 'quarter', label: '3 tháng qua' },
    { value: 'year', label: '12 tháng qua' }
  ];
};

/**
 * Get loyalty tier colors
 */
export const getLoyaltyTierColor = (tier) => {
  const colors = {
    bronze: '#CD7F32',
    silver: '#C0C0C0',
    gold: '#FFD700',
    platinum: '#E5E4E2'
  };
  return colors[tier] || '#B0B0B0';
};

/**
 * Calculate max value from daily revenue data
 */
export const getMaxDailyRevenue = (dailyData) => {
  if (!dailyData || dailyData.length === 0) return 0;
  return Math.max(...dailyData.map(d => d.amount || 0));
};

/**
 * Calculate chart bar height percentage
 */
export const calculateBarHeight = (value, maxValue, maxHeight = 150) => {
  if (!maxValue || maxValue === 0) return 0;
  return (value / maxValue) * maxHeight;
};

/**
 * Format date for chart labels
 */
export const formatChartDate = (dateString) => {
  const date = new Date(dateString);
  return `${date.getDate()}/${date.getMonth() + 1}`;
};

/**
 * Format revenue for chart labels (in millions)
 */
export const formatRevenueLabel = (amount) => {
  return `${Math.round(amount / 1000000)}M`;
};

/**
 * Calculate average transaction value
 */
export const calculateAvgTransactionValue = (totalRevenue, totalTransactions) => {
  if (!totalTransactions || totalTransactions === 0) return 0;
  return Math.round(totalRevenue / totalTransactions);
};

/**
 * Get tabs configuration
 */
export const getTabsConfig = () => {
  return [
    { id: 'overview', label: '📊 Tổng quan' },
    { id: 'revenue', label: '💰 Doanh thu' },
    { id: 'usage', label: '⚡ Sử dụng' },
    { id: 'customers', label: '👥 Khách hàng' }
  ];
};

/**
 * Check if report data is empty
 */
export const isReportDataEmpty = (reportData) => {
  return !reportData || Object.keys(reportData).length === 0;
};

/**
 * Get battery status percentage for progress bar
 */
export const getBatteryStatusProgress = (status) => {
  const progressMap = {
    excellent: 85,
    good: 70,
    fair: 40,
    poor: 20
  };
  return progressMap[status] || 0;
};
