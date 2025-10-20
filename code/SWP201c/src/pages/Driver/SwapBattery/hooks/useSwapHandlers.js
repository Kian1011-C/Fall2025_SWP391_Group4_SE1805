// Driver/SwapBattery/hooks/useSwapHandlers.js
// Custom hook to manage swap handlers and navigation logic
import { useSwapSteps } from './useSwapSteps';

export const useSwapHandlers = (currentUser, selectedVehicle, swapProcess, swapData) => {
  const swapSteps = useSwapSteps();

  // Destructure swap data (passed from parent)
  const {
    stations,
    userContract,
    towers,
    fullSlots,
    loading,
    loadingTowers,
    loadingSlots,
    error,
    fetchInitialData,
    fetchTowersByStation,
    fetchSlotsByTower,
    setError
  } = swapData;

  // Destructure swap steps
  const {
    currentStep,
    selectedStation,
    selectedTower,
    selectedNewBatterySlot,
    selectedEmptySlot,
    swapResult,
    setCurrentStep,
    setSelectedStation,
    setSelectedTower,
    setSelectedNewBatterySlot,
    setSelectedEmptySlot,
    setSwapResult
  } = swapSteps;

  // Destructure swap process
  const {
    handleStartSwap,
    handleSwapConfirmation,
    handleFinish,
    setApiError,
    setNewBatteryData,
    setCurrentBatteryLevel,
    setSelectedVehicle
  } = swapProcess;

  // Handle station selection
  const handleSelectStation = async (station) => {
    console.log('🏪 handleSelectStation called!');
    console.log('📍 Station:', station.name, 'Status:', station.status);
    
    // Smart status checking - support multiple formats
    let canSelect = false;
    
    if (station.status === undefined || station.status === null) {
      canSelect = true;
    } else if (typeof station.status === 'string') {
      const statusLower = station.status.toLowerCase().trim();
      canSelect = statusLower === 'active' || statusLower === 'hoạt động' || statusLower === 'available';
    } else if (typeof station.status === 'number') {
      canSelect = station.status === 1 || station.status > 0;
    } else if (typeof station.status === 'boolean') {
      canSelect = station.status === true;
    } else {
      console.warn('⚠️ Unknown status format, allowing selection');
      canSelect = true;
    }
    
    console.log('✅ Can select?', canSelect);
    
    if (canSelect) {
      console.log('🏪 Selecting station and fetching towers...');
      setSelectedStation(station);
      setSelectedTower(null);
      const stationId = station.stationId || station.id;
      await fetchTowersByStation(stationId);
      setCurrentStep(2);
      console.log('🏪 Station selected; moving to step 2 to choose tower');
    } else {
      console.log('❌ Station not active, cannot select');
      alert('Trạm này đang bảo trì. Vui lòng chọn trạm khác.');
    }
  };

  // Handle tower selection
  const handleSelectTower = async (tower) => {
    console.log('🔌 handleSelectTower called!');
    console.log('📍 Tower:', tower);
    
    const statusVal = typeof tower.status === 'string' ? tower.status.toLowerCase() : tower.status;
    if (statusVal === 'active' || statusVal === true || statusVal === 1) {
      console.log('✅ Tower is active, selecting...');
      setSelectedTower(tower);
      setSelectedNewBatterySlot(null);
      setSelectedEmptySlot(null);
      const towerId = tower.towerId || tower.id;
      await fetchSlotsByTower(towerId);
      setCurrentStep(3);
      console.log('🔌 Tower selected; moving to step 3');
    } else {
      console.log('❌ Tower not active, cannot select');
      alert('Trụ này không khả dụng. Vui lòng chọn trụ khác.');
    }
  };

  // Handle navigation between steps
  const handleNext = async () => {
    if (currentStep === 1) {
      console.log('Step 1: Station selection handled by handleSelectStation');
    } else if (currentStep === 2) {
      console.log('Step 2: Tower selection handled by handleSelectTower');
    } else if (currentStep === 3) {
      console.log('Step 3: Sending swap request...');
      console.log('Selected Station:', selectedStation);
      console.log('Selected Tower:', selectedTower);
      console.log('Selected Vehicle:', selectedVehicle);
      
      if (!selectedStation || !selectedTower || !selectedVehicle) {
        console.error('❌ Missing required info:', {
          station: !!selectedStation,
          tower: !!selectedTower,
          vehicle: !!selectedVehicle
        });
        alert('Thiếu thông tin (trạm/trụ/xe). Vui lòng quay lại chọn trạm và trụ.');
        return;
      }
      
      const result = await handleStartSwap(selectedStation, selectedTower);
      if (result.success) {
        setCurrentStep(4);
      }
    } else if (currentStep === 4) {
      setCurrentStep(5);
    } else if (currentStep === 5) {
      const result = await handleSwapConfirmation(selectedStation, selectedNewBatterySlot, fullSlots);
      if (result.success) {
        if (result.newBatterySlot) {
          setSelectedNewBatterySlot(result.newBatterySlot);
          // Update vehicle battery level locally when BE confirmation is skipped
          const newLevel = result.newBatterySlot.batteryLevel || 100;
          if (selectedVehicle) {
            const updatedVehicle = { ...selectedVehicle, batteryLevel: newLevel, health: newLevel };
            setSelectedVehicle(updatedVehicle);
            try { sessionStorage.setItem('selectedVehicle', JSON.stringify(updatedVehicle)); } catch {}
            setCurrentBatteryLevel(newLevel);
          }
          setSwapResult({
            swapId: `SWAP_${Date.now()}`,
            stationName: selectedStation?.name,
            time: new Date().toLocaleString('vi-VN'),
            oldBattery: selectedVehicle?.health || selectedVehicle?.batteryLevel || 50,
            newBattery: newLevel,
            status: 'completed'
          });
        }
        if (result.data) {
          setSwapResult(result.data);
        }
        setCurrentStep(6);
      }
    }
  };

  // Handle back navigation
  const handleBack = () => {
    if (currentStep > 1) {
      if (currentStep === 5) {
        setCurrentStep(4);
      } else if (currentStep === 4) {
        setCurrentStep(3);
      } else if (currentStep === 3) {
        setCurrentStep(2);
      } else if (currentStep === 2) {
        setCurrentStep(1);
      }
    }
  };

  // Handle place old battery completion
  const handlePlaceOldBatteryComplete = (data) => {
    console.log('✅ Place old battery completed:', data);
    setNewBatteryData(data);
    setCurrentStep(5);
  };

  // Handle place old battery error
  const handlePlaceOldBatteryError = (error) => {
    console.error('❌ Place old battery error:', error);
    setApiError(error.message || 'Lỗi khi đặt pin cũ');
    alert(error.message || 'Lỗi khi đặt pin cũ');
  };

  // Handle swap completion error
  const handleSwapCompletionError = (error) => {
    console.error('❌ SwapCompletion error:', error);
    setApiError(error.message || 'Lỗi khi hoàn tất đổi pin');
    alert(error.message || 'Lỗi khi hoàn tất đổi pin');
  };

  // Handle confirm and save completion
  const handleConfirmAndSaveComplete = () => {
    const newBatteryLevel = selectedNewBatterySlot?.batteryLevel || 100;
    if (selectedVehicle) {
      const updatedVehicle = { ...selectedVehicle, batteryLevel: newBatteryLevel, health: newBatteryLevel };
      setSelectedVehicle(updatedVehicle);
      sessionStorage.setItem('selectedVehicle', JSON.stringify(updatedVehicle));
      setCurrentBatteryLevel(newBatteryLevel);
    }
    setSwapResult({
      swapId: `SWAP_${Date.now()}`,
      stationName: selectedStation?.name,
      time: new Date().toLocaleString('vi-VN'),
      oldBattery: selectedVehicle?.health || selectedVehicle?.batteryLevel || 50,
      newBattery: newBatteryLevel,
      status: 'completed'
    });
    setCurrentStep(6);
  };

  return {
    // Data from hooks
    stations,
    userContract,
    towers,
    fullSlots,
    loading,
    loadingTowers,
    loadingSlots,
    error,
    fetchInitialData,
    fetchTowersByStation,
    fetchSlotsByTower,
    setError,
    
    // Step management
    currentStep,
    selectedStation,
    selectedTower,
    selectedNewBatterySlot,
    selectedEmptySlot,
    swapResult,
    setCurrentStep,
    setSelectedStation,
    setSelectedTower,
    setSelectedNewBatterySlot,
    setSelectedEmptySlot,
    setSwapResult,
    
    // Handlers
    handleSelectStation,
    handleSelectTower,
    handleNext,
    handleBack,
    handlePlaceOldBatteryComplete,
    handlePlaceOldBatteryError,
    handleSwapCompletionError,
    handleConfirmAndSaveComplete,
    handleFinish
  };
};
