// Dashboard Layout với Sidebar và Header
import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const DashboardLayout = ({ children, role = 'driver' }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { currentUser, handleLogout } = useAuth();

  const menuItems = {
    driver: [
      { icon: '🏠', label: 'Trang chủ', path: '/driver/dashboard' },
      { icon: '🔋', label: 'Đổi pin', path: '/driver/swap-battery' },
      { icon: '🗺️', label: 'Bản đồ trạm', path: '/driver/stations-map' },
      { icon: '🚗', label: 'Xe của tôi', path: '/driver/vehicles' },
      { icon: '💎', label: 'Gói dịch vụ', path: '/driver/subscriptions' },
      { icon: '📋', label: 'Hợp đồng', path: '/driver/contracts' },
      { icon: '💳', label: 'Thanh toán', path: '/driver/payments' },
      { icon: '❓', label: 'Hỗ trợ', path: '/driver/support' },
    ],
    staff: [
      { icon: '🏠', label: 'Trang chủ', path: '/staff/dashboard' },
      { icon: '🏢', label: 'Quản lý trạm', path: '/staff/station-management' },
      { icon: '✅', label: 'Xác nhận đổi pin', path: '/staff/swap-confirm' },
      { icon: '📦', label: 'Kho pin', path: '/staff/battery-stock' },
      { icon: '🔧', label: 'Sự cố', path: '/staff/issues' },
      { icon: '📊', label: 'Báo cáo', path: '/staff/reports' },
    ],
    admin: [
      { icon: '🏠', label: 'Trang chủ', path: '/admin/dashboard' },
      { icon: '👥', label: 'Người dùng', path: '/admin/users' },
      { icon: '🏢', label: 'Trạm sạc', path: '/admin/stations' },
      { icon: '🔋', label: 'Pin', path: '/admin/batteries' },
      { icon: '💎', label: 'Gói dịch vụ', path: '/admin/subscriptions' },
      { icon: '📋', label: 'Hợp đồng', path: '/admin/contracts' },
      { icon: '📊', label: 'Báo cáo', path: '/admin/reports' },
    ],
  };

  const handleMenuClick = (path) => {
    navigate(path);
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  const getRoleColor = () => {
    switch (role) {
      case 'admin': return '#ffa500';
      case 'staff': return '#19c37d';
      default: return '#6ab7ff';
    }
  };

  const getRoleLabel = () => {
    switch (role) {
      case 'admin': return 'Admin';
      case 'staff': return 'Staff';
      default: return 'Driver';
    }
  };

  return (
    <div style={{
      display: 'flex',
      minHeight: '100vh',
      background: 'linear-gradient(180deg, #0b1020 0%, #0e1430 100%)',
      color: '#FFFFFF'
    }}>
      {/* Sidebar */}
      <div style={{
        width: '280px',
        background: 'rgba(18, 24, 49, 0.95)',
        borderRight: '1px solid rgba(255, 255, 255, 0.1)',
        display: 'flex',
        flexDirection: 'column',
        position: 'fixed',
        height: '100vh',
        left: 0,
        top: 0
      }}>
        {/* Logo */}
        <div style={{
          padding: '24px',
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px'
          }}>
            <div style={{
              width: '40px',
              height: '40px',
              borderRadius: '12px',
              background: `linear-gradient(135deg, ${getRoleColor()}, ${getRoleColor()}dd)`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '20px'
            }}>
              🔋
            </div>
            <div>
              <div style={{ fontWeight: '700', fontSize: '18px' }}>SWP201</div>
              <div style={{ fontSize: '12px', color: '#9aa4c7' }}>{getRoleLabel()} Panel</div>
            </div>
          </div>
        </div>

        {/* Menu Items */}
        <div style={{
          flex: 1,
          padding: '20px 12px',
          overflowY: 'auto'
        }}>
          {menuItems[role]?.map((item, index) => {
            const active = isActive(item.path);
            return (
              <div
                key={index}
                onClick={() => handleMenuClick(item.path)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '12px 16px',
                  borderRadius: '10px',
                  marginBottom: '8px',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  background: active ? `${getRoleColor()}33` : 'transparent',
                  borderLeft: active ? `3px solid ${getRoleColor()}` : '3px solid transparent',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = `${getRoleColor()}22`;
                }}
                onMouseLeave={(e) => {
                  if (!active) e.currentTarget.style.background = 'transparent';
                }}
              >
                <span style={{ fontSize: '20px' }}>{item.icon}</span>
                <span style={{ 
                  fontSize: '14px', 
                  fontWeight: active ? '600' : '500',
                  color: active ? getRoleColor() : '#FFFFFF'
                }}>
                  {item.label}
                </span>
              </div>
            );
          })}
        </div>

        {/* User Info & Logout */}
        <div style={{
          padding: '20px',
          borderTop: '1px solid rgba(255, 255, 255, 0.1)'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            marginBottom: '12px'
          }}>
            <div style={{
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              background: `linear-gradient(135deg, ${getRoleColor()}, ${getRoleColor()}dd)`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '18px'
            }}>
              👤
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: '14px', fontWeight: '600' }}>
                {currentUser?.name || 'User'}
              </div>
              <div style={{ fontSize: '12px', color: '#9aa4c7' }}>
                {currentUser?.email}
              </div>
            </div>
          </div>
          <button
            onClick={() => {
              console.log('🚪 Sidebar logout clicked');
              console.log('Current user:', currentUser);
              console.log('HandleLogout function:', typeof handleLogout);
              
              if (handleLogout && typeof handleLogout === 'function') {
                console.log('✅ Calling handleLogout...');
                handleLogout();
              } else {
                console.error('❌ handleLogout function not available');
                alert('Chức năng đăng xuất không khả dụng. Vui lòng reload trang.');
                // Fallback navigation
                navigate('/');
              }
            }}
            style={{
              width: '100%',
              padding: '10px',
              background: 'rgba(255, 71, 87, 0.2)',
              border: '1px solid rgba(255, 71, 87, 0.3)',
              borderRadius: '8px',
              color: '#ff4757',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '600',
              transition: 'all 0.2s'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(255, 71, 87, 0.3)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(255, 71, 87, 0.2)';
            }}
          >
            🚪 Đăng xuất
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div style={{
        flex: 1,
        marginLeft: '280px',
        display: 'flex',
        flexDirection: 'column'
      }}>
        {/* Header */}
        <div style={{
          height: '70px',
          background: 'rgba(18, 24, 49, 0.6)',
          backdropFilter: 'blur(10px)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
          display: 'flex',
          alignItems: 'center',
          padding: '0 30px',
          position: 'sticky',
          top: 0,
          zIndex: 10
        }}>
          <h2 style={{ margin: 0, fontSize: '20px', fontWeight: '600' }}>
            Dashboard
          </h2>
        </div>

        {/* Content Area */}
        <div style={{
          flex: 1,
          overflowY: 'auto',
          padding: '0'
        }}>
          {children}
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;

