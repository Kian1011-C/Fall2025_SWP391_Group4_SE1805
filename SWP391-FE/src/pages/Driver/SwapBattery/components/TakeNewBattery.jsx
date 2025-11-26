import React, { useContext, useState, useEffect } from 'react';
import { SwapContext } from '../index';
import batteryService from '../../../../assets/js/services/batteryService';
import '../../../../assets/css/TakeNewBattery.css';

const TakeNewBattery = () => {
    const { newBattery, completeSwap, isLoading, goToStep, STEPS } = useContext(SwapContext);
    const [newBatteryId, setNewBatteryId] = useState(null);
    const [newBatterySlot, setNewBatterySlot] = useState(null);
    const [newBatteryLevel, setNewBatteryLevel] = useState(null);
    const [newBatteryCapacity, setNewBatteryCapacity] = useState(null);
    const [loadingBattery, setLoadingBattery] = useState(true);
    const [error, setError] = useState(null);

    // GỌI API ĐỂ LẤY THÔNG TIN PIN MỚI THẬT TỪ BACKEND
    useEffect(() => {
        const fetchNewBatteryInfo = async () => {
            try {
                console.log(' TakeNewBattery: Lấy thông tin pin mới từ API');
                
                // Bước 1: Lấy batteryId từ sessionStorage
                const newBatteryIdFromStorage = sessionStorage.getItem('new_battery_id');
                const newBatterySlotFromStorage = sessionStorage.getItem('newBatterySlot');
                
                console.log('  - new_battery_id từ sessionStorage:', newBatteryIdFromStorage);
                console.log('  - newBatterySlot từ sessionStorage:', newBatterySlotFromStorage);
                
                if (!newBatteryIdFromStorage) {
                    console.error(' Không tìm thấy new_battery_id trong sessionStorage');
                    setError('Không tìm thấy thông tin pin mới');
                    setLoadingBattery(false);
                    return;
                }

                setNewBatteryId(newBatteryIdFromStorage);
                setNewBatterySlot(newBatterySlotFromStorage);

                // Bước 2: Gọi API để lấy thông tin chi tiết pin (CHỈ NẾU ID là số hợp lệ)
                //  Kiểm tra: Battery ID phải là số, không được là string như "BAT-SLOT-1"
                const isValidBatteryId = !isNaN(newBatteryIdFromStorage) && newBatteryIdFromStorage !== null;
                
                if (isValidBatteryId) {
                    console.log(' Gọi API getBatteryById để lấy thông tin pin mới:', newBatteryIdFromStorage);
                    const batteryResponse = await batteryService.getBatteryById(newBatteryIdFromStorage);
                    
                    if (batteryResponse.success && batteryResponse.data) {
                        const batteryData = batteryResponse.data;
                        
                        // Lấy dung lượng pin từ nhiều nguồn có thể (từ API thật)
                        const batteryLevel = batteryData.stateOfHealth || 
                                           batteryData.state_of_health || 
                                           batteryData.batteryLevel || 
                                           batteryData.battery_level ||
                                           batteryData.health || 100;
                        const batteryCapacity = batteryData.capacity || 100;
                        
                        console.log(' Đã lấy thông tin pin mới từ API:');
                        console.log('  - Battery ID:', newBatteryIdFromStorage);
                        console.log('  - Battery Level (THẬT từ API):', batteryLevel + '%');
                        console.log('  - Battery Capacity (Độ chai):', batteryCapacity + '%');
                        console.log('  - Full battery data:', batteryData);
                        
                        setNewBatteryLevel(batteryLevel);
                        setNewBatteryCapacity(batteryCapacity);
                        
                        // Cập nhật sessionStorage với dữ liệu từ API (để đảm bảo đồng bộ)
                        sessionStorage.setItem('newBatteryLevel', String(batteryLevel));
                    } else {
                        console.warn(' Không lấy được thông tin pin từ API, dùng dữ liệu từ sessionStorage');
                        // Fallback: dùng giá trị từ sessionStorage nếu API không trả về
                        const fallbackLevel = sessionStorage.getItem('newBatteryLevel');
                        setNewBatteryLevel(fallbackLevel ? parseInt(fallbackLevel) : 100);
                    }
                } else {
                    console.warn(' Battery ID không hợp lệ (không phải số):', newBatteryIdFromStorage);
                    console.warn('   Backend cần trả về batteryId thật từ API /api/driver/slots');
                    // Dùng dữ liệu fallback từ sessionStorage
                    const fallbackLevel = sessionStorage.getItem('newBatteryLevel');
                    setNewBatteryLevel(fallbackLevel ? parseInt(fallbackLevel) : 100);
                }
                
                setLoadingBattery(false);
            } catch (err) {
                console.error(' Lỗi khi lấy thông tin pin mới từ API:', err);
                
                // Fallback: dùng dữ liệu từ sessionStorage nếu API lỗi
                const fallbackLevel = sessionStorage.getItem('newBatteryLevel');
                const fallbackId = sessionStorage.getItem('new_battery_id');
                const fallbackSlot = sessionStorage.getItem('newBatterySlot');
                
                if (fallbackId) {
                    setNewBatteryId(fallbackId);
                    setNewBatterySlot(fallbackSlot);
                    setNewBatteryLevel(fallbackLevel ? parseInt(fallbackLevel) : 100);
                    console.warn(' Đã dùng dữ liệu fallback từ sessionStorage');
                } else {
                    setError('Không thể tải thông tin pin mới. Vui lòng thử lại.');
                }
                
                setLoadingBattery(false);
            }
        };

        fetchNewBatteryInfo();
    }, []);

    if (loadingBattery) {
        return (
            <div style={{ color: 'white', textAlign: 'center', padding: '40px' }}>
                Đang tải danh sách pin mới...
            </div>
        );
    }

    if (error) {
        return (
            <div style={{ color: 'red', textAlign: 'center', padding: '40px' }}>
                Lỗi: {error}
            </div>
        );
    }

    return (
        <div className="station-selector-container">
            <h2 className="station-selector-title">4. Lấy pin mới</h2>
            
            {/* Thông báo hệ thống đã chọn */}
            <div className="battery-selection-notice">
                <div className="notice-icon"></div>
                <div className="notice-text">
                    <h3>Hệ thống đã chọn pin sẵn sàng cho bạn</h3>
                    <p>Pin đã được quét và xác nhận trạng thái sẵn sàng</p>
                </div>
            </div>

            {/* Thông tin slot trống */}
            <div className="battery-compartment-card">
                <div className="compartment-header">
                    <span className="compartment-label">Slot pin đầy</span>
                    <div className="compartment-number">
                        {newBatterySlot || newBattery?.newBatterySlot || 'Đang tải...'}
                    </div>
                </div>
                <div className="compartment-indicator">
                    <div className="indicator-light"></div>
                    <span>Pin sẵn sàng</span>
                </div>
            </div>

            {/* Thông tin chi tiết pin */}
            <div className="battery-info-card">
                <h4 className="battery-info-title">Thông tin pin sẵn sàng</h4>
                
                <div className="battery-details">
                    <div className="detail-item">
                        <span className="detail-label">Mã pin:</span>
                        <span className="detail-value">{newBatteryId || newBattery?.newBatteryCode || 'Đang tải...'}</span>
                    </div>
                    
                    <div className="detail-item">
                        <span className="detail-label">Dung lượng (%):</span>
                        <span className="detail-value battery-level">
                            {newBatteryLevel !== null ? `${newBatteryLevel}%` : (newBattery?.newBatteryPercent ? `${newBattery.newBatteryPercent}%` : 'Đang tải...')}
                        </span>
                    </div>
                    
                    <div className="detail-item">
                        <span className="detail-label">Độ chai pin (%):</span>
                        <span className="detail-value">
                            {newBatteryCapacity !== null ? `${newBatteryCapacity}%` : 'Đang tải...'}
                        </span>
                    </div>
                </div>

                {/* Thanh tiến trình dung lượng */}
                <div className="battery-level-bar">
                    <div 
                        className="battery-level-fill" 
                        style={{ 
                            width: `${newBatteryLevel !== null ? newBatteryLevel : (newBattery?.newBatteryPercent || 0)}%` 
                        }}
                    ></div>
                </div>
            </div>

            {/* Thông báo xác nhận */}
            <div className="battery-confirmation">
                <div className="confirmation-icon"></div>
                    <div className="confirmation-text">
                        <strong>Pin đã sẵn sàng!</strong>
                        <p>ID: {newBatteryId || 'Đang tải...'} | Slot: {newBatterySlot || 'Đang tải...'} | Dung lượng: {newBatteryLevel !== null ? `${newBatteryLevel}%` : 'Đang tải...'}</p>
                    </div>
            </div>

            {/* Nút hoàn thành - GỌI completeSwap */}
            <div className="battery-action">
                <button 
                    className="complete-battery-button"
                    onClick={async () => {
                        // GỌI API XÁC NHẬN - MỘT LẦN DUY NHẤT
                        console.log(' Gọi completeSwap với tất cả dữ liệu...');
                        await completeSwap();
                        goToStep(STEPS.SUCCESS);
                    }} 
                    disabled={isLoading}
                >
                    {isLoading ? (
                        <>
                            <span className="loading-spinner"></span>
                            Đang xử lý...
                        </>
                    ) : (
                        <>
                            <span className="button-icon"></span>
                            Tôi đã lấy pin mới rồi
                        </>
                    )}
                </button>
            </div>
        </div>
    );
};
export default TakeNewBattery;