import React from 'react';
import { useAdminDashboardData } from './hooks/useAdminDashboardData';
import StatsCards from './components/StatsCards';
import ActivityTimeline from './components/ActivityTimeline';
import QuickActions from './components/QuickActions';
import '../../../assets/css/AdminDashboard.css';

const AdminDashboard = () => {
  const { stats, isLoading, error, refetch } = useAdminDashboardData();

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Đang tải dữ liệu tổng quan...</p>
        </div>
      );
    }

    if (error) {
      return (
        <div className="error-container">
          <div className="error-icon">⚠️</div>
          <p className="error-message">Lỗi: {error}</p>
          <button onClick={refetch} className="retry-button">
            🔄 Thử lại
          </button>
        </div>
      );
    }

    if (!stats) {
      return (
        <div className="empty-container">
          <p>Không có dữ liệu thống kê.</p>
        </div>
      );
    }

    return (
      <>
        {/* Stats Cards */}
        <StatsCards stats={stats} />

        {/* Bottom Section */}
        <div className="dashboard-bottom">
          {/* Quick Actions */}
          <div className="quick-actions-section">
            <QuickActions />
          </div>

          {/* Recent Activity */}
          <div className="activity-section">
            <ActivityTimeline stats={stats} />
          </div>
        </div>
      </>
    );
  };

  return (
    <div className="admin-dashboard">
      {/* Header */}
      <div className="dashboard-header">
        <div className="header-content">
          <div>
            <h1>Tổng quan Hệ thống</h1>
            <p className="subtitle">Xem thống kê và quản lý hệ thống EV Battery Swap</p>
          </div>
          <div className="header-actions">
            <button onClick={refetch} disabled={isLoading} className="refresh-button">
              {isLoading ? (
                <>
                  <span className="spinner-small"></span>
                  Đang tải...
                </>
              ) : (
                <>
                  🔄 Tải lại
                </>
              )}
            </button>
            <button className="export-button">
              📊 Xuất báo cáo
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="dashboard-content">
        {renderContent()}
      </div>
    </div>
  );
};

export default AdminDashboard;