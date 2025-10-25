// Driver/Payments/utils/paymentsHelpers.js
// Pure helper functions for payments management

/**
 * Get user ID from current user
 */
export const getUserId = (user) => {
  if (!user) return null;
  return user.id || user.user_id || user.userId;
};

/**
 * Format date to Vietnamese locale
 */
export const formatDate = (dateString) => {
  if (!dateString) return '-';
  try {
    const date = new Date(dateString);
    return date.toLocaleString('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  } catch {
    return dateString;
  }
};

/**
 * Format currency to Vietnamese dong
 */
export const formatCurrency = (amount) => {
  if (!amount && amount !== 0) return '0 VNĐ';
  return amount.toLocaleString('vi-VN') + ' VNĐ';
};

/**
 * Get payment status style and text
 */
export const getStatusStyle = (status) => {
  const styles = {
    completed: { 
      color: '#19c37d', 
      background: 'rgba(25, 195, 125, 0.2)',
      text: '✓ Thành công'
    },
    pending: { 
      color: '#ffa500', 
      background: 'rgba(255, 165, 0, 0.2)',
      text: '⏳ Đang xử lý'
    },
    failed: { 
      color: '#ff6b6b', 
      background: 'rgba(255, 107, 107, 0.2)',
      text: '✕ Thất bại'
    }
  };
  return styles[status] || styles.pending;
};

/**
 * Get payment method display name
 */
export const getPaymentMethodName = (method) => {
  const methods = {
    'credit_card': '💳 Thẻ tín dụng',
    'debit_card': '💳 Thẻ ghi nợ',
    'bank_transfer': '🏦 Chuyển khoản',
    'e_wallet': '📱 Ví điện tử',
    'cash': '💵 Tiền mặt'
  };
  return methods[method] || method;
};

/**
 * Get payment type display name
 */
export const getPaymentTypeName = (type) => {
  const types = {
    'subscription': '📋 Đăng ký gói',
    'swap': '🔄 Hoán đổi pin',
    'penalty': '⚠️ Phạt',
    'refund': '↩️ Hoàn tiền',
    'other': '📝 Khác'
  };
  return types[type] || type;
};

/**
 * Sort payments by date (newest first)
 */
export const sortPaymentsByDate = (payments) => {
  return [...payments].sort((a, b) => {
    const dateA = new Date(a.paymentDate || a.createdAt);
    const dateB = new Date(b.paymentDate || b.createdAt);
    return dateB - dateA; // Newest first
  });
};

/**
 * Filter payments by status
 */
export const filterPaymentsByStatus = (payments, status) => {
  if (!status || status === 'all') return payments;
  return payments.filter(payment => payment.status === status);
};

/**
 * Filter payments by date range
 */
export const filterPaymentsByDateRange = (payments, startDate, endDate) => {
  if (!startDate && !endDate) return payments;
  
  return payments.filter(payment => {
    const paymentDate = new Date(payment.paymentDate || payment.createdAt);
    if (startDate && paymentDate < new Date(startDate)) return false;
    if (endDate && paymentDate > new Date(endDate)) return false;
    return true;
  });
};

/**
 * Calculate total amount from payments
 */
export const calculateTotalAmount = (payments) => {
  return payments.reduce((total, payment) => {
    if (payment.status === 'completed') {
      return total + (payment.amount || 0);
    }
    return total;
  }, 0);
};

/**
 * Get payment statistics
 */
export const getPaymentStats = (payments) => {
  const completed = payments.filter(p => p.status === 'completed');
  const pending = payments.filter(p => p.status === 'pending');
  const failed = payments.filter(p => p.status === 'failed');
  
  return {
    total: payments.length,
    completed: completed.length,
    pending: pending.length,
    failed: failed.length,
    totalAmount: calculateTotalAmount(payments),
    completedAmount: calculateTotalAmount(completed)
  };
};

/**
 * Validate payment data
 */
export const validatePaymentData = (paymentData) => {
  const errors = {};

  if (!paymentData.amount || paymentData.amount <= 0) {
    errors.amount = 'Số tiền phải lớn hơn 0';
  }

  if (!paymentData.paymentMethod) {
    errors.paymentMethod = 'Vui lòng chọn phương thức thanh toán';
  }

  if (!paymentData.description || paymentData.description.trim() === '') {
    errors.description = 'Vui lòng nhập mô tả';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

/**
 * Create payment request data
 */
export const createPaymentRequest = (formData, userId) => {
  return {
    userId: userId,
    amount: parseFloat(formData.amount),
    paymentMethod: formData.paymentMethod,
    description: formData.description.trim(),
    paymentType: formData.paymentType || 'other',
    metadata: formData.metadata || {}
  };
};

/**
 * Get payment method options
 */
export const getPaymentMethodOptions = () => [
  { value: 'credit_card', label: '💳 Thẻ tín dụng' },
  { value: 'debit_card', label: '💳 Thẻ ghi nợ' },
  { value: 'bank_transfer', label: '🏦 Chuyển khoản' },
  { value: 'e_wallet', label: '📱 Ví điện tử' },
  { value: 'cash', label: '💵 Tiền mặt' }
];

/**
 * Get payment type options
 */
export const getPaymentTypeOptions = () => [
  { value: 'subscription', label: '📋 Đăng ký gói' },
  { value: 'swap', label: '🔄 Hoán đổi pin' },
  { value: 'penalty', label: '⚠️ Phạt' },
  { value: 'other', label: '📝 Khác' }
];
