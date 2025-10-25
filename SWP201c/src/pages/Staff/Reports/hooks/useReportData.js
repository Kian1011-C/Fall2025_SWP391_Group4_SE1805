import { useState, useEffect, useCallback } from 'react';
// import reportService from '../../../../assets/js/services/reportService';

export const useReportData = () => {
  const [report, setReport] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchReport = useCallback(async (filters = {}) => {
    try {
      setIsLoading(true);
      setError(null);
      
      // const response = await reportService.getStaffReport(filters);
      // Dùng dữ liệu giả để xây dựng giao diện
      const mockResponse = {
        success: true,
        data: {
          totalSwaps: 1250,
          revenueToday: 3125000,
          peakHours: '5 PM - 7 PM',
          averageBatteryHealth: 96.5,
          mostUsedTower: 'Trụ 2',
          failedSwaps: 5,
        }
      };

      if (mockResponse.success) {
        setReport(mockResponse.data);
      } else {
        throw new Error("Lỗi khi tải dữ liệu báo cáo");
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchReport();
  }, [fetchReport]);

  return { report, isLoading, error, refetch: fetchReport };
};