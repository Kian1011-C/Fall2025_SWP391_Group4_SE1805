import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../assets/css/StaffLayout.css'; // Đảm bảo đường dẫn này đúng

const StaffLayout = () => {
  const { handleLogout } = useAuth();

  const navItems = [
    { path: '/staff/dashboard', name: 'Trang chủ', icon: '🏠' },
    { path: '/staff/battery-management', name: 'Quản lý Pin', icon: '🔋' }, 
    { path: '/staff/station-management', name: 'Quản lý trạm', icon: '🏢' },
    { path: '/staff/transaction-management', name: 'Lịch sử đổi Pin', icon: '🔄' },
    { path: '/staff/payments', name: 'Quản lý Thanh toán', icon: '💳' },
    { path: '/staff/issues', name: 'Sự cố', icon: '🔧' },
    { path: '/staff/reports', name: 'Báo cáo', icon: '📊' },
    { path: '/staff/swap-battery', name: 'Đổi Pin', icon: '⚡' },
  ];

  return (
    <div className="staff-layout">
      <aside className="staff-sidebar">
        <div className="sidebar-header">
          <h3>Staff Portal</h3>
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
      <main className="staff-content">
        <Outlet />
      </main>
    </div>
  );
};

export default StaffLayout;