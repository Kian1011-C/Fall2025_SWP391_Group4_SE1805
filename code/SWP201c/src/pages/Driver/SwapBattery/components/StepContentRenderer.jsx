// Driver/SwapBattery/components/StepContentRenderer.jsx
// Component to render step content based on current step
import React from 'react';
import {
  StationSelector,
  TowerSelector,
  SwapConfirmation,
  PlaceOldBattery,
  TakeNewBattery,
  ConfirmAndSave,
  SwapCompletion
} from './index';
import { SWAP_STEPS } from '../utils/swapConstants';

const StepContentRenderer = ({
  currentStep,
  // Step 1 props
  stations,
  selectedStation,
  selectedVehicle,
  currentBatteryLevel,
  loading,
  error,
  onSelectStation,
  onRetry,
  // Step 2 props
  towers,
  selectedTower,
  loadingTowers,
  onSelectTower,
  onGoBack,
  // Step 3 props
  selectedNewBatterySlot,
  selectedEmptySlot,
  apiError,
  onStartSwap,
  isStartingSwap,
  // Step 4 props
  swapSessionData,
  oldBatteryId,
  onPlaceOldBatteryComplete,
  onPlaceOldBatteryError,
  // Step 5 props
  // Step 6 props
  // Step 6 completion props
  swapId,
  onSwapCompletionError
}) => {
  const renderStepContent = () => {
    switch (currentStep) {
      case SWAP_STEPS.SELECT_STATION:
        return (
          <div style={{ display: 'grid', gap: '20px' }}>
            <StationSelector
              stations={stations}
              selectedStation={selectedStation}
              selectedVehicle={selectedVehicle}
              currentBatteryLevel={currentBatteryLevel}
              loading={loading}
              error={error}
              onSelectStation={onSelectStation}
              onRetry={onRetry}
            />
          </div>
        );

      case SWAP_STEPS.SELECT_TOWER:
        return (
          <TowerSelector
            towers={towers}
            selectedStation={selectedStation}
            selectedTower={selectedTower}
            loadingTowers={loadingTowers}
            onSelectTower={onSelectTower}
            onGoBack={onGoBack}
          />
        );

      case SWAP_STEPS.CONFIRM_LOCATION:
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
                onStartSwap={onStartSwap}
                isStartingSwap={isStartingSwap}
              />
            </div>
          </div>
        );

      case SWAP_STEPS.PLACE_OLD_BATTERY:
        return (
          <PlaceOldBattery
            selectedStation={selectedStation}
            selectedTower={selectedTower}
            selectedEmptySlot={selectedEmptySlot}
            selectedVehicle={selectedVehicle}
            currentBatteryLevel={currentBatteryLevel}
            swapSessionId={swapSessionData?.swapSessionId}
            oldBatteryId={oldBatteryId}
            onComplete={onPlaceOldBatteryComplete}
            onError={onPlaceOldBatteryError}
          />
        );

      case SWAP_STEPS.TAKE_NEW_BATTERY:
        return (
          <TakeNewBattery
            selectedStation={selectedStation}
            selectedTower={selectedTower}
            selectedNewBatterySlot={selectedNewBatterySlot}
          />
        );

      case SWAP_STEPS.COMPLETE:
        return (
          <SwapCompletion
            selectedStation={selectedStation}
            selectedTower={selectedTower}
            selectedVehicle={selectedVehicle}
            swapId={swapId}
            onError={onSwapCompletionError}
          />
        );

      default:
        return null;
    }
  };

  return renderStepContent();
};

export default StepContentRenderer;
