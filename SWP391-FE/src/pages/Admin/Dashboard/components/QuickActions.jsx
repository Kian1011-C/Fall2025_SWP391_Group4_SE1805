import React from 'react';
import { useNavigate } from 'react-router-dom';

const QuickActions = () => {
  const navigate = useNavigate();

  const actions = [
    {
      icon: '👥',
      title: 'Quản lý Người dùng',
      description: 'Xem và quản lý tài khoản',
      color: '#3b82f6',
      path: '/admin/users'
    },
    {
      icon: '🏢',
      title: 'Quản lý Trạm',
      description: 'Quản lý trạm đổi pin',
      color: '#10b981',
      path: '/admin/stations'
    },
    {
      icon: '🔋',
      title: 'Quản lý Pin',
      description: 'Theo dõi tình trạng pin',
      color: '#f59e0b',
      path: '/admin/batteries'
    },
    {
      icon: '📊',
      title: 'Báo cáo',
      description: 'Xem báo cáo chi tiết',
      color: '#8b5cf6',
      path: '/admin/reports'
    },
    {
      icon: '💳',
      title: 'Giao dịch',
      description: 'Quản lý thanh toán',
      color: '#ec4899',
      path: '/admin/payments'
    },
    {
      icon: '📄',
      title: 'Hợp đồng',
      description: 'Quản lý hợp đồng thuê pin',
      color: '#14b8a6',
      path: '/admin/contracts'
    }
  ];

  return (
    <div className="quick-actions">
      <h2>Thao tác Nhanh</h2>
      <div className="actions-grid">
        {actions.map((action, index) => (
          <button
            key={index}
            className="action-card"
            onClick={() => navigate(action.path)}
            style={{ borderLeftColor: action.color }}
          >
            <div className="action-icon" style={{ color: action.color }}>
              {action.icon}
            </div>
            <div className="action-content">
              <div className="action-title">{action.title}</div>
              <div className="action-description">{action.description}</div>
            </div>
            <div className="action-arrow">→</div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default QuickActions;
