import { useState, useEffect, useCallback } from 'react';
import dashboardService from '../../../../assets/js/services/dashboardService';

export const useDashboardData = () => {
  const [stats, setStats] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchStats = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      // const response = await dashboardService.getStaffStats(); // Sẽ dùng khi nối API thật
      // Dùng dữ liệu giả để xây dựng giao diện
      const mockResponse = {
        success: true,
        data: {
          pendingRequests: 3,
          completedToday: 15,
          lowBatteries: 8,
          stationStatus: 'Hoạt động tốt'
        }
      };

      if (mockResponse.success) {
        setStats(mockResponse.data);
      } else {
        throw new Error(mockResponse.message || "Lỗi khi tải dữ liệu thống kê");
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  return { stats, isLoading, error, refetch: fetchStats };
};