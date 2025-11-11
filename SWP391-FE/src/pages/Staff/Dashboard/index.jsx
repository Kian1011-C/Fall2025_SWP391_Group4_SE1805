import React from 'react';
import { useDashboardData } from './hooks/useDashboardData';
import StatCard from './components/StatCard';
import '../../../assets/css/StaffDashboard.css';

const mockActivities = [
    { time: '10:15 AM', text: 'Tài xế Nguyễn Văn A báo cáo sự cố hộc pin kẹt.' },
    { time: '09:45 AM', text: 'Hoàn tất đổi pin cho yêu cầu #REQ001.' },
    { time: '09:30 AM', text: 'Pin BAT007 đã được sạc đầy và sẵn sàng.' },
];

const StaffDashboard = () => {
  const { stats, isLoading, error, refetch } = useDashboardData();

  const renderContent = () => {
    if (isLoading) {
      return <div className="staff-dashboard-loading">⏳ Đang tải dữ liệu trang chủ...</div>;
    }
    if (error) {
      return (
        <div className="staff-dashboard-error">
          <p>❌ Lỗi: {error}</p>
          <button onClick={refetch} className="staff-dashboard-error-btn">
            🔄 Thử lại
          </button>
        </div>
      );
    }
    if (!stats) {
        return <div className="staff-dashboard-loading">Không có dữ liệu để hiển thị.</div>;
    }

    return (
      <>
        {/* Thống kê tổng quan */}
        <div className="staff-dashboard-section">
          <h2 className="staff-dashboard-section-title">
            📊 Thống kê hệ thống
          </h2>
          <div className="staff-dashboard-grid">
            <StatCard 
              label="Tổng lượt đổi pin" 
              value={stats.totalSwaps} 
              icon="🔄" 
              color="#3b82f6" 
            />
            <StatCard 
              label="Tổng số trạm" 
              value={stats.totalStations} 
              icon="🏢" 
              color="#8b5cf6" 
            />
            <StatCard 
              label="Người dùng hoạt động" 
              value={stats.activeUsers} 
              icon="👥" 
              color="#06b6d4" 
            />
          </div>
        </div>

        {/* Thống kê pin */}
        <div className="staff-dashboard-section">
          <h2 className="staff-dashboard-section-title">
            🔋 Quản lý pin
          </h2>
          <div className="staff-dashboard-grid">
            <StatCard 
              label="Tổng số pin" 
              value={stats.totalBatteries} 
              icon="🔋" 
              color="#f59e0b" 
            />
            <StatCard 
              label="Pin sẵn sàng" 
              value={stats.activeBatteries} 
              icon="✅" 
              color="#10b981" 
            />
          </div>
        </div>

        {/* Hoạt động gần đây */}
        <div className="staff-dashboard-activities">
          <h2 className="staff-dashboard-activities-title">
            🕐 Hoạt động gần đây
          </h2>
          <div>
            {mockActivities.map((activity, index) => (
              <div key={index} className="staff-dashboard-activity-item">
                <div className="staff-dashboard-activity-time">{activity.time}</div>
                <div className="staff-dashboard-activity-text">{activity.text}</div>
              </div>
            ))}
          </div>
          <div className="staff-dashboard-notice">
            ℹ️ Dữ liệu hoạt động thời gian thực sẽ được cập nhật khi có API
          </div>
        </div>
      </>
    );
  };

  return (
    <div className="staff-dashboard">
      <div className="staff-dashboard-header">
        <div>
          <h1 className="staff-dashboard-title">📍 Tổng quan Trạm</h1>
          <p className="staff-dashboard-subtitle">Thống kê và quản lý hệ thống đổi pin</p>
        </div>
        <button 
          onClick={refetch} 
          disabled={isLoading} 
          className="staff-dashboard-refresh-btn"
        >
          🔄 {isLoading ? 'Đang tải...' : 'Tải lại'}
        </button>
      </div>
      {renderContent()}
    </div>
  );
};

export default StaffDashboard;