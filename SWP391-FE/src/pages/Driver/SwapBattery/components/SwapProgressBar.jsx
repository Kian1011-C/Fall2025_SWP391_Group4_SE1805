// components/SwapProgressBar.jsx
import React, { useContext } from 'react';
import { SwapContext } from '../index'; 

const stepLabels = {
  SELECT_STATION: 'Chọn trạm',
  SELECT_TOWER: 'Chọn trụ',
  PLACE_OLD_BATTERY: 'Trả pin cũ',
  TAKE_NEW_BATTERY: 'Lấy pin mới',
  SUCCESS: 'Hoàn thành',
};
const STEP_ORDER = [
  'SELECT_STATION',
  'SELECT_TOWER',
  'PLACE_OLD_BATTERY',
  'TAKE_NEW_BATTERY',
  'SUCCESS',
];

const SwapProgressBar = () => {
    const context = useContext(SwapContext);
    
    // Fallback nếu context chưa sẵn sàng
    if (!context) {
        console.warn('SwapProgressBar: SwapContext is not available');
        return (
            <div className="swap-progress-bar">
                <h2 className="progress-bar-title">Tiến trình đổi pin</h2>
                <div className="progress-steps-container">
                    <div className="progress-step">
                        <div className="step-circle">1</div>
                        <span className="step-label">Đang tải...</span>
                    </div>
                </div>
            </div>
        );
    }
    
    const { currentStep, STEPS } = context;

    const effectiveStep = currentStep === STEPS.PROCESSING 
      ? STEP_ORDER[STEP_ORDER.indexOf(currentStep) - 1] 
      : currentStep;
      
    const currentStepIndex = STEP_ORDER.indexOf(effectiveStep);

    return (
        <div className="swap-progress-bar">
            <h2 className="progress-bar-title">Tiến trình đổi pin</h2>
            <div className="progress-steps-container">
                {STEP_ORDER.map((step, index) => {
                    const isCompleted = index < currentStepIndex;
                    const isCurrent = index === currentStepIndex;

                    let circleClass = 'step-circle';
                    if (isCompleted) circleClass += ' completed';
                    else if (isCurrent) circleClass += ' current';

                    let labelClass = 'step-label';
                    if (isCurrent) labelClass += ' current';

                    return (
                        <React.Fragment key={step}>
                            {index > 0 && (
                                <div className={`step-line ${isCompleted ? 'completed' : ''}`}></div>
                            )}
                            <div className="progress-step">
                                <div className={circleClass}>
                                    {isCompleted ? '✔' : index + 1}
                                </div>
                                <span className={labelClass}>
                                    {stepLabels[step]}
                                </span>
                            </div>
                        </React.Fragment>
                    );
                })}
            </div>
        </div>
    );
};
export default SwapProgressBar;