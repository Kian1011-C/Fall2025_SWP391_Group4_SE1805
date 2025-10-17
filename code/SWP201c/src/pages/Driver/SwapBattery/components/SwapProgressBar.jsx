// Swap Progress Bar Component
import React from 'react';

const SwapProgressBar = ({ currentStep }) => {
  const steps = [
    { number: 1, label: 'Chọn trạm' },
    { number: 2, label: 'Chọn trụ' },
    { number: 3, label: 'Đến trạm & xác nhận' },
    { number: 4, label: 'Đặt pin cũ' },
    { number: 5, label: 'Nhận pin mới' },
    { number: 6, label: 'Hoàn tất đổi pin' }
  ];

  return (
    <div className="swap-progress-bar">
      {steps.map((step) => (
        <div
          key={step.number}
          className={`progress-step ${currentStep >= step.number ? 'completed' : ''} ${
            currentStep === step.number ? 'active' : ''
          }`}
        >
          <div className="step-circle">
            {currentStep > step.number ? '✓' : step.number}
          </div>
          <span className="step-label">{step.label}</span>
        </div>
      ))}
    </div>
  );
};

export default SwapProgressBar;
