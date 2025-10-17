// Driver/Subscriptions/utils/subscriptionsHelpers.js
// Pure helper functions for subscriptions management

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
 * Get plan color based on plan name
 */
export const getPlanColor = (planName) => {
  const name = (planName || '').toLowerCase();
  if (name.includes('basic')) return '#19c37d';
  if (name.includes('plus')) return '#6ab7ff';
  if (name.includes('premium')) return '#ffa500';
  return '#9c88ff';
};

/**
 * Get plan icon based on index or name
 */
export const getPlanIcon = (index, planName) => {
  const name = (planName || '').toLowerCase();
  if (name.includes('basic')) return '⚡';
  if (name.includes('plus')) return '💎';
  if (name.includes('premium')) return '👑';
  
  // Fallback to index-based icons
  const icons = ['⚡', '💎', '👑'];
  return icons[index] || '📦';
};

/**
 * Check if plan is popular (middle plan or specific plan)
 */
export const isPlanPopular = (index, totalPlans) => {
  // Middle plan is popular for 3 plans
  if (totalPlans === 3) return index === 1;
  // For other counts, mark the second plan
  return index === 1;
};

/**
 * Get plan duration text
 */
export const getPlanDuration = (plan) => {
  if (plan.monthlyDistance) return `${plan.monthlyDistance} km/tháng`;
  if (plan.swapLimit) return `${plan.swapLimit} lần đổi pin`;
  if (plan.duration) return plan.duration;
  return 'Theo hợp đồng';
};

/**
 * Get plan features (with fallback)
 */
export const getPlanFeatures = (plan) => {
  if (plan.features && Array.isArray(plan.features) && plan.features.length > 0) {
    return plan.features;
  }
  
  // Default features
  return [
    'Đổi pin tại mọi trạm',
    'Hỗ trợ 24/7',
    'Không phí ẩn'
  ];
};

/**
 * Get plan price
 */
export const getPlanPrice = (plan) => {
  return plan.monthlyFee || plan.fee || plan.price || 0;
};

/**
 * Get plan name
 */
export const getPlanName = (plan) => {
  return plan.name || plan.planName || 'Gói dịch vụ';
};

/**
 * Get plan description
 */
export const getPlanDescription = (plan) => {
  return plan.description || 'Gói dịch vụ chất lượng';
};

/**
 * Extract user ID from user object
 */
export const getUserId = (user) => {
  if (!user) return null;
  return user.id || user.user_id || user.userId || null;
};

/**
 * Validate user has ID
 */
export const validateUser = (user) => {
  const userId = getUserId(user);
  if (!userId) {
    throw new Error('Không tìm thấy User ID hợp lệ');
  }
  return userId;
};

/**
 * Find active subscription from contracts
 */
export const findActiveSubscription = (contracts) => {
  if (!contracts || !Array.isArray(contracts)) return null;
  
  return contracts.find(contract => 
    contract.status === 'active' || contract.status === 'Active'
  );
};

/**
 * Format subscription from contract
 */
export const formatSubscription = (contract) => {
  if (!contract) return null;
  
  return {
    id: contract.contractId || contract.id,
    name: contract.planName || contract.plan || 'Gói dịch vụ',
    contractNumber: contract.contractNumber,
    status: contract.status,
    monthlyFee: contract.monthlyFee || contract.monthlyTotalFee,
    startDate: contract.startDate,
    endDate: contract.endDate,
    vehiclePlate: contract.vehiclePlate,
    remaining: contract.remainingSwaps || 'Không giới hạn'
  };
};

/**
 * Get FAQ items
 */
export const getFAQItems = () => [
  {
    question: 'Làm sao để thay đổi gói?',
    answer: 'Bạn có thể nâng cấp hoặc hạ cấp gói bất kỳ lúc nào. Phần chênh lệch sẽ được hoàn trả hoặc tính thêm.'
  },
  {
    question: 'Gói có tự động gia hạn không?',
    answer: 'Các gói sẽ tự động gia hạn trừ khi bạn hủy trước kỳ thanh toán.'
  },
  {
    question: 'Số lượt đổi pin có tích lũy không?',
    answer: 'Số lượt đổi pin không sử dụng trong tháng sẽ không được chuyển sang tháng tiếp theo.'
  }
];

/**
 * Create subscription request data
 */
export const createSubscriptionRequest = (plan, userId) => {
  return {
    planId: plan.planId || plan.id,
    userId: userId,
    planName: getPlanName(plan),
    monthlyFee: getPlanPrice(plan)
  };
};

/**
 * Get confirmation message for subscription
 */
export const getSubscriptionConfirmMessage = (plan) => {
  const planName = getPlanName(plan);
  const price = formatCurrency(getPlanPrice(plan));
  return `Bạn có chắc muốn đăng ký gói ${planName}?\nGiá: ${price}`;
};

/**
 * Get success message for subscription
 */
export const getSubscriptionSuccessMessage = (plan) => {
  const planName = getPlanName(plan);
  const price = formatCurrency(getPlanPrice(plan));
  return `Đăng ký gói ${planName} thành công!\nPhí hàng tháng: ${price}`;
};
