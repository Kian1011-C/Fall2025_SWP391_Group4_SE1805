// Admin/Batteries/hooks/useBatteriesData.js
// Custom hook for fetching battery data from API

import { useState, useEffect } from 'react';
import adminService from '../../../../assets/js/services/adminService';

export const useBatteriesData = () => {
  const [batteries, setBatteries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchBatteries = async () => {
    try {
      setLoading(true);
      setError(null);

      const result = await adminService.getDrivers();

      if (result.success) {
        setBatteries(result.data);
      } else {
        setError(result.message);
      }
    } catch (err) {
      setError('Không thể tải dữ liệu tài xế');
      console.error('Error fetching drivers:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBatteries();
  }, []);

  return {
    batteries,
    loading,
    error,
    refetch: fetchBatteries
  };
};
