import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import menuItems from '../config/menuItems';

const Sidebar = ({ role = 'driver' }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { currentUser, handleLogout } = useAuth();

  const isActive = (path) => location.pathname === path;

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
            <button
              key={index}
              onClick={() => navigate(item.path)}
              style={{
                width: '100%',
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
                borderTop: 'none',
                borderRight: 'none',
                borderBottom: 'none',
                textAlign: 'left'
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
            </button>
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
            if (handleLogout && typeof handleLogout === 'function') {
              handleLogout();
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
  );
};

export default Sidebar;


