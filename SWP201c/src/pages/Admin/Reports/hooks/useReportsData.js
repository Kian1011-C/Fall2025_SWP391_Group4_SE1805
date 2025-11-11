import { useState, useEffect, useCallback } from 'react';
import reportService from '../../../../assets/js/services/reportService';

export const useReportsData = () => {
  const [revenueData, setRevenueData] = useState(null);
  const [usageData, setUsageData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // State cho bộ lọc
  const [dateRange, setDateRange] = useState({
    startDate: new Date(new Date().setDate(new Date().getDate() - 30)).toISOString().split('T')[0], // 30 ngày trước
    endDate: new Date().toISOString().split('T')[0], // Hôm nay
  });

  const fetchReports = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const filters = { startDate: dateRange.startDate, endDate: dateRange.endDate };

      // Gọi đồng thời cả hai API
      const [revenueResponse, usageResponse] = await Promise.all([
        reportService.getRevenueReport(filters),
        reportService.getUsageReport(filters)
      ]);

      if (revenueResponse.success) {
        setRevenueData(revenueResponse.data);
      } else {
        throw new Error(revenueResponse.message || "Lỗi tải báo cáo doanh thu");
      }
      
      if (usageResponse.success) {
        setUsageData(usageResponse.data);
      } else {
        throw new Error(usageResponse.message || "Lỗi tải báo cáo sử dụng");
      }

    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, [dateRange]); // Chạy lại hàm này khi `dateRange` thay đổi

  useEffect(() => {
    fetchReports();
  }, [fetchReports]);

  return {
    revenueData,
    usageData,
    isLoading,
    error,
    dateRange,
    setDateRange,
    refetch: fetchReports,
  };
};