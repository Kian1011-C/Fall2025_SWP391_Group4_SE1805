// Admin/Subscriptions/utils/subscriptionsHelpers.js
// Pure helper functions for subscription management

/**
 * Format currency to Vietnamese Dong
 */
export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    minimumFractionDigits: 0
  }).format(amount);
};

/**
 * Get plan name (handle both name and planName fields)
 */
export const getPlanName = (plan) => {
  return plan.name || plan.planName || 'Unnamed Plan';
};

/**
 * Get plan duration (handle both duration and swapLimit fields)
 */
export const getPlanDuration = (plan) => {
  return plan.duration || plan.swapLimit || 0;
};

/**
 * Validate plan form data
 */
export const validatePlanForm = (formData) => {
  const errors = [];

  if (!formData.name || formData.name.trim() === '') {
    errors.push('Tên gói không được để trống');
  }

  if (!formData.price || formData.price <= 0) {
    errors.push('Giá phải lớn hơn 0');
  }

  if (!formData.duration || formData.duration <= 0) {
    errors.push('Số lần đổi phải lớn hơn 0');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

/**
 * Transform API plan to form data
 */
export const planToFormData = (plan) => {
  return {
    name: getPlanName(plan),
    description: plan.description || '',
    price: plan.price || '',
    duration: getPlanDuration(plan),
    features: plan.features || []
  };
};

/**
 * Get initial form data
 */
export const getInitialFormData = () => {
  return {
    name: '',
    description: '',
    price: '',
    duration: '',
    features: []
  };
};

/**
 * Check if plans array is empty
 */
export const isPlansEmpty = (plans) => {
  return !plans || plans.length === 0;
};

/**
 * Calculate total plans count
 */
export const getTotalPlansCount = (plans) => {
  return plans ? plans.length : 0;
};

/**
 * Calculate total revenue from all plans
 */
export const calculateTotalRevenue = (plans) => {
  if (!plans || plans.length === 0) return 0;
  return plans.reduce((sum, plan) => sum + (plan.price || 0), 0);
};

/**
 * Get most expensive plan
 */
export const getMostExpensivePlan = (plans) => {
  if (!plans || plans.length === 0) return null;
  return plans.reduce((max, plan) => 
    (plan.price > (max?.price || 0)) ? plan : max
  , plans[0]);
};

/**
 * Get cheapest plan
 */
export const getCheapestPlan = (plans) => {
  if (!plans || plans.length === 0) return null;
  return plans.reduce((min, plan) => 
    (plan.price < (min?.price || Infinity)) ? plan : min
  , plans[0]);
};
