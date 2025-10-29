import React, { useContext, useState, useEffect } from 'react';
import { SwapContext } from '../index';
// import { apiUtils } from '/src/assets/js/config/api'; // Không cần - chỉ đọc từ sessionStorage
import '../../../../assets/css/TakeNewBattery.css';

const TakeNewBattery = () => {
    const { newBattery, completeSwap, isLoading, goToStep, STEPS } = useContext(SwapContext);
    const [newBatteryId, setNewBatteryId] = useState(null);
    const [loadingBattery, setLoadingBattery] = useState(true);
    const [error, setError] = useState(null);

    // ĐỌC THÔNG TIN TỪ SESSION STORAGE - KHÔNG GỌI API
    useEffect(() => {
        console.log('✅ TakeNewBattery: Đọc thông tin từ sessionStorage (không gọi API)');
        
        const newBatteryIdFromStorage = sessionStorage.getItem('new_battery_id');
        const newBatterySlotFromStorage = sessionStorage.getItem('newBatterySlot');
        const newBatteryLevelFromStorage = sessionStorage.getItem('newBatteryLevel');
        
        console.log('  - new_battery_id:', newBatteryIdFromStorage);
        console.log('  - newBatterySlot:', newBatterySlotFromStorage);
        console.log('  - newBatteryLevel:', newBatteryLevelFromStorage);
        
        if (newBatteryIdFromStorage) {
            setNewBatteryId(newBatteryIdFromStorage);
            setLoadingBattery(false);
        } else {
            console.error('❌ Không tìm thấy new_battery_id trong sessionStorage');
            setError('Không tìm thấy thông tin pin mới');
            setLoadingBattery(false);
        }
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

    // Lấy thông tin từ sessionStorage
    const newBatterySlot = sessionStorage.getItem('newBatterySlot');
    const newBatteryLevel = sessionStorage.getItem('newBatteryLevel');

    return (
        <div className="station-selector-container">
            <h2 className="station-selector-title">4. Lấy pin mới</h2>
            
            {/* Thông báo hệ thống đã chọn */}
            <div className="battery-selection-notice">
                <div className="notice-icon">🤖</div>
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
                        {newBatterySlot || newBattery?.newBatterySlot || '...'}
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
                        <span className="detail-label">Dung lượng:</span>
                        <span className="detail-value battery-level">
                            {newBatteryLevel || newBattery?.newBatteryPercent || 'Đang tải...'}%
                        </span>
                    </div>
                </div>

                {/* Thanh tiến trình dung lượng */}
                <div className="battery-level-bar">
                    <div 
                        className="battery-level-fill" 
                        style={{ 
                            width: `${newBatteryLevel || newBattery?.newBatteryPercent || 0}%` 
                        }}
                    ></div>
                </div>
            </div>

            {/* Thông báo xác nhận */}
            <div className="battery-confirmation">
                <div className="confirmation-icon">✅</div>
                    <div className="confirmation-text">
                        <strong>Pin đã sẵn sàng!</strong>
                        <p>ID: {newBatteryId} | Slot: {newBatterySlot} | Dung lượng: {newBatteryLevel}%</p>
                    </div>
            </div>

            {/* Nút hoàn thành - GỌI completeSwap */}
            <div className="battery-action">
                <button 
                    className="complete-battery-button"
                    onClick={async () => {
                        // GỌI API XÁC NHẬN - MỘT LẦN DUY NHẤT
                        console.log('🔄 Gọi completeSwap với tất cả dữ liệu...');
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
                            <span className="button-icon">🔋</span>
                            Tôi đã lấy pin mới rồi
                        </>
                    )}
                </button>
            </div>
        </div>
    );
};
export default TakeNewBattery;