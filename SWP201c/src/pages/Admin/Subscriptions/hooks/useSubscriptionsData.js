// Admin/Subscriptions/hooks/useSubscriptionsData.js
// Custom hook for fetching subscription plans data from API

import { useState, useEffect } from 'react';
import contractService from '../../../../assets/js/services/contractService';

export const useSubscriptionsData = () => {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchPlans = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const result = await contractService.getContractPlans();
      
      if (result.success) {
        setPlans(result.data || []);
      } else {
        setError(result.message || 'Không thể tải danh sách gói dịch vụ');
      }
    } catch (err) {
      setError('Lỗi khi tải danh sách gói dịch vụ');
      console.error('Error fetching plans:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlans();
  }, []);

  return {
    plans,
    loading,
    error,
    refetch: fetchPlans
  };
};
