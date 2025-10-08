// Staff Reports - Refactored
import React from 'react';

const StaffReports = () => {
  const [dateRange, setDateRange] = React.useState('week');
  
  const stats = {
    totalSwaps: 127,
    totalRevenue: 6350000,
    avgSwapsPerDay: 18,
    totalBatteries: 45
  };

  const dailyData = [
    { date: '06/10', swaps: 22, revenue: 1100000 },
    { date: '05/10', swaps: 25, revenue: 1250000 },
    { date: '04/10', swaps: 19, revenue: 950000 },
    { date: '03/10', swaps: 15, revenue: 750000 },
    { date: '02/10', swaps: 18, revenue: 900000 },
    { date: '01/10', swaps: 16, revenue: 800000 },
    { date: '30/09', swaps: 12, revenue: 600000 }
  ];

  return (
    <div style={{ padding: '30px', background: '#0f172a', minHeight: '100vh', color: '#fff' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        <h2>📊 Báo cáo hoạt động</h2>
        <select
          value={dateRange}
          onChange={e => setDateRange(e.target.value)}
          style={{
            padding: '10px 20px',
            background: 'rgba(255,255,255,0.1)',
            border: '1px solid rgba(255,255,255,0.2)',
            borderRadius: '8px',
            color: '#fff',
            cursor: 'pointer'
          }}
        >
          <option value="day">Hôm nay</option>
          <option value="week">7 ngày qua</option>
          <option value="month">30 ngày qua</option>
        </select>
      </div>

      {/* Stats Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
        gap: '20px',
        marginBottom: '30px'
      }}>
        <div style={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          padding: '24px',
          borderRadius: '12px'
        }}>
          <div style={{ fontSize: '14px', opacity: 0.9, marginBottom: '8px' }}>Tổng lượt đổi pin</div>
          <div style={{ fontSize: '36px', fontWeight: 'bold' }}>{stats.totalSwaps}</div>
          <div style={{ fontSize: '12px', opacity: 0.8, marginTop: '8px' }}>
            TB: {stats.avgSwapsPerDay} lượt/ngày
          </div>
        </div>

        <div style={{
          background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
          padding: '24px',
          borderRadius: '12px'
        }}>
          <div style={{ fontSize: '14px', opacity: 0.9, marginBottom: '8px' }}>Tổng doanh thu</div>
          <div style={{ fontSize: '36px', fontWeight: 'bold' }}>
            {(stats.totalRevenue / 1000000).toFixed(1)}M
          </div>
          <div style={{ fontSize: '12px', opacity: 0.8, marginTop: '8px' }}>VNĐ</div>
        </div>

        <div style={{
          background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
          padding: '24px',
          borderRadius: '12px'
        }}>
          <div style={{ fontSize: '14px', opacity: 0.9, marginBottom: '8px' }}>Số pin đang quản lý</div>
          <div style={{ fontSize: '36px', fontWeight: 'bold' }}>{stats.totalBatteries}</div>
          <div style={{ fontSize: '12px', opacity: 0.8, marginTop: '8px' }}>pin</div>
        </div>

        <div style={{
          background: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
          padding: '24px',
          borderRadius: '12px'
        }}>
          <div style={{ fontSize: '14px', opacity: 0.9, marginBottom: '8px' }}>Hiệu suất</div>
          <div style={{ fontSize: '36px', fontWeight: 'bold' }}>96%</div>
          <div style={{ fontSize: '12px', opacity: 0.8, marginTop: '8px' }}>hoàn thành</div>
        </div>
      </div>

      {/* Chart Area - Simplified */}
      <div style={{
        background: 'rgba(255,255,255,0.05)',
        borderRadius: '12px',
        padding: '24px',
        marginBottom: '30px'
      }}>
        <h3 style={{ marginTop: 0, marginBottom: '20px' }}>Biểu đồ hoạt động</h3>
        <div style={{ 
          display: 'flex', 
          alignItems: 'flex-end', 
          gap: '12px', 
          height: '250px',
          borderBottom: '2px solid rgba(255,255,255,0.1)',
          paddingBottom: '10px'
        }}>
          {dailyData.map((day, idx) => (
            <div key={idx} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <div style={{
                width: '100%',
                height: `${(day.swaps / 25) * 200}px`,
                background: 'linear-gradient(to top, #4F8CFF, #667eea)',
                borderRadius: '8px 8px 0 0',
                display: 'flex',
                alignItems: 'flex-start',
                justifyContent: 'center',
                paddingTop: '8px',
                fontSize: '12px',
                fontWeight: 'bold',
                color: '#fff'
              }}>
                {day.swaps}
              </div>
              <div style={{ marginTop: '8px', fontSize: '12px', color: '#999' }}>{day.date}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Transactions Table */}
      <div style={{
        background: 'rgba(255,255,255,0.05)',
        borderRadius: '12px',
        overflow: 'hidden'
      }}>
        <div style={{ padding: '20px', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
          <h3 style={{ margin: 0 }}>Giao dịch gần đây</h3>
        </div>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: 'rgba(255,255,255,0.05)' }}>
              <th style={{ padding: '12px', textAlign: 'left' }}>Thời gian</th>
              <th style={{ padding: '12px', textAlign: 'left' }}>Tài xế</th>
              <th style={{ padding: '12px', textAlign: 'left' }}>Pin</th>
              <th style={{ padding: '12px', textAlign: 'right' }}>Số tiền</th>
            </tr>
          </thead>
          <tbody>
            {['Nguyễn Văn A', 'Trần Thị B', 'Lê Văn C'].map((name, idx) => (
              <tr key={idx} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                <td style={{ padding: '12px' }}>{new Date().toLocaleTimeString('vi-VN')}</td>
                <td style={{ padding: '12px' }}>{name}</td>
                <td style={{ padding: '12px' }}>BAT-{101 + idx} → BAT-{201 + idx}</td>
                <td style={{ padding: '12px', textAlign: 'right', fontWeight: '600' }}>50,000đ</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Export Button */}
      <button
        onClick={() => alert('Xuất báo cáo (chức năng sẽ được triển khai)')}
        style={{
          marginTop: '20px',
          padding: '12px 24px',
          background: '#19c37d',
          border: 'none',
          borderRadius: '8px',
          color: '#fff',
          cursor: 'pointer',
          fontSize: '14px',
          fontWeight: '600'
        }}
      >
        📥 Xuất báo cáo Excel
      </button>
    </div>
  );
};

export default StaffReports;

