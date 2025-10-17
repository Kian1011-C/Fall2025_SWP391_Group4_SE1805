// Admin/Reports/index.jsx
// Container for Reports page - orchestrates all components and hooks

import React from 'react';
import DashboardLayout from '../../../layouts/DashboardLayout';
import { useReportsData, useReportsFilters } from './hooks';
import {
  ReportsHeader,
  ReportsTabs,
  OverviewTab,
  RevenueTab,
  UsageTab,
  CustomersTab
} from './components';
import { isReportDataEmpty } from './utils';

const Reports = () => {
  // Custom hooks for data and filters
  const { activeTab, dateRange, handleTabChange, handleDateRangeChange } = useReportsFilters();
  const { reportData, loading, error } = useReportsData(dateRange);

  // Handle export functionality
  const handleExport = () => {
    alert('Chức năng xuất báo cáo đang được phát triển');
    // When API ready: implement PDF/Excel export
  };

  // Loading state
  if (loading) {
    return (
      <DashboardLayout role="admin">
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '60vh'
        }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{
              width: '60px',
              height: '60px',
              border: '4px solid rgba(106, 183, 255, 0.2)',
              borderTop: '4px solid #6ab7ff',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite',
              margin: '0 auto 20px'
            }} />
            <p style={{ color: '#B0B0B0', fontSize: '1.1rem' }}>
              Đang tải báo cáo...
            </p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  // Error state
  if (error) {
    return (
      <DashboardLayout role="admin">
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '60vh'
        }}>
          <div style={{
            background: 'rgba(239, 68, 68, 0.1)',
            borderRadius: '12px',
            padding: '30px',
            border: '1px solid rgba(239, 68, 68, 0.3)',
            textAlign: 'center',
            maxWidth: '500px'
          }}>
            <div style={{ fontSize: '3rem', marginBottom: '15px' }}>⚠️</div>
            <h3 style={{ color: '#EF4444', marginBottom: '10px' }}>
              Lỗi tải dữ liệu
            </h3>
            <p style={{ color: '#B0B0B0' }}>{error}</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  // Empty data state
  if (isReportDataEmpty(reportData)) {
    return (
      <DashboardLayout role="admin">
        <ReportsHeader 
          dateRange={dateRange}
          onDateRangeChange={handleDateRangeChange}
          onExport={handleExport}
        />
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '50vh'
        }}>
          <div style={{
            background: 'rgba(26, 32, 44, 0.8)',
            borderRadius: '12px',
            padding: '40px',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '4rem', marginBottom: '20px' }}>📊</div>
            <h3 style={{ color: '#FFFFFF', marginBottom: '10px' }}>
              Chưa có dữ liệu báo cáo
            </h3>
            <p style={{ color: '#B0B0B0' }}>
              Dữ liệu báo cáo sẽ xuất hiện khi hệ thống có giao dịch
            </p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  // Render active tab content
  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return <OverviewTab data={reportData.overview} />;
      case 'revenue':
        return <RevenueTab data={reportData.revenue} />;
      case 'usage':
        return <UsageTab data={reportData.usage} />;
      case 'customers':
        return <CustomersTab data={reportData.customers} />;
      default:
        return <OverviewTab data={reportData.overview} />;
    }
  };

  return (
    <DashboardLayout role="admin">
      <style>
        {`
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
        `}
      </style>

      <ReportsHeader 
        dateRange={dateRange}
        onDateRangeChange={handleDateRangeChange}
        onExport={handleExport}
      />

      <ReportsTabs 
        activeTab={activeTab}
        onTabChange={handleTabChange}
      />

      {renderTabContent()}
    </DashboardLayout>
  );
};

export default Reports;
