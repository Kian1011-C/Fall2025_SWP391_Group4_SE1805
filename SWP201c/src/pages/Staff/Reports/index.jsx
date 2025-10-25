import React from 'react';
import { useReportData } from './hooks/useReportData';
import ReportCard from './components/ReportCard';

const StaffReports = () => {
  const { report, isLoading, error, refetch } = useReportData();

  const renderContent = () => {
    if (isLoading) return <p style={{ color: '#94a3b8', textAlign: 'center' }}>Đang tải dữ liệu báo cáo...</p>;
    if (error) return (
      <div style={{ color: '#ef4444', textAlign: 'center' }}>
        <p>Lỗi: {error}</p>
        <button onClick={() => refetch()}>Thử lại</button>
      </div>
    );
    if (!report) return <p style={{ color: '#94a3b8', textAlign: 'center' }}>Không có dữ liệu báo cáo.</p>;

    return (
      <>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '25px' }}>
          <ReportCard label="Tổng lượt đổi trong tháng" value={report.totalSwaps.toLocaleString()} icon="🔄" />
          <ReportCard label="Doanh thu hôm nay" value={report.revenueToday.toLocaleString('vi-VN') + ' ₫'} icon="💰" />
          <ReportCard label="Sức khỏe pin trung bình" value={report.averageBatteryHealth + '%'} icon="❤️" />
          <ReportCard label="Giờ cao điểm" value={report.peakHours} icon="🕒" />
          <ReportCard label="Trụ sử dụng nhiều nhất" value={report.mostUsedTower} icon="🏆" />
          <ReportCard label="Lượt đổi thất bại" value={report.failedSwaps} icon="⚠️" />
        </div>
        <div style={{ marginTop: '40px' }}>
          <h2 style={{ marginBottom: '20px', color: 'white' }}>Biểu đồ Tăng trưởng Doanh thu</h2>
          <div style={{ background: '#1e293b', padding: '20px', borderRadius: '16px', height: '300px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94a3b8' }}>
            (Biểu đồ sẽ được tích hợp ở đây)
          </div>
        </div>
      </>
    );
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        <div>
            <h1 style={{ margin: 0, fontSize: '28px' }}>Báo cáo Hoạt động</h1>
            <p style={{ margin: '5px 0 0 0', color: '#94a3b8' }}>Thống kê hiệu suất hoạt động của trạm.</p>
        </div>
        <input 
          type="date" 
          defaultValue={new Date().toISOString().substring(0, 10)} 
          onChange={(e) => refetch({ date: e.target.value })}
          style={{ background: '#334155', color: 'white', border: '1px solid #475569', padding: '8px 12px', borderRadius: '8px' }}
        />
      </div>
      {renderContent()}
    </div>
  );
};

export default StaffReports;