import { useState, useEffect, useCallback } from 'react';
import servicePlanService from '../../../../assets/js/services/servicePlanService';

export const useSubscriptionsData = () => {
  const [plans, setPlans] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Hàm gọi API
  const fetchPlans = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await servicePlanService.getAllServicePlans();
      if (response.success && Array.isArray(response.data)) {
        setPlans(response.data);
      } else {
        throw new Error(response.message || "Dữ liệu gói cước không hợp lệ.");
      }
    } catch (err) {
      setError(err.message || "Không thể tải danh sách gói cước.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPlans();
  }, [fetchPlans]);

  // Các hàm CRUD
  const handleCreate = async (planData) => {
    const response = await servicePlanService.createServicePlan(planData);
    if (response.success) {
      fetchPlans(); // Tải lại danh sách
    }
    return response;
  };

  const handleUpdate = async (planId, planData) => {
    const response = await servicePlanService.updateServicePlan(planId, planData);
    if (response.success) {
      fetchPlans(); // Tải lại danh sách
    }
    return response;
  };

  return {
    plans,
    isLoading, error, refetch: fetchPlans,
    handleCreate, handleUpdate,
  };
};