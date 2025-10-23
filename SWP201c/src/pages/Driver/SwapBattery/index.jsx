// pages/Driver/SwapBattery/index.jsx
import React from 'react';
import { useSwapSteps } from './hooks/useSwapSteps'; 
// BẠN CŨNG CẦN DÒNG NÀY:
import { useSwapData } from './hooks/useSwapData';
import '../../../assets/css/battery-swap.css';
// Import các components UI của bạn
// Bạn có thể dùng file components/index.js để import gọn hơn
import StationSelector from './components/StationSelector';
import TowerSelector from './components/TowerSelector';
import PlaceOldBattery from './components/PlaceOldBattery';
import TakeNewBattery from './components/TakeNewBattery';
import SwapSuccess from './components/SwapSuccess';
import SwapProcessing from './components/SwapProcessing';
import SwapProgressBar from './components/SwapProgressBar';
// import StaffAssistanceButton from './components/StaffAssistanceButton';

// Tạo Context để truyền props
export const SwapContext = React.createContext();

const SwapBatteryPage = () => {
    // 1. Gọi hook quản lý BƯỚC
    const { currentStep, STEPS, goToStep, resetSteps } = useSwapSteps();
    
    // 2. Gọi hook quản lý DỮ LIỆU/API
    const dataProps = useSwapData(goToStep, STEPS);

    // 3. Kết hợp các props từ 2 hooks lại
    const providerValue = {
        currentStep,
        STEPS,
        goToStep,
        ...dataProps, // Gồm: isLoading, error, transaction, newBattery, v.v.
    };
    
    // Hàm reset tổng
    const handleReset = () => {
        resetSteps();
        dataProps.resetSwapData();
    };

    // 4. Quyết định render component nào
    const renderCurrentStep = () => {
        // Ưu tiên hiển thị lỗi nếu có
        if (dataProps.error) {
            return (
                <div>
                    <h2>Đã xảy ra lỗi!</h2>
                    <p>{dataProps.error}</p>
                    <button onClick={() => dataProps.setError(null)}>Đã hiểu</button>
                </div>
            );
        }
        
        // Nếu đang tải, hiển thị màn hình Processing
        // (Component này sẽ che màn hình hiện tại)
        if (dataProps.isLoading) {
            return <SwapProcessing />;
        }

        switch (currentStep) {
            case STEPS.SELECT_STATION:
                return <StationSelector />;
            case STEPS.SELECT_TOWER:
                return <TowerSelector />;
            case STEPS.PLACE_OLD_BATTERY:
                return <PlaceOldBattery />;
            case STEPS.TAKE_NEW_BATTERY:
                return <TakeNewBattery />;
            case STEPS.SUCCESS:
                return <SwapSuccess onFinish={handleReset} />;
            default:
                return <div>Lỗi: Bước không xác định</div>;
        }
    };

    return (
        // 5. Cung cấp "Context" cho tất cả component con
        <SwapContext.Provider value={providerValue}>
            <div className="swap-battery-container" style={{ padding: '20px' }}>
                <SwapProgressBar />
                <div className="swap-content" style={{ marginTop: '20px' }}>
                    {renderCurrentStep()}
                </div>
                {/* Nút trợ giúp luôn hiển thị */}
                {/* <StaffAssistanceButton /> */}
            </div>
        </SwapContext.Provider>
    );
};

export default SwapBatteryPage;