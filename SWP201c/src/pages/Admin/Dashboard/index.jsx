import React from 'react';
import { useAdminDashboardData } from './hooks/useAdminDashboardData';
import StatCard from './components/StatsCards';
import { formatCurrency } from '../../../assets/js/utils/apiHelpers';

const AdminDashboard = () => {
  const { stats, isLoading, error, refetch } = useAdminDashboardData();

  const renderContent = () => {
    if (isLoading) return <p style={{ color: '#9ca3af', textAlign: 'center' }}>Đang tải dữ liệu tổng quan...</p>;
    if (error) return (
      <div style={{ color: '#ef4444', textAlign: 'center' }}>
        <p>Lỗi: {error}</p>
        <button onClick={refetch} style={{ background: '#374151', color: 'white', border: 'none', padding: '8px 12px', borderRadius: '6px', cursor: 'pointer' }}>
          Thử lại
        </button>
      </div>
    );
    if (!stats) return <p style={{ color: '#9ca3af', textAlign: 'center' }}>Không có dữ liệu thống kê.</p>;

    const totalRevenue = stats.totalRevenue ? formatCurrency(stats.totalRevenue) : 'N/A';
    const newUsers = stats.newUsersThisMonth ?? 'N/A';
    const totalStations = stats.totalStations ?? 'N/A';
    const swapsToday = stats.swapsToday ?? 'N/A';

    return (
      <>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '25px' }}>
          <StatCard label="Tổng Doanh thu" value={totalRevenue} icon="💰" color="#f59e0b" />
          <StatCard label="Người dùng mới (Tháng)" value={newUsers} icon="👥" color="#10b981" />
          <StatCard label="Tổng số trạm" value={totalStations} icon="🏢" color="#3b82f6" />
          <StatCard label="Lượt đổi pin (Hôm nay)" value={swapsToday} icon="🔄" color="#ef4444" />
        </div>
        <div style={{ marginTop: '40px', background: '#1f2937', padding: '30px', borderRadius: '16px', height: '400px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#9ca3af' }}>
          (Biểu đồ doanh thu sẽ được hiển thị ở đây)
        </div>
      </>
    );
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        <h1 style={{ margin: 0, fontSize: '28px' }}>Tổng quan Hệ thống</h1>
        <button onClick={refetch} disabled={isLoading} style={{ background: '#374151', color: 'white', border: 'none', padding: '8px 15px', borderRadius: '6px', cursor: 'pointer' }}>
            {isLoading ? 'Đang tải...' : '🔄 Tải lại'}
        </button>
      </div>
      {renderContent()}
    </div>
  );
};

export default AdminDashboard;