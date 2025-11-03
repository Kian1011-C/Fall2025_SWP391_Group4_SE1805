import { useState, useEffect, useCallback } from 'react';
import { apiUtils, API_CONFIG } from '../../../../assets/js/config/api.js';

export const useDashboardData = () => {
  const [stats, setStats] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchStats = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Gọi API overview và usage từ backend ReportController
      const [overviewResponse, usageResponse] = await Promise.all([
        apiUtils.get(API_CONFIG.ENDPOINTS.REPORTS.OVERVIEW),
        apiUtils.get(API_CONFIG.ENDPOINTS.REPORTS.USAGE)
      ]);

      if (overviewResponse.success && usageResponse.success) {
        const overview = overviewResponse.data;
        const usage = usageResponse.data;
        
        // Kết hợp dữ liệu từ cả 2 API
        const combinedStats = {
          // Từ overview
          totalUsers: overview.totalUsers || 0,
          activeUsers: overview.activeUsers || 0,
          totalStations: overview.totalStations || 0,
          totalBatteries: overview.totalBatteries || 0,
          activeBatteries: overview.activeBatteries || 0,
          totalSwaps: overview.totalSwaps || 0,
          totalTransactions: overview.totalTransactions || 0,
          monthlyRevenue: overview.monthlyRevenue || 0,
          
          // Từ usage
          monthlySwaps: usage.monthlySwaps || 0,
          averageSwapsPerDay: usage.averageSwapsPerDay || 0,
          
          // Tính toán thêm
          lowBatteries: overview.totalBatteries - overview.activeBatteries || 0,
          stationStatus: overview.totalStations > 0 ? 'Hoạt động tốt' : 'Không có trạm',
          batteryUtilization: overview.totalBatteries > 0 
            ? Math.round((overview.activeBatteries / overview.totalBatteries) * 100) 
            : 0
        };
        
        setStats(combinedStats);
      } else {
        throw new Error(overviewResponse.message || usageResponse.message || "Lỗi khi tải dữ liệu thống kê");
      }
    } catch (err) {
      console.error('Error fetching dashboard stats:', err);
      setError(err.message || 'Không thể kết nối đến server');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  return { stats, isLoading, error, refetch: fetchStats };
};