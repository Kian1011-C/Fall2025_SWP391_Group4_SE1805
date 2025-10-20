// Driver/SwapBattery/hooks/useSwapProcess.js
// Custom hook to manage swap process state and logic
import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../../../context/AuthContext';
import { swapService } from '../../../../assets/js/services/index.js';
import { devLog } from '../../../../assets/js/config/development';
import { getBatteryLevel } from '../utils';

export const useSwapProcess = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Selected vehicle state
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [currentBatteryLevel, setCurrentBatteryLevel] = useState(50);

  // API integration state
  const [swapId, setSwapId] = useState(null);
  const [apiLoading, setApiLoading] = useState(false);
  const [apiError, setApiError] = useState(null);
  
  // Start swap state
  const [isStartingSwap, setIsStartingSwap] = useState(false);
  const [swapSessionData, setSwapSessionData] = useState(null);
  const [oldBatteryId, setOldBatteryId] = useState(null);
  const [newBatteryData, setNewBatteryData] = useState(null);

  // Initialize vehicle from navigation or session storage
  useEffect(() => {
    const vehicleFromNavigation = location.state?.selectedVehicle;
    if (vehicleFromNavigation) {
      console.log('🚗 Received selected vehicle from Dashboard:', vehicleFromNavigation);
      console.log('📋 Vehicle contract info:', {
        contract_id: vehicleFromNavigation.contract_id,
        contractId: vehicleFromNavigation.contractId,
        subscriptionId: vehicleFromNavigation.subscriptionId,
        subscription_id: vehicleFromNavigation.subscription_id
      });
      setSelectedVehicle(vehicleFromNavigation);
      
      // Get battery level with priority: health > batteryLevel > 50
      const batteryLevel = getBatteryLevel(vehicleFromNavigation, 50);
      console.log('🔋 Setting battery level from vehicle:', batteryLevel, 
                  '(health:', vehicleFromNavigation.health, 
                  'batteryLevel:', vehicleFromNavigation.batteryLevel, ')');
      setCurrentBatteryLevel(batteryLevel);
    } else {
      console.warn('⚠️ No vehicle received from navigation, checking session storage...');
      
      // Try to get vehicle from session storage
      try {
        const sessionVehicle = JSON.parse(sessionStorage.getItem('selectedVehicle'));
        if (sessionVehicle) {
          console.log('🚗 Found vehicle in session storage:', sessionVehicle);
          setSelectedVehicle(sessionVehicle);
          const batteryLevel = getBatteryLevel(sessionVehicle, 50);
          setCurrentBatteryLevel(batteryLevel);
        } else {
          console.error('❌ No vehicle found in session storage either!');
          alert('Vui lòng chọn xe trước khi đổi pin. Đang chuyển về Dashboard...');
          setTimeout(() => {
            navigate('/driver/dashboard');
          }, 2000);
        }
      } catch (err) {
        console.error('❌ Error reading session storage:', err);
        alert('Vui lòng chọn xe trước khi đổi pin. Đang chuyển về Dashboard...');
        setTimeout(() => {
          navigate('/driver/dashboard');
        }, 2000);
      }
    }
  }, [currentUser, location.state, navigate]);

  // Handle initiate swap
  const handleStartSwap = async (selectedStation, selectedTower) => {
    try {
      setIsStartingSwap(true);
      setApiError(null);

      console.log('🚀 Initiating swap process...');

      // Validate required data
      if (!currentUser?.id && !currentUser?.user_id) {
        throw new Error('Không tìm thấy thông tin người dùng');
      }
      if (!selectedStation?.id) {
        throw new Error('Vui lòng chọn trạm');
      }
      if (!selectedTower?.id) {
        throw new Error('Vui lòng chọn trụ sạc');
      }
      if (!selectedVehicle?.id && !selectedVehicle?.vehicle_id) {
        throw new Error('Vui lòng chọn xe');
      }

      const swapData = {
        userId: currentUser?.id || currentUser?.user_id,
        stationId: selectedStation?.id,
        towerId: selectedTower?.id,
        vehicleId: selectedVehicle?.id || selectedVehicle?.vehicle_id,
        selectedSlotId: null // Will be set later
      };
      
      console.log('📋 Swap data:', swapData);
      
      // Call initiate API
      const response = await swapService.initiateSwap(swapData);
      
      if (response.success) {
        console.log('✅ Swap initiated successfully:', response.data);
        
        // Store swap session data
        setSwapSessionData(response.data);
        setSwapId(response.data.swapSessionId);
        setOldBatteryId(response.data.oldBatteryId || 456);
        
        // Log swap session data for debugging
        console.log('📋 Swap session data:', {
          swapSessionId: response.data.swapSessionId,
          instructions: response.data.instructions,
          emptySlotNumber: response.data.emptySlotNumber,
          newBatterySlot: response.data.newBatterySlot,
          estimatedTime: response.data.estimatedTime
        });
        
        return { success: true, data: response.data };
      } else {
        throw new Error(response.message || 'Không thể khởi tạo quy trình đổi pin');
      }
    } catch (error) {
      console.error('❌ Error initiating swap:', error);
      setApiError(error.message || 'Lỗi khi khởi tạo quy trình đổi pin');
      alert(error.message || 'Lỗi khi khởi tạo quy trình đổi pin');
      return { success: false, error: error.message };
    } finally {
      setIsStartingSwap(false);
    }
  };

  // Handle swap request
  const handleSwapRequest = async (selectedStation, selectedTower) => {
    setApiLoading(true);
    setApiError(null);
    
    try {
      const payload = {
        driver_id: currentUser?.id || currentUser?.user_id || currentUser?.userId,
        vehicle_id: selectedVehicle?.vehicle_id || selectedVehicle?.vehicleId || selectedVehicle?.id,
        station_id: selectedStation?.stationId || selectedStation?.id,
        slot_id: selectedTower?.towerId || selectedTower?.id
      };
      devLog('info', 'Sending swap request with payload:', payload);
      
      const res = await swapService.requestSwap(payload);
      devLog('info', 'Swap request response:', res);
      
      if (res?.success) {
        setSwapId(res.data?.swapId || res.data?.id || `SWAP_${Date.now()}`);
        devLog('info', 'API call successful:', res.message);
        return { success: true, data: res.data };
      } else {
        devLog('error', 'Swap request failed:', res.message);
        setApiError({
          message: res.message || 'Lỗi khi gửi yêu cầu đổi pin',
          errorType: res.errorType || 'UNKNOWN'
        });
        alert(res.message || 'Lỗi khi gửi yêu cầu đổi pin');
        return { success: false, error: res.message };
      }
    } catch (error) {
      devLog('error', 'Swap request error:', error);
      setApiError({
        message: error.message || 'Lỗi khi gửi yêu cầu đổi pin',
        errorType: 'UNKNOWN'
      });
      alert(error.message || 'Lỗi khi gửi yêu cầu đổi pin');
      return { success: false, error: error.message };
    } finally {
      setApiLoading(false);
    }
  };

  // Handle swap confirmation
  const handleSwapConfirmation = async (selectedStation, selectedNewBatterySlot, fullSlots) => {
    // If we have an active swap session, confirm with backend to persist history and stats
    if (swapId) {
      setApiLoading(true);
      setApiError(null);
      try {
        const res = await swapService.confirmSwap(swapId);
        if (res?.success && res.data) {
          const newLevel = res.data?.newBatteryLevel || selectedNewBatterySlot?.batteryLevel || 100;
          const oldLevel = res.data?.oldBatteryLevel || currentBatteryLevel;
          if (selectedVehicle) {
            const updatedVehicle = { ...selectedVehicle, batteryLevel: newLevel, health: newLevel };
            setSelectedVehicle(updatedVehicle);
            sessionStorage.setItem('selectedVehicle', JSON.stringify(updatedVehicle));
            setCurrentBatteryLevel(newLevel);
          }
          return {
            success: true,
            data: {
              swapId: res.data.swapId || swapId,
              stationName: selectedStation?.name,
              time: new Date().toLocaleString('vi-VN'),
              oldBattery: oldLevel,
              newBattery: newLevel,
              status: 'completed'
            }
          };
        } else {
          setApiError(res?.message || 'Không thể xác nhận đổi pin');
          return { success: false, error: res?.message || 'Không thể xác nhận đổi pin' };
        }
      } finally {
        setApiLoading(false);
      }
    }

    // No swap session: fallback to local success (demo mode)
    if (Array.isArray(fullSlots) && fullSlots.length > 0) {
      const randomIndex = Math.floor(Math.random() * fullSlots.length);
      return { success: true, newBatterySlot: fullSlots[randomIndex] };
    }
    
    setApiLoading(true);
    setApiError(null);
    
    try {
      return { success: true, newBatterySlot: selectedNewBatterySlot };
    } finally {
      setApiLoading(false);
    }
  };

  // Handle finish and navigation
  const handleFinish = () => {
    const updatedVehicleData = sessionStorage.getItem('selectedVehicle');
    if (updatedVehicleData) {
      try {
        const updatedVehicle = JSON.parse(updatedVehicleData);
        console.log('🔙 Navigating back with updated vehicle:', updatedVehicle);
        navigate('/driver/dashboard', { 
          state: { updatedVehicle },
          replace: true 
        });
        return;
      } catch (err) {
        console.warn('⚠️ Failed to parse updated vehicle:', err);
      }
    }
    navigate('/driver/dashboard');
  };

  return {
    // State
    currentUser,
    selectedVehicle,
    setSelectedVehicle,
    currentBatteryLevel,
    setCurrentBatteryLevel,
    swapId,
    setSwapId,
    apiLoading,
    apiError,
    setApiError,
    isStartingSwap,
    swapSessionData,
    setSwapSessionData,
    oldBatteryId,
    setOldBatteryId,
    newBatteryData,
    setNewBatteryData,
    
    // Actions
    handleStartSwap,
    handleSwapRequest,
    handleSwapConfirmation,
    handleFinish
  };
};
