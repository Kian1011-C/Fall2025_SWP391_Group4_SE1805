// Driver Layout Component
// Layout wrapper for driver pages with sidebar navigation

import React from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const DriverLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { currentUser, logout } = useAuth();

  const menuItems = [
    { path: '/driver/dashboard', icon: 'fas fa-home', label: 'Trang chủ' },
    { path: '/driver/swap-battery', icon: 'fas fa-battery-half', label: 'Đổi pin' },
    { path: '/driver/stations-map', icon: 'fas fa-map-marker-alt', label: 'Bản đồ trạm' },
    { path: '/driver/vehicles', icon: 'fas fa-car', label: 'Xe của tôi' },
    { path: '/driver/subscriptions', icon: 'fas fa-gem', label: 'Gói dịch vụ' },
    { path: '/driver/contracts', icon: 'fas fa-file-contract', label: 'Hợp đồng' },
    { path: '/driver/payments', icon: 'fas fa-credit-card', label: 'Thanh toán' },
    { path: '/driver/support', icon: 'fas fa-question-circle', label: 'Hỗ trợ' },
    { path: '/driver/profile', icon: 'fas fa-cog', label: 'Cài đặt' }
  ];

  const handleLogout = () => {
    logout();
    navigate('/');
  };

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
              <i className={item.icon}></i>
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
        <Outlet />
      </main>
    </div>
  );
};

export default DriverLayout;