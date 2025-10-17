// Driver/Subscriptions/hooks/useSubscriptionsData.js
// Hook for fetching plans and user subscriptions

import { useState, useEffect, useCallback } from 'react';
import contractService from '../../../../assets/js/services/contractService';
import { validateUser, findActiveSubscription, formatSubscription } from '../utils';

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
      
      console.log('🔄 Fetching subscription data for user:', currentUser?.email);
      
      if (!currentUser) {
        setError('Không thể tải thông tin người dùng. Vui lòng đăng nhập lại.');
        return;
      }

      const userId = validateUser(currentUser);

      // Get available contract plans from API
      console.log('📝 Fetching available contract plans...');
      try {
        const plansResult = await contractService.getContractPlans();
        console.log('📝 Plans API response:', plansResult);
        if (plansResult.success && plansResult.data) {
          setPlans(plansResult.data || []);
        } else {
          console.warn('⚠️ No plans found from API');
          setPlans([]);
        }
      } catch (planError) {
        console.warn('⚠️ Plans API failed:', planError);
        setPlans([]);
      }

      // Get current user contracts/subscriptions
      console.log('📋 Fetching user contracts for userId:', userId);
      try {
        const contractsResponse = await contractService.getContracts(userId);
        console.log('📋 User contracts response:', contractsResponse);
        
        if (contractsResponse.success && contractsResponse.data) {
          const contracts = contractsResponse.data;
          setUserContracts(contracts);
          
          // Find active subscription
          const activeContract = findActiveSubscription(contracts);
          
          if (activeContract) {
            console.log('✅ Found active contract:', activeContract);
            setCurrentSubscription(formatSubscription(activeContract));
          } else {
            console.log('ℹ️ No active contracts found');
            setCurrentSubscription(null);
          }
        } else {
          console.log('ℹ️ No contracts found for user');
          setUserContracts([]);
          setCurrentSubscription(null);
        }
      } catch (contractError) {
        console.warn('⚠️ Contract API failed:', contractError);
        setUserContracts([]);
        setCurrentSubscription(null);
      }

    } catch (err) {
      console.error('❌ Error fetching subscription data:', err);
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
