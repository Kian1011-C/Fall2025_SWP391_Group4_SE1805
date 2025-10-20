// Driver/SwapBattery/components/StepActionsRenderer.jsx
// Component to render step actions based on current step
import React from 'react';
import { SWAP_STEPS } from '../utils/swapConstants';

const StepActionsRenderer = ({
  currentStep,
  loading,
  loadingSlots,
  onBack,
  onNext,
  onFinish,
  onCancel
}) => {
  const renderActions = () => {
    switch (currentStep) {
      case SWAP_STEPS.SELECT_STATION:
        return (
          !loading && (
            <>
              <button className="btn-swap btn-back" onClick={onCancel}>
                Hủy
              </button>
              {/* Step 1: Station selection handled by handleSelectStation */}
            </>
          )
        );

      case SWAP_STEPS.SELECT_TOWER:
        return (
          <>
            <button className="btn-swap btn-back" onClick={onBack}>
              ← Quay lại
            </button>
            {/* Step 2: Tower selection handled by handleSelectTower */}
          </>
        );

      case SWAP_STEPS.CONFIRM_LOCATION:
        return (
          !loadingSlots && (
            <>
              <button className="btn-swap btn-back" onClick={onBack}>
                ← Quay lại
              </button>
              {/* Nút "Đổi pin" được hiển thị trong Step 3 content */}
            </>
          )
        );

      case SWAP_STEPS.PLACE_OLD_BATTERY:
        return (
          <>
            <button className="btn-swap btn-back" onClick={onBack}>
              ← Quay lại
            </button>
            <button className="btn-swap btn-next" onClick={onNext}>
              Tiếp tục →
            </button>
          </>
        );

            case SWAP_STEPS.TAKE_NEW_BATTERY:
              return (
                <button
                  className="btn-swap btn-next"
                  onClick={onNext}
                  disabled={loadingSlots}
                >
                  Tiếp tục →
                </button>
              );

      case SWAP_STEPS.COMPLETE:
        return (
          <button className="btn-swap btn-finish" onClick={onFinish}>
            Hoàn tất đổi pin
          </button>
        );

      default:
        return null;
    }
  };

  return <>{renderActions()}</>;
};

export default StepActionsRenderer;
