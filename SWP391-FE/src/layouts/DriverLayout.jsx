// Driver Layout Component
// Layout wrapper for driver pages with sidebar navigation

import React from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const DriverLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { currentUser, handleLogout } = useAuth();

  const menuItems = [
    { path: '/driver/dashboard', icon: '', label: 'Trang chủ' },
    { path: '/driver/swap-battery', icon: '', label: 'Đổi pin' },
    { path: '/driver/stations-map', icon: '', label: 'Bản đồ trạm' },
    { path: '/driver/vehicles', icon: '', label: 'Xe của tôi' },
    { path: '/driver/subscriptions', icon: '', label: 'Gói dịch vụ' },
    { path: '/driver/contracts', icon: '', label: 'Hợp đồng' },
    { path: '/driver/payments', icon: '', label: 'Thanh toán' },
    { path: '/driver/support', icon: '', label: 'Hỗ trợ' },
    { path: '/driver/profile', icon: '', label: 'Cài đặt' }
  ];

  // use handleLogout từ AuthContext

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <div className="driver-layout">
      {/* Sidebar */}
      <aside className="driver-sidebar">
        <div className="sidebar-header">
          <div className="brand">
            <div className="logo-emblem">
              <span className="logo-text">EV</span>
            </div>
            <div className="logo-text-main">
              <span className="logo-primary">Battery</span>
              <span className="logo-secondary">Swap</span>
            </div>
          </div>
        </div>

        <nav className="sidebar-nav">
          {menuItems.map((item) => (
            <button
              key={item.path}
              className={`nav-item ${isActive(item.path) ? 'active' : ''}`}
              onClick={() => navigate(item.path)}
            >
              <span className="icon-emoji">{item.icon}</span>
              <span>{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="sidebar-footer">
          <div className="user-info">
            <div className="user-avatar">
              <i className="fas fa-user"></i>
            </div>
            <div className="user-details">
              <div className="user-name">{currentUser?.fullName || 'Driver'}</div>
              <div className="user-email">{currentUser?.email || 'driver@example.com'}</div>
            </div>
          </div>
          <button className="logout-btn" onClick={handleLogout}>
            <i className="fas fa-sign-out-alt"></i>
            <span>Đăng xuất</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="driver-main">
        {/* topbar removed per request */}
        <div className="driver-content">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default DriverLayout;