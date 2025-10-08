// Admin Dashboard Component
// Main administrative dashboard with beautiful design

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import reportService from '../../assets/js/services/reportService';
import DashboardLayout from '../../layouts/DashboardLayout';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalBatteries: 0,
    totalStations: 0,
    totalTransactions: 0,
    totalSwaps: 0,
    monthlyRevenue: 0,
    activeUsers: 0,
    activeBatteries: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Update time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Fetch dashboard stats
  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Get current month date range
      const now = new Date();
      const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
      const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0);
      
      const dateRange = {
        startDate: firstDay.toISOString().split('T')[0],
        endDate: lastDay.toISOString().split('T')[0]
      };

      const result = await reportService.getOverviewReport(dateRange);
      
      if (result.success && result.data) {
        setStats({
          totalUsers: result.data.totalUsers || 0,
          totalBatteries: result.data.totalBatteries || 0,
          totalStations: result.data.totalStations || 0,
          totalTransactions: result.data.totalTransactions || 0,
          totalSwaps: result.data.totalSwaps || 0,
          monthlyRevenue: result.data.revenue || 0,
          activeUsers: result.data.activeUsers || 0,
          activeBatteries: result.data.activeBatteries || 0
        });
      } else {
        setError(result.message || 'Không thể tải dữ liệu dashboard');
      }
    } catch (err) {
      setError('Lỗi khi tải dữ liệu dashboard');
      console.error('Error fetching dashboard stats:', err);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const formatNumber = (number) => {
    return new Intl.NumberFormat('vi-VN').format(number);
  };

  const adminFeatures = [
    {
      id: 1,
      icon: '👥',
      title: 'Quản lý người dùng',
      description: 'Quản lý tài khoản và phân quyền người dùng',
      route: '/admin/users',
      color: '#19c37d'
    },
    {
      id: 2,
      icon: '🔋',
      title: 'Quản lý pin',
      description: 'Theo dõi và quản lý kho pin EV',
      route: '/admin/batteries',
      color: '#6ab7ff'
    },
    {
      id: 3,
      icon: '🏪',
      title: 'Quản lý trạm',
      description: 'Quản lý các trạm đổi pin',
      route: '/admin/stations',
      color: '#ffa500'
    },
    {
      id: 4,
      icon: '📊',
      title: 'Báo cáo & Thống kê',
      description: 'Xem báo cáo và phân tích dữ liệu',
      route: '/admin/reports',
      color: '#ff6b6b'
    },
    {
      id: 5,
      icon: '📋',
      title: 'Quản lý hợp đồng',
      description: 'Quản lý hợp đồng và giao dịch',
      route: '/admin/contracts',
      color: '#9c88ff'
    },
    {
      id: 6,
      icon: '💎',
      title: 'Gói dịch vụ',
      description: 'Quản lý các gói subscription',
      route: '/admin/subscriptions',
      color: '#4ecdc4'
    }
  ];

  const handleFeatureClick = (route) => {
    navigate(route);
  };

  if (loading) {
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <div style={{ color: '#19c37d', fontSize: '1.5rem' }}>⏳ Đang tải...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <div style={{ color: '#ff6b6b', fontSize: '1.2rem' }}>⚠️ {error}</div>
        <button 
          onClick={fetchDashboardStats}
          style={{
            marginTop: '20px',
            padding: '10px 20px',
            background: '#19c37d',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer'
          }}
        >
          Thử lại
        </button>
      </div>
    );
  }

  return (
    <DashboardLayout role="admin">
      <div style={{ padding: '20px', minHeight: '100vh' }}>
        {/* Hero Section */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(25, 195, 125, 0.1), rgba(106, 183, 255, 0.1))',
        borderRadius: '20px',
        padding: '40px',
        marginBottom: '30px',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        backdropFilter: 'blur(20px)',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Background Pattern */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage: `
            radial-gradient(circle at 20% 80%, rgba(25, 195, 125, 0.1) 0%, transparent 50%),
            radial-gradient(circle at 80% 20%, rgba(106, 183, 255, 0.1) 0%, transparent 50%),
            radial-gradient(circle at 40% 40%, rgba(255, 165, 0, 0.05) 0%, transparent 50%)
          `,
          zIndex: 0
        }} />
        
        <div style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <div>
              <h1 style={{ 
                margin: 0, 
                color: '#FFFFFF', 
                fontSize: '2.5rem', 
                fontWeight: '700',
                background: 'linear-gradient(135deg, #19c37d, #6ab7ff)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text'
              }}>
                ⚙️ Dashboard Quản trị
              </h1>
              <p style={{ 
                margin: '10px 0 0 0', 
                color: '#B0B0B0', 
                fontSize: '1.1rem',
                fontWeight: '400'
              }}>
                Chào mừng bạn đến với hệ thống quản lý pin EV
              </p>
            </div>
            <div style={{
              background: 'rgba(255, 255, 255, 0.1)',
              borderRadius: '15px',
              padding: '15px 25px',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              textAlign: 'center'
            }}>
              <div style={{ color: '#19c37d', fontSize: '1.1rem', fontWeight: '600' }}>
                {currentTime.toLocaleDateString('vi-VN')}
              </div>
              <div style={{ color: '#6ab7ff', fontSize: '1.4rem', fontWeight: '700' }}>
                {currentTime.toLocaleTimeString('vi-VN')}
              </div>
            </div>
          </div>
          
          {/* Quick Stats Overview */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
            gap: '15px',
            marginTop: '20px'
          }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ color: '#19c37d', fontSize: '1.8rem', fontWeight: '700' }}>
                {formatNumber(stats.totalUsers)}
              </div>
              <div style={{ color: '#E0E0E0', fontSize: '0.9rem' }}>Người dùng</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ color: '#6ab7ff', fontSize: '1.8rem', fontWeight: '700' }}>
                {formatNumber(stats.totalBatteries)}
              </div>
              <div style={{ color: '#E0E0E0', fontSize: '0.9rem' }}>Pin</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ color: '#ffa500', fontSize: '1.8rem', fontWeight: '700' }}>
                {stats.totalStations}
              </div>
              <div style={{ color: '#E0E0E0', fontSize: '0.9rem' }}>Trạm</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ color: '#ff6b6b', fontSize: '1.8rem', fontWeight: '700' }}>
                {formatNumber(stats.totalTransactions)}
              </div>
              <div style={{ color: '#E0E0E0', fontSize: '0.9rem' }}>Giao dịch</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ color: '#4ecdc4', fontSize: '1.8rem', fontWeight: '700' }}>
                {formatCurrency(stats.monthlyRevenue)}
              </div>
              <div style={{ color: '#E0E0E0', fontSize: '0.9rem' }}>Doanh thu</div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Stats Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '25px',
        marginBottom: '30px'
      }}>
        {/* Users Card */}
        <div style={{
          background: 'linear-gradient(135deg, rgba(25, 195, 125, 0.1), rgba(25, 195, 125, 0.05))',
          borderRadius: '20px',
          padding: '30px',
          border: '1px solid rgba(25, 195, 125, 0.2)',
          backdropFilter: 'blur(10px)',
          position: 'relative',
          overflow: 'hidden'
        }}>
          <div style={{
            position: 'absolute',
            top: '-20px',
            right: '-20px',
            width: '100px',
            height: '100px',
            background: 'linear-gradient(135deg, rgba(25, 195, 125, 0.2), rgba(25, 195, 125, 0.1))',
            borderRadius: '50%',
            filter: 'blur(20px)'
          }} />
          <div style={{ position: 'relative', zIndex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '20px' }}>
              <div style={{
                padding: '15px',
                borderRadius: '15px',
                background: 'linear-gradient(135deg, #19c37d, #15a36a)',
                fontSize: '2rem',
                boxShadow: '0 10px 30px rgba(25, 195, 125, 0.3)'
              }}>
                👥
              </div>
              <div>
                <h3 style={{ margin: 0, color: '#FFFFFF', fontSize: '1.3rem' }}>Người dùng</h3>
                <p style={{ margin: 0, color: '#B0B0B0', fontSize: '0.9rem' }}>Quản lý tài khoản</p>
              </div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ fontSize: '2.5rem', fontWeight: '700', color: '#19c37d' }}>
                  {formatNumber(stats.totalUsers)}
                </div>
                <div style={{ fontSize: '0.9rem', color: '#19c37d' }}>
                  {formatNumber(stats.activeUsers)} hoạt động
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Batteries Card */}
        <div style={{
          background: 'linear-gradient(135deg, rgba(106, 183, 255, 0.1), rgba(106, 183, 255, 0.05))',
          borderRadius: '20px',
          padding: '30px',
          border: '1px solid rgba(106, 183, 255, 0.2)',
          backdropFilter: 'blur(10px)',
          position: 'relative',
          overflow: 'hidden'
        }}>
          <div style={{
            position: 'absolute',
            top: '-20px',
            right: '-20px',
            width: '100px',
            height: '100px',
            background: 'linear-gradient(135deg, rgba(106, 183, 255, 0.2), rgba(106, 183, 255, 0.1))',
            borderRadius: '50%',
            filter: 'blur(20px)'
          }} />
          <div style={{ position: 'relative', zIndex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '20px' }}>
              <div style={{
                padding: '15px',
                borderRadius: '15px',
                background: 'linear-gradient(135deg, #6ab7ff, #4a9eff)',
                fontSize: '2rem',
                boxShadow: '0 10px 30px rgba(106, 183, 255, 0.3)'
              }}>
                🔋
              </div>
              <div>
                <h3 style={{ margin: 0, color: '#FFFFFF', fontSize: '1.3rem' }}>Kho pin</h3>
                <p style={{ margin: 0, color: '#B0B0B0', fontSize: '0.9rem' }}>Quản lý pin EV</p>
              </div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ fontSize: '2.5rem', fontWeight: '700', color: '#6ab7ff' }}>
                  {formatNumber(stats.totalBatteries)}
                </div>
                <div style={{ fontSize: '0.9rem', color: '#6ab7ff' }}>
                  {formatNumber(stats.activeBatteries)} sẵn sàng
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Revenue Card */}
        <div style={{
          background: 'linear-gradient(135deg, rgba(255, 165, 0, 0.1), rgba(255, 165, 0, 0.05))',
          borderRadius: '20px',
          padding: '30px',
          border: '1px solid rgba(255, 165, 0, 0.2)',
          backdropFilter: 'blur(10px)',
          position: 'relative',
          overflow: 'hidden'
        }}>
          <div style={{
            position: 'absolute',
            top: '-20px',
            right: '-20px',
            width: '100px',
            height: '100px',
            background: 'linear-gradient(135deg, rgba(255, 165, 0, 0.2), rgba(255, 165, 0, 0.1))',
            borderRadius: '50%',
            filter: 'blur(20px)'
          }} />
          <div style={{ position: 'relative', zIndex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '20px' }}>
              <div style={{
                padding: '15px',
                borderRadius: '15px',
                background: 'linear-gradient(135deg, #ffa500, #e6940b)',
                fontSize: '2rem',
                boxShadow: '0 10px 30px rgba(255, 165, 0, 0.3)'
              }}>
                💰
              </div>
              <div>
                <h3 style={{ margin: 0, color: '#FFFFFF', fontSize: '1.3rem' }}>Doanh thu</h3>
                <p style={{ margin: 0, color: '#B0B0B0', fontSize: '0.9rem' }}>Tháng này</p>
              </div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ fontSize: '2.5rem', fontWeight: '700', color: '#ffa500' }}>
                  {formatCurrency(stats.monthlyRevenue)}
                </div>
                <div style={{ fontSize: '0.9rem', color: '#ffa500' }}>
                  {formatNumber(stats.totalTransactions)} giao dịch
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Admin Features Grid */}
      <div style={{
        background: 'rgba(26, 32, 44, 0.8)',
        borderRadius: '20px',
        padding: '30px',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        backdropFilter: 'blur(10px)',
        marginBottom: '30px'
      }}>
        <h3 style={{ 
          color: '#FFFFFF', 
          marginBottom: '25px', 
          display: 'flex', 
          alignItems: 'center', 
          gap: '10px',
          fontSize: '1.3rem'
        }}>
          ⚡ Chức năng quản trị
        </h3>
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '20px' 
      }}>
        {adminFeatures.map((feature) => (
          <div
            key={feature.id}
            onClick={() => handleFeatureClick(feature.route)}
            style={{
              background: 'rgba(26, 32, 44, 0.8)',
              borderRadius: '12px',
              padding: '25px',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              backdropFilter: 'blur(10px)',
              boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
            }}
            onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-5px)';
                e.currentTarget.style.boxShadow = '0 16px 48px rgba(0,0,0,0.4)';
                e.currentTarget.style.borderColor = feature.color;
            }}
            onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 8px 32px rgba(0,0,0,0.3)';
                e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)';
            }}
          >
            <div style={{
              display: 'flex',
              alignItems: 'center',
              marginBottom: '15px',
              gap: '15px'
            }}>
              <div style={{
                fontSize: '2.5rem',
                padding: '15px',
                borderRadius: '12px',
                background: `linear-gradient(135deg, ${feature.color}, ${feature.color}dd)`,
                boxShadow: `0 8px 24px ${feature.color}40`
              }}>
                {feature.icon}
              </div>
              <div>
                <h3 style={{
                  margin: '0 0 8px 0',
                  color: '#FFFFFF',
                  fontSize: '1.2rem',
                  fontWeight: '600'
                }}>
                  {feature.title}
                </h3>
                <p style={{
                  margin: 0,
                  color: '#B0B0B0',
                  fontSize: '0.9rem',
                  lineHeight: '1.4'
                }}>
                  {feature.description}
                </p>
              </div>
            </div>
            <div style={{
              padding: '12px 0',
              borderTop: '1px solid rgba(255, 255, 255, 0.1)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <span style={{ color: feature.color, fontSize: '0.9rem', fontWeight: '500' }}>
                Nhấn để truy cập
              </span>
              <span style={{ color: feature.color, fontSize: '1.2rem' }}>→</span>
            </div>
          </div>
        ))}
        </div>
      </div>

      {/* Activity Timeline */}
      <div style={{
        background: 'rgba(26, 32, 44, 0.8)',
        borderRadius: '20px',
        padding: '30px',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        backdropFilter: 'blur(10px)'
      }}>
        <h3 style={{ 
          color: '#FFFFFF', 
          marginBottom: '25px', 
          display: 'flex', 
          alignItems: 'center', 
          gap: '10px',
          fontSize: '1.3rem'
        }}>
          🕒 Hoạt động gần đây
        </h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          {[
            { icon: '👤', text: 'Người dùng mới đăng ký tài khoản', time: '2 phút trước', color: '#19c37d' },
            { icon: '🔋', text: 'Đổi pin tại trạm thành công', time: '5 phút trước', color: '#6ab7ff' },
            { icon: '💳', text: 'Thanh toán hoàn tất', time: '8 phút trước', color: '#ffa500' },
            { icon: '👨‍💼', text: 'Nhân viên đăng nhập hệ thống', time: '12 phút trước', color: '#9c88ff' },
            { icon: '🔧', text: 'Bảo trì pin được lên lịch', time: '15 phút trước', color: '#ff6b6b' }
          ].map((activity, index) => (
            <div key={index} style={{
              display: 'flex',
              alignItems: 'center',
              gap: '15px',
              padding: '15px',
              borderRadius: '12px',
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              transition: 'all 0.3s ease'
            }}>
              <div style={{
                fontSize: '1.5rem',
                padding: '10px',
                borderRadius: '10px',
                background: `${activity.color}20`,
                border: `1px solid ${activity.color}40`
              }}>
                {activity.icon}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ color: '#FFFFFF', fontSize: '0.95rem', marginBottom: '2px' }}>
                  {activity.text}
                </div>
                <div style={{ color: '#B0B0B0', fontSize: '0.8rem' }}>{activity.time}</div>
              </div>
              <div style={{
                width: '4px',
                height: '30px',
                background: activity.color,
                borderRadius: '2px'
              }} />
            </div>
          ))}
        </div>
      </div>
    </div>
    </DashboardLayout>
  );
};

export default AdminDashboard;
