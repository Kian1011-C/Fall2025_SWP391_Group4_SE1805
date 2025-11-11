// Admin/Dashboard/hooks/useDashboardData.js
// Custom hook for fetching dashboard statistics

import { useState, useEffect } from 'react';
import reportService from '../../../../assets/js/services/reportService';
import { getDateRange } from '../utils';

export const useDashboardData = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalBatteries: 0,
    totalStations: 0,
    totalTransactions: 0,
    totalSwaps: 0,
    monthlyRevenue: 0,
    activeUsers: 0,
    activeBatteries: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchDashboardStats = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const dateRange = getDateRange();
      const result = await reportService.getOverviewReport(dateRange);
      
      if (result.success && result.data) {
        setStats({
          totalUsers: result.data.totalUsers || 0,
          totalBatteries: result.data.totalBatteries || 0,
          totalStations: result.data.totalStations || 0,
          totalTransactions: result.data.totalTransactions || 0,
          totalSwaps: result.data.totalSwaps || 0,
          monthlyRevenue: result.data.revenue || 0,
          activeUsers: result.data.activeUsers || 0,
          activeBatteries: result.data.activeBatteries || 0
        });
      } else {
        setError(result.message || 'Không thể tải dữ liệu dashboard');
      }
    } catch (err) {
      setError('Lỗi khi tải dữ liệu dashboard');
      console.error('Error fetching dashboard stats:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  return {
    stats,
    loading,
    error,
    refetch: fetchDashboardStats
  };
};
