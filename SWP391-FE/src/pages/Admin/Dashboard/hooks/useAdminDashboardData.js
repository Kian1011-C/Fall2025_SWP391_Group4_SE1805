import { useState, useEffect, useCallback } from 'react';
// <-- SỬA LẠI DÒNG IMPORT NÀY -->
import adminDashboardService from '../../../../assets/js/services/adminDashboardService';

export const useAdminDashboardData = () => {
  const [stats, setStats] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchStats = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      // <-- SỬA LẠI TÊN SERVICE GỌI API -->
      const response = await adminDashboardService.getDashboardOverview();

      if (response.success) {
        setStats(response.data);
      } else {
        throw new Error(response.message || "Lỗi khi tải dữ liệu thống kê");
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