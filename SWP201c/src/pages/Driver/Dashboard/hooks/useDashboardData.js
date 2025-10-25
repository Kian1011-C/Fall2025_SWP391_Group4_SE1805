// Driver/Dashboard/hooks/useDashboardData.js
// Custom hook for fetching all dashboard data

import { useState, useEffect } from 'react';
import { useAuth } from '../../../../context/AuthContext';
import userService from '../../../../assets/js/services/userService';
import vehicleService from '../../../../assets/js/services/vehicleService';
import contractService from '../../../../assets/js/services/contractService';
import paymentService from '../../../../assets/js/services/paymentService';
import swapService from '../../../../assets/js/services/swapService';
import { normalizeDashboardStats, extractErrorMessage } from '../../../../assets/js/utils/apiHelpers';
import {
  validateUser,
  processVehicles,
  updateVehiclesFromSession,
  processContracts
} from '../utils';

export const useDashboardData = () => {
  const { currentUser } = useAuth();
  const [vehicles, setVehicles] = useState([]);
  const [contracts, setContracts] = useState([]);
  const [recentPayments, setRecentPayments] = useState([]);
  const [swapHistory, setSwapHistory] = useState([]);
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
      
      // Prefer aggregated dashboard API for stats; vehicles luôn lấy từ API chuyên biệt
      const dashboardResp = await userService.getUserDashboard(userId);
      console.log('📊 Dashboard API Response:', dashboardResp);
      
      if (dashboardResp.success && dashboardResp.data) {
        const root = dashboardResp.data;
        // Vehicles: gọi endpoint chuyên biệt
        const vehiclesResp = await vehicleService.getUserVehicles(userId);
        const userVehicles = vehiclesResp.success ? (vehiclesResp.data || []) : [];
        const userDashboard = root.dashboard || {};
        
        // Process vehicles
        const processedVehicles = processVehicles(userVehicles);
        const finalVehicles = updateVehiclesFromSession(processedVehicles);
        setVehicles(finalVehicles);
        
        // Fetch contracts
        const userContracts = await fetchContracts(userId, userDashboard);
        setContracts(userContracts);
        
        // Fetch payments - Commented out until API is ready
        // const payments = await fetchPayments(userId);
        // setRecentPayments(payments);
        setRecentPayments([]); // Set empty array to avoid errors
        
        // Fetch swap history for accurate totalSwaps count
        try {
          const swapResp = await swapService.getSwapHistory(userId);
          if (swapResp.success) {
            const swapHistoryData = Array.isArray(swapResp.data) ? swapResp.data : [];
            setSwapHistory(swapHistoryData);
            const calculatedStats = normalizeDashboardStats(
              userDashboard, 
              processedVehicles, 
              userContracts, 
              swapHistoryData
            );
            setStats(calculatedStats);
          } else {
            // Fallback to dashboard data if swap API fails
            setSwapHistory([]);
            const calculatedStats = normalizeDashboardStats(
              userDashboard, 
              processedVehicles, 
              userContracts, 
              []
            );
            setStats(calculatedStats);
          }
        } catch (swapError) {
          console.warn('⚠️ Swap history API failed, using dashboard data:', swapError);
          setSwapHistory([]);
          const calculatedStats = normalizeDashboardStats(
            userDashboard, 
            processedVehicles, 
            userContracts, 
            []
          );
          setStats(calculatedStats);
        }
        
        console.log('✅ Successfully loaded dashboard data');
      } else {
        // Fallback: try driver profile API
        const userResponse = await userService.getDriverProfile(userId);
        console.log('📄 User API Response (fallback):', userResponse);
        if (userResponse.success && userResponse.data) {
          const userData = userResponse.data;
          // Still fetch vehicles via API chuyên biệt
          const vehiclesResp = await vehicleService.getUserVehicles(userId);
          const userVehicles = vehiclesResp.success ? (vehiclesResp.data || []) : [];
          const userDashboard = userData.dashboard || {};
          const processedVehicles = processVehicles(userVehicles);
          const finalVehicles = updateVehiclesFromSession(processedVehicles);
          setVehicles(finalVehicles);
          const userContracts = await fetchContracts(userId, userDashboard);
          setContracts(userContracts);
          // const payments = await fetchPayments(userId);
          // setRecentPayments(payments);
          setRecentPayments([]); // Set empty array to avoid errors
          // Try to fetch swap history for fallback too
          try {
            const swapResp = await swapService.getSwapHistory(userId);
            if (swapResp.success) {
              const swapHistoryData = Array.isArray(swapResp.data) ? swapResp.data : [];
              setSwapHistory(swapHistoryData);
              const calculatedStats = normalizeDashboardStats(
                userDashboard, 
                processedVehicles, 
                userContracts, 
                swapHistoryData
              );
              setStats(calculatedStats);
            } else {
              setSwapHistory([]);
              const calculatedStats = normalizeDashboardStats(
                userDashboard, processedVehicles, userContracts, []
              );
              setStats(calculatedStats);
            }
          } catch (swapError) {
            console.warn('⚠️ Swap history API failed in fallback:', swapError);
            setSwapHistory([]);
            const calculatedStats = normalizeDashboardStats(
              userDashboard, processedVehicles, userContracts, []
            );
            setStats(calculatedStats);
          }
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

  // Fetch contracts helper: use vehicle plan API
  const fetchContracts = async (userId, userDashboard) => {
    try {
      let selected = null;
      try { selected = JSON.parse(sessionStorage.getItem('selectedVehicle')); } catch {}
      if (!selected?.id && !selected?.vehicleId) {
        return processContracts([], userDashboard);
      }
      const vehicleId = selected.id || selected.vehicleId;
      const planResp = await contractService.getVehiclePlan(vehicleId);
      console.log('📝 Vehicle plan response:', planResp);
      if (planResp.success && planResp.data) {
        const contractsArr = Array.isArray(planResp.data) ? planResp.data : [planResp.data];
        return processContracts(contractsArr, userDashboard);
      }
      return processContracts([], userDashboard);
    } catch (err) {
      console.warn('⚠️ Vehicle plan API failed:', err);
      return processContracts([], userDashboard);
    }
  };

  // Fetch payments helper - Commented out until API is ready
  // const fetchPayments = async (userId) => {
  //   try {
  //     const paymentsResponse = await paymentService.getPaymentHistory(userId);
  //     console.log('💰 Payment service response:', paymentsResponse);
      
  //     if (paymentsResponse.success && paymentsResponse.data) {
  //       return Array.isArray(paymentsResponse.data) ? 
  //         paymentsResponse.data.slice(0, 5) : [];
  //     }
  //     return [];
  //   } catch (err) {
  //     console.warn('⚠️ Payment API failed:', err);
  //     return [];
  //   }
  // };

  // Fetch swap history for "Tổng lượt đổi pin" using the new API
  useEffect(() => {
    (async () => {
      try {
        const validation = validateUser(currentUser);
        if (!validation.isValid) return;
        
        const userId = validation.userId;
        console.log('🔄 Fetching swap history for user:', userId);
        
        const resp = await swapService.getSwapHistory(userId);
        if (resp.success) {
          const swapHistoryData = Array.isArray(resp.data) ? resp.data : [];
          setSwapHistory(swapHistoryData);
          setStats((s) => ({ ...s, totalSwaps: swapHistoryData.length }));
          console.log('✅ Swap history loaded:', swapHistoryData.length, 'swaps');
        } else {
          console.warn('⚠️ Failed to load swap history:', resp.message);
          setSwapHistory([]);
        }
      } catch (error) {
        console.error('❌ Error fetching swap history:', error);
      }
    })();
  }, [currentUser]);

  // Fetch on mount
  useEffect(() => {
    fetchDashboardData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    vehicles,
    contracts,
    recentPayments,
    swapHistory,
    stats,
    loading,
    error,
    refetch: fetchDashboardData
  };
};
