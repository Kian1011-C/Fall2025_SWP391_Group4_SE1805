// pages/Driver/SwapBattery/index.jsx
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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
    const navigate = useNavigate();
    
    // Kiểm tra selectedVehicle khi component mount
    useEffect(() => {
        const checkSelectedVehicle = () => {
            try {
                const selectedVehicleStr = sessionStorage.getItem('selectedVehicle');
                if (!selectedVehicleStr) {
                    console.warn('⚠️ Không tìm thấy selectedVehicle, redirect về Dashboard');
                    alert('Vui lòng chọn xe trước khi đổi pin');
                    navigate('/driver/dashboard');
                    return;
                }
                
                const selectedVehicle = JSON.parse(selectedVehicleStr);
                const batteryId = selectedVehicle?.batteryId || 
                                 selectedVehicle?.currentBatteryId || 
                                 selectedVehicle?.current_battery_id ||
                                 selectedVehicle?.battery?.id;
                
                if (!batteryId) {
                    console.warn('⚠️ Xe chưa có pin (batteryId null), redirect về Dashboard');
                    alert('Xe của bạn chưa được gắn pin.\nVui lòng kiểm tra lại thông tin xe.');
                    navigate('/driver/dashboard');
                    return;
                }
                
                console.log('✅ selectedVehicle hợp lệ, batteryId:', batteryId);
                // Lưu batteryId vào session để useSwapData dùng
                sessionStorage.setItem('old_battery_id', String(batteryId));
            } catch (err) {
                console.error('❌ Lỗi khi kiểm tra selectedVehicle:', err);
                alert('Có lỗi xảy ra. Vui lòng thử lại.');
                navigate('/driver/dashboard');
            }
        };
        
        checkSelectedVehicle();
    }, [navigate]);
    
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
    
    // Hàm điều hướng về dashboard
    const handleGoToDashboard = () => {
        // Xóa session trước khi điều hướng
        try {
            sessionStorage.removeItem('selectedStation');
            sessionStorage.removeItem('selectedCabinet');
            sessionStorage.removeItem('EmptySlot');
            sessionStorage.removeItem('oldBatteryId');
            sessionStorage.removeItem('newBatteryId');
            sessionStorage.removeItem('newBatterySlot');
            sessionStorage.removeItem('newBatteryLevel');
            sessionStorage.removeItem('emptySlotNumber');
            sessionStorage.removeItem('UserID');
            sessionStorage.removeItem('contractID');
            sessionStorage.removeItem('vehicleID');
            sessionStorage.removeItem('stationID');
            sessionStorage.removeItem('towerID');
            sessionStorage.removeItem('old_battery_id');
            sessionStorage.removeItem('new_battery_id');
            sessionStorage.removeItem('distance_used');
            sessionStorage.removeItem('swapId');
            console.log('Đã xóa tất cả sessionStorage khi về dashboard');
        } catch (error) {
            console.error('Lỗi khi xóa sessionStorage:', error);
        }
        
        // Điều hướng về dashboard
        navigate('/driver/dashboard');
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
                return <SwapSuccess onFinish={handleGoToDashboard} />;
            default:
                return <div>Lỗi: Bước không xác định</div>;
        }
    };

    return (
        <div className="swap-battery-container" style={{ padding: '20px' }}>
            {/* 5. Cung cấp "Context" cho tất cả component con */}
            <SwapContext.Provider value={providerValue}>
                <SwapProgressBar />
                <div className="swap-content" style={{ marginTop: '20px' }}>
                    {renderCurrentStep()}
                </div>
                {/* Nút trợ giúp luôn hiển thị */}
                {/* <StaffAssistanceButton /> */}
            </SwapContext.Provider>
        </div>
    );
};

export default SwapBatteryPage;