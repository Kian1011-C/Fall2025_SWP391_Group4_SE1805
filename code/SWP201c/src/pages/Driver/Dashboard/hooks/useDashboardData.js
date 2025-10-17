// Driver/Dashboard/hooks/useDashboardData.js
// Custom hook for fetching all dashboard data

import { useState, useEffect } from 'react';
import { useAuth } from '../../../../context/AuthContext';
import userService from '../../../../assets/js/services/userService';
import contractService from '../../../../assets/js/services/contractService';
import paymentService from '../../../../assets/js/services/paymentService';
import { normalizeDashboardStats, extractErrorMessage } from '../../../../assets/js/utils/apiHelpers';
import {
  validateUser,
  processVehicles,
  updateVehiclesFromSession,
  processContracts
} from '../utils';

export const useDashboardData = (selectedVehicle = null) => {
  const { currentUser } = useAuth();
  const [vehicles, setVehicles] = useState([]);
  const [contracts, setContracts] = useState([]);
  const [recentPayments, setRecentPayments] = useState([]);
  const [stats, setStats] = useState({
    totalSwaps: 0,
    currentPlans: [],
    activeVehicles: 0,
    monthlySpent: 0,
    totalDistance: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('🚗 DriverDashboard: Fetching data for user:', currentUser);
      
      // Validate user
      const validation = validateUser(currentUser);
      if (!validation.isValid) {
        setError(validation.error);
        return;
      }

      const userId = validation.userId;
      console.log('🆔 Using userId for API:', userId);
      
      // Prefer aggregated dashboard API with flexible shape + offline fallback
      const dashboardResp = await userService.getUserDashboard(userId);
      console.log('📊 Dashboard API Response:', dashboardResp);
      
      if (dashboardResp.success && dashboardResp.data) {
        const root = dashboardResp.data;
        // Backend returns { success, user, dashboard, vehicles } directly
        const userData = root.user || root;
        const userVehicles = root.vehicles || userData.vehicles || [];
        const userDashboard = root.dashboard || {};
        
        // Process vehicles
        const processedVehicles = processVehicles(userVehicles);
        const finalVehicles = updateVehiclesFromSession(processedVehicles);
        setVehicles(selectedVehicle ? [selectedVehicle] : finalVehicles);
        
        // Fetch contracts
        const userContracts = await fetchContracts(userId, userDashboard);
        setContracts(userContracts);
        
        // Fetch payments (current status)
        const payments = await fetchPayments(userId);
        setRecentPayments(payments.slice(0, 5));
        
        // Calculate stats
        let calculatedStats = normalizeDashboardStats(
          userDashboard, 
          processedVehicles, 
          userContracts, 
          []
        );

        // If a vehicle is selected, enrich stats with vehicle-specific data
        if (selectedVehicle) {
          const swaps = await (await import('../../../../assets/js/services/swapService')).default.getSwapCountSummary(userId);
          if (swaps?.success && swaps.data) {
            calculatedStats.totalSwaps = swaps.data?.totalSwaps ?? calculatedStats.totalSwaps;
          }
        }
        setStats(calculatedStats);
        
        console.log('✅ Successfully loaded dashboard data');
      } else {
        // Fallback: try basic user API or local demo
        const userResponse = await userService.getUserById(userId);
        console.log('📄 User API Response (fallback):', userResponse);
        if (userResponse.success && userResponse.data) {
          const userData = userResponse.data;
          const userVehicles = userData.vehicles || [];
          const userDashboard = userData.dashboard || {};
          const processedVehicles = processVehicles(userVehicles);
          const finalVehicles = updateVehiclesFromSession(processedVehicles);
          setVehicles(selectedVehicle ? [selectedVehicle] : finalVehicles);
          const userContracts = await fetchContracts(userId, userDashboard);
          setContracts(userContracts);
          const payments = await fetchPayments(userId);
          setRecentPayments(payments.slice(0, 5));
          let calculatedStats = normalizeDashboardStats(
            userDashboard, processedVehicles, userContracts, []
          );
          if (selectedVehicle) {
            const swaps = await (await import('../../../../assets/js/services/swapService')).default.getSwapCountSummary(userId);
            if (swaps?.success && swaps.data) {
              calculatedStats.totalSwaps = swaps.data?.totalSwaps ?? calculatedStats.totalSwaps;
            }
          }
          setStats(calculatedStats);
        } else {
          throw new Error('API không trả về dữ liệu hợp lệ');
        }
      }
    } catch (err) {
      console.error('❌ Error fetching dashboard data:', err);
      const errorMessage = extractErrorMessage(err);
      setError(`API Error: ${errorMessage}. Không thể lấy dữ liệu từ server.`);
      
      // Set empty data
      setVehicles([]);
      setContracts([]);
      setRecentPayments([]);
      setStats({
        totalSwaps: 0,
        currentPlans: ['Không có dữ liệu'],
        activeVehicles: 0,
        monthlySpent: 0,
        totalDistance: 0
      });
    } finally {
      setLoading(false);
    }
  };

  // Fetch contracts helper
  const fetchContracts = async (userId, userDashboard) => {
    try {
      const contractsResponse = await contractService.getContracts(userId);
      console.log('📝 Contract service response:', contractsResponse);
      
      if (contractsResponse.success && contractsResponse.data?.length > 0) {
        return processContracts(contractsResponse.data, userDashboard);
      }
      
      return processContracts([], userDashboard);
    } catch (err) {
      console.warn('⚠️ Contract service failed:', err);
      return processContracts([], userDashboard);
    }
  };

  // Fetch payments helper
  const fetchPayments = async (userId) => {
    try {
      const paymentsResponse = await paymentService.getPaymentHistory(userId);
      console.log('💰 Payment service response:', paymentsResponse);
      
      if (paymentsResponse.success && paymentsResponse.data) {
        return Array.isArray(paymentsResponse.data) ? paymentsResponse.data : [];
      }
      return [];
    } catch (err) {
      console.warn('⚠️ Payment API failed:', err);
      return [];
    }
  };

  // Fetch on mount
  useEffect(() => {
    fetchDashboardData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedVehicle?.id]);

  return {
    vehicles,
    contracts,
    recentPayments,
    stats,
    loading,
    error,
    refetch: fetchDashboardData
  };
};
