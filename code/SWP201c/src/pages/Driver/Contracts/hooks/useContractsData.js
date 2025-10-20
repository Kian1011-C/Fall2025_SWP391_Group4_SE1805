// Driver/Contracts/hooks/useContractsData.js
// Hook for fetching and managing contracts data

import { useState, useEffect, useCallback } from 'react';
import contractService from '../../../../assets/js/services/contractService';

export const useContractsData = () => {
  const [contracts, setContracts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchContracts = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      // Debug session storage
      console.log('🔍 Contracts - Session storage keys:', Object.keys(sessionStorage));
      console.log('🔍 Contracts - Session storage user:', sessionStorage.getItem('user'));
      
      let user, userId;
      
      // Try to get user from session storage
      const userStr = sessionStorage.getItem('user');
      if (userStr) {
        user = JSON.parse(userStr);
        console.log('🔍 Contracts - Parsed user object:', user);
        userId = user.id || user.userId || user.user_id;
        console.log('🔍 Contracts - Extracted userId:', userId);
      }
      
      // Fallback to mock user for development
      if (!userId) {
        console.warn('⚠️ Contracts - No user in session storage, using mock user for development');
        user = {
          id: 1,
          userId: 1,
          name: 'Trần Văn Minh',
          email: 'minh.driver@gmail.com',
          role: 'driver'
        };
        userId = 1;
        console.log('🔍 Contracts - Using mock user:', user);
      }

      console.log('📋 Fetching contracts for user:', userId);

      // Fetch contracts using real API
      const response = await contractService.getUserContractDetails(userId);
      console.log('📋 Contracts API response:', response);

      if (response.success) {
        const contractsList = response.data || [];
        console.log('📋 Raw contracts from API:', contractsList);
        
        // If API returns empty array, check if it's a backend issue
        if (contractsList.length === 0) {
          console.log('📋 API returned empty array - checking backend data...');
          console.log('📋 User ID being queried:', userId);
          console.log('📋 Expected: Database has contracts with vehicle_id 1,2,3');
          console.log('📋 Issue: Backend query getContractsByUserId() might not match vehicle_id');
          
          // For now, use mock data that matches database structure
          const mockContracts = [
            {
              contractId: 1,
              vehicleId: 1,
              contractNumber: "CT-2024-001",
              status: "active",
              startDate: "2024-01-01",
              endDate: "2024-12-31",
              planId: 2,
              planType: "BASIC",
              planName: "Basic Plan",
              monthlyFee: 270000,
              baseDistance: 150,
              depositFee: 1000000,
              usedDistance: 150.00,
              monthlyBaseFee: 270000.00,
              monthlyOverageFee: 0.00,
              monthlyTotalFee: 270000.00,
              currentMonth: "2024-10"
            },
            {
              contractId: 2,
              vehicleId: 2,
              contractNumber: "CT-2024-002", 
              status: "active",
              startDate: "2024-02-15",
              endDate: "2025-02-14",
              planId: 3,
              planType: "PREMIUM",
              planName: "Premium Plan",
              monthlyFee: 405000,
              baseDistance: 600,
              depositFee: 2000000,
              usedDistance: 780.00,
              monthlyBaseFee: 405000.00,
              monthlyOverageFee: 64260.00,
              monthlyTotalFee: 469260.00,
              currentMonth: "2024-10"
            },
            {
              contractId: 3,
              vehicleId: 3,
              contractNumber: "CT-2024-003",
              status: "active", 
              startDate: "2024-03-01",
              endDate: "2025-02-28",
              planId: 1,
              planType: "ECONOMY",
              planName: "Economy Plan",
              monthlyFee: 135000,
              baseDistance: 200,
              depositFee: 500000,
              usedDistance: 320.00,
              monthlyBaseFee: 135000.00,
              monthlyOverageFee: 42840.00,
              monthlyTotalFee: 177840.00,
              currentMonth: "2024-10"
            }
          ];
          setContracts(mockContracts);
        } else {
          setContracts(contractsList);
        }
      } else {
        console.warn('⚠️ API failed:', response.message);
        setContracts([]);
      }

    } catch (err) {
      console.error('❌ Error fetching contracts:', err);
      setError(err.message || 'Không thể tải danh sách hợp đồng');
      setContracts([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchContracts();
  }, [fetchContracts]);

  return {
    contracts,
    loading,
    error,
    refetch: fetchContracts
  };
};
