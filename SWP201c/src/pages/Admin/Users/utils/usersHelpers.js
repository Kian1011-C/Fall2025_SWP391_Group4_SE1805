// Admin/Users/utils/usersHelpers.js
// Pure helper functions for user management

export const getRoleLabel = (role) => {
  const roleMap = {
    'admin': 'Quản trị viên',
    'staff': 'Nhân viên',
    'driver': 'Tài xế'
  };
  return roleMap[role] || role;
};

export const getRoleColor = (role) => {
  const colorMap = {
    'admin': '#e74c3c',
    'staff': '#f39c12',
    'driver': '#27ae60'
  };
  return colorMap[role] || '#95a5a6';
};

export const getStatusColor = (status) => {
  return status === 'active' ? '#27ae60' : '#e74c3c';
};

export const getStatusLabel = (status) => {
  return status === 'active' ? 'Hoạt động' : 'Không hoạt động';
};

export const getTabInfo = (activeTab) => {
  switch (activeTab) {
    case 'users':
      return { 
        title: 'Danh sách người dùng', 
        color: '#19c37d', 
        icon: '🚗',
        role: 'driver'
      };
    case 'staff':
      return { 
        title: 'Danh sách nhân viên', 
        color: '#ffa500', 
        icon: '👨‍💼',
        role: 'staff'
      };
    case 'admin':
      return { 
        title: 'Danh sách quản trị', 
        color: '#e74c3c', 
        icon: '👨‍💻',
        role: 'admin'
      };
    default:
      return { 
        title: 'Danh sách người dùng', 
        color: '#19c37d', 
        icon: '🚗',
        role: 'driver'
      };
  }
};

export const calculateStats = (users) => {
  return {
    total: users.length,
    drivers: users.filter(u => u.role === 'driver').length,
    staff: users.filter(u => u.role === 'staff').length,
    admins: users.filter(u => u.role === 'admin').length,
    active: users.filter(u => u.status === 'active').length
  };
};

export const formatUserData = (user) => {
  return {
    ...user,
    roleLabel: getRoleLabel(user.role),
    roleColor: getRoleColor(user.role),
    statusColor: getStatusColor(user.status),
    statusLabel: getStatusLabel(user.status)
  };
};
