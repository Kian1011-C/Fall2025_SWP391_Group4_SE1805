import React from 'react';
import { FiDollarSign, FiCreditCard, FiTrendingUp, FiZap, FiMapPin, FiUsers, FiFilter, FiRefreshCw } from 'react-icons/fi';
import { useReportsData } from './hooks/useReportsData';
import ReportCard from './components/ReportCard';

// Style cho bộ lọc ngày tháng
const dateInputStyle = {
  background: '#374151', color: 'white', border: '1px solid #4b5563',
  padding: '10px 15px', borderRadius: '8px', fontSize: '14px'
};

const AdminReports = () => {
  const { revenueData, usageData, isLoading, error, dateRange, setDateRange, refetch } = useReportsData();

  const handleDateChange = (e) => {
    setDateRange(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const renderContent = () => {
    if (isLoading) return <p style={{ color: '#9ca3af', textAlign: 'center' }}>Đang tải dữ liệu báo cáo...</p>;
    if (error) return (
      <div style={{ color: '#ef4444', textAlign: 'center' }}>
        <p>Lỗi: {error}</p>
        <button onClick={refetch} style={{ background: '#374151', color: 'white', border: 'none', padding: '8px 12px', borderRadius: '6px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}>
          <FiRefreshCw size={16} /> Thử lại
        </button>
      </div>
    );
    if (!revenueData || !usageData) return <p style={{ color: '#9ca3af', textAlign: 'center' }}>Không có dữ liệu báo cáo.</p>;

    return (
      <>
        {/* Hàng 1: Thống kê Doanh thu */}
        <h2 style={{ color: 'white', borderBottom: '1px solid #374151', paddingBottom: '10px' }}>Báo cáo Doanh thu</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '25px', marginBottom: '30px' }}>
          <ReportCard label="Tổng Doanh thu" value={revenueData.totalRevenue?.toLocaleString('vi-VN') + ' ₫'} icon={<FiDollarSign size={32} />} color="#10b981" />
          <ReportCard label="Giao dịch" value={revenueData.totalTransactions?.toLocaleString()} icon={<FiCreditCard size={32} />} color="#3b82f6" />
          <ReportCard label="Doanh thu TB / Giao dịch" value={revenueData.avgRevenuePerTx?.toLocaleString('vi-VN') + ' ₫'} icon={<FiTrendingUp size={32} />} color="#f59e0b" />
        </div>

        {/* Hàng 2: Thống kê Sử dụng */}
        <h2 style={{ color: 'white', borderBottom: '1px solid #374151', paddingBottom: '10px' }}>Báo cáo Sử dụng</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '25px' }}>
          <ReportCard label="Tổng lượt đổi pin" value={usageData.totalSwaps?.toLocaleString()} icon={<FiZap size={32} />} color="#3b82f6" />
          <ReportCard label="Trạm Yêu thích" value={usageData.favoriteStation || 'N/A'} icon={<FiMapPin size={32} />} color="#f59e0b" />
          <ReportCard label="Tài xế Hoạt động" value={usageData.activeUsers?.toLocaleString()} icon={<FiUsers size={32} />} color="#10b981" />
        </div>
      </>
    );
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        <div>
          <h1 style={{ margin: 0, fontSize: '28px' }}>Báo cáo</h1>
          <p style={{ margin: '5px 0 0 0', color: '#9ca3af' }}>Xem báo cáo chi tiết về doanh thu và tình hình sử dụng.</p>
        </div>
        <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
          <input type="date" name="startDate" value={dateRange.startDate} onChange={handleDateChange} style={dateInputStyle} />
          <span style={{ color: '#9ca3af' }}>đến</span>
          <input type="date" name="endDate" value={dateRange.endDate} onChange={handleDateChange} style={dateInputStyle} />
          <button onClick={refetch} disabled={isLoading} style={{ background: '#374151', color: 'white', border: 'none', padding: '10px 15px', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>
            {isLoading ? 'Đang tải...' : <><FiFilter size={18} /> Lọc</>}
          </button>
        </div>
      </div>
      {renderContent()}
    </div>
  );
};

export default AdminReports;