import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../assets/css/AdminLayout.css'; // Chúng ta sẽ tạo file này

const AdminLayout = () => {
  const { handleLogout } = useAuth();

  // Dựa trên cấu trúc thư mục của bạn
  const navItems = [
    { path: '/admin/dashboard', name: 'Trang chủ', icon: '' },
    { path: '/admin/users', name: 'Quản lý Người dùng', icon: '' },
    { path: '/admin/stations', name: 'Quản lý Trạm', icon: '' },
    { path: '/admin/batteries', name: 'Quản lý Pin', icon: '' },
    { path: '/admin/contracts', name: 'Quản lý Hợp đồng', icon: '' },
    { path: '/admin/subscriptions', name: 'Quản lý Gói cước', icon: '' },
    { path: '/admin/payments', name: 'Quản lý Thanh toán', icon: '' },
    { path: '/admin/transactions', name: 'Lịch sử đổi Pin', icon: '' },
  ];

  return (
    <div className="admin-layout">
      <aside className="admin-sidebar">
        <div className="sidebar-header">
          <h3>Admin Panel</h3>
        </div>
        <nav className="sidebar-nav">
          {navItems.map(item => (
            <NavLink key={item.path} to={item.path} className="nav-link">
              <span className="nav-icon">{item.icon}</span>
              <span className="nav-text">{item.name}</span>
            </NavLink>
          ))}
        </nav>
        <div className="sidebar-footer">
          <button onClick={handleLogout} className="logout-button">
            Đăng xuất
          </button>
        </div>
      </aside>
      <main className="admin-content">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;