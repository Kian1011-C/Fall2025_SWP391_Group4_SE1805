// hooks/useSwapSteps.js
import { useState } from 'react';

// Định nghĩa các bước
export const STEPS = {
    SELECT_STATION: 'SELECT_STATION',   // Chọn trạm
    SELECT_TOWER: 'SELECT_TOWER',     // Chọn trụ
    PLACE_OLD_BATTERY: 'PLACE_OLD_BATTERY', // Đặt pin cũ
    PROCESSING: 'PROCESSING',         // Đang xử lý (Chờ BE)
    TAKE_NEW_BATTERY: 'TAKE_NEW_BATTERY',  // Lấy pin mới
    SUCCESS: 'SUCCESS',               // Thành công
};

export const useSwapSteps = (initialStep = STEPS.SELECT_STATION) => {
    const [currentStep, setCurrentStep] = useState(initialStep);

    const goToStep = (step) => {
        setCurrentStep(step);
    };

    const resetSteps = () => {
        setCurrentStep(STEPS.SELECT_STATION);
    };

    return {
        currentStep,
        STEPS,
        goToStep,
        resetSteps,
    };
};