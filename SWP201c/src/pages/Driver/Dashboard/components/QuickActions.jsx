// Quick Actions Component
import React from 'react';
import { useNavigate } from 'react-router-dom';

const QuickActions = ({ selectedVehicle, vehicles = [] }) => {
  const navigate = useNavigate();

  // Filter actions based on whether user has vehicles
  const getQuickActions = () => {
    const baseActions = [
      {
        icon: '🚗',
        title: 'Quản lý phương tiện',
        description: 'Xem và quản lý tất cả xe của bạn',
        color: '#22c55e',
        route: '/driver/vehicles'
      },
      {
        icon: '🗺️',
        title: 'Bản đồ trạm',
        description: 'Xem các trạm gần bạn',
        color: '#6ab7ff',
        route: '/driver/stations-map'
      },
      {
        icon: '💳',
        title: 'Thanh toán',
        description: 'Quản lý thanh toán',
        color: '#ffa500',
        route: '/driver/payments'
      },
      {
        icon: '💎',
        title: 'Gói dịch vụ',
        description: 'Nâng cấp gói của bạn',
        color: '#9c88ff',
        route: '/driver/subscriptions'
      }
    ];

    // Only add battery swap action if user has vehicles
    if (vehicles && vehicles.length > 0) {
      baseActions.unshift({
        icon: '🔋',
        title: 'Đổi pin',
        description: selectedVehicle ? `Đổi pin cho ${selectedVehicle.plateNumber}` : 'Tìm trạm và đổi pin ngay',
        color: '#19c37d',
        route: '/driver/swap-battery'
      });
    }

    return baseActions;
  };

  const quickActions = getQuickActions();

  return (
    <div style={{
      background: 'rgba(26, 32, 44, 0.8)',
      borderRadius: '20px',
      padding: '30px',
      border: '1px solid rgba(255, 255, 255, 0.1)',
      marginBottom: '30px'
    }}>
      <h3 style={{ 
        color: '#FFFFFF', 
        marginBottom: '20px',
        fontSize: '1.3rem',
        display: 'flex',
        alignItems: 'center',
        gap: '10px'
      }}>
        ⚡ Thao tác nhanh
      </h3>
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '15px'
      }}>
        {quickActions.map((action, index) => (
          <button
            key={index}
            onClick={() => navigate(action.route, selectedVehicle ? { state: { selectedVehicle } } : {})}
            style={{
              background: `linear-gradient(135deg, ${action.color}20, ${action.color}10)`,
              border: `1px solid ${action.color}40`,
              borderRadius: '15px',
              padding: '20px',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              textAlign: 'left'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = `0 10px 30px ${action.color}30`;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            <div style={{ fontSize: '2.5rem', marginBottom: '10px' }}>{action.icon}</div>
            <div style={{ color: '#FFFFFF', fontSize: '1.1rem', fontWeight: '600', marginBottom: '5px' }}>
              {action.title}
            </div>
            <div style={{ color: '#B0B0B0', fontSize: '0.9rem' }}>
              {action.description}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default QuickActions;
