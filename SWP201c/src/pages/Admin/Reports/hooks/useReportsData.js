// Admin/Reports/hooks/useReportsData.js
// Custom hook for fetching reports data from API

import { useState, useEffect } from 'react';
import reportService from '../../../../assets/js/services/reportService';

export const useReportsData = (dateRange) => {
  const [reportData, setReportData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchReports = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch all report types in parallel
      const [overviewResult, revenueResult, usageResult, customerResult] = await Promise.all([
        reportService.getOverviewReport(dateRange),
        reportService.getRevenueReport(dateRange),
        reportService.getUsageReport(dateRange),
        reportService.getCustomerReport(dateRange)
      ]);

      // Check if all requests succeeded
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
      console.error('Error fetching reports:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dateRange]);

  return {
    reportData,
    loading,
    error,
    refetch: fetchReports
  };
};
