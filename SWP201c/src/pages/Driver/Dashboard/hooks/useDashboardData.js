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
        console.log('🚗 Raw userVehicles from API:', userVehicles);
        console.log('🚗 Processed vehicles from API:', processedVehicles);
        
        // Check for stored vehicles in localStorage
        const storedVehiclesStr = localStorage.getItem('vehicles');
        console.log('🔍 Stored vehicles in localStorage:', storedVehiclesStr);
        
        const finalVehicles = updateVehiclesFromSession(processedVehicles);
        console.log('🚗 Final vehicles after session update:', finalVehicles);
        setVehicles(finalVehicles);
        
        // Fetch contracts
        const userContracts = await fetchContracts(userId, userDashboard);
        setContracts(userContracts);
        
        // Fetch payments
        const payments = await fetchPayments(userId);
        setRecentPayments(payments);
        
        // Calculate stats
        const calculatedStats = normalizeDashboardStats(
          userDashboard, 
          processedVehicles, 
          userContracts, 
          []
        );
        setStats(calculatedStats);
        
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
          const payments = await fetchPayments(userId);
          setRecentPayments(payments);
          const calculatedStats = normalizeDashboardStats(
            userDashboard, processedVehicles, userContracts, []
          );
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

  // Fetch contracts helper: use vehicle plan API
  const fetchContracts = async (userId, userDashboard) => {
    try {
      let selected = null;
      try { selected = JSON.parse(sessionStorage.getItem('selectedVehicle')); } catch (err) {
        console.warn('Failed to parse selectedVehicle from sessionStorage:', err);
      }
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

  // Fetch payments helper
  const fetchPayments = async (userId) => {
    try {
      const paymentsResponse = await paymentService.getPaymentHistory(userId);
      console.log('💰 Payment service response:', paymentsResponse);
      
      if (paymentsResponse.success && paymentsResponse.data) {
        return Array.isArray(paymentsResponse.data) ? 
          paymentsResponse.data.slice(0, 5) : [];
      }
      return [];
    } catch (err) {
      console.warn('⚠️ Payment API failed:', err);
      return [];
    }
  };

  // After initial loads, optionally fetch swaps count for "Tổng lượt đổi pin"
  useEffect(() => {
    (async () => {
      try {
        const resp = await swapService.getAllSwaps();
        if (resp.success) {
          setStats((s) => ({ ...s, totalSwaps: Array.isArray(resp.data) ? resp.data.length : 0 }));
        }
      } catch (err) {
        console.warn('Failed to fetch swaps:', err);
      }
    })();
  }, []);

  // Fetch on mount
  useEffect(() => {
    fetchDashboardData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
