// Driver/Dashboard/hooks/useDashboardData.js
// Custom hook for fetching all dashboard data

import { useState, useEffect } from 'react';
import { useAuth } from '../../../../context/AuthContext';
import userService from '../../../../assets/js/services/userService';
import vehicleService from '../../../../assets/js/services/vehicleService';
import contractService from '../../../../assets/js/services/contractService';
import paymentService from '../../../../assets/js/services/paymentService';
import batteryService from '../../../../assets/js/services/batteryService';
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
      
      console.log(' DriverDashboard: Fetching data for user:', currentUser);
      
      // Validate user
      const validation = validateUser(currentUser);
      if (!validation.isValid) {
        setError(validation.error);
        return;
      }

      const userId = validation.userId;
      console.log('🆔 Using userId for API:', userId);
      
      // SỬ DỤNG API MỚI: GET /api/users/{id} - TẤT CẢ DỮ LIỆU TRONG MỘT API
      const dashboardResp = await userService.getUserDashboard(userId);
      console.log(' Dashboard API Response (API mới):', dashboardResp);
      
      if (dashboardResp.success && dashboardResp.data) {
        const root = dashboardResp.data;
        const userDashboard = root.dashboard || {};
        
        console.log(' Dữ liệu từ API mới:');
        console.log('- totalSwaps:', userDashboard.totalSwaps);
        console.log('- totalDistance:', userDashboard.totalDistance);
        console.log('- activeVehicles:', userDashboard.activeVehicles);
        console.log('- monthlySpent:', userDashboard.monthlySpent);
        console.log('- currentPlans:', userDashboard.currentPlans);
        console.log('- vehicles:', root.vehicles);
        
        // SỬ DỤNG DỮ LIỆU TỪ API MỚI - KHÔNG CẦN GỌI API KHÁC
        const userVehicles = root.vehicles || [];
        const processedVehicles = processVehicles(userVehicles);
        
        // Enrich vehicles với battery info từ API (nếu chưa có)
        const enrichedVehicles = await enrichVehiclesWithBatteryInfo(processedVehicles);
        const finalVehicles = updateVehiclesFromSession(enrichedVehicles);
        setVehicles(finalVehicles);
        
        // Tính totalDistance từ tổng odometer của tất cả vehicles (nếu API không trả về)
        const calculatedTotalDistance = userDashboard.totalDistance || 
          finalVehicles.reduce((total, vehicle) => {
            const odometer = vehicle.currentOdometer !== null && vehicle.currentOdometer !== undefined
              ? vehicle.currentOdometer
              : (vehicle.current_odometer !== null && vehicle.current_odometer !== undefined
                ? vehicle.current_odometer
                : null);
            // Chỉ cộng nếu odometer có giá trị hợp lệ (không phải null hoặc NaN)
            if (odometer !== null && odometer !== undefined && !isNaN(odometer)) {
              return total + (typeof odometer === 'number' ? odometer : parseFloat(odometer));
            }
            return total;
          }, 0);
        
        // Sử dụng contracts từ API mới
        const userContracts = userDashboard.contracts || [];
        setContracts(userContracts);
        
        // Fetch payments (vẫn cần API riêng)
        const payments = await fetchPayments(userId);
        setRecentPayments(payments);
        
        // SỬ DỤNG DỮ LIỆU THẬT TỪ API MỚI
        const calculatedStats = {
          totalSwaps: userDashboard.totalSwaps || 0,
          currentPlans: userDashboard.currentPlans || [],
          activeVehicles: userDashboard.activeVehicles || (userVehicles ? userVehicles.length : 0),
          monthlySpent: userDashboard.monthlySpent || 0,
          totalDistance: calculatedTotalDistance
        };
        
        console.log(' Calculated stats:', calculatedStats);
        console.log(' Total distance calculated from vehicles:', calculatedTotalDistance);
        setStats(calculatedStats);
        console.log(' Successfully loaded dashboard data từ API mới:', calculatedStats);
      } else {
        // Fallback: try driver profile API
        const userResponse = await userService.getDriverProfile(userId);
        console.log(' User API Response (fallback):', userResponse);
        if (userResponse.success && userResponse.data) {
          const userData = userResponse.data;
          // Still fetch vehicles via API chuyên biệt
          const vehiclesResp = await vehicleService.getUserVehicles(userId);
          const userVehicles = vehiclesResp.success ? (vehiclesResp.data || []) : [];
          const userDashboard = userData.dashboard || {};
          const processedVehicles = processVehicles(userVehicles);
          
          // Enrich vehicles với battery info từ API (nếu chưa có)
          const enrichedVehicles = await enrichVehiclesWithBatteryInfo(processedVehicles);
          const finalVehicles = updateVehiclesFromSession(enrichedVehicles);
          setVehicles(finalVehicles);
          
          // Tính totalDistance từ tổng odometer của tất cả vehicles (nếu API không trả về)
          const calculatedTotalDistance = userDashboard.totalDistance || 
            finalVehicles.reduce((total, vehicle) => {
              const odometer = vehicle.currentOdometer !== null && vehicle.currentOdometer !== undefined
                ? vehicle.currentOdometer
                : (vehicle.current_odometer !== null && vehicle.current_odometer !== undefined
                  ? vehicle.current_odometer
                  : null);
              // Chỉ cộng nếu odometer có giá trị hợp lệ (không phải null hoặc NaN)
              if (odometer !== null && odometer !== undefined && !isNaN(odometer)) {
                return total + (typeof odometer === 'number' ? odometer : parseFloat(odometer));
              }
              return total;
            }, 0);
          
          const userContracts = await fetchContracts(userId, userDashboard);
          setContracts(userContracts);
          const payments = await fetchPayments(userId);
          setRecentPayments(payments);
          
          const calculatedStats = normalizeDashboardStats(
            userDashboard, finalVehicles, userContracts, []
          );
          
          // Override totalDistance với giá trị tính từ vehicles
          calculatedStats.totalDistance = calculatedTotalDistance;
          
          setStats(calculatedStats);
        } else {
          throw new Error('API không trả về dữ liệu hợp lệ');
        }
      }
    } catch (err) {
      console.error(' Error fetching dashboard data:', err);
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

  // Enrich vehicles with battery info from API
  const enrichVehiclesWithBatteryInfo = async (vehiclesList) => {
    if (!vehiclesList || vehiclesList.length === 0) return vehiclesList;
    
    console.log(' Enriching vehicles with battery info from API...');
    
    // Fetch battery info for all vehicles in parallel
    const enrichedVehicles = await Promise.all(
      vehiclesList.map(async (vehicle) => {
        // Nếu vehicle đã có batteryLevel từ API (kể cả 0), dùng luôn
        if (vehicle.batteryLevel !== null && vehicle.batteryLevel !== undefined) {
          console.log(` Vehicle ${vehicle.plateNumber} đã có batteryLevel từ API:`, vehicle.batteryLevel);
          return vehicle;
        }
        
        // Nếu không có batteryLevel, thử lấy từ battery API
        const batteryId = vehicle.batteryId || vehicle.battery_id || vehicle.current_battery_id;
        if (batteryId && batteryId !== 'undefined' && batteryId !== 'null') {
          try {
            console.log(` Fetching battery info for vehicle ${vehicle.plateNumber}, batteryId: ${batteryId}`);
            const batteryResponse = await batteryService.getBatteryById(batteryId);
            
            if (batteryResponse.success && batteryResponse.data) {
              const batteryData = batteryResponse.data;
              const batteryLevel = batteryData.stateOfHealth || 
                                  batteryData.state_of_health || 
                                  batteryData.batteryLevel || 
                                  batteryData.battery_level ||
                                  batteryData.health || null;
              
              if (batteryLevel !== null && batteryLevel !== undefined) {
                console.log(` Lấy được batteryLevel từ API cho vehicle ${vehicle.plateNumber}:`, batteryLevel);
                return {
                  ...vehicle,
                  batteryLevel: batteryLevel,
                  health: batteryLevel
                };
              }
            }
          } catch (error) {
            console.warn(` Không lấy được battery info từ API cho vehicle ${vehicle.plateNumber}:`, error);
          }
        }
        
        // Giữ nguyên vehicle nếu không lấy được battery info
        return vehicle;
      })
    );
    
    console.log(' Đã enrich vehicles với battery info');
    return enrichedVehicles;
  };

  // Fetch contracts helper: use vehicle plan API
  const fetchContracts = async (userId, userDashboard) => {
    try {
      // Ưu tiên 1: Sử dụng contracts từ userDashboard nếu có (từ API chính)
      if (userDashboard?.contracts && Array.isArray(userDashboard.contracts) && userDashboard.contracts.length > 0) {
        console.log(' Sử dụng contracts từ userDashboard:', userDashboard.contracts.length);
        return processContracts(userDashboard.contracts, userDashboard);
      }

      // Ưu tiên 2: Lấy contracts từ selectedVehicle nếu có
      let selected = null;
      try {
        const selectedStr = sessionStorage.getItem('selectedVehicle');
        if (selectedStr) {
          selected = JSON.parse(selectedStr);
        }
      } catch (parseError) {
        console.warn(' Không thể parse selectedVehicle từ sessionStorage:', parseError);
      }

      if (selected?.id || selected?.vehicleId) {
        const vehicleId = selected.id || selected.vehicleId;
        
        // Validate vehicleId trước khi gọi API
        if (!vehicleId || vehicleId === 'undefined' || vehicleId === 'null') {
          console.warn(' vehicleId không hợp lệ:', vehicleId);
          return processContracts([], userDashboard);
        }

        console.log(' Lấy contracts cho vehicleId:', vehicleId);
        const planResp = await contractService.getVehiclePlan(vehicleId);
        console.log(' Vehicle plan response:', planResp);
        
        if (planResp.success && planResp.data) {
          const contractsArr = Array.isArray(planResp.data) ? planResp.data : [planResp.data];
          console.log(' Đã lấy được contracts từ vehicle plan:', contractsArr.length);
          return processContracts(contractsArr, userDashboard);
        } else {
          console.warn(' Vehicle plan API trả về success: false hoặc không có data:', planResp.message);
        }
      } else {
        console.log('Không có selectedVehicle, sẽ dùng contracts từ userDashboard hoặc trả về empty');
      }

      // Fallback: trả về empty array hoặc contracts từ userDashboard (nếu có)
      return processContracts([], userDashboard);
    } catch (err) {
      console.error(' Lỗi khi fetch contracts:', err);
      console.warn(' Vehicle plan API failed, fallback về empty contracts');
      return processContracts([], userDashboard);
    }
  };

  // Fetch payments helper
  const fetchPayments = async (userId) => {
    try {
      const paymentsResponse = await paymentService.getPaymentHistory(userId);
      console.log(' Payment service response:', paymentsResponse);
      
      if (paymentsResponse.success && paymentsResponse.data) {
        return Array.isArray(paymentsResponse.data) ? 
          paymentsResponse.data.slice(0, 5) : [];
      }
      return [];
    } catch (err) {
      console.warn(' Payment API failed:', err);
      return [];
    }
  };

  // KHÔNG CẦN GỌI API RIÊNG CHO totalSwaps - DỮ LIỆU ĐÃ CÓ TRONG API MỚI
  // useEffect đã được loại bỏ vì dữ liệu totalSwaps đã có trong API GET /api/users/{id}

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
