// pages/Driver/SwapBattery/index.jsx
import React, { useEffect } from 'react';
import { FiBattery } from 'react-icons/fi';
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
        const checkSelectedVehicle = async () => {
            try {
                const selectedVehicleStr = sessionStorage.getItem('selectedVehicle');
                
                // Nếu chưa có selectedVehicle, tự động lấy xe đầu tiên của user
                if (!selectedVehicleStr) {
                    console.warn(' Chưa chọn xe, đang tự động lấy xe đầu tiên...');
                    
                    try {
                        // Import vehicleService để lấy danh sách xe
                        const { default: vehicleService } = await import('/src/assets/js/services/vehicleService.js');
                        const userId = sessionStorage.getItem('userId') || sessionStorage.getItem('UserID') || 'driver001';
                        
                        const response = await vehicleService.getUserVehicles(userId);
                        
                        if (response && response.success && response.data && response.data.length > 0) {
                            const firstVehicle = response.data[0];
                            console.log(' Tự động chọn xe đầu tiên:', firstVehicle);
                            
                            // Lưu vào sessionStorage
                            sessionStorage.setItem('selectedVehicle', JSON.stringify(firstVehicle));
                            
                            // Kiểm tra xe có pin không
                            const batteryId = firstVehicle?.batteryId || 
                                             firstVehicle?.currentBatteryId || 
                                             firstVehicle?.current_battery_id ||
                                             firstVehicle?.battery?.id;
                            
                            if (!batteryId) {
                                console.warn(' Xe đầu tiên chưa có pin');
                                alert('Xe của bạn chưa được gắn pin.\nVui lòng kiểm tra lại thông tin xe.');
                                navigate('/driver/dashboard');
                                return;
                            }
                            
                            // Lưu batteryId
                            sessionStorage.setItem('old_battery_id', String(batteryId));
                            console.log(' Đã tự động chọn xe có pin, batteryId:', batteryId);
                            return; // OK, tiếp tục flow
                        } else {
                            console.error(' Không tìm thấy xe nào');
                            alert('Bạn chưa có xe nào.\nVui lòng thêm xe trước khi đổi pin.');
                            navigate('/driver/dashboard');
                            return;
                        }
                    } catch (apiError) {
                        console.error(' Lỗi khi lấy danh sách xe:', apiError);
                        alert('Không thể tải thông tin xe.\nVui lòng thử lại.');
                        navigate('/driver/dashboard');
                        return;
                    }
                }
                
                // Nếu đã có selectedVehicle, kiểm tra pin
                const selectedVehicle = JSON.parse(selectedVehicleStr);
                const batteryId = selectedVehicle?.batteryId || 
                                 selectedVehicle?.currentBatteryId || 
                                 selectedVehicle?.current_battery_id ||
                                 selectedVehicle?.battery?.id;
                
                if (!batteryId) {
                    console.warn(' Xe chưa có pin (batteryId null), redirect về Dashboard');
                    alert('Xe của bạn chưa được gắn pin.\nVui lòng kiểm tra lại thông tin xe.');
                    navigate('/driver/dashboard');
                    return;
                }
                
                console.log(' selectedVehicle hợp lệ, batteryId:', batteryId);
                // Lưu batteryId vào session để useSwapData dùng
                sessionStorage.setItem('old_battery_id', String(batteryId));
            } catch (err) {
                console.error(' Lỗi khi kiểm tra selectedVehicle:', err);
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
        // Xóa session NHƯNG GIỮ LẠI selectedVehicle và vehicleNeedsReload
        try {
            // Backup selectedVehicle và vehicleNeedsReload trước khi clear
            const selectedVehicleBackup = sessionStorage.getItem('selectedVehicle');
            const vehicleNeedsReloadBackup = sessionStorage.getItem('vehicleNeedsReload');
            
            // Clear các session keys liên quan đến swap
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
            
            // GIỮ LẠI selectedVehicle và vehicleNeedsReload (đã được cập nhật trong useSwapData)
            if (selectedVehicleBackup) {
                sessionStorage.setItem('selectedVehicle', selectedVehicleBackup);
            }
            if (vehicleNeedsReloadBackup) {
                sessionStorage.setItem('vehicleNeedsReload', vehicleNeedsReloadBackup);
            }
            
            console.log(' Đã xóa swap session, giữ lại selectedVehicle và vehicleNeedsReload');
        } catch (error) {
            console.error(' Lỗi khi xóa sessionStorage:', error);
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