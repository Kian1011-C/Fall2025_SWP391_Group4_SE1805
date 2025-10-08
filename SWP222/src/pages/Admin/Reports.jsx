import React, { useState, useEffect } from 'react';
import reportService from '../../assets/js/services/reportService';
import DashboardLayout from '../../layouts/DashboardLayout';

const AdminReports = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [dateRange, setDateRange] = useState('month');
  const [reportData, setReportData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch reports from API
  useEffect(() => {
    fetchReports();
  }, [dateRange]);

  const fetchReports = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch all report types
      const [overviewResult, revenueResult, usageResult, customerResult] = await Promise.all([
        reportService.getOverviewReport(dateRange),
        reportService.getRevenueReport(dateRange),
        reportService.getUsageReport(dateRange),
        reportService.getCustomerReport(dateRange)
      ]);

      if (overviewResult.success && revenueResult.success && usageResult.success && customerResult.success) {
        setReportData({
          overview: overviewResult.data,
          revenue: revenueResult.data,
          usage: usageResult.data,
          customers: customerResult.data
        });
      } else {
        setError('Không thể tải báo cáo');
      }
    } catch (err) {
      setError('Lỗi khi tải báo cáo');
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  };

  const formatNumber = (number) => {
    return new Intl.NumberFormat('vi-VN').format(number);
  };

  const getGrowthColor = (growth) => {
    return growth >= 0 ? '#19c37d' : '#ff6b6b';
  };

  const renderOverviewTab = () => (
    <div style={{ display: 'grid', gap: '25px' }}>
      {/* Key Metrics */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
        gap: '20px'
      }}>
        <div style={{
          background: 'linear-gradient(135deg, rgba(25, 195, 125, 0.1), rgba(25, 195, 125, 0.05))',
          borderRadius: '15px',
          padding: '25px',
          border: '1px solid rgba(25, 195, 125, 0.2)'
        }}>
          <h3 style={{ color: '#E0E0E0', fontSize: '14px', margin: '0 0 10px 0' }}>Tổng doanh thu</h3>
          <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#19c37d', marginBottom: '8px' }}>
            {formatCurrency(reportData.overview?.totalRevenue || 0)}
          </div>
          <div style={{ fontSize: '12px', color: '#19c37d' }}>
            +{reportData.overview?.revenueGrowth || 0}% so với tháng trước
          </div>
        </div>

        <div style={{
          background: 'linear-gradient(135deg, rgba(106, 183, 255, 0.1), rgba(106, 183, 255, 0.05))',
          borderRadius: '15px',
          padding: '25px',
          border: '1px solid rgba(106, 183, 255, 0.2)'
        }}>
          <h3 style={{ color: '#E0E0E0', fontSize: '14px', margin: '0 0 10px 0' }}>Tổng giao dịch</h3>
          <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#6ab7ff', marginBottom: '8px' }}>
            {formatNumber(reportData.overview?.totalTransactions || 0)}
          </div>
          <div style={{ fontSize: '12px', color: '#6ab7ff' }}>
            Giá trị TB: {formatCurrency(reportData.overview?.avgTransactionValue || 0)}
          </div>
        </div>

        <div style={{
          background: 'linear-gradient(135deg, rgba(255, 165, 0, 0.1), rgba(255, 165, 0, 0.05))',
          borderRadius: '15px',
          padding: '25px',
          border: '1px solid rgba(255, 165, 0, 0.2)'
        }}>
          <h3 style={{ color: '#E0E0E0', fontSize: '14px', margin: '0 0 10px 0' }}>Người dùng hoạt động</h3>
          <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#ffa500', marginBottom: '8px' }}>
            {formatNumber(reportData.overview?.activeUsers || 0)}
          </div>
          <div style={{ fontSize: '12px', color: '#ffa500' }}>
            +{reportData.overview?.userGrowth || 0}% so với tháng trước
          </div>
        </div>

        <div style={{
          background: 'linear-gradient(135deg, rgba(78, 205, 196, 0.1), rgba(78, 205, 196, 0.05))',
          borderRadius: '15px',
          padding: '25px',
          border: '1px solid rgba(78, 205, 196, 0.2)'
        }}>
          <h3 style={{ color: '#E0E0E0', fontSize: '14px', margin: '0 0 10px 0' }}>Tổng số trạm</h3>
          <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#4ecdc4', marginBottom: '8px' }}>
            {formatNumber(reportData.overview?.totalStations || 0)}
          </div>
          <div style={{ fontSize: '12px', color: '#4ecdc4' }}>
            {formatNumber(reportData.overview?.totalBatteries || 0)} pin
          </div>
        </div>
      </div>

      {/* Quick Insights */}
      <div style={{
        background: 'rgba(26, 32, 44, 0.8)',
        borderRadius: '15px',
        padding: '25px',
        border: '1px solid rgba(255, 255, 255, 0.1)'
      }}>
        <h3 style={{ color: '#FFFFFF', fontSize: '18px', marginBottom: '20px' }}>📈 Thông tin nhanh</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '1.5rem', color: '#19c37d', fontWeight: 'bold' }}>87%</div>
            <div style={{ fontSize: '14px', color: '#E0E0E0' }}>Tỷ lệ sử dụng TB</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '1.5rem', color: '#ffa500', fontWeight: 'bold' }}>2.3h</div>
            <div style={{ fontSize: '14px', color: '#E0E0E0' }}>Thời gian TB/giao dịch</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '1.5rem', color: '#6ab7ff', fontWeight: 'bold' }}>96%</div>
            <div style={{ fontSize: '14px', color: '#E0E0E0' }}>Tỷ lệ hài lòng</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '1.5rem', color: '#4ecdc4', fontWeight: 'bold' }}>18:30</div>
            <div style={{ fontSize: '14px', color: '#E0E0E0' }}>Giờ cao điểm</div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderRevenueTab = () => (
    <div style={{ display: 'grid', gap: '25px' }}>
      {/* Revenue by Station */}
      <div style={{
        background: 'rgba(26, 32, 44, 0.8)',
        borderRadius: '15px',
        padding: '25px',
        border: '1px solid rgba(255, 255, 255, 0.1)'
      }}>
        <h3 style={{ color: '#FFFFFF', fontSize: '18px', marginBottom: '20px' }}>💰 Doanh thu theo trạm</h3>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: 'rgba(255, 255, 255, 0.05)' }}>
                <th style={{ padding: '12px', textAlign: 'left', color: '#E0E0E0', fontWeight: '600' }}>Trạm</th>
                <th style={{ padding: '12px', textAlign: 'right', color: '#E0E0E0', fontWeight: '600' }}>Doanh thu</th>
                <th style={{ padding: '12px', textAlign: 'right', color: '#E0E0E0', fontWeight: '600' }}>Giao dịch</th>
                <th style={{ padding: '12px', textAlign: 'right', color: '#E0E0E0', fontWeight: '600' }}>TB/Giao dịch</th>
              </tr>
            </thead>
            <tbody>
              {reportData.revenue?.byStation?.map((station, index) => (
                <tr key={index} style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.1)' }}>
                  <td style={{ padding: '12px', color: '#FFFFFF' }}>{station.station}</td>
                  <td style={{ padding: '12px', textAlign: 'right', color: '#19c37d', fontWeight: 'bold' }}>
                    {formatCurrency(station.amount)}
                  </td>
                  <td style={{ padding: '12px', textAlign: 'right', color: '#E0E0E0' }}>
                    {formatNumber(station.transactions)}
                  </td>
                  <td style={{ padding: '12px', textAlign: 'right', color: '#ffa500' }}>
                    {formatCurrency(Math.round(station.amount / station.transactions))}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Revenue Chart Placeholder */}
      <div style={{
        background: 'rgba(26, 32, 44, 0.8)',
        borderRadius: '15px',
        padding: '25px',
        border: '1px solid rgba(255, 255, 255, 0.1)'
      }}>
        <h3 style={{ color: '#FFFFFF', fontSize: '18px', marginBottom: '20px' }}>📊 Biểu đồ doanh thu 7 ngày gần nhất</h3>
        <div style={{
          height: '200px',
          display: 'flex',
          alignItems: 'end',
          justifyContent: 'space-between',
          padding: '20px 0'
        }}>
          {reportData.revenue?.daily?.map((day, index) => {
            const maxAmount = Math.max(...(reportData.revenue?.daily?.map(d => d.amount) || []));
            const height = (day.amount / maxAmount) * 150;
            return (
              <div key={index} style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                flex: 1
              }}>
                <div style={{
                  width: '40px',
                  height: `${height}px`,
                  background: 'linear-gradient(135deg, #19c37d, #4ecdc4)',
                  borderRadius: '4px 4px 0 0',
                  marginBottom: '10px'
                }} />
                <div style={{ fontSize: '12px', color: '#E0E0E0' }}>
                  {new Date(day.date).getDate()}/{new Date(day.date).getMonth() + 1}
                </div>
                <div style={{ fontSize: '10px', color: '#19c37d', marginTop: '4px' }}>
                  {Math.round(day.amount / 1000000)}M
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );

  const renderUsageTab = () => (
    <div style={{ display: 'grid', gap: '25px' }}>
      {/* Battery Status */}
      <div style={{
        background: 'rgba(26, 32, 44, 0.8)',
        borderRadius: '15px',
        padding: '25px',
        border: '1px solid rgba(255, 255, 255, 0.1)'
      }}>
        <h3 style={{ color: '#FFFFFF', fontSize: '18px', marginBottom: '20px' }}>🔋 Tình trạng pin</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '15px' }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '2rem', color: '#19c37d', fontWeight: 'bold' }}>
              {reportData.usage?.batteryStatus?.excellent || 0}
            </div>
            <div style={{ fontSize: '14px', color: '#E0E0E0' }}>Tuyệt vời</div>
            <div style={{
              width: '100%',
              height: '6px',
              background: 'rgba(25, 195, 125, 0.3)',
              borderRadius: '3px',
              marginTop: '8px'
            }}>
              <div style={{
                width: '85%',
                height: '100%',
                background: '#19c37d',
                borderRadius: '3px'
              }} />
            </div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '2rem', color: '#ffa500', fontWeight: 'bold' }}>
              {reportData.usage?.batteryStatus?.good || 0}
            </div>
            <div style={{ fontSize: '14px', color: '#E0E0E0' }}>Tốt</div>
            <div style={{
              width: '100%',
              height: '6px',
              background: 'rgba(255, 165, 0, 0.3)',
              borderRadius: '3px',
              marginTop: '8px'
            }}>
              <div style={{
                width: '70%',
                height: '100%',
                background: '#ffa500',
                borderRadius: '3px'
              }} />
            </div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '2rem', color: '#6ab7ff', fontWeight: 'bold' }}>
              {reportData.usage?.batteryStatus?.fair || 0}
            </div>
            <div style={{ fontSize: '14px', color: '#E0E0E0' }}>Trung bình</div>
            <div style={{
              width: '100%',
              height: '6px',
              background: 'rgba(106, 183, 255, 0.3)',
              borderRadius: '3px',
              marginTop: '8px'
            }}>
              <div style={{
                width: '40%',
                height: '100%',
                background: '#6ab7ff',
                borderRadius: '3px'
              }} />
            </div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '2rem', color: '#ff6b6b', fontWeight: 'bold' }}>
              {reportData.usage?.batteryStatus?.poor || 0}
            </div>
            <div style={{ fontSize: '14px', color: '#E0E0E0' }}>Cần thay</div>
            <div style={{
              width: '100%',
              height: '6px',
              background: 'rgba(255, 107, 107, 0.3)',
              borderRadius: '3px',
              marginTop: '8px'
            }}>
              <div style={{
                width: '20%',
                height: '100%',
                background: '#ff6b6b',
                borderRadius: '3px'
              }} />
            </div>
          </div>
        </div>
      </div>

      {/* Station Utilization */}
      <div style={{
        background: 'rgba(26, 32, 44, 0.8)',
        borderRadius: '15px',
        padding: '25px',
        border: '1px solid rgba(255, 255, 255, 0.1)'
      }}>
        <h3 style={{ color: '#FFFFFF', fontSize: '18px', marginBottom: '20px' }}>📊 Tỷ lệ sử dụng trạm</h3>
        <div style={{ display: 'grid', gap: '15px' }}>
          {reportData.usage?.stationUtilization?.map((station, index) => (
            <div key={index} style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '12px 0'
            }}>
              <div style={{ color: '#FFFFFF', flex: 1 }}>{station.station}</div>
              <div style={{ flex: 1, margin: '0 20px' }}>
                <div style={{
                  width: '100%',
                  height: '8px',
                  background: 'rgba(255, 255, 255, 0.1)',
                  borderRadius: '4px',
                  overflow: 'hidden'
                }}>
                  <div style={{
                    width: `${station.utilization}%`,
                    height: '100%',
                    background: station.utilization >= 80 ? '#ff6b6b' : 
                              station.utilization >= 60 ? '#ffa500' : '#19c37d',
                    borderRadius: '4px'
                  }} />
                </div>
              </div>
              <div style={{
                color: station.utilization >= 80 ? '#ff6b6b' : 
                       station.utilization >= 60 ? '#ffa500' : '#19c37d',
                fontWeight: 'bold',
                minWidth: '50px',
                textAlign: 'right'
              }}>
                {station.utilization}%
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderCustomersTab = () => (
    <div style={{ display: 'grid', gap: '25px' }}>
      {/* Demographics */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '20px'
      }}>
        <div style={{
          background: 'rgba(26, 32, 44, 0.8)',
          borderRadius: '15px',
          padding: '25px',
          border: '1px solid rgba(255, 255, 255, 0.1)'
        }}>
          <h3 style={{ color: '#FFFFFF', fontSize: '18px', marginBottom: '20px' }}>👥 Giới tính</h3>
          <div style={{ display: 'grid', gap: '15px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ color: '#E0E0E0' }}>Nam</span>
              <span style={{ color: '#6ab7ff', fontWeight: 'bold' }}>
                {formatNumber(reportData.customers?.demographics?.male || 0)}
              </span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ color: '#E0E0E0' }}>Nữ</span>
              <span style={{ color: '#ff6b6b', fontWeight: 'bold' }}>
                {formatNumber(reportData.customers?.demographics?.female || 0)}
              </span>
            </div>
          </div>
        </div>

        <div style={{
          background: 'rgba(26, 32, 44, 0.8)',
          borderRadius: '15px',
          padding: '25px',
          border: '1px solid rgba(255, 255, 255, 0.1)'
        }}>
          <h3 style={{ color: '#FFFFFF', fontSize: '18px', marginBottom: '20px' }}>🎂 Độ tuổi</h3>
          <div style={{ display: 'grid', gap: '12px' }}>
            {Object.entries(reportData.customers?.ageGroups || {}).map(([age, count]) => (
              <div key={age} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ color: '#E0E0E0' }}>{age}</span>
                <span style={{ color: '#19c37d', fontWeight: 'bold' }}>
                  {formatNumber(count)}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Loyalty Tiers */}
      <div style={{
        background: 'rgba(26, 32, 44, 0.8)',
        borderRadius: '15px',
        padding: '25px',
        border: '1px solid rgba(255, 255, 255, 0.1)'
      }}>
        <h3 style={{ color: '#FFFFFF', fontSize: '18px', marginBottom: '20px' }}>🏆 Hạng thành viên</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' }}>
          {Object.entries(reportData.customers?.loyaltyTiers || {}).map(([tier, count]) => {
            const colors = {
              bronze: '#CD7F32',
              silver: '#C0C0C0',
              gold: '#FFD700',
              platinum: '#E5E4E2'
            };
            return (
              <div key={tier} style={{
                textAlign: 'center',
                padding: '20px',
                background: `linear-gradient(135deg, ${colors[tier]}20, ${colors[tier]}10)`,
                border: `1px solid ${colors[tier]}40`,
                borderRadius: '12px'
              }}>
                <div style={{ fontSize: '1.8rem', color: colors[tier], fontWeight: 'bold', marginBottom: '8px' }}>
                  {formatNumber(count)}
                </div>
                <div style={{ fontSize: '14px', color: '#E0E0E0', textTransform: 'capitalize' }}>
                  {tier}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );

  const tabs = [
    { id: 'overview', label: '📊 Tổng quan', component: renderOverviewTab },
    { id: 'revenue', label: '💰 Doanh thu', component: renderRevenueTab },
    { id: 'usage', label: '⚡ Sử dụng', component: renderUsageTab },
    { id: 'customers', label: '👥 Khách hàng', component: renderCustomersTab }
  ];

  if (loading) {
    return (
      <div style={{ padding: '20px', textAlign: 'center', color: '#FFFFFF' }}>
        <h2>Đang tải báo cáo...</h2>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: '20px', textAlign: 'center', color: '#ff6b6b' }}>
        <h2>Lỗi: {error}</h2>
        <button onClick={fetchReports} style={{ marginTop: '20px', padding: '10px 20px' }}>
          Thử lại
        </button>
      </div>
    );
  }

  return (
    <DashboardLayout role="admin">
      <div style={{ padding: '20px' }}>
        {/* Header */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(106, 183, 255, 0.1), rgba(106, 183, 255, 0.05))',
        borderRadius: '20px',
        padding: '30px',
        marginBottom: '30px',
        border: '1px solid rgba(106, 183, 255, 0.2)',
        backdropFilter: 'blur(20px)'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h1 style={{ 
              margin: 0, 
              color: '#FFFFFF', 
              fontSize: '2.2rem', 
              fontWeight: '700',
              display: 'flex',
              alignItems: 'center',
              gap: '15px'
            }}>
              📊 Báo cáo & Phân tích
            </h1>
            <p style={{ 
              margin: '10px 0 0 0', 
              color: '#B0B0B0', 
              fontSize: '1rem'
            }}>
              Báo cáo tổng quan và phân tích dữ liệu hệ thống
            </p>
          </div>
          <div style={{ display: 'flex', gap: '10px' }}>
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              style={{
                padding: '12px 16px',
                background: 'rgba(26, 32, 44, 0.8)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                borderRadius: '8px',
                color: '#FFFFFF',
                fontSize: '14px'
              }}
            >
              <option value="week">7 ngày qua</option>
              <option value="month">30 ngày qua</option>
              <option value="quarter">3 tháng qua</option>
              <option value="year">12 tháng qua</option>
            </select>
            <button
              style={{
                padding: '12px 20px',
                background: 'linear-gradient(135deg, #6ab7ff, #4a9eff)',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontWeight: '500',
                fontSize: '14px'
              }}
            >
              📥 Xuất báo cáo
            </button>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div style={{
        display: 'flex',
        gap: '5px',
        marginBottom: '25px',
        background: 'rgba(26, 32, 44, 0.8)',
        borderRadius: '12px',
        padding: '8px',
        border: '1px solid rgba(255, 255, 255, 0.1)'
      }}>
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              flex: 1,
              padding: '12px 16px',
              background: activeTab === tab.id 
                ? 'linear-gradient(135deg, #6ab7ff, #4a9eff)' 
                : 'transparent',
              color: activeTab === tab.id ? '#FFFFFF' : '#B0B0B0',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: activeTab === tab.id ? '600' : '400',
              fontSize: '14px',
              transition: 'all 0.3s ease'
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div>
        {tabs.find(tab => tab.id === activeTab)?.component()}
      </div>
    </div>
    </DashboardLayout>
  );
};

export default AdminReports;