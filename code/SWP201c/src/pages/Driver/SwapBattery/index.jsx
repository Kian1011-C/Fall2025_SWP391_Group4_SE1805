// Driver/SwapBattery/index.jsx
// Swap Battery page (container inlined)
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import { swapService } from '../../../assets/js/services/index.js';
import { devLog } from '../../../assets/js/config/development';
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
  SwapCompletion,
  StaffAssistanceButton,
  ApiErrorModal
} from './components';

// Utils
import { getBatteryLevel } from './utils';
// import { swapService } from '../../../assets/js/services';

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
    swapResult: _swapResult,
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
  const [apiError, setApiError] = useState(null);
  const [showApiErrorModal, setShowApiErrorModal] = useState(false);
  
  // Start swap state
  const [isStartingSwap, setIsStartingSwap] = useState(false);
  const [_swapSessionData, setSwapSessionData] = useState(null);
  const [oldBatteryId, setOldBatteryId] = useState(null);
  const [_newBatteryData, setNewBatteryData] = useState(null);

  // Handle initiate swap
  const handleStartSwap = async () => {
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
        selectedSlotId: selectedNewBatterySlot?.slotId || selectedNewBatterySlot?.id
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
        
        // Continue to next step in the same page
        setCurrentStep(4); // Move to PlaceOldBattery step
      } else {
        throw new Error(response.message || 'Không thể khởi tạo quy trình đổi pin');
      }
    } catch (error) {
      console.error('❌ Error initiating swap:', error);
      setApiError(error.message || 'Lỗi khi khởi tạo quy trình đổi pin');
      setShowApiErrorModal(true);
    } finally {
      setIsStartingSwap(false);
    }
  };

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
      // Move to step 2 (choose tower)
      setCurrentStep(2);
      console.log('🏪 Station selected; moving to step 2 to choose tower');
    } else {
      console.log('❌ Station not active, cannot select');
      alert('Trạm này đang bảo trì. Vui lòng chọn trạm khác.');
    }
  };

  // Handle tower selection (stay in step 1 until user proceeds)
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
      // Move to step 3 after selecting tower
      setCurrentStep(3);
      console.log('🔌 Tower selected; moving to step 3');
    } else {
      console.log('❌ Tower not active, cannot select');
      alert('Trụ này không khả dụng. Vui lòng chọn trụ khác.');
    }
  };

  // Handle empty slot selection
  // Removed explicit empty slot selection handler in the new flow

  // Staff assistance popups removed – can integrate inline button later if needed

  // Handle navigation
  const handleNext = async () => {
    // New flow (6 steps):
    // 1) Chọn trạm → 2) Chọn trụ → 3) Đến trạm & xác nhận → 4) Bỏ pin cũ → 5) Nhận pin mới → 6) Hoàn tất
    if (currentStep === 1) {
      // Step 1: User selects station, then automatically moves to step 2
      // This is handled by handleSelectStation
      console.log('Step 1: Station selection handled by handleSelectStation');
    } else if (currentStep === 2) {
      // Step 2: User selects tower, then automatically moves to step 3
      // This is handled by handleSelectTower
      console.log('Step 2: Tower selection handled by handleSelectTower');
    } else if (currentStep === 3) {
      // Step 3: User clicks "Đổi pin" button to send swap request
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
          setCurrentStep(4);
          devLog('info', 'API call successful:', res.message);
        } else {
          // Handle API failure - show error modal
          devLog('error', 'Swap request failed:', res.message);
          setApiError({
            message: res.message || 'Lỗi khi gửi yêu cầu đổi pin',
            errorType: res.errorType || 'UNKNOWN'
          });
          setShowApiErrorModal(true);
          return; // Don't continue to next step
        }
      } catch (error) {
        devLog('error', 'Swap request error:', error);
        setApiError({
          message: error.message || 'Lỗi khi gửi yêu cầu đổi pin',
          errorType: 'UNKNOWN'
        });
        setShowApiErrorModal(true);
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
          </div>
        );

      case 2:
        return (
              <TowerSelector
                towers={towers}
                selectedStation={selectedStation}
                selectedTower={selectedTower}
                loadingTowers={loadingTowers}
                onSelectTower={handleSelectTower}
                onGoBack={() => setCurrentStep(1)}
              />
        );

      case 3:
        return (
          <div className="step-confirmation-container">
            <div className="step-confirmation-header">
              <div className="step-icon">📍</div>
              <h3 className="step-title">Đến trạm & xác nhận</h3>
            </div>
            
            <div className="step-confirmation-content">
              <div className="location-info">
                <div className="location-card">
                  <div className="location-icon">🏪</div>
                  <div className="location-details">
                    <div className="location-label">Trạm đã chọn</div>
                    <div className="location-value">{selectedStation?.name || '...'}</div>
                  </div>
                </div>
                
                <div className="location-card">
                  <div className="location-icon">🔌</div>
                  <div className="location-details">
                    <div className="location-label">Trụ sạc</div>
                    <div className="location-value">{selectedTower?.towerNumber || selectedTower?.name || selectedTower?.id || '...'}</div>
                  </div>
                </div>
              </div>
              
              <div className="instructions">
                <div className="instruction-item">
                  <div className="instruction-icon">✅</div>
                  <p>Kiểm tra biển báo trên trụ sạc để đảm bảo đúng vị trí</p>
                </div>
                <div className="instruction-item">
                  <div className="instruction-icon">📱</div>
                  <p>Nhấn nút "Đổi pin" để gửi yêu cầu đến hệ thống trạm</p>
                </div>
                <div className="instruction-item">
                  <div className="instruction-icon">🔋</div>
                  <p>Sau khi hệ thống xác nhận, bạn sẽ được hướng dẫn đặt pin cũ vào khoang</p>
                </div>
              </div>
            </div>
            
            <div className="step-confirmation-actions">
              <SwapConfirmation
                selectedStation={selectedStation}
                selectedTower={selectedTower}
                selectedVehicle={selectedVehicle}
                selectedNewBatterySlot={selectedNewBatterySlot}
                selectedEmptySlot={selectedEmptySlot}
                currentBatteryLevel={currentBatteryLevel}
                error={apiError}
                onStartSwap={handleStartSwap}
                isStartingSwap={isStartingSwap}
              />
            </div>
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
            swapSessionId={_swapSessionData?.swapSessionId}
            oldBatteryId={oldBatteryId}
            onComplete={(data) => {
              console.log('✅ Place old battery completed:', data);
              setNewBatteryData(data);
              setCurrentStep(5); // Move to TakeNewBattery step
            }}
            onError={(error) => {
              console.error('❌ Place old battery error:', error);
              setApiError(error.message || 'Lỗi khi đặt pin cũ');
              setShowApiErrorModal(true);
            }}
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
    <div style={{ 
      padding: '20px', 
      width: '100%', 
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
    }}>
      <div className="battery-swap-container" style={{ 
        maxWidth: 'none', 
        width: '100%',
        margin: '0 auto',
        maxHeight: 'none',
        overflowY: 'visible'
      }}>
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
              <SwapCompletion
                selectedStation={selectedStation}
                selectedTower={selectedTower}
                selectedVehicle={selectedVehicle}
                swapId={swapId}
                onError={(error) => {
                  console.error('❌ SwapCompletion error:', error);
                  setApiError(error.message || 'Lỗi khi hoàn tất đổi pin');
                  setShowApiErrorModal(true);
                }}
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
                {/* Step 1: Station selection handled by handleSelectStation */}
              </>
            )}

            {currentStep === 2 && (
              <>
                <button className="btn-swap btn-back" onClick={handleBack}>
                  ← Quay lại
                </button>
                {/* Step 2: Tower selection handled by handleSelectTower */}
              </>
            )}

            {currentStep === 3 && !loadingSlots && (
              <>
                <button className="btn-swap btn-back" onClick={handleBack}>
                  ← Quay lại
                </button>
                {/* Nút "Đổi pin" được hiển thị trong Step 3 content */}
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
        
        {/* API Error Modal */}
        <ApiErrorModal
          isOpen={showApiErrorModal}
          onClose={() => setShowApiErrorModal(false)}
          error={apiError}
          onRetry={() => {
            setShowApiErrorModal(false);
            // Retry the current step
            if (currentStep === 3) {
              handleNext();
            }
          }}
        />
    </div>
  );
};

export default SwapBatteryContainer;
