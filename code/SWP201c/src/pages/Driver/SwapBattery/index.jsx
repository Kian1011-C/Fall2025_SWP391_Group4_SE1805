// Driver/SwapBattery/index.jsx
// Swap Battery page (refactored with separated concerns)
import React from 'react';
import { useLocation } from 'react-router-dom';
import '../../../assets/css/battery-swap.css';

// Hooks
import { useSwapProcess, useSwapHandlers, useSwapData } from './hooks';

// Components
import {
  SwapProgressBar,
  StepContentRenderer,
  StepActionsRenderer,
  StaffAssistanceButton
} from './components';

// Constants
import { SWAP_STEPS } from './utils/swapConstants';

const SwapBatteryContainer = () => {
  const location = useLocation();

  // Initialize swap process hook
  const swapProcess = useSwapProcess();

  // Initialize swap data hook
  const swapData = useSwapData(swapProcess.currentUser);

  // Initialize swap handlers hook
  const swapHandlers = useSwapHandlers(
    swapProcess.currentUser,
    swapProcess.selectedVehicle,
    swapProcess,
    swapData
  );

  // Destructure swap process
  const {
    selectedVehicle,
    currentBatteryLevel,
    swapId,
    apiError,
    isStartingSwap,
    swapSessionData,
    oldBatteryId,
    handleFinish
  } = swapProcess;

  // Destructure swap handlers
  const {
    stations,
    userContract,
    towers,
    loading,
    loadingTowers,
    loadingSlots,
    error,
    currentStep,
    selectedStation,
    selectedTower,
    selectedNewBatterySlot,
    selectedEmptySlot,
    handleSelectStation,
    handleSelectTower,
    handleNext,
    handleBack,
    handlePlaceOldBatteryComplete,
    handlePlaceOldBatteryError,
    handleSwapCompletionError,
    handleConfirmAndSaveComplete
  } = swapHandlers;

  // Initialize data when component mounts
  React.useEffect(() => {
    swapData.fetchInitialData(location.state?.selectedVehicle);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.state?.selectedVehicle]);

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
          {currentStep === SWAP_STEPS.COMPLETE ? (
            <StepContentRenderer
              currentStep={currentStep}
                selectedStation={selectedStation}
                selectedTower={selectedTower}
                selectedVehicle={selectedVehicle}
                swapId={swapId}
              onSwapCompletionError={handleSwapCompletionError}
              />
            ) : (
            <StepContentRenderer
              currentStep={currentStep}
              stations={stations}
              selectedStation={selectedStation}
              selectedVehicle={selectedVehicle}
              currentBatteryLevel={currentBatteryLevel}
              loading={loading}
              error={error}
              onSelectStation={handleSelectStation}
              onRetry={() => swapData.fetchInitialData(location.state?.selectedVehicle)}
              towers={towers}
              selectedTower={selectedTower}
              loadingTowers={loadingTowers}
              onSelectTower={handleSelectTower}
              onGoBack={() => swapHandlers.setCurrentStep(SWAP_STEPS.SELECT_STATION)}
              selectedNewBatterySlot={selectedNewBatterySlot}
              selectedEmptySlot={selectedEmptySlot}
              apiError={apiError}
              onStartSwap={handleNext}
              isStartingSwap={isStartingSwap}
              swapSessionData={swapSessionData}
              oldBatteryId={oldBatteryId}
              onPlaceOldBatteryComplete={handlePlaceOldBatteryComplete}
              onPlaceOldBatteryError={handlePlaceOldBatteryError}
              userContract={userContract}
              onConfirmAndSaveComplete={handleConfirmAndSaveComplete}
              onConfirmAndSaveError={(errorMsg) => swapHandlers.setError(errorMsg)}
            />
            )}
          </div>

          {/* Actions */}
          <div className="swap-actions">
          <StepActionsRenderer
            currentStep={currentStep}
            loading={loading}
            loadingSlots={loadingSlots}
            onBack={handleBack}
            onNext={handleNext}
            onFinish={handleFinish}
            onCancel={handleFinish}
          />
        </div>

        {/* Staff Assistance Button */}
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
