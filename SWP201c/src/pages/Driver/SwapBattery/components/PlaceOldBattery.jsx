// src/pages/Driver/SwapBattery/components/PlaceOldBattery.jsx
import React, { useContext, useState, useEffect } from 'react'; // Add useEffect
import { SwapContext } from '../index'; 

const PlaceOldBattery = () => {
    // 1. GET DATA FROM CONTEXT
    const { transaction, isLoading, goToStep, STEPS } = useContext(SwapContext);

    // 2. STATE FOR THE FORM
    const [code, setCode] = useState(''); // Real ID
    const [percent, setPercent] = useState(0); // Initialize percentage state
    const [isPercentGenerated, setIsPercentGenerated] = useState(false); // Flag to ensure random generation happens only once
    const [selectedVehicle, setSelectedVehicle] = useState(null); // Vehicle data

    // 3. LOAD VEHICLE DATA AND SET BATTERY CODE
    useEffect(() => {
        try {
            // KIỂM TRA XEM CÓ BATTERY ID ĐÃ LƯU TRƯỚC ĐÓ KHÔNG
            const savedBatteryId = sessionStorage.getItem('oldBatteryId');
            if (savedBatteryId) {
                setCode(savedBatteryId);
                console.log('Đã load lại batteryId từ sessionStorage:', savedBatteryId);
                return; // Không cần load từ vehicle nữa
            }
            
            const vehicleStr = sessionStorage.getItem('selectedVehicle');
            console.log('Vehicle string from sessionStorage:', vehicleStr);
            
            if (vehicleStr) {
                const vehicle = JSON.parse(vehicleStr);
                
                // Bổ sung thông tin pin nếu chưa có
                const enhancedVehicle = {
                    ...vehicle,
                    current_battery_id: vehicle.current_battery_id || vehicle.batteryId || vehicle.id || 20,
                    batteryCode: vehicle.batteryCode || `BAT-${vehicle.batteryId || vehicle.id || '001'}`,
                    battery_code: vehicle.battery_code || `BAT-${vehicle.batteryId || vehicle.id || '001'}`,
                    batteryLevel: vehicle.batteryLevel || 85, // Mặc định 85%
                    battery_level: vehicle.battery_level || 85
                };
                
                setSelectedVehicle(enhancedVehicle);
                console.log('Đã load thông tin xe:', enhancedVehicle);
                console.log('batteryId từ sessionStorage:', vehicle.batteryId);
                console.log('current_battery_id:', enhancedVehicle.current_battery_id);
                console.log('batteryCode:', enhancedVehicle.batteryCode);
                console.log('battery_code:', enhancedVehicle.battery_code);
                
                // Lấy mã pin từ xe đã chọn với debug chi tiết
                let batteryCode = 'N/A';
                
                // Ưu tiên batteryId từ sessionStorage trước
                if (vehicle.batteryId) {
                    batteryCode = String(vehicle.batteryId);
                    console.log('Sử dụng batteryId từ sessionStorage:', batteryCode);
                } else if (enhancedVehicle.current_battery_id) {
                    batteryCode = String(enhancedVehicle.current_battery_id);
                    console.log('Sử dụng current_battery_id:', batteryCode);
                } else if (enhancedVehicle.batteryCode) {
                    batteryCode = String(enhancedVehicle.batteryCode);
                    console.log('Sử dụng batteryCode:', batteryCode);
                } else if (enhancedVehicle.battery_code) {
                    batteryCode = String(enhancedVehicle.battery_code);
                    console.log('Sử dụng battery_code:', batteryCode);
                } else {
                    console.log('Không tìm thấy mã pin, tạo mã pin giả lập');
                    // Tạo mã pin giả lập dựa trên ID xe
                    batteryCode = `BAT-${enhancedVehicle.id || '001'}`;
                    console.log('Tạo mã pin giả lập:', batteryCode);
                }
                
                setCode(batteryCode);
                console.log('Mã pin cuối cùng:', batteryCode);
                
                // LƯU BATTERY ID VÀO SESSION STORAGE
                try {
                    sessionStorage.setItem('oldBatteryId', batteryCode);
                    console.log('Đã lưu batteryId vào sessionStorage:', batteryCode);
                } catch (error) {
                    console.error('Lỗi khi lưu batteryId vào sessionStorage:', error);
                }
            } else {
                console.log('Không có dữ liệu xe trong sessionStorage');
                setCode('N/A');
            }
        } catch (error) {
            console.error('Lỗi khi load thông tin xe:', error);
            setCode('N/A');
        }
    }, []);

    // 4. GENERATE RANDOM PERCENTAGE ON MOUNT
    useEffect(() => {
        if (!isPercentGenerated) {
            // Generate a random integer between 5 and 60 (simulating a used battery)
            const randomPercent = Math.floor(Math.random() * 56) + 5; // Generates 5 to 60
            setPercent(randomPercent);
            setIsPercentGenerated(true); // Mark as generated
            console.log(`Simulated old battery percentage: ${randomPercent}%`);
        }
    }, [isPercentGenerated]); // Run only when isPercentGenerated changes

    // 4. HANDLE SUBMIT
    const handleSubmit = (e) => {
        e.preventDefault();
        // Chỉ chuyển bước, không gọi confirmSwap ở đây
        goToStep(STEPS.TAKE_NEW_BATTERY);
        console.log('Đã đặt pin cũ, chuyển sang bước lấy pin mới.');
    };

    // Get the empty slot number
    const emptySlotNumber = transaction?.emptySlot || '...';

    return (
        <div className="station-selector-container">
            <h2 className="station-selector-title">3. Trả pin cũ</h2>

            <div className="place-battery-card">
                <p className="place-battery-label">Mời bạn đặt pin cũ vào hộc số:</p>
                <h1 className="place-battery-slot-number">{emptySlotNumber}</h1>

                {/* Simulation Form */}
                <form onSubmit={handleSubmit} className="simulation-form">
                    <p className="simulation-label">Thông tin pin cũ (Mô phỏng):</p>
                     <div className="form-group">
                         <label htmlFor="batCode">Mã/ID pin cũ:</label>
                         <input
                             type="text"
                             id="batCode"
                             value={code} // Display real ID
                             readOnly // Make ID read-only
                             className="readonly-input" // Add a class for styling
                         />
                         {selectedVehicle && (
                             <small style={{ color: '#9ca3af', fontSize: '12px' }}>
                                 Từ xe {selectedVehicle.plateNumber || selectedVehicle.model}
                             </small>
                         )}
                     </div>
                    <div className="form-group">
                        <label htmlFor="batPercent">% pin cũ (Đã quét - Random):</label>
                        <input
                            type="number"
                            id="batPercent"
                            value={percent} // Display random percentage
                            readOnly // Make percentage read-only
                            className="readonly-input" // Add a class for styling
                        />
                    </div>

                    <button
                        type="submit"
                        className="place-battery-button"
                        disabled={isLoading}
                    >
                        {isLoading ? "Đang xác nhận..." : "Tôi đã đặt pin"}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default PlaceOldBattery;