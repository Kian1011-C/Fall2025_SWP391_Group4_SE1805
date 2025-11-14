// Driver/Support/utils/supportHelpers.js
// Pure helper functions for support management

/**
 * Get FAQ items
 */
export const getFAQItems = () => [
  {
    question: 'Làm sao để đổi pin?',
    answer: 'Vào mục "Đổi pin" trên menu, chọn trạm gần bạn và làm theo hướng dẫn.'
  },
  {
    question: 'Tôi có thể hủy gói dịch vụ không?',
    answer: 'Có, bạn có thể hủy gói bất kỳ lúc nào trong phần "Gói dịch vụ".'
  },
  {
    question: 'Thời gian đổi pin mất bao lâu?',
    answer: 'Quá trình đổi pin thường mất từ 3-5 phút.'
  },
  {
    question: 'Làm sao để liên hệ hỗ trợ khẩn cấp?',
    answer: 'Gọi hotline 1900-xxxx hoặc dùng nút "Hỗ trợ khẩn cấp" trong app.'
  }
];

/**
 * Get issue types
 */
export const getIssueTypes = () => [
  { 
    icon: '', 
    title: 'Lỗi pin', 
    desc: 'Pin không hoạt động đúng', 
    color: '#19c37d',
    type: 'battery'
  },
  { 
    icon: '', 
    title: 'Lỗi trạm', 
    desc: 'Trạm đổi pin có vấn đề', 
    color: '#6ab7ff',
    type: 'station'
  },
  { 
    icon: '', 
    title: 'Lỗi thanh toán', 
    desc: 'Vấn đề với thanh toán', 
    color: '#ffa500',
    type: 'payment'
  },
  { 
    icon: '', 
    title: 'Lỗi ứng dụng', 
    desc: 'App không hoạt động', 
    color: '#9c88ff',
    type: 'app'
  }
];

/**
 * Get contact info
 */
export const getContactInfo = () => [
  {
    icon: '',
    label: 'Hotline',
    value: '1900-xxxx',
    color: '#19c37d',
    type: 'phone'
  },
  {
    icon: '',
    label: 'Email',
    value: 'evdriversystem@gmail.com',
    color: '#6ab7ff',
    type: 'email'
  },
  {
    icon: '⏰',
    label: 'Giờ làm việc',
    value: '24/7 - Mọi lúc',
    color: '#B0B0B0',
    type: 'hours'
  }
];

/**
 * Get tabs configuration
 */
export const getTabs = () => [
  { id: 'contact', label: ' Liên hệ', icon: '' }
];

/**
 * Get priority options
 */
export const getPriorityOptions = () => [
  { value: 'low', label: 'Thấp' },
  { value: 'normal', label: 'Bình thường' },
  { value: 'high', label: 'Cao' },
  { value: 'urgent', label: 'Khẩn cấp' }
];

/**
 * Get priority color
 */
export const getPriorityColor = (priority) => {
  const colors = {
    low: '#B0B0B0',
    normal: '#6ab7ff',
    high: '#ffa500',
    urgent: '#ff6b6b'
  };
  return colors[priority] || '#B0B0B0';
};

/**
 * Get priority label
 */
export const getPriorityLabel = (priority) => {
  const labels = {
    low: 'Thấp',
    normal: 'Bình thường',
    high: 'Cao',
    urgent: 'Khẩn cấp'
  };
  return labels[priority] || priority;
};

/**
 * Validate support form
 */
export const validateSupportForm = (formData) => {
  const errors = {};

  if (!formData.subject || formData.subject.trim() === '') {
    errors.subject = 'Vui lòng nhập chủ đề';
  } else if (formData.subject.length < 5) {
    errors.subject = 'Chủ đề phải có ít nhất 5 ký tự';
  }

  if (!formData.message || formData.message.trim() === '') {
    errors.message = 'Vui lòng nhập nội dung';
  } else if (formData.message.length < 10) {
    errors.message = 'Nội dung phải có ít nhất 10 ký tự';
  }

  if (!formData.priority) {
    errors.priority = 'Vui lòng chọn mức độ ưu tiên';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

/**
 * Create support ticket request
 */
export const createSupportRequest = (formData, userId) => {
  return {
    userId: userId,
    subject: formData.subject.trim(),
    message: formData.message.trim(),
    priority: formData.priority,
    stationId: formData.stationId ? Number(formData.stationId) : null,
    status: 'open',
    createdAt: new Date().toISOString()
  };
};

/**
 * Get initial form data
 */
export const getInitialFormData = () => ({
  subject: '',
  message: '',
  priority: 'normal',
  stationId: ''
});

/**
 * Format issue type for submission
 */
export const formatIssueReport = (issueType, userId) => {
  const issue = getIssueTypes().find(i => i.type === issueType);
  
  return {
    userId: userId,
    subject: issue?.title || 'Báo cáo vấn đề',
    message: `Báo cáo ${issue?.title}: ${issue?.desc}`,
    priority: 'normal',
    type: issueType,
    status: 'open',
    createdAt: new Date().toISOString()
  };
};
