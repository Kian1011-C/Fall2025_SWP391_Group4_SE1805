// Admin User Management
// Manage all system users with sub-tabs for different user types

import React, { useState, useEffect } from 'react';
import userService from '../../assets/js/services/userService';
import DashboardLayout from '../../layouts/DashboardLayout';

const AdminUsers = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRole, setSelectedRole] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [activeSubTab, setActiveSubTab] = useState('users'); // 'users', 'staff', 'admin'
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch users from API
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const result = await userService.getAllUsers();
      
      if (result.success) {
        setUsers(result.data);
      } else {
        setError(result.message);
      }
    } catch (err) {
      setError('Không thể tải dữ liệu người dùng');
    } finally {
      setLoading(false);
    }
  };

  // Old mock data removed - Now using API

  const getRoleLabel = (role) => {
    const roleMap = {
      'admin': 'Quản trị viên',
      'staff': 'Nhân viên',
      'driver': 'Tài xế'
    };
    return roleMap[role] || role;
  };

  const getRoleColor = (role) => {
    const colorMap = {
      'admin': '#e74c3c',
      'staff': '#f39c12',
      'driver': '#27ae60'
    };
    return colorMap[role] || '#95a5a6';
  };

  const getStatusColor = (status) => {
    return status === 'active' ? '#27ae60' : '#e74c3c';
  };

  // Filter users based on active sub-tab
  const getFilteredUsers = () => {
    let filtered = users;
    
    // Filter by sub-tab
    switch (activeSubTab) {
      case 'users':
        filtered = filtered.filter(user => user.role === 'driver');
        break;
      case 'staff':
        filtered = filtered.filter(user => user.role === 'staff');
        break;
      case 'admin':
        filtered = filtered.filter(user => user.role === 'admin');
        break;
      default:
        break;
    }
    
    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(user =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.phone.includes(searchTerm)
      );
    }
    
    // Filter by status if needed
    if (selectedRole !== 'all') {
      filtered = filtered.filter(user => user.status === selectedRole);
    }
    
    return filtered;
  };

  const filteredUsers = getFilteredUsers();

  // Get current tab title and color
  const getCurrentTabInfo = () => {
    switch (activeSubTab) {
      case 'users':
        return { title: 'Danh sách người dùng', color: '#19c37d', icon: '🚗' };
      case 'staff':
        return { title: 'Danh sách nhân viên', color: '#ffa500', icon: '👨‍💼' };
      case 'admin':
        return { title: 'Danh sách quản trị', color: '#e74c3c', icon: '👨‍💻' };
      default:
        return { title: 'Danh sách người dùng', color: '#19c37d', icon: '🚗' };
    }
  };

  const currentTabInfo = getCurrentTabInfo();

  const stats = {
    total: users.length,
    drivers: users.filter(u => u.role === 'driver').length,
    staff: users.filter(u => u.role === 'staff').length,
    admins: users.filter(u => u.role === 'admin').length,
    active: users.filter(u => u.status === 'active').length
  };

  const handleDeleteUser = async (userId) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa người dùng này?')) {
      try {
        const result = await userService.deleteUser(userId);
        
        if (result.success) {
          alert('Xóa người dùng thành công!');
          fetchUsers();
        } else {
          alert(`Lỗi: ${result.message}`);
        }
      } catch (error) {
        alert('Có lỗi xảy ra khi xóa!');
      }
    }
  };

  const handleToggleStatus = async (userId) => {
    try {
      const result = await userService.toggleUserStatus(userId);
      
      if (result.success) {
        fetchUsers();
      } else {
        alert(`Lỗi: ${result.message}`);
      }
    } catch (error) {
      alert('Có lỗi xảy ra!');
    }
  };

  if (loading) {
    return (
      <div style={{ padding: '20px', textAlign: 'center', color: '#FFFFFF' }}>
        <h2>Đang tải dữ liệu người dùng...</h2>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: '20px', textAlign: 'center', color: '#ff6b6b' }}>
        <h2>Lỗi: {error}</h2>
        <button onClick={fetchUsers} style={{ marginTop: '20px', padding: '10px 20px' }}>
          Thử lại
        </button>
      </div>
    );
  }

  return (
    <DashboardLayout role="admin">
      <div style={{ padding: '20px' }}>
        <div style={{ marginBottom: '30px' }}>
        <h1 style={{ color: '#FFFFFF', marginBottom: '10px' }}>👥 Danh sách người dùng</h1>
        <p style={{ color: '#E0E0E0' }}>Quản lý tài khoản người dùng, nhân viên và quản trị viên</p>
      </div>

      {/* Sub Navigation Tabs */}
      <div style={{
        background: 'rgba(26, 32, 44, 0.8)',
        borderRadius: '12px',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        marginBottom: '20px',
        overflow: 'hidden'
      }}>
        <div style={{ 
          display: 'flex',
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
        }}>
          <button
            onClick={() => setActiveSubTab('users')}
            style={{
              flex: 1,
              padding: '15px 20px',
              background: activeSubTab === 'users' ? 'rgba(25, 195, 125, 0.2)' : 'transparent',
              color: activeSubTab === 'users' ? '#19c37d' : '#E0E0E0',
              border: 'none',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '500',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              borderBottom: activeSubTab === 'users' ? '2px solid #19c37d' : '2px solid transparent',
              transition: 'all 0.3s ease'
            }}
          >
            <span>🚗</span> Người dùng ({stats.drivers})
          </button>
          <button
            onClick={() => setActiveSubTab('staff')}
            style={{
              flex: 1,
              padding: '15px 20px',
              background: activeSubTab === 'staff' ? 'rgba(255, 165, 0, 0.2)' : 'transparent',
              color: activeSubTab === 'staff' ? '#ffa500' : '#E0E0E0',
              border: 'none',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '500',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              borderBottom: activeSubTab === 'staff' ? '2px solid #ffa500' : '2px solid transparent',
              transition: 'all 0.3s ease'
            }}
          >
            <span>👨‍💼</span> Nhân viên ({stats.staff})
          </button>
          <button
            onClick={() => setActiveSubTab('admin')}
            style={{
              flex: 1,
              padding: '15px 20px',
              background: activeSubTab === 'admin' ? 'rgba(231, 76, 60, 0.2)' : 'transparent',
              color: activeSubTab === 'admin' ? '#e74c3c' : '#E0E0E0',
              border: 'none',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '500',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              borderBottom: activeSubTab === 'admin' ? '2px solid #e74c3c' : '2px solid transparent',
              transition: 'all 0.3s ease'
            }}
          >
            <span>👨‍💻</span> Quản trị ({stats.admins})
          </button>
        </div>
      </div>

      {/* Statistics */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', 
        gap: '15px', 
        marginBottom: '30px' 
      }}>
        {[
          { label: 'Tổng số', value: stats.total, color: '#6ab7ff' },
          { label: 'Tài xế', value: stats.drivers, color: '#27ae60' },
          { label: 'Nhân viên', value: stats.staff, color: '#f39c12' },
          { label: 'Quản trị', value: stats.admins, color: '#e74c3c' },
          { label: 'Hoạt động', value: stats.active, color: '#19c37d' }
        ].map((stat, index) => (
          <div key={index} style={{
            background: 'rgba(26, 32, 44, 0.8)',
            borderRadius: '12px',
            padding: '20px',
            textAlign: 'center',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(10px)'
          }}>
            <div style={{ fontSize: '24px', fontWeight: 'bold', color: stat.color }}>{stat.value}</div>
            <div style={{ fontSize: '14px', color: '#E0E0E0', marginTop: '5px' }}>{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Current Tab Header */}
      <div style={{
        background: 'rgba(26, 32, 44, 0.8)',
        borderRadius: '12px',
        padding: '20px',
        marginBottom: '20px',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          <div style={{
            padding: '12px',
            borderRadius: '10px',
            background: `${currentTabInfo.color}20`,
            fontSize: '1.5rem'
          }}>
            {currentTabInfo.icon}
          </div>
          <div>
            <h2 style={{ margin: 0, color: '#FFFFFF', fontSize: '1.3rem' }}>
              {currentTabInfo.title}
            </h2>
            <p style={{ margin: 0, color: '#B0B0B0', fontSize: '0.9rem' }}>
              {filteredUsers.length} người dùng được tìm thấy
            </p>
          </div>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          style={{
            padding: '12px 24px',
            background: `linear-gradient(135deg, ${currentTabInfo.color}, ${currentTabInfo.color}dd)`,
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontWeight: '500',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}
        >
          <span>+</span> Thêm {activeSubTab === 'users' ? 'người dùng' : activeSubTab === 'staff' ? 'nhân viên' : 'quản trị viên'}
        </button>
      </div>

      {/* Search and Filter Controls */}
      <div style={{
        background: 'rgba(26, 32, 44, 0.8)',
        borderRadius: '12px',
        padding: '20px',
        marginBottom: '20px',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        display: 'flex',
        gap: '20px',
        alignItems: 'center',
        flexWrap: 'wrap'
      }}>
        <input
          type="text"
          placeholder={`Tìm kiếm ${activeSubTab === 'users' ? 'người dùng' : activeSubTab === 'staff' ? 'nhân viên' : 'quản trị viên'}...`}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{
            flex: 1,
            minWidth: '300px',
            padding: '12px 16px',
            border: '2px solid rgba(255, 255, 255, 0.2)',
            borderRadius: '8px',
            background: 'rgba(255, 255, 255, 0.1)',
            color: '#FFFFFF',
            fontSize: '14px'
          }}
        />

        <select
          value={selectedRole}
          onChange={(e) => setSelectedRole(e.target.value)}
          style={{
            padding: '12px 16px',
            border: '2px solid rgba(255, 255, 255, 0.2)',
            borderRadius: '8px',
            background: 'rgba(255, 255, 255, 0.1)',
            color: '#FFFFFF',
            fontSize: '14px'
          }}
        >
          <option value="all">Tất cả trạng thái</option>
          <option value="active">Hoạt động</option>
          <option value="inactive">Không hoạt động</option>
        </select>
      </div>

      {/* Users Table */}
      <div style={{
        background: 'rgba(26, 32, 44, 0.8)',
        borderRadius: '12px',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        overflow: 'hidden'
      }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: 'rgba(255, 255, 255, 0.05)' }}>
              <th style={{ padding: '15px', textAlign: 'left', color: '#FFFFFF', borderBottom: '1px solid rgba(255, 255, 255, 0.1)' }}>Người dùng</th>
              <th style={{ padding: '15px', textAlign: 'left', color: '#FFFFFF', borderBottom: '1px solid rgba(255, 255, 255, 0.1)' }}>Liên hệ</th>
              <th style={{ padding: '15px', textAlign: 'left', color: '#FFFFFF', borderBottom: '1px solid rgba(255, 255, 255, 0.1)' }}>Vai trò</th>
              <th style={{ padding: '15px', textAlign: 'left', color: '#FFFFFF', borderBottom: '1px solid rgba(255, 255, 255, 0.1)' }}>Trạng thái</th>
              <th style={{ padding: '15px', textAlign: 'left', color: '#FFFFFF', borderBottom: '1px solid rgba(255, 255, 255, 0.1)' }}>Ngày tham gia</th>
              <th style={{ padding: '15px', textAlign: 'left', color: '#FFFFFF', borderBottom: '1px solid rgba(255, 255, 255, 0.1)' }}>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map(user => (
              <tr key={user.id} style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.05)' }}>
                <td style={{ padding: '15px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <span style={{ fontSize: '2rem' }}>{user.avatar}</span>
                    <div>
                      <div style={{ color: '#FFFFFF', fontWeight: '500' }}>{user.name}</div>
                      <div style={{ color: '#B0B0B0', fontSize: '0.8rem' }}>ID: {user.id}</div>
                    </div>
                  </div>
                </td>
                <td style={{ padding: '15px' }}>
                  <div style={{ color: '#FFFFFF' }}>{user.email}</div>
                  <div style={{ color: '#B0B0B0', fontSize: '0.9rem' }}>{user.phone}</div>
                </td>
                <td style={{ padding: '15px' }}>
                  <span style={{
                    padding: '4px 12px',
                    borderRadius: '20px',
                    backgroundColor: getRoleColor(user.role),
                    color: 'white',
                    fontSize: '0.8rem',
                    fontWeight: '500'
                  }}>
                    {getRoleLabel(user.role)}
                  </span>
                </td>
                <td style={{ padding: '15px' }}>
                  <span style={{
                    padding: '4px 12px',
                    borderRadius: '20px',
                    backgroundColor: getStatusColor(user.status),
                    color: 'white',
                    fontSize: '0.8rem',
                    fontWeight: '500'
                  }}>
                    {user.status === 'active' ? 'Hoạt động' : 'Không hoạt động'}
                  </span>
                </td>
                <td style={{ padding: '15px', color: '#E0E0E0' }}>{user.joinDate}</td>
                <td style={{ padding: '15px' }}>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button
                      onClick={() => handleToggleStatus(user.id)}
                      style={{
                        padding: '6px 12px',
                        background: user.status === 'active' ? '#f39c12' : '#27ae60',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontSize: '0.8rem'
                      }}
                    >
                      {user.status === 'active' ? '⏸️' : '▶️'}
                    </button>
                    <button
                      onClick={() => handleDeleteUser(user.id)}
                      style={{
                        padding: '6px 12px',
                        background: '#e74c3c',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontSize: '0.8rem'
                      }}
                    >
                      🗑️
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add User Modal */}
      {showAddModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.8)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div style={{
            background: 'rgba(26, 32, 44, 0.95)',
            borderRadius: '12px',
            padding: '30px',
            width: '500px',
            border: '1px solid rgba(255, 255, 255, 0.2)'
          }}>
            <h3 style={{ color: '#FFFFFF', marginBottom: '20px' }}>Thêm người dùng mới</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              <input
                type="text"
                placeholder="Họ tên"
                style={{
                  padding: '12px',
                  border: '2px solid rgba(255, 255, 255, 0.2)',
                  borderRadius: '8px',
                  background: 'rgba(255, 255, 255, 0.1)',
                  color: '#FFFFFF'
                }}
              />
              <input
                type="email"
                placeholder="Email"
                style={{
                  padding: '12px',
                  border: '2px solid rgba(255, 255, 255, 0.2)',
                  borderRadius: '8px',
                  background: 'rgba(255, 255, 255, 0.1)',
                  color: '#FFFFFF'
                }}
              />
              <input
                type="tel"
                placeholder="Số điện thoại"
                style={{
                  padding: '12px',
                  border: '2px solid rgba(255, 255, 255, 0.2)',
                  borderRadius: '8px',
                  background: 'rgba(255, 255, 255, 0.1)',
                  color: '#FFFFFF'
                }}
              />
              <select
                style={{
                  padding: '12px',
                  border: '2px solid rgba(255, 255, 255, 0.2)',
                  borderRadius: '8px',
                  background: 'rgba(255, 255, 255, 0.1)',
                  color: '#FFFFFF'
                }}
              >
                <option value="driver">Tài xế</option>
                <option value="staff">Nhân viên</option>
                <option value="admin">Quản trị viên</option>
              </select>
            </div>
            <div style={{ display: 'flex', gap: '15px', marginTop: '25px' }}>
              <button
                onClick={() => setShowAddModal(false)}
                style={{
                  flex: 1,
                  padding: '12px',
                  background: 'rgba(255, 255, 255, 0.2)',
                  color: '#FFFFFF',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer'
                }}
              >
                Hủy
              </button>
              <button
                style={{
                  flex: 1,
                  padding: '12px',
                  background: '#27ae60',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer'
                }}
              >
                Thêm mới
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
    </DashboardLayout>
  );
};

export default AdminUsers;