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
    const [isCheckingVehicle, setIsCheckingVehicle] = React.useState(true);
    const [hasValidVehicle, setHasValidVehicle] = React.useState(false);
    
    // Kiểm tra selectedVehicle khi component mount
    useEffect(() => {
        const checkSelectedVehicle = async () => {
            setIsCheckingVehicle(true);
            
            try {
                const selectedVehicleStr = sessionStorage.getItem('selectedVehicle');
                
                // Nếu chưa có selectedVehicle, tự động lấy xe đầu tiên của user
                if (!selectedVehicleStr) {
                    console.warn('⚠️ Chưa chọn xe, đang kiểm tra danh sách xe...');
                    
                    try {
                        // Lấy userId từ localStorage (currentUser)
                        const currentUserStr = localStorage.getItem('currentUser');
                        if (!currentUserStr) {
                            console.error(' Không tìm thấy thông tin user');
                            alert('Phiên đăng nhập đã hết hạn.\nVui lòng đăng nhập lại.');
                            setIsCheckingVehicle(false);
                            navigate('/driver/dashboard', { replace: true });
                            return;
                        }
                        
                        const currentUser = JSON.parse(currentUserStr);
                        const userId = currentUser?.id;
                        
                        if (!userId) {
                            console.error(' Không tìm thấy userId trong currentUser');
                            alert('Phiên đăng nhập đã hết hạn.\nVui lòng đăng nhập lại.');
                            setIsCheckingVehicle(false);
                            navigate('/driver/dashboard', { replace: true });
                            return;
                        }
                        
                        // Import vehicleService để lấy danh sách xe
                        const { default: vehicleService } = await import('/src/assets/js/services/vehicleService.js');
                        
                        console.log('🔍 Kiểm tra vehicles của userId:', userId);
                        const response = await vehicleService.getUserVehicles(userId);
                        console.log('📋 API Response:', response);
                        
                        if (!response || !response.success || !response.data || response.data.length === 0) {
                            console.error(' User không có xe nào');
                            alert('Bạn chưa đăng ký xe nào.\nVui lòng đăng ký xe trước khi sử dụng dịch vụ đổi pin.');
                            setIsCheckingVehicle(false);
                            navigate('/driver/vehicles', { replace: true });
                            return;
                        }
                        
                        // Tìm xe có pin
                        const vehicleWithBattery = response.data.find(v => {
                            return v?.batteryId;
                        });
                        
                        if (!vehicleWithBattery) {
                            console.error(' Không có xe nào được gắn pin');
                            alert('Xe của bạn chưa được gắn pin.\nVui lòng liên hệ nhân viên.');
                            setIsCheckingVehicle(false);
                            navigate('/driver/vehicles', { replace: true });
                            return;
                        }
                        
                        console.log(' Tìm thấy xe có pin:', vehicleWithBattery);
                            
                        // Lưu vào sessionStorage
                        sessionStorage.setItem('selectedVehicle', JSON.stringify(vehicleWithBattery));
                        
                        const batteryId = vehicleWithBattery.batteryId;
                        
                        // Lưu batteryId
                        sessionStorage.setItem('old_battery_id', String(batteryId));
                        console.log(' Đã chọn xe có pin, batteryId:', batteryId);
                        
                        setHasValidVehicle(true);
                        setIsCheckingVehicle(false);
                        return;
                    } catch (apiError) {
                        console.error(' Lỗi API:', apiError);
                        alert('Không thể tải thông tin xe.\nVui lòng thử lại sau.');
                        setIsCheckingVehicle(false);
                        navigate('/driver/dashboard', { replace: true });
                        return;
                    }
                }
                
                // Nếu đã có selectedVehicle, kiểm tra pin
                const selectedVehicle = JSON.parse(selectedVehicleStr);
                const batteryId = selectedVehicle?.batteryId;
                
                if (!batteryId) {
                    console.warn(' Xe không có pin');
                    alert('Xe của bạn chưa được gắn pin.\nVui lòng liên hệ quản trị viên.');
                    setIsCheckingVehicle(false);
                    navigate('/driver/vehicles', { replace: true });
                    return;
                }
                
                console.log(' Vehicle hợp lệ, batteryId:', batteryId);
                sessionStorage.setItem('old_battery_id', String(batteryId));
                setHasValidVehicle(true);
                setIsCheckingVehicle(false);
            } catch (err) {
                console.error(' Exception:', err);
                alert('Có lỗi xảy ra. Vui lòng thử lại.');
                setIsCheckingVehicle(false);
                navigate('/driver/dashboard', { replace: true });
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
        // Hiển thị loading khi đang check vehicle
        if (isCheckingVehicle) {
            return (
                <div style={{ color: 'white', textAlign: 'center', padding: '60px 20px' }}>
                    <div style={{ fontSize: '48px', marginBottom: '20px' }}>🔍</div>
                    <h3 style={{ marginBottom: '10px' }}>Đang kiểm tra thông tin xe...</h3>
                    <p style={{ color: '#94a3b8' }}>Vui lòng đợi trong giây lát</p>
                </div>
            );
        }
        
        // Chặn render nếu không có vehicle hợp lệ
        if (!hasValidVehicle) {
            return null;
        }
        
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