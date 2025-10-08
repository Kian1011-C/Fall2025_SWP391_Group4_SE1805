// Driver Dashboard Component
// Main dashboard page for drivers/users

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import authService from '../../assets/js/services/authService';
import userService from '../../assets/js/services/userService';
import vehicleService from '../../assets/js/services/vehicleService';
import contractService from '../../assets/js/services/contractService';
import swapService from '../../assets/js/services/swapService';
import paymentService from '../../assets/js/services/paymentService';
import DashboardLayout from '../../layouts/DashboardLayout';
import { normalizeVehicleData, normalizeContractData, normalizeSwapData, normalizeDashboardStats, extractErrorMessage } from '../../assets/js/utils/apiHelpers';
import { API_CONFIG } from '../../assets/js/config/api';
const DriverDashboard = () => {
  const navigate = useNavigate();
  const { currentUser, handleLogout } = useAuth();
  const [user, setUser] = useState(null);
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
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('🚗 DriverDashboard: Fetching data for user:', currentUser);
      console.log('🚗 DriverDashboard: User email:', currentUser?.email);
      console.log('🚗 DriverDashboard: User ID:', currentUser?.id);
      
      if (!currentUser) {
        console.log('❌ No current user found, setting error');
        setError('Không thể tải thông tin người dùng. Vui lòng đăng nhập lại.');
        return;
      }

      // Set user info
      setUser(currentUser);
      console.log('✅ Current user set:', currentUser);
      
      // Always try to fetch from backend API first
      console.log('🔄 Calling Spring Boot API for user dashboard data...');
      
      // Get userId for API call - try multiple fields
      const userId = currentUser.id || currentUser.user_id || currentUser.userId;
      console.log('🆔 Using userId for API:', userId);
      
      if (!userId) {
        console.log('❌ No valid userId found');
        throw new Error('Không tìm thấy User ID hợp lệ');
      }
      
      // Fetch user dashboard data from Spring Boot backend
      const userResponse = await userService.getUserById(userId);
      console.log('📊 API Response:', userResponse);
      
      if (userResponse.success && userResponse.data) {
        const userData = userResponse.data;
        console.log('📋 User data received:', userData);
        
        // Extract data from API response
        const apiUser = userData.user || {};
        const userVehicles = userData.vehicles || [];
        const userDashboard = userData.dashboard || {};
        
        console.log('🚗 Vehicles from API:', userVehicles);
        console.log('📊 Dashboard from API:', userDashboard);
        
        // Set vehicles data - process directly to preserve API data
        const processedVehicles = userVehicles.map(vehicle => ({
          id: vehicle.vehicleId || vehicle.id,
          plateNumber: vehicle.plateNumber || vehicle.plate_number,
          model: vehicle.vehicleModel || vehicle.model,
          // Use real battery health from API, not fake 85%
          batteryLevel: vehicle.health || vehicle.batteryLevel || 0,
          currentOdometer: vehicle.currentOdometer || vehicle.current_odometer || 0,
          current_odometer: vehicle.currentOdometer || vehicle.current_odometer || 0,
          batteryId: vehicle.batteryId || vehicle.battery_id,
          batteryModel: vehicle.batteryModel || vehicle.battery_model,
          batteryType: vehicle.batteryType || vehicle.battery_type,
          vinNumber: vehicle.vinNumber || vehicle.vin_number,
          compatibleBatteryTypes: vehicle.compatibleBatteryTypes || vehicle.compatible_battery_types,
          // Keep original data
          ...vehicle
        }));
        console.log('✅ Processed vehicles with real battery data:', processedVehicles);
        setVehicles(processedVehicles);
        
        // Auto-select first vehicle if available and no vehicle selected
        if (processedVehicles.length > 0 && !selectedVehicle) {
          setSelectedVehicle(processedVehicles[0]);
        }
        
        // Initialize variables for contracts and payments
        let userContracts = [];
        let normalizedPayments = [];
        
        // Always fetch ALL contracts for the user, not just from dashboard
        console.log('🔄 Fetching ALL contracts for user from contract service...');
        console.log('🔍 Contract service URL will be:', API_CONFIG.ENDPOINTS.CONTRACTS.BY_USER(userId));
        try {
          const contractsResponse = await contractService.getContracts(userId);
          console.log('📝 Contract service response:', contractsResponse);
          console.log('📝 Contract response success:', contractsResponse?.success);
          console.log('� Contract response data:', contractsResponse?.data);
          
          if (contractsResponse.success && contractsResponse.data && contractsResponse.data.length > 0) {
            // Process ALL contracts for this user
            console.log('📝 Processing contract data:', contractsResponse.data);
            userContracts = contractsResponse.data.map((contractData, index) => {
              console.log(`📝 Processing contract ${index}:`, contractData);
              console.log(`💰 Contract ${index} monthlyTotalFee:`, contractData.monthlyTotalFee);
              console.log(`💰 Contract ${index} monthlyFee:`, contractData.monthlyFee);
              console.log(`💰 Contract ${index} fee:`, contractData.fee);
              const processedContract = {
                id: contractData.contractId || contractData.id || contractData.contractNumber,
                contractNumber: contractData.contractNumber,
                planName: contractData.planName || contractData.plan || `Contract ${contractData.contractNumber}`,
                status: contractData.status || 'active',
                startDate: contractData.startDate,
                endDate: contractData.endDate,
                monthlyFee: contractData.monthlyFee || contractData.monthlyBaseFee, // Giá gốc gói
                monthlyTotalFee: contractData.monthlyTotalFee, // Giá total cho billing
                monthlyDistance: contractData.monthlyDistance || contractData.distance,
                vehiclePlate: contractData.vehiclePlate,
                vehicleId: contractData.vehicleId
              };
              console.log(`✅ Processed contract ${index}:`, processedContract);
              return processedContract;
            });
            
            console.log('� All contracts processed:', userContracts);
          } else {
            console.warn('⚠️ No contracts found from service');
            userContracts = [];
          }
        } catch (contractError) {
          console.warn('⚠️ Contract service failed:', contractError);
          
          // Fallback to dashboard data if available
          if (userDashboard && userDashboard.contractNumber) {
            console.log('� Fallback to dashboard contract data:', {
              contractNumber: userDashboard.contractNumber,
              contractStatus: userDashboard.contractStatus,
              vehiclePlate: userDashboard.vehiclePlate,
              availableFields: Object.keys(userDashboard)
            });
            
            if (contractsResponse.success && contractsResponse.data && contractsResponse.data.length > 0) {
              // Find matching contract or use first available
              const contractData = contractsResponse.data.find(c => 
                c.contractNumber === userDashboard.contractNumber ||
                c.id === userDashboard.contractNumber ||
                c.vehiclePlate === userDashboard.vehiclePlate
              ) || contractsResponse.data[0];
              
              console.log('📋 Matched contract data:', contractData);
              
              userContracts = [{
                id: contractData.id || userDashboard.contractNumber,
                contractNumber: contractData.contractNumber || userDashboard.contractNumber,
                planName: contractData.planName || contractData.plan || 'Unknown Plan',
                status: contractData.status || userDashboard.contractStatus || 'active',
                startDate: contractData.startDate || userDashboard.contractStartDate,
                endDate: contractData.endDate || userDashboard.contractEndDate,
                monthlyTotalFee: contractData.monthlyTotalFee || contractData.monthlyFee || contractData.fee,
                monthlyDistance: contractData.monthlyDistance || contractData.distance,
                vehiclePlate: contractData.vehiclePlate || userDashboard.vehiclePlate
              }];
            } else {
              // Fallback to basic dashboard data only if contract service fails
              console.warn('⚠️ No contract data from service, using dashboard only');
              userContracts = [{
                id: userDashboard.contractNumber,
                contractNumber: userDashboard.contractNumber,
                planName: 'Contract ' + userDashboard.contractNumber,
                status: userDashboard.contractStatus || 'active',
                startDate: userDashboard.contractStartDate,
                endDate: userDashboard.contractEndDate,
                monthlyTotalFee: null, // No hard-coding
                monthlyDistance: null, // No hard-coding
                vehiclePlate: userDashboard.vehiclePlate
              }];
            }
          } else {
            userContracts = [];
          }
        }
        
        setContracts(userContracts);
        console.log('📝 Final contracts set:', userContracts);
        
        // Try to fetch recent payments
        try {
          console.log('💰 Fetching payment history for user:', userId);
          const paymentsResponse = await paymentService.getPaymentHistory(userId);
          console.log('💰 Payment API response:', paymentsResponse);
          if (paymentsResponse.success && paymentsResponse.data) {
            const recentPaymentsList = Array.isArray(paymentsResponse.data) ? 
              paymentsResponse.data.slice(0, 5) : []; // Lấy 5 payments gần nhất
            setRecentPayments(recentPaymentsList);
            console.log('� Recent payments set:', recentPaymentsList);
          } else {
            setRecentPayments([]);
          }
        } catch (paymentError) {
          console.warn('⚠️ Payment API failed:', paymentError);
          setRecentPayments([]);
        }

        // Fetch recent payment history
        try {
          console.log('💰 Fetching payment history for user:', userId);
          const paymentsResponse = await paymentService.getPaymentHistory(userId);
          console.log('💰 Payment service response:', paymentsResponse);
          
          if (paymentsResponse.success && paymentsResponse.data) {
            // Take only the 5 most recent payments
            const recentPaymentsList = Array.isArray(paymentsResponse.data) ? 
              paymentsResponse.data.slice(0, 5) : [];
            setRecentPayments(recentPaymentsList);
            console.log('💰 Recent payments set:', recentPaymentsList);
          } else {
            setRecentPayments([]);
          }
        } catch (paymentError) {
          console.warn('⚠️ Payment API failed:', paymentError);
          setRecentPayments([]);
        }
        
        // Calculate dashboard stats using helper
        const calculatedStats = normalizeDashboardStats(
          userDashboard, 
          processedVehicles, 
          userContracts, 
          normalizedPayments
        );

        setStats(calculatedStats);
        
        console.log('✅ Successfully loaded data from API');
        console.log('📊 Calculated stats:', calculatedStats);
        
      } else {
        // API không trả về dữ liệu hợp lệ
        console.log('❌ API call failed or no data for user:', currentUser.email);
        throw new Error('API không trả về dữ liệu hợp lệ cho user này');
      }
      
    } catch (err) {
      console.error('❌ Error fetching dashboard data:', err);
      
      // Use helper to extract error message
      const errorMessage = extractErrorMessage(err);
      setError(`API Error: ${errorMessage}. Không thể lấy dữ liệu từ server.`);
      
      // Set empty data instead of demo data
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



  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const quickActions = [
    {
      icon: '🔋',
      title: 'Đổi pin',
      description: selectedVehicle ? `Đổi pin cho ${selectedVehicle.plateNumber}` : 'Tìm trạm và đổi pin ngay',
      color: '#19c37d',
      route: '/driver/swap-battery'
    },
    {
      icon: '🚗',
      title: 'Quản lý phương tiện',
      description: 'Xem và quản lý tất cả xe của bạn',
      color: '#22c55e',
      route: '/driver/vehicles'
    },
    {
      icon: '🗺️',
      title: 'Bản đồ trạm',
      description: 'Xem các trạm gần bạn',
      color: '#6ab7ff',
      route: '/driver/stations-map'
    },
    {
      icon: '💳',
      title: 'Thanh toán',
      description: 'Quản lý thanh toán',
      color: '#ffa500',
      route: '/driver/payments'
    },
    {
      icon: '💎',
      title: 'Gói dịch vụ',
      description: 'Nâng cấp gói của bạn',
      color: '#9c88ff',
      route: '/driver/subscriptions'
    }
  ];

  if (loading) {
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <div style={{ color: '#19c37d', fontSize: '1.5rem' }}>⏳ Đang tải...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <div style={{ color: '#ff6b6b', fontSize: '1.2rem' }}>⚠️ {error}</div>
        <button 
          onClick={fetchDashboardData}
          style={{
            marginTop: '20px',
            padding: '10px 20px',
            background: '#19c37d',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer'
          }}
        >
          Thử lại
        </button>
      </div>
    );
  }

  return (
    <DashboardLayout role="driver">
      <div style={{ padding: '20px', minHeight: '100vh' }}>
      
      {/* Development Debug Info */}
      {import.meta.env.VITE_ENABLE_DEBUG === 'true' && (
        <div style={{
          background: 'rgba(255, 165, 0, 0.1)',
          border: '1px solid rgba(255, 165, 0, 0.3)',
          borderRadius: '10px',
          padding: '15px',
          marginBottom: '20px',
          fontSize: '0.9rem',
          color: '#ffa500'
        }}>
          <strong>🔧 Debug Info:</strong><br/>
          API Base URL: {import.meta.env.VITE_API_BASE_URL}<br/>
          Current User ID: {currentUser?.id || currentUser?.user_id || currentUser?.userId}<br/>
          Vehicles Count: {vehicles.length}<br/>
          Contracts Count: {contracts.length}<br/>
          Data Source: {error ? 'API FAILED - No Data' : vehicles.length > 0 ? 'API SUCCESS' : 'NO DATA'}<br/>
          API Status: {error ? '❌ Error' : vehicles.length > 0 ? '✅ Connected' : '⏳ No Response'}<br/>
          Error: {error || 'None'}<br/>
          <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
            <button 
              onClick={() => window.open('http://localhost:8080/api/users/driver002', '_blank')} 
              style={{
                padding: '5px 10px',
                background: 'rgba(25, 195, 125, 0.2)',
                border: '1px solid rgba(25, 195, 125, 0.3)',
                borderRadius: '5px',
                color: '#19c37d',
                cursor: 'pointer',
                fontSize: '0.8rem'
              }}
            >
              Test API Direct
            </button>
            <button 
              onClick={() => {
                console.log('🚪 Debug logout clicked');
                console.log('handleLogout function:', typeof handleLogout);
                console.log('Current user:', currentUser);
                
                if (handleLogout && typeof handleLogout === 'function') {
                  console.log('✅ Executing logout...');
                  handleLogout();
                } else {
                  console.error('❌ handleLogout not available');
                  alert('Logout function not working');
                }
              }}
              style={{
                padding: '5px 10px',
                background: 'rgba(255, 107, 107, 0.2)',
                border: '1px solid rgba(255, 107, 107, 0.3)',
                borderRadius: '5px',
                color: '#ff6b6b',
                cursor: 'pointer',
                fontSize: '0.8rem'
              }}
            >
              🚪 Debug Logout
            </button>
          </div>
        </div>
      )}
      
      {/* Welcome Header */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(25, 195, 125, 0.1), rgba(106, 183, 255, 0.1))',
        borderRadius: '20px',
        padding: '30px',
        marginBottom: '30px',
        border: '1px solid rgba(255, 255, 255, 0.1)'
      }}>
        <h1 style={{ 
          color: '#FFFFFF', 
          margin: '0 0 10px 0',
          fontSize: '2rem'
        }}>
          🚗 Chào mừng {currentUser?.name || (currentUser?.firstName && currentUser?.lastName ? currentUser.firstName + ' ' + currentUser.lastName : currentUser?.email || 'Driver')}!
        </h1>
        <p style={{ color: '#B0B0B0', margin: 0, fontSize: '1.1rem' }}>
          {stats.activeVehicles > 0 ? `Bạn có ${stats.activeVehicles} xe đang hoạt động` : 'Sẵn sàng cho chuyến đi của bạn'}
        </p>
      </div>

      {/* Stats Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: '20px',
        marginBottom: '30px'
      }}>
        <div style={{
          background: 'rgba(26, 32, 44, 0.8)',
          borderRadius: '15px',
          padding: '25px',
          border: '1px solid rgba(25, 195, 125, 0.3)'
        }}>
          <div style={{ fontSize: '2rem', marginBottom: '10px' }}>🔋</div>
          <div style={{ color: '#19c37d', fontSize: '2rem', fontWeight: '700', marginBottom: '5px' }}>
            {stats.totalSwaps}
          </div>
          <div style={{ color: '#B0B0B0', fontSize: '0.9rem' }}>Tổng lượt đổi pin</div>
        </div>

        <div style={{
          background: 'rgba(26, 32, 44, 0.8)',
          borderRadius: '15px',
          padding: '25px',
          border: '1px solid rgba(106, 183, 255, 0.3)'
        }}>
          <div style={{ fontSize: '2rem', marginBottom: '10px' }}>💎</div>
          <div style={{ color: '#6ab7ff', fontSize: '1.1rem', fontWeight: '700', marginBottom: '5px' }}>
            {stats.currentPlans.length > 0 ? stats.currentPlans.join(', ') : 'Chưa có gói'}
          </div>
          <div style={{ color: '#B0B0B0', fontSize: '0.9rem' }}>
            {stats.currentPlans.length > 1 ? 'Các gói hiện tại' : 'Gói hiện tại'}
          </div>
        </div>

        <div style={{
          background: 'rgba(26, 32, 44, 0.8)',
          borderRadius: '15px',
          padding: '25px',
          border: '1px solid rgba(255, 165, 0, 0.3)'
        }}>
          <div style={{ fontSize: '2rem', marginBottom: '10px' }}>🚗</div>
          <div style={{ color: '#ffa500', fontSize: '2rem', fontWeight: '700', marginBottom: '5px' }}>
            {stats.activeVehicles}
          </div>
          <div style={{ color: '#B0B0B0', fontSize: '0.9rem' }}>Xe đang sử dụng</div>
        </div>

        <div style={{
          background: 'rgba(26, 32, 44, 0.8)',
          borderRadius: '15px',
          padding: '25px',
          border: '1px solid rgba(156, 136, 255, 0.3)'
        }}>
          <div style={{ fontSize: '2rem', marginBottom: '10px' }}>💰</div>
          <div style={{ color: '#9c88ff', fontSize: '1.3rem', fontWeight: '700', marginBottom: '5px' }}>
            {formatCurrency(stats.monthlySpent)}
          </div>
          <div style={{ color: '#B0B0B0', fontSize: '0.9rem' }}>Chi phí tháng này</div>
        </div>

        <div style={{
          background: 'rgba(26, 32, 44, 0.8)',
          borderRadius: '15px',
          padding: '25px',
          border: '1px solid rgba(34, 197, 94, 0.3)'
        }}>
          <div style={{ fontSize: '2rem', marginBottom: '10px' }}>📏</div>
          <div style={{ color: '#22c55e', fontSize: '1.3rem', fontWeight: '700', marginBottom: '5px' }}>
            {stats.totalDistance.toLocaleString()} km
          </div>
          <div style={{ color: '#B0B0B0', fontSize: '0.9rem' }}>Tổng quãng đường</div>
        </div>
      </div>

      {/* Quick Actions */}
      <div style={{
        background: 'rgba(26, 32, 44, 0.8)',
        borderRadius: '20px',
        padding: '30px',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        marginBottom: '30px'
      }}>
        <h3 style={{ 
          color: '#FFFFFF', 
          marginBottom: '20px',
          fontSize: '1.3rem',
          display: 'flex',
          alignItems: 'center',
          gap: '10px'
        }}>
          ⚡ Thao tác nhanh
        </h3>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '15px'
        }}>
          {quickActions.map((action, index) => (
            <button
              key={index}
              onClick={() => navigate(action.route, selectedVehicle ? { state: { selectedVehicle } } : {})}
              style={{
                background: `linear-gradient(135deg, ${action.color}20, ${action.color}10)`,
                border: `1px solid ${action.color}40`,
                borderRadius: '15px',
                padding: '20px',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                textAlign: 'left'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = `0 10px 30px ${action.color}30`;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              <div style={{ fontSize: '2.5rem', marginBottom: '10px' }}>{action.icon}</div>
              <div style={{ color: '#FFFFFF', fontSize: '1.1rem', fontWeight: '600', marginBottom: '5px' }}>
                {action.title}
              </div>
              <div style={{ color: '#B0B0B0', fontSize: '0.9rem' }}>
                {action.description}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Vehicle & Contract Management */}
      {(vehicles.length > 0 || contracts.length > 0) && (
        <div style={{
          background: 'rgba(26, 32, 44, 0.8)',
          borderRadius: '20px',
          padding: '30px',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          marginBottom: '30px'
        }}>
          <h3 style={{ 
            color: '#FFFFFF', 
            marginBottom: '20px',
            fontSize: '1.3rem',
            display: 'flex',
            alignItems: 'center',
            gap: '10px'
          }}>
            🚗 Xe và Gói dịch vụ
          </h3>

          {/* Selected Vehicle Display */}
          {selectedVehicle && (
            <div style={{
              background: 'linear-gradient(135deg, rgba(25, 195, 125, 0.1), rgba(106, 183, 255, 0.1))',
              border: '2px solid rgba(25, 195, 125, 0.3)',
              borderRadius: '15px',
              padding: '20px',
              marginBottom: '25px'
            }}>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '15px'
              }}>
                <div>
                  <div style={{ 
                    color: '#19c37d', 
                    fontSize: '0.9rem', 
                    fontWeight: '600',
                    marginBottom: '5px'
                  }}>
                    ⭐ XE ĐANG CHỌN
                  </div>
                  <div style={{ color: '#FFFFFF', fontSize: '1.3rem', fontWeight: '700' }}>
                    {selectedVehicle.model}
                  </div>
                  <div style={{ color: '#19c37d', fontSize: '1.1rem', fontWeight: '600' }}>
                    {selectedVehicle.plateNumber}
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{
                    background: selectedVehicle.batteryLevel > 70 ? 'rgba(25, 195, 125, 0.3)' : 
                               selectedVehicle.batteryLevel > 30 ? 'rgba(255, 165, 0, 0.3)' : 
                               'rgba(255, 107, 107, 0.3)',
                    color: selectedVehicle.batteryLevel > 70 ? '#19c37d' : 
                           selectedVehicle.batteryLevel > 30 ? '#ffa500' : '#ff6b6b',
                    padding: '8px 15px',
                    borderRadius: '20px',
                    fontSize: '1.1rem',
                    fontWeight: '700',
                    marginBottom: '10px'
                  }}>
                    🔋 {selectedVehicle.batteryLevel}%
                  </div>
                  <div style={{ color: '#B0B0B0', fontSize: '0.9rem', marginBottom: '5px' }}>
                    📏 {(selectedVehicle.current_odometer || selectedVehicle.currentOdometer || 0)?.toLocaleString()} km
                  </div>
                  {(() => {
                    // Filter contracts for selected vehicle
                    const selectedVehicleContracts = contracts.filter(
                      contract => contract.vehiclePlate === selectedVehicle.plateNumber || 
                                 contract.vehicleId === selectedVehicle.id ||
                                 (contracts.length === 1 && vehicles.length === 1) // Single vehicle case
                    );
                    
                    return selectedVehicleContracts.length > 0 && (
                      <div style={{ color: '#B0B0B0', fontSize: '0.8rem' }}>
                        💎 {selectedVehicleContracts.length} gói dịch vụ
                      </div>
                    );
                  })()}
                </div>
              </div>
              <div style={{
                display: 'flex',
                gap: '10px',
                marginTop: '15px'
              }}>
                <button
                  onClick={() => navigate('/driver/swap-battery', { state: { selectedVehicle } })}
                  style={{
                    background: 'linear-gradient(135deg, #19c37d, #15a36a)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '10px',
                    padding: '12px 20px',
                    cursor: 'pointer',
                    fontSize: '0.9rem',
                    fontWeight: '600',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}
                >
                  🔋 Đổi pin xe này
                </button>
                <button
                  onClick={() => navigate('/driver/stations-map', { state: { selectedVehicle } })}
                  style={{
                    background: 'rgba(106, 183, 255, 0.2)',
                    color: '#6ab7ff',
                    border: '1px solid rgba(106, 183, 255, 0.3)',
                    borderRadius: '10px',
                    padding: '12px 20px',
                    cursor: 'pointer',
                    fontSize: '0.9rem',
                    fontWeight: '600',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}
                >
                  🗺️ Tìm trạm
                </button>
              </div>
            </div>
          )}

          {/* Vehicle Selection */}
          {vehicles.length > 0 && (
            <div style={{ marginBottom: '25px' }}>
              <h4 style={{ 
                color: '#FFFFFF', 
                marginBottom: '15px',
                fontSize: '1.1rem',
                fontWeight: '600'
              }}>
                🚗 Chọn xe ({vehicles.length} xe)
              </h4>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                gap: '15px'
              }}>
                {vehicles.map((vehicle, index) => {
                  const isSelected = selectedVehicle?.id === vehicle.id || 
                                   (selectedVehicle?.plateNumber === vehicle.plateNumber && !vehicle.id);
                  return (
                    <div
                      key={vehicle.id || index}
                      onClick={() => setSelectedVehicle(vehicle)}
                      style={{
                        background: isSelected ? 'rgba(25, 195, 125, 0.1)' : 'rgba(255, 255, 255, 0.05)',
                        border: isSelected ? '2px solid rgba(25, 195, 125, 0.5)' : '1px solid rgba(255, 255, 255, 0.1)',
                        borderRadius: '12px',
                        padding: '15px',
                        cursor: 'pointer',
                        transition: 'all 0.3s ease'
                      }}
                      onMouseEnter={(e) => {
                        if (!isSelected) {
                          e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)';
                          e.currentTarget.style.border = '1px solid rgba(255, 255, 255, 0.2)';
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (!isSelected) {
                          e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
                          e.currentTarget.style.border = '1px solid rgba(255, 255, 255, 0.1)';
                        }
                      }}
                    >
                      <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginBottom: '10px'
                      }}>
                        <div>
                          <div style={{ 
                            color: isSelected ? '#19c37d' : '#FFFFFF', 
                            fontSize: '1rem', 
                            fontWeight: '600',
                            marginBottom: '3px'
                          }}>
                            {isSelected ? '⭐ ' : ''}{vehicle.model}
                          </div>
                          <div style={{ 
                            color: '#19c37d', 
                            fontSize: '0.9rem', 
                            fontWeight: '500' 
                          }}>
                            {vehicle.plateNumber}
                          </div>
                        </div>
                        <div style={{
                          background: vehicle.batteryLevel > 70 ? 'rgba(25, 195, 125, 0.2)' : 
                                     vehicle.batteryLevel > 30 ? 'rgba(255, 165, 0, 0.2)' : 
                                     'rgba(255, 107, 107, 0.2)',
                          color: vehicle.batteryLevel > 70 ? '#19c37d' : 
                                 vehicle.batteryLevel > 30 ? '#ffa500' : '#ff6b6b',
                          padding: '4px 10px',
                          borderRadius: '12px',
                          fontSize: '0.8rem',
                          fontWeight: '600'
                        }}>
                          🔋 {vehicle.batteryLevel}%
                        </div>
                      </div>
                      <div style={{ 
                        display: 'flex', 
                        justifyContent: 'space-between', 
                        color: '#B0B0B0', 
                        fontSize: '0.8rem',
                        marginBottom: '8px'
                      }}>
                        <span>📏 Quãng đường:</span>
                        <span>{(vehicle.current_odometer || vehicle.currentOdometer || 0)?.toLocaleString()} km</span>
                      </div>
                      
                      {/* Vehicle's Active Contracts */}
                      {(() => {
                        // Filter contracts for this specific vehicle
                        const vehicleContracts = contracts.filter(
                          contract => contract.vehiclePlate === vehicle.plateNumber || 
                                     contract.vehicleId === vehicle.id ||
                                     (contracts.length === 1 && vehicles.length === 1) // Single vehicle case
                        );
                        
                        return vehicleContracts.length > 0 && (
                          <div style={{ 
                            borderTop: '1px solid rgba(255, 255, 255, 0.1)', 
                            paddingTop: '8px',
                            marginTop: '8px'
                          }}>
                            <div style={{ 
                              color: '#B0B0B0', 
                              fontSize: '0.8rem',
                              marginBottom: '5px',
                              fontWeight: '600'
                            }}>
                              💎 Gói dịch vụ ({vehicleContracts.length})
                            </div>
                            {vehicleContracts.slice(0, 2).map((contract, contractIndex) => (
                              <div key={contract.id || contractIndex} style={{
                                background: 'rgba(255, 255, 255, 0.05)',
                                borderRadius: '6px',
                                padding: '6px 8px',
                                marginBottom: '4px',
                                fontSize: '0.7rem'
                              }}>
                                <div style={{
                                  display: 'flex',
                                  justifyContent: 'space-between',
                                  alignItems: 'center'
                                }}>
                                  <span style={{ color: '#FFFFFF', fontWeight: '500' }}>
                                    {contract.planName}
                                  </span>
                                  <span style={{
                                    background: contract.status === 'active' ? 'rgba(25, 195, 125, 0.3)' : 'rgba(255, 165, 0, 0.3)',
                                    color: contract.status === 'active' ? '#19c37d' : '#ffa500',
                                    padding: '2px 6px',
                                    borderRadius: '8px',
                                    fontSize: '0.6rem',
                                    fontWeight: '600'
                                  }}>
                                    {contract.status === 'active' ? '✅' : '⏳'}
                                  </span>
                                </div>
                                <div style={{ 
                                  color: '#19c37d', 
                                  fontSize: '0.6rem',
                                  marginTop: '2px'
                                }}>
                                  {contract.monthlyFee ? `${contract.monthlyFee.toLocaleString()} VND/tháng` : 'Liên hệ để biết giá'}
                                </div>
                              </div>
                            ))}
                            {vehicleContracts.length > 2 && (
                              <div style={{
                                color: '#B0B0B0',
                                fontSize: '0.6rem',
                                textAlign: 'center',
                                marginTop: '4px'
                              }}>
                                +{vehicleContracts.length - 2} gói khác
                              </div>
                            )}
                          </div>
                        );
                      })()}
                    </div>
                  );
                })}
              </div>
            </div>
          )}


        </div>
      )}

      {/* Recent Swaps */}
      <div style={{
        background: 'rgba(26, 32, 44, 0.8)',
        borderRadius: '20px',
        padding: '30px',
        border: '1px solid rgba(255, 255, 255, 0.1)'
      }}>
        <h3 style={{ 
          color: '#FFFFFF', 
          marginBottom: '20px',
          fontSize: '1.3rem',
          display: 'flex',
          alignItems: 'center',
          gap: '10px'
        }}>
          � Lịch sử thanh toán gần đây
        </h3>
        {recentPayments.length > 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            {recentPayments.map((payment, index) => (
              <div
                key={payment.paymentId || payment.id || index}
                style={{
                  background: 'rgba(255, 255, 255, 0.05)',
                  borderRadius: '10px',
                  padding: '15px',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}
              >
                <div>
                  <div style={{ color: '#FFFFFF', fontSize: '1rem', marginBottom: '5px' }}>
                    💳 Thanh toán {payment.method || 'N/A'}
                  </div>
                  <div style={{ color: '#B0B0B0', fontSize: '0.8rem' }}>
                    {payment.processedAt ? new Date(payment.processedAt).toLocaleString('vi-VN') : 'N/A'}
                  </div>
                  <div style={{ color: '#B0B0B0', fontSize: '0.7rem', marginTop: '2px' }}>
                    ID: {payment.transactionId || payment.paymentId || 'N/A'}
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{
                    background: payment.status === 'success' ? 'rgba(25, 195, 125, 0.2)' : 
                               payment.status === 'pending' ? 'rgba(255, 165, 0, 0.2)' : 'rgba(255, 107, 107, 0.2)',
                    color: payment.status === 'success' ? '#19c37d' : 
                           payment.status === 'pending' ? '#ffa500' : '#ff6b6b',
                    padding: '4px 12px',
                    borderRadius: '12px',
                    fontSize: '0.8rem',
                    fontWeight: '600',
                    marginBottom: '5px'
                  }}>
                    {payment.status === 'success' ? '✅ Thành công' : 
                     payment.status === 'pending' ? '⏳ Đang xử lý' : '❌ Thất bại'}
                  </div>
                  <div style={{ color: '#19c37d', fontSize: '0.9rem', fontWeight: '600' }}>
                    {payment.amount ? `${payment.amount.toLocaleString()} ${payment.currency || 'VND'}` : 'N/A'}
                  </div>
                  <div style={{ color: '#B0B0B0', fontSize: '0.7rem' }}>
                    {payment.method || 'N/A'}
                  </div>
                </div>
              </div>
            ))}
            <button
              onClick={() => navigate('/driver/payments')}
              style={{
                background: 'rgba(25, 195, 125, 0.1)',
                border: '1px solid rgba(25, 195, 125, 0.3)',
                borderRadius: '8px',
                padding: '10px',
                color: '#19c37d',
                cursor: 'pointer',
                fontSize: '0.9rem',
                marginTop: '10px'
              }}
            >
              📊 Xem tất cả lịch sử
            </button>
          </div>
        ) : (
          <div style={{ 
            display: 'flex', 
            flexDirection: 'column', 
            gap: '15px',
            textAlign: 'center',
            padding: '40px',
            color: '#B0B0B0'
          }}>
            <div style={{ fontSize: '3rem' }}>�</div>
            <div>Chưa có lịch sử thanh toán nào</div>
            <button
              onClick={() => navigate('/driver/subscriptions')}
              style={{
                background: 'linear-gradient(135deg, #9c88ff, #8b5cf6)',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                padding: '12px 24px',
                cursor: 'pointer',
                fontSize: '1rem',
                marginTop: '10px'
              }}
            >
              � Xem gói dịch vụ
            </button>
          </div>
        )}
      </div>
      </div>
    </DashboardLayout>
  );
};

export default DriverDashboard;
