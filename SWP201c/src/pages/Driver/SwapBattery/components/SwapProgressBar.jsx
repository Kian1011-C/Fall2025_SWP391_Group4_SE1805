// Swap Progress Bar Component
import React from 'react';

const SwapProgressBar = ({ currentStep }) => {
  const steps = [
    { number: 1, label: 'Tìm/đặt trạm' },
    { number: 2, label: 'Quét QR đăng nhập' },
    { number: 3, label: 'Chọn Đổi pin' },
    { number: 4, label: 'Bỏ pin cũ' },
    { number: 5, label: 'Nhận pin đầy' },
    { number: 6, label: 'Lắp pin & hoàn tất' }
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
