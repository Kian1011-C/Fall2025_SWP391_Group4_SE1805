// Driver/Profile/utils/profileHelpers.js
// Pure helper functions for profile management

/**
 * Get role badge color
 */
export const getRoleBadgeColor = (role) => {
  switch (role?.toUpperCase()) {
    case 'DRIVER':
      return {
        bg: '#19c37d20',
        color: '#19c37d',
        border: '1px solid #19c37d40'
      };
    case 'STAFF':
      return {
        bg: '#6ab7ff20',
        color: '#6ab7ff',
        border: '1px solid #6ab7ff40'
      };
    case 'ADMIN':
      return {
        bg: '#ff6b6b20',
        color: '#ff6b6b',
        border: '1px solid #ff6b6b40'
      };
    default:
      return {
        bg: '#B0B0B020',
        color: '#B0B0B0',
        border: '1px solid #B0B0B040'
      };
  }
};

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
 * Validate profile form data
 */
export const validateProfileForm = (formData) => {
  const errors = {};

  // Full name validation
  if (!formData.fullName || formData.fullName.trim() === '') {
    errors.fullName = 'Họ tên là bắt buộc';
  } else if (formData.fullName.trim().length < 3) {
    errors.fullName = 'Họ tên phải có ít nhất 3 ký tự';
  }

  // Email validation
  if (!formData.email || formData.email.trim() === '') {
    errors.email = 'Email là bắt buộc';
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
    errors.email = 'Email không hợp lệ';
  }

  // Phone validation (optional but if provided must be valid)
  if (formData.phone && formData.phone.trim() !== '') {
    const cleanedPhone = formData.phone.replace(/\D/g, '');
    if (cleanedPhone.length < 10 || cleanedPhone.length > 11) {
      errors.phone = 'Số điện thoại phải có 10-11 chữ số';
    }
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

/**
 * Convert user data to form data
 */
export const userToFormData = (user) => ({
  fullName: user?.fullName || user?.username || '',
  email: user?.email || '',
  phone: user?.phone || '',
  address: user?.address || ''
});

/**
 * Get initial form data (empty)
 */
export const getInitialFormData = () => ({
  fullName: '',
  email: '',
  phone: '',
  address: ''
});

/**
 * Get profile stats for display
 */
export const getProfileStats = (user) => {
  const joinDate = user?.createdAt ? new Date(user.createdAt) : new Date();
  const now = new Date();
  const daysSinceJoin = Math.floor((now - joinDate) / (1000 * 60 * 60 * 24));

  return {
    memberSince: joinDate.toLocaleDateString('vi-VN', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    }),
    daysSinceJoin,
    totalVehicles: user?.vehicles?.length || 0,
    activeContracts: user?.contracts?.filter(c => c.status === 'active').length || 0
  };
};

/**
 * Get user avatar initials
 */
export const getUserInitials = (user) => {
  const name = user?.fullName || user?.username || 'U';
  const parts = name.trim().split(' ');
  
  if (parts.length >= 2) {
    return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
  }
  return name[0].toUpperCase();
};

/**
 * Check if profile is complete
 */
export const isProfileComplete = (user) => {
  const requiredFields = ['fullName', 'email', 'phone', 'address'];
  return requiredFields.every(field => user?.[field] && user[field].trim() !== '');
};

/**
 * Get completion percentage
 */
export const getProfileCompletion = (user) => {
  const fields = ['fullName', 'email', 'phone', 'address'];
  const filledFields = fields.filter(field => user?.[field] && user[field].trim() !== '');
  return Math.round((filledFields.length / fields.length) * 100);
};
