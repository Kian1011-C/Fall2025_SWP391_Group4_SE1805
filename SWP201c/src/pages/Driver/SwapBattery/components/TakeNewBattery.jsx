import React, { useContext, useState, useEffect } from 'react';
import { SwapContext } from '../index';
import { apiUtils } from '/src/assets/js/config/api';

const TakeNewBattery = () => {
    const { newBattery, completeSwap, isLoading } = useContext(SwapContext);
    const [newBatteryId, setNewBatteryId] = useState(null);
    const [loadingBattery, setLoadingBattery] = useState(true);
    const [error, setError] = useState(null);

    // GỌI API LẤY DANH SÁCH PIN MỚI CÓ SẴN
    useEffect(() => {
        const fetchAvailableBatteries = async () => {
            try {
                setLoadingBattery(true);
                setError(null);
                
                // Lấy thông tin trụ đã chọn từ sessionStorage
                const savedCabinet = sessionStorage.getItem('selectedCabinet');
                if (!savedCabinet) {
                    console.error('Không tìm thấy thông tin trụ');
                    setError('Không tìm thấy thông tin trụ');
                    return;
                }
                
                const cabinet = JSON.parse(savedCabinet);
                const towerId = cabinet.id || cabinet.cabinetId;
                
                console.log('Đang gọi API lấy danh sách pin mới cho towerId:', towerId);
                
                // Gọi API GET /api/driver/slots?towerId={towerId}
                const response = await apiUtils.get(`/api/driver/slots?towerId=${towerId}`);
                
                console.log('Response từ API slots:', response);
                
                // Lọc ra những khe cắm có pin với trạng thái AVAILABLE
                const availableSlots = response.filter(slot => 
                    slot.status === 'AVAILABLE' || slot.status === 'available'
                );
                
                console.log('Danh sách khe cắm có sẵn:', availableSlots);
                
                if (availableSlots.length > 0) {
                    // Chọn pin đầu tiên có sẵn
                    const selectedSlot = availableSlots[0];
                    const batteryId = selectedSlot.batteryId || selectedSlot.battery_id;
                    
                    console.log('Đã chọn pin mới:', selectedSlot);
                    console.log('newBatteryId:', batteryId);
                    
                    // Lưu newBatteryId vào sessionStorage
                    sessionStorage.setItem('newBatteryId', batteryId);
                    console.log('Đã lưu newBatteryId vào sessionStorage:', batteryId);
                    
                    setNewBatteryId(batteryId);
                } else {
                    console.warn('Không có pin nào có sẵn');
                    setError('Không có pin nào có sẵn trong trụ này');
                }
                
            } catch (err) {
                console.error('Lỗi khi lấy danh sách pin mới:', err);
                setError('Không thể lấy danh sách pin mới');
                
                // Fallback: tạo newBatteryId giả lập
                const fallbackBatteryId = `NEW-BAT-${Date.now()}`;
                sessionStorage.setItem('newBatteryId', fallbackBatteryId);
                setNewBatteryId(fallbackBatteryId);
                console.log('Sử dụng newBatteryId giả lập:', fallbackBatteryId);
            } finally {
                setLoadingBattery(false);
            }
        };

        fetchAvailableBatteries();
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
        <div>
            <h2>4. Mời lấy pin mới từ hộc:</h2>
            <h1 style={{ fontSize: '3rem', color: 'green' }}>{newBattery?.newBatterySlot || '...'}</h1>
            
            <h4>Thông tin pin mới:</h4>
            <p>Mã pin: {newBatteryId || newBattery?.newBatteryCode || 'Đang tải...'}</p>
            <p>% pin: {newBattery?.newBatteryPercent || 'Đang tải...'}%</p>
            
            <div style={{ marginTop: '20px', padding: '10px', backgroundColor: '#f0f0f0', borderRadius: '5px' }}>
                <small style={{ color: '#666' }}>
                    newBatteryId từ API: {newBatteryId}
                </small>
            </div>
            
            <button onClick={completeSwap} disabled={isLoading} style={{marginTop: '20px'}}>
                Tôi đã lấy pin (Hoàn tất)
            </button>
        </div>
    );
};
export default TakeNewBattery;