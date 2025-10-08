// Staff Dashboard Component
// Main dashboard for staff members with new management features

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../../layouts/DashboardLayout';
import reportService from '../../assets/js/services/reportService';

const StaffDashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    activeStations: 0,
    readyBatteries: 0,
    todayTransactions: 0,
    successRate: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      setLoading(true);
      
      const today = new Date().toISOString().split('T')[0];
      const result = await reportService.getOverviewReport({ startDate: today, endDate: today });
      
      if (result.success && result.data) {
        setStats({
          activeStations: result.data.totalStations || 0,
          readyBatteries: result.data.activeBatteries || 0,
          todayTransactions: result.data.totalTransactions || 0,
          successRate: result.data.successRate || 0
        });
      }
    } catch (err) {
      console.error('Error fetching dashboard stats:', err);
    } finally {
      setLoading(false);
    }
  };

  const staffFeatures = [
    {
      id: 'battery-inventory',
      title: 'Quản lý kho pin',
      description: 'Theo dõi và cập nhật trạng thái pin (đang dùng, sạc, hỏng)',
      icon: '🔋',
      color: '#6ab7ff',
      route: '/battery-inventory'
    },
    {
      id: 'transaction-management',
      title: 'Quản lý giao dịch',
      description: 'Hiển thị danh sách toàn bộ lịch sử đổi pin và thanh toán',
      icon: '💳',
      color: '#ffa500',
      route: '/transaction-management'
    },
    {
      id: 'battery-stock',
      title: 'Kho pin',
      description: 'Monitor and manage battery inventory',
      icon: '📦',
      color: '#9c88ff',
      route: '/battery-stock'
    },
    {
      id: 'swap-confirm',
      title: 'Quản lý yêu cầu đổi pin',
      description: 'Process and confirm battery swap requests',
      icon: '✅',
      color: '#19c37d',
      route: '/swap-confirm'
    },
    {
      id: 'issues',
      title: 'Xử lý sự cố',
      description: 'Quản lý các vấn đề kỹ thuật',
      icon: '🔧',
      color: '#ff4757',
      route: '/issues'
    },
    {
      id: 'reports',
      title: 'Báo cáo',
      description: 'Báo cáo hoạt động trạm',
      icon: '📊',
      color: '#6c757d',
      route: '/reports'
    }
  ];

  const handleFeatureClick = (route) => {
    navigate(route);
  };

  return (
    <DashboardLayout role="staff">
      <div className="staff-dashboard" style={{ padding: '20px' }}>
        <div className="page-header" style={{ marginBottom: '30px' }}>
          <h1 style={{ color: '#FFFFFF', marginBottom: '10px' }}>👨‍💼 Staff Dashboard</h1>
          <p style={{ color: '#E0E0E0' }}>Quản lý hoạt động trạm đổi pin và hỗ trợ khách hàng</p>
        </div>

        {/* Quick Stats */}
        <div className="quick-stats" style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
          gap: '20px', 
          marginBottom: '30px' 
        }}>
          <div style={{
            background: 'rgba(26, 32, 44, 0.8)',
            borderRadius: '12px',
            padding: '20px',
            boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
            textAlign: 'center',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(10px)'
          }}>
            <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#19c37d' }}>
              {loading ? '...' : stats.activeStations}
            </div>
            <div style={{ fontSize: '14px', color: '#E0E0E0', marginTop: '5px' }}>Trạm hoạt động</div>
          </div>
          <div style={{
            background: 'rgba(26, 32, 44, 0.8)',
            borderRadius: '12px',
            padding: '20px',
            boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
            textAlign: 'center',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(10px)'
          }}>
            <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#6ab7ff' }}>
              {loading ? '...' : stats.readyBatteries}
            </div>
            <div style={{ fontSize: '14px', color: '#E0E0E0', marginTop: '5px' }}>Pin sẵn sàng</div>
          </div>
          <div style={{
            background: 'rgba(26, 32, 44, 0.8)',
            borderRadius: '12px',
            padding: '20px',
            boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
            textAlign: 'center',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(10px)'
          }}>
            <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#ffa500' }}>
              {loading ? '...' : stats.todayTransactions}
            </div>
            <div style={{ fontSize: '14px', color: '#E0E0E0', marginTop: '5px' }}>Giao dịch hôm nay</div>
          </div>
          <div style={{
            background: 'rgba(26, 32, 44, 0.8)',
            borderRadius: '12px',
            padding: '20px',
            boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
            textAlign: 'center',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(10px)'
          }}>
            <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#9c88ff' }}>
              {loading ? '...' : `${stats.successRate}%`}
            </div>
            <div style={{ fontSize: '14px', color: '#E0E0E0', marginTop: '5px' }}>Tỷ lệ thành công</div>
          </div>
        </div>

        {/* Features Grid */}
        <div className="features-grid" style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
          gap: '20px' 
        }}>
          {staffFeatures.map(feature => (
            <div 
              key={feature.id}
              onClick={() => handleFeatureClick(feature.route)}
              style={{
                background: 'rgba(26, 32, 44, 0.8)',
                borderRadius: '12px',
                padding: '25px',
                boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                backdropFilter: 'blur(10px)'
              }}
              onMouseEnter={(e) => {
                e.target.style.transform = 'translateY(-5px)';
                e.target.style.boxShadow = '0 12px 40px rgba(0,0,0,0.4)';
                e.target.style.borderColor = feature.color;
                e.target.style.background = 'rgba(26, 32, 44, 0.9)';
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = '0 8px 32px rgba(0,0,0,0.3)';
                e.target.style.borderColor = 'rgba(255, 255, 255, 0.1)';
                e.target.style.background = 'rgba(26, 32, 44, 0.8)';
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: '15px' }}>
                <div style={{ 
                  fontSize: '32px', 
                  marginRight: '15px',
                  background: `${feature.color}20`,
                  padding: '10px',
                  borderRadius: '10px',
                  border: `1px solid ${feature.color}40`
                }}>
                  {feature.icon}
                </div>
                <div>
                  <h3 style={{ 
                    margin: 0, 
                    color: '#FFFFFF', 
                    fontSize: '18px',
                    fontWeight: 'bold'
                  }}>
                    {feature.title}
                  </h3>
                </div>
              </div>
              <p style={{ 
                margin: 0, 
                color: '#E0E0E0', 
                fontSize: '14px',
                lineHeight: '1.5'
              }}>
                {feature.description}
              </p>
              <div style={{ 
                marginTop: '15px', 
                textAlign: 'right',
                color: feature.color,
                fontWeight: 'bold',
                fontSize: '14px'
              }}>
                Truy cập →
              </div>
            </div>
          ))}
        </div>

        {/* Recent Activity */}
        <div style={{ 
          marginTop: '40px',
          background: 'rgba(26, 32, 44, 0.8)',
          borderRadius: '12px',
          padding: '25px',
          boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(10px)'
        }}>
          <h3 style={{ margin: '0 0 20px 0', color: '#FFFFFF' }}>Hoạt động gần đây</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              padding: '10px',
              background: 'rgba(255, 255, 255, 0.05)',
              borderRadius: '8px',
              border: '1px solid rgba(255, 255, 255, 0.1)'
            }}>
              <span style={{ marginRight: '10px' }}>🔋</span>
              <span style={{ flex: 1, color: '#E0E0E0' }}>Pin BAT-001 đã được đổi thành công tại Trạm Quận 1</span>
              <span style={{ color: '#B0B0B0', fontSize: '12px' }}>2 phút trước</span>
            </div>
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              padding: '10px',
              background: 'rgba(255, 255, 255, 0.05)',
              borderRadius: '8px',
              border: '1px solid rgba(255, 255, 255, 0.1)'
            }}>
              <span style={{ marginRight: '10px' }}>🏢</span>
              <span style={{ flex: 1, color: '#E0E0E0' }}>Trạm Quận 3 đã được cập nhật thông tin</span>
              <span style={{ color: '#B0B0B0', fontSize: '12px' }}>15 phút trước</span>
            </div>
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              padding: '10px',
              background: 'rgba(255, 255, 255, 0.05)',
              borderRadius: '8px',
              border: '1px solid rgba(255, 255, 255, 0.1)'
            }}>
              <span style={{ marginRight: '10px' }}>⚠️</span>
              <span style={{ flex: 1, color: '#E0E0E0' }}>Pin BAT-003 cần bảo trì khẩn cấp</span>
              <span style={{ color: '#B0B0B0', fontSize: '12px' }}>1 giờ trước</span>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default StaffDashboard;