// Driver/Subscriptions/hooks/useSubscriptionsData.js
// Hook for fetching plans and user subscriptions

import { useState, useEffect, useCallback } from 'react';
import contractService from '../../../../assets/js/services/contractService';
import { validateUser, findActiveSubscription, formatSubscription } from '../utils';
import vehicleService from '../../../../assets/js/services/vehicleService';

export const useSubscriptionsData = (currentUser) => {
  const [plans, setPlans] = useState([]);
  const [currentSubscription, setCurrentSubscription] = useState(null);
  const [userContracts, setUserContracts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log(' Fetching subscription data for user:', currentUser?.email);
      
      if (!currentUser) {
        setError('Không thể tải thông tin người dùng. Vui lòng đăng nhập lại.');
        return;
      }

      const userId = validateUser(currentUser);

      // Get available contract plans from API
      console.log(' Fetching available contract plans...');
      try {
        const plansResult = await contractService.getContractPlans();
        console.log(' Plans API response:', plansResult);
        if (plansResult.success && plansResult.data) {
          setPlans(plansResult.data || []);
        } else {
          console.warn(' No plans found from API');
          setPlans([]);
        }
      } catch (planError) {
        console.warn(' Plans API failed:', planError);
        setPlans([]);
      }

      // Get current user contracts via dedicated API
      console.log(' Fetching user contracts for userId:', userId);
      const contractsResponse = await contractService.getUserContracts(userId);
      if (contractsResponse.success && contractsResponse.data) {
        const userContracts = contractsResponse.data;
        setUserContracts(userContracts);
      } else {
        setUserContracts([]);
      }

      // If there is a selected vehicle, fetch its active plan
      try {
        let selected = null;
        try { selected = JSON.parse(localStorage.getItem('selectedVehicle')) || JSON.parse(sessionStorage.getItem('selectedVehicle')); } catch {}
        if (selected?.id || selected?.vehicleId) {
          const vehicleId = selected.id || selected.vehicleId;
          const planResp = await contractService.getVehiclePlan(vehicleId);
          if (planResp.success && planResp.data) {
            setCurrentSubscription(formatSubscription(planResp.data));
          }
        }
      } catch {}

    } catch (err) {
      console.error(' Error fetching subscription data:', err);
      setError('Lỗi khi tải dữ liệu gói dịch vụ: ' + err.message);
      setPlans([]);
      setUserContracts([]);
      setCurrentSubscription(null);
    } finally {
      setLoading(false);
    }
  }, [currentUser]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return {
    plans,
    currentSubscription,
    userContracts,
    loading,
    error,
    refetch: fetchData
  };
};
