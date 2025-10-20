// Staff/Dashboard/hooks/useDashboardStats.js
import { useState, useEffect } from 'react';
import reportService from '../../../../assets/js/services/reportService';
import { getTodayDate, processDashboardStats } from '../utils';

/**
 * Custom hook for fetching dashboard statistics
 */
export const useDashboardStats = () => {
  const [stats, setStats] = useState({
    activeStations: 0,
    readyBatteries: 0,
    todayTransactions: 0,
    successRate: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchDashboardStats = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const today = getTodayDate();
      console.log('📊 Fetching dashboard stats for:', today);
      
      const result = await reportService.getOverviewReport({ 
        startDate: today, 
        endDate: today 
      });
      
      if (result.success && result.data) {
        const processedStats = processDashboardStats(result.data);
        console.log('✅ Dashboard stats loaded:', processedStats);
        setStats(processedStats);
      } else {
        console.warn('⚠️ Dashboard stats failed:', result.message);
      }
    } catch (err) {
      console.error('❌ Error fetching dashboard stats:', err);
      setError(err.message);
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
