import React from 'react';
import { FiClock, FiAlertCircle, FiRefreshCw, FiZap, FiMapPin, FiUsers, FiBattery, FiPackage, FiActivity } from 'react-icons/fi';
import { useDashboardData } from './hooks/useDashboardData';
import StatCard from './components/StatCard';
import '../../../assets/css/StaffDashboard.css';

const StaffDashboard = () => {
  const { stats, isLoading, error, refetch } = useDashboardData();

  const renderContent = () => {
    if (isLoading) {
      return <div className="staff-dashboard-loading" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
        <FiClock size={24} /> Đang tải dữ liệu trang chủ...
      </div>;
    }
    if (error) {
      return (
        <div className="staff-dashboard-error">
          <p style={{ display: 'flex', alignItems: 'center', gap: '8px', justifyContent: 'center' }}>
            <FiAlertCircle size={20} /> Lỗi: {error}
          </p>
          <button onClick={refetch} className="staff-dashboard-error-btn" style={{ display: 'flex', alignItems: 'center', gap: '8px', margin: '0 auto' }}>
            <FiRefreshCw size={18} /> Thử lại
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
             Thống kê hệ thống
          </h2>
          <div className="staff-dashboard-grid">
            <StatCard 
              label="Tổng lượt đổi pin" 
              value={stats.totalSwaps} 
              icon={<FiZap size={28} />} 
              color="#3b82f6" 
            />
            <StatCard 
              label="Tổng số trạm" 
              value={stats.totalStations} 
              icon={<FiMapPin size={28} />} 
              color="#8b5cf6" 
            />
            <StatCard 
              label="Người dùng hoạt động" 
              value={stats.activeUsers} 
              icon={<FiUsers size={28} />} 
              color="#06b6d4" 
            />
          </div>
        </div>

        {/* Thống kê pin */}
        <div className="staff-dashboard-section">
          <h2 className="staff-dashboard-section-title">
             Quản lý pin
          </h2>
          <div className="staff-dashboard-grid">
            <StatCard 
              label="Tổng số pin" 
              value={stats.totalBatteries} 
              icon="" 
              color="#f59e0b" 
            />
            <StatCard 
              label="Pin sẵn sàng" 
              value={stats.activeBatteries} 
              icon="" 
              color="#10b981" 
            />
          </div>
        </div>
      </>
    );
  };

  return (
    <div className="staff-dashboard">
      <div className="staff-dashboard-header">
        <div>
          <h1 className="staff-dashboard-title"> Tổng quan Trạm</h1>
          <p className="staff-dashboard-subtitle">Thống kê và quản lý hệ thống đổi pin</p>
        </div>
        <button 
          onClick={refetch} 
          disabled={isLoading} 
          className="staff-dashboard-refresh-btn"
        >
           {isLoading ? 'Đang tải...' : 'Tải lại'}
        </button>
      </div>
      {renderContent()}
    </div>
  );
};

export default StaffDashboard;