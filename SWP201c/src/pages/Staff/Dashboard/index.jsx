import React from 'react';
import { useDashboardData } from './hooks/useDashboardData';
import StatCard from './components/StatCard';

const mockActivities = [
    { time: '10:15 AM', text: 'Tài xế Nguyễn Văn A báo cáo sự cố hộc pin kẹt.' },
    { time: '09:45 AM', text: 'Hoàn tất đổi pin cho yêu cầu #REQ001.' },
    { time: '09:30 AM', text: 'Pin BAT007 đã được sạc đầy và sẵn sàng.' },
];

const StaffDashboard = () => {
  const { stats, isLoading, error, refetch } = useDashboardData();

  const renderContent = () => {
    if (isLoading) {
      return <p style={{ color: '#94a3b8', textAlign: 'center' }}>Đang tải dữ liệu trang chủ...</p>;
    }
    if (error) {
      return (
        <div style={{ color: '#ef4444', textAlign: 'center' }}>
          <p>Lỗi: {error}</p>
          <button onClick={refetch}>Thử lại</button>
        </div>
      );
    }
    if (!stats) {
        return <p style={{ color: '#94a3b8', textAlign: 'center' }}>Không có dữ liệu để hiển thị.</p>;
    }

    return (
      <>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '25px' }}>
          <StatCard label="Yêu cầu đang chờ" value={stats.pendingRequests} icon="⏳" color="#f59e0b" />
          <StatCard label="Lượt đổi hôm nay" value={stats.completedToday} icon="✅" color="#10b981" />
          <StatCard label="Pin yếu cần sạc" value={stats.lowBatteries} icon="🔋" color="#ef4444" />
          <StatCard label="Tình trạng trạm" value={stats.stationStatus} icon="🏢" color="#3b82f6" />
        </div>
        <div style={{ marginTop: '40px', background: '#1e293b', padding: '30px', borderRadius: '16px' }}>
          <h2 style={{ marginTop: 0, color: 'white' }}>Hoạt động gần đây</h2>
          <div>
            {mockActivities.map((activity, index) => (
              <div key={index} style={{ display: 'flex', gap: '20px', padding: '15px 0', borderTop: index > 0 ? '1px solid #334155' : 'none' }}>
                <div style={{ color: '#94a3b8', minWidth: '80px' }}>{activity.time}</div>
                <div style={{ color: '#e2e8f0' }}>{activity.text}</div>
              </div>
            ))}
          </div>
        </div>
      </>
    );
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        <h1 style={{ margin: 0, fontSize: '28px' }}>Tổng quan Trạm</h1>
        <button onClick={refetch} disabled={isLoading} style={{ background: '#334155', color: 'white', border: 'none', padding: '8px 15px', borderRadius: '6px', cursor: 'pointer' }}>
            🔄 Tải lại
        </button>
      </div>
      {renderContent()}
    </div>
  );
};

export default StaffDashboard;