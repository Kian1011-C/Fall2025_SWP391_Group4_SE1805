// Driver/SwapBattery/index.jsx
// Swap Battery page (container inlined)
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
// import { swapService } from '../../../assets/js/services';
import '../../../assets/css/battery-swap.css';

// Hooks
import { useSwapData, useSwapSteps } from './hooks';

// Components
import {
  SwapProgressBar,
  StationSelector,
  TowerSelector,
  EmptySlotSelector,
  SwapConfirmation,
  PlaceOldBattery,
  TakeNewBattery,
  ConfirmAndSave,
  SwapSuccess,
  StaffAssistanceButton
} from './components';

// Utils
import { getBatteryLevel } from './utils';
import { swapService } from '../../../assets/js/services';

const SwapBatteryContainer = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Selected vehicle state
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [currentBatteryLevel, setCurrentBatteryLevel] = useState(50); // Changed from 15 to 50 for better default

  // Popups removed per requirement – inline flow only

  // Custom hooks
  const swapData = useSwapData(currentUser, selectedVehicle);
  const swapSteps = useSwapSteps();

  // Destructure for easier access
  const {
    stations,
    userContract,
    towers,
    fullSlots,
    // emptySlots, // no longer directly used in the simplified flow
    loading,
    loadingTowers,
    loadingSlots,
    error,
    fetchInitialData,
    fetchTowersByStation,
    fetchSlotsByTower,
    setError
  } = swapData;

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

  // isProcessing is no longer used but kept for UI compatibility
  const isProcessing = false;
  // API integration state
  const [swapId, setSwapId] = useState(null);
  // Simple flags kept for future UI states (e.g., spinner/toast)
  const [apiLoading, setApiLoading] = useState(false); // eslint-disable-line no-unused-vars
  const [apiError, setApiError] = useState(null); // eslint-disable-line no-unused-vars

  // Initialize - Get vehicle from navigation
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
      console.warn('⚠️ No vehicle received from navigation, using default battery level');
    }

    fetchInitialData(vehicleFromNavigation);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUser, location.state]);

  // Handle station selection
  const handleSelectStation = async (station) => {
    console.log('🏪 handleSelectStation called!');
    console.log('📍 Station:', station.name, 'Status:', station.status);
    
    // Smart status checking - support multiple formats
    let canSelect = false;
    
    if (station.status === undefined || station.status === null) {
      // No status - default to active
      canSelect = true;
    } else if (typeof station.status === 'string') {
      const statusLower = station.status.toLowerCase().trim();
      canSelect = statusLower === 'active' || statusLower === 'hoạt động' || statusLower === 'available';
    } else if (typeof station.status === 'number') {
      canSelect = station.status === 1 || station.status > 0;
    } else if (typeof station.status === 'boolean') {
      canSelect = station.status === true;
    } else {
      // Unknown format - default to active
      console.warn('⚠️ Unknown status format, allowing selection');
      canSelect = true;
    }
    
    console.log('✅ Can select?', canSelect);
    
    if (canSelect) {
      console.log('� Selecting station and fetching towers...');
      setSelectedStation(station);
      setSelectedTower(null);
      const stationId = station.stationId || station.id;
      await fetchTowersByStation(stationId);
      // Stay at step 1 until user also selects a tower and clicks "Tiếp tục"
      console.log('🏪 Station selected; waiting for tower selection before proceeding');
    } else {
      console.log('❌ Station not active, cannot select');
      alert('Trạm này đang bảo trì. Vui lòng chọn trạm khác.');
    }
  };

  // Handle tower selection (stay in step 1 until user proceeds)
  const handleSelectTower = async (tower) => {
    const statusVal = typeof tower.status === 'string' ? tower.status.toLowerCase() : tower.status;
    if (statusVal === 'active' || statusVal === true || statusVal === 1) {
      setSelectedTower(tower);
      setSelectedNewBatterySlot(null);
      setSelectedEmptySlot(null);
      const towerId = tower.towerId || tower.id;
      await fetchSlotsByTower(towerId);
    }
  };

  // Handle empty slot selection
  // Removed explicit empty slot selection handler in the new flow

  // Staff assistance popups removed – can integrate inline button later if needed

  // Handle navigation
  const handleNext = async () => {
    // New flow (6 steps):
    // 1) Tìm/đặt trạm (chọn trạm + trụ) → 2) Quét QR đăng nhập → 3) Chọn Đổi pin → 4) Bỏ pin cũ → 5) Nhận pin đầy → 6) Lắp pin & hoàn tất
    if (currentStep === 1) {
      if (selectedStation && selectedTower) {
        setCurrentStep(2);
      }
    } else if (currentStep === 2) {
      setCurrentStep(3);
    } else if (currentStep === 3) {
      // Initiate swap via BE
      if (!selectedStation) {
        alert('Thiếu thông tin trạm');
        return;
      }
      setApiLoading(true);
      setApiError(null);
      try {
        // Theo BE: /api/batteries/swap/initiate yêu cầu { userId, stationId } (batteryId optional)
        const resolvedContractId = userContract?.contract_id || userContract?.contractId || userContract?.id;
        const payload = {
          userId: currentUser?.id || currentUser?.user_id || currentUser?.userId,
          stationId: selectedStation?.stationId || selectedStation?.id,
          contractId: resolvedContractId,
          contract_id: resolvedContractId
        };
        const res = await swapService.initiateSwap(payload);
        if (res?.success && res.data) {
          setSwapId(res.data.swapId || res.data.id);
          setCurrentStep(4);
        } else {
          setApiError(res?.message || 'Không thể khởi tạo đổi pin');
          alert(res?.message || 'Không thể khởi tạo đổi pin');
        }
      } finally {
        setApiLoading(false);
      }
    } else if (currentStep === 4) {
      setCurrentStep(5);
    } else if (currentStep === 5) {
      // Auto pick a random full slot to simulate receiving a full battery from station
      if (Array.isArray(fullSlots) && fullSlots.length > 0) {
        const randomIndex = Math.floor(Math.random() * fullSlots.length);
        setSelectedNewBatterySlot(fullSlots[randomIndex]);
      }
      // Confirm swap via BE (if initiated)
      if (!swapId) {
        setCurrentStep(6);
        return;
      }
      setApiLoading(true);
      setApiError(null);
      try {
        // Theo BE: /api/batteries/swap/{swapId}/confirm không yêu cầu body
        const res = await swapService.confirmSwap(swapId);
        if (res?.success && res.data) {
          const newLevel = res.data?.newBatteryLevel || selectedNewBatterySlot?.batteryLevel || 100;
          const oldLevel = res.data?.oldBatteryLevel || currentBatteryLevel;
          setSwapResult({
            swapId: res.data.swapId || swapId,
            stationName: selectedStation?.name,
            time: new Date().toLocaleString('vi-VN'),
            oldBattery: oldLevel,
            newBattery: newLevel,
            status: 'completed'
          });
          if (selectedVehicle) {
            const updatedVehicle = { ...selectedVehicle, batteryLevel: newLevel, health: newLevel };
            setSelectedVehicle(updatedVehicle);
            sessionStorage.setItem('selectedVehicle', JSON.stringify(updatedVehicle));
            setCurrentBatteryLevel(newLevel);
          }
          setCurrentStep(6);
        } else {
          setApiError(res?.message || 'Không thể xác nhận đổi pin');
          alert(res?.message || 'Không thể xác nhận đổi pin');
        }
      } finally {
        setApiLoading(false);
      }
    }
  };

  const handleBack = () => {
    if (currentStep > 1 && !isProcessing) {
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

  const handleFinish = () => {
    // Pass updated vehicle back to dashboard/vehicles page
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

  // Render step content
  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div style={{ display: 'grid', gap: '20px' }}>
            <StationSelector
              stations={stations}
              selectedStation={selectedStation}
              selectedVehicle={selectedVehicle}
              currentBatteryLevel={currentBatteryLevel}
              loading={loading}
              error={error}
              onSelectStation={handleSelectStation}
              onRetry={() => fetchInitialData(location.state?.selectedVehicle)}
            />
            {selectedStation && (
              <TowerSelector
                towers={towers}
                selectedStation={selectedStation}
                selectedTower={selectedTower}
                loadingTowers={loadingTowers}
                onSelectTower={handleSelectTower}
                onGoBack={() => setCurrentStep(1)}
              />
            )}
          </div>
        );

      case 2:
        return (
          <div style={{ padding: '16px', color: '#B0B0B0' }}>
            <h3 style={{ color: '#FFFFFF' }}>Bước 2: Quét mã QR để đăng nhập</h3>
            <p>Vui lòng dùng ứng dụng để quét QR trên màn hình trạm để xác thực.</p>
          </div>
        );

      case 3:
        return (
          <div style={{ padding: '16px', color: '#B0B0B0' }}>
            <h3 style={{ color: '#FFFFFF' }}>Bước 3: Chọn “Đổi pin”</h3>
            <p>Nhấn nút Đổi pin trên màn hình trạm để bắt đầu quy trình.</p>
            <button
              className="btn-swap btn-confirm"
              onClick={handleNext}
              style={{ marginTop: '16px' }}
            >
              ✓ Đổi pin
            </button>
          </div>
        );

      case 4:
        return (
          <PlaceOldBattery
            selectedStation={selectedStation}
            selectedTower={selectedTower}
            selectedEmptySlot={selectedEmptySlot}
            selectedVehicle={selectedVehicle}
            currentBatteryLevel={currentBatteryLevel}
            onComplete={() => {}}
          />
        );

      case 5:
        return (
          <TakeNewBattery
            selectedStation={selectedStation}
            selectedTower={selectedTower}
            selectedNewBatterySlot={selectedNewBatterySlot}
            onComplete={() => {}}
          />
        );

      case 6:
        return (
          <ConfirmAndSave
            selectedStation={selectedStation}
            selectedTower={selectedTower}
            selectedNewBatterySlot={selectedNewBatterySlot}
            selectedEmptySlot={selectedEmptySlot}
            selectedVehicle={selectedVehicle}
            userContract={userContract}
            currentBatteryLevel={currentBatteryLevel}
            onError={(errorMsg) => setError(errorMsg)}
            onComplete={() => {
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
                oldBattery: getBatteryLevel(selectedVehicle, currentBatteryLevel),
                newBattery: newBatteryLevel,
                status: 'completed'
              });
              // Move to success screen
              setCurrentStep(6);
            }}
          />
        );
      // Success screen is shown outside of switch using currentStep state

      default:
        return null;
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <div className="battery-swap-container">
          {/* Header */}
          <div className="battery-swap-header">
            <h2 className="battery-swap-title">
              <span>🔋</span>
              Quy trình đổi pin
            </h2>
          </div>

          {/* Progress Bar */}
          <SwapProgressBar currentStep={currentStep} />

          {/* Content */}
          <div className="swap-content">
            {currentStep === 6 ? (
              <SwapSuccess
                swapResult={swapResult}
                selectedStation={selectedStation}
                selectedVehicle={selectedVehicle}
                currentBatteryLevel={currentBatteryLevel}
              />
            ) : (
              renderStepContent()
            )}
          </div>

          {/* Actions */}
          <div className="swap-actions">
            {currentStep === 1 && !loading && (
              <>
                <button className="btn-swap btn-back" onClick={handleFinish}>
                  Hủy
                </button>
                <button
                  className="btn-swap btn-next"
                  onClick={handleNext}
                  disabled={!selectedStation || !selectedTower}
                >
                  Tiếp tục →
                </button>
              </>
            )}

            {currentStep === 2 && (
              <>
                <button className="btn-swap btn-back" onClick={handleBack}>
                  ← Quay lại
                </button>
                <button className="btn-swap btn-confirm" onClick={handleNext}>
                  ✓ Xác nhận đổi pin
                </button>
              </>
            )}

            {currentStep === 3 && !loadingSlots && (
              <>
                <button className="btn-swap btn-back" onClick={handleBack}>
                  ← Quay lại
                </button>
                <button
                  className="btn-swap btn-next"
                  onClick={handleNext}
                  disabled={false}
                >
                  Tiếp tục →
                </button>
              </>
            )}

            {currentStep === 4 && (
              <>
                <button className="btn-swap btn-back" onClick={handleBack}>
                  ← Quay lại
                </button>
                <button className="btn-swap btn-next" onClick={handleNext}>
                  Tiếp tục →
                </button>
              </>
            )}

            {currentStep === 5 && (
              <button
                className="btn-swap btn-finish"
                onClick={() => setCurrentStep(6)}
              >
                🏁 Hoàn tất
              </button>
            )}

            {currentStep === 6 && (
              <button className="btn-swap btn-finish" onClick={handleFinish}>
                Về Dashboard
              </button>
            )}
          </div>
          <StaffAssistanceButton
            selectedStation={selectedStation}
            onRequestAssistance={() => alert('Đã gửi yêu cầu hỗ trợ đến nhân viên')}
            position="bottom"
          />
        </div>
    </div>
  );
};

export default SwapBatteryContainer;
