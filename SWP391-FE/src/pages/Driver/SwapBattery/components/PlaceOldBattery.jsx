// src/pages/Driver/SwapBattery/components/PlaceOldBattery.jsx
import React, { useContext, useState, useEffect } from 'react'; // Add useEffect
import { SwapContext } from '../index';
import batteryService from '/src/assets/js/services/batteryService.js'; 

const PlaceOldBattery = () => {
    // 1. GET DATA FROM CONTEXT
    const { transaction, isLoading, goToStep, STEPS, selectNewBatteryFromTower } = useContext(SwapContext);

    // 2. STATE FOR THE FORM
    const [code, setCode] = useState(''); // Real ID
    const [percent, setPercent] = useState(0); // Initialize percentage state
    const [capacity, setCapacity] = useState(null); // Battery capacity (độ chai pin)
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
                    current_battery_id: vehicle.current_battery_id || vehicle.batteryId || vehicle.id || null,
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
                    console.error(' Không tìm thấy mã pin trong dữ liệu xe');
                    console.error('Dữ liệu xe:', enhancedVehicle);
                    throw new Error('Không tìm thấy mã pin của xe. Vui lòng kiểm tra dữ liệu API.');
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

    // 4. LẤY DUNG LƯỢNG PIN CŨ THẬT TỪ API
    useEffect(() => {
        const fetchOldBatteryLevel = async () => {
            if (!isPercentGenerated && code && code !== 'N/A') {
                try {
                    console.log(' Lấy thông tin pin cũ từ API cho batteryId:', code);
                    console.log(' API endpoint sẽ gọi: GET /api/batteries/' + code);
                    
                    // Lấy thông tin pin cũ từ API
                    const batteryResponse = await batteryService.getBatteryById(code);
                    
                    console.log(' API response cho pin cũ:', batteryResponse);
                    console.log(' batteryResponse.success:', batteryResponse.success);
                    console.log(' batteryResponse.data:', batteryResponse.data);
                    
                    if (batteryResponse.success && batteryResponse.data) {
                        const batteryData = batteryResponse.data;
                        console.log(' batteryData chi tiết:', batteryData);
                        
                        const batteryLevel = batteryData.stateOfHealth || batteryData.state_of_health || 
                                          batteryData.batteryLevel || batteryData.battery_level || 0;
                        const batteryCapacity = batteryData.capacity || 100;
                        
                        console.log(' Dung lượng pin cũ từ API:', batteryLevel);
                        console.log(' Độ chai pin cũ từ API:', batteryCapacity);
                        console.log(' Các trường có sẵn:', {
                            stateOfHealth: batteryData.stateOfHealth,
                            state_of_health: batteryData.state_of_health,
                            batteryLevel: batteryData.batteryLevel,
                            battery_level: batteryData.battery_level,
                            capacity: batteryData.capacity
                        });
                        
                        // Không kiểm tra - chỉ set giá trị
                        console.log(' Dung lượng pin cũ:', batteryLevel);
                        setPercent(batteryLevel);
                        setCapacity(batteryCapacity);
                    } else {
                        console.warn(' Không lấy được thông tin pin cũ từ API');
                        console.log(' Kiểm tra dữ liệu từ xe đã chọn...');
                        console.log(' selectedVehicle:', selectedVehicle);
                        
                        // Sử dụng dữ liệu từ xe đã chọn
                        const vehicleBatteryLevel = selectedVehicle?.batteryLevel || selectedVehicle?.battery_level || 0;
                        console.log(' vehicleBatteryLevel từ xe:', vehicleBatteryLevel);
                        
                        if (vehicleBatteryLevel > 0) {
                            console.log(' CẢNH BÁO: Sử dụng dữ liệu từ xe có thể không chính xác!');
                            console.log(' Dữ liệu từ xe có thể là pin mới, không phải pin cũ!');
                            console.log(' vehicleBatteryLevel từ xe:', vehicleBatteryLevel);
                            
                            // Kiểm tra nếu dữ liệu từ xe có vẻ không hợp lý cho pin cũ
                            if (vehicleBatteryLevel > 80) {
                                console.log(' Dữ liệu từ xe quá cao cho pin cũ, sử dụng random thấp hơn');
                                const randomPercent = Math.floor(Math.random() * 25) + 5; // 5-29%
                                setPercent(randomPercent);
                                console.log(' Sử dụng random percentage cho pin cũ:', randomPercent);
                            } else {
                                setPercent(vehicleBatteryLevel);
                                console.log(' Sử dụng dung lượng pin từ xe:', vehicleBatteryLevel);
                            }
                        } else {
                            console.log(' Không có dữ liệu từ xe, sử dụng random');
                            // Fallback: Random percentage thấp hơn 30%
                            const randomPercent = Math.floor(Math.random() * 25) + 5; // 5-29%
                            setPercent(randomPercent);
                        }
                    }
                } catch (error) {
                    console.error(' Lỗi khi lấy thông tin pin cũ:', error);
                    // Fallback: Random percentage thấp hơn 30%
                    const randomPercent = Math.floor(Math.random() * 25) + 5; // 5-29%
                    setPercent(randomPercent);
                    console.log(`Fallback random percentage: ${randomPercent}%`);
                }
                
                setIsPercentGenerated(true);
            }
        };
        
        fetchOldBatteryLevel();
    }, [code, isPercentGenerated, selectedVehicle]);

    // 4. HANDLE SUBMIT
    const handleSubmit = async (e) => {
        e.preventDefault();
        
        try {
            // Lưu thông tin pin cũ vào sessionStorage
            sessionStorage.setItem('oldBatteryLevel', String(percent));
            console.log(' Đã lưu dung lượng pin cũ:', percent);
            
            // Lưu emptySlotNumber (slot trống nơi đặt pin cũ) vào sessionStorage
            // Để dùng cho SwapSuccess hiển thị "Slot trống" cho pin cũ
            if (emptySlotNumber && emptySlotNumber !== 'undefined' && emptySlotNumber !== 'null') {
                sessionStorage.setItem('emptySlotNumber', String(emptySlotNumber));
                console.log(' Đã lưu emptySlotNumber vào sessionStorage:', emptySlotNumber);
            }
            
            // CHỈ GHI NHẬN - KHÔNG GỌI API
            // Tất cả cập nhật database sẽ được xử lý ở bước cuối cùng (confirmSwap)
            console.log(' Đã ghi nhận thông tin pin cũ:', {
                batteryId: code,
                level: percent,
                emptySlot: emptySlotNumber
            });
            
            // LẤY PIN MỚI TỪ TRỤ VÀ LƯU VÀO SESSION
            console.log(' Đang lấy pin mới từ trụ...');
            try {
                const newBatteryInfo = await selectNewBatteryFromTower();
                console.log(' Đã lấy pin mới thành công:', newBatteryInfo);
            } catch (batteryError) {
                console.error(' Lỗi khi lấy pin mới:', batteryError);
                alert('Có lỗi khi lấy pin mới từ trụ. Vui lòng thử lại.');
                return; // Không chuyển bước nếu lỗi
            }
            
            // Chuyển bước
            goToStep(STEPS.TAKE_NEW_BATTERY);
            console.log('Đã đặt pin cũ và lấy pin mới, chuyển sang bước lấy pin mới.');
            
        } catch (error) {
            console.error(' Lỗi khi xử lý pin cũ:', error);
            alert('Có lỗi xảy ra khi xử lý pin cũ. Vui lòng thử lại.');
        }
    };

    // Get the empty slot number with fallback
    const emptySlotFromSession = sessionStorage.getItem('emptySlotNumber');
    const emptySlotNumber = transaction?.emptySlot || emptySlotFromSession || '1';
    
    // Debug logging
    console.log(' PlaceOldBattery - transaction:', transaction);
    console.log(' PlaceOldBattery - emptySlot:', transaction?.emptySlot);
    console.log(' PlaceOldBattery - emptySlotFromSession:', emptySlotFromSession);
    console.log(' PlaceOldBattery - emptySlotNumber:', emptySlotNumber);
    console.log(' PlaceOldBattery - isLoading:', isLoading);

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
                        <label htmlFor="batPercent">Dung lượng pin (%):</label>
                        <input
                            type="number"
                            id="batPercent"
                            value={percent} // Display battery level (stateOfHealth)
                            readOnly // Make percentage read-only
                            className="readonly-input" // Add a class for styling
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="batCapacity">Độ chai pin (%):</label>
                        <input
                            type="number"
                            id="batCapacity"
                            value={capacity !== null ? capacity : 'Đang tải...'} // Display capacity
                            readOnly
                            className="readonly-input"
                        />
                    </div>

                    <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
                        <button
                            type="button"
                            onClick={() => goToStep(STEPS.SELECT_TOWER)}
                            className="place-battery-button"
                            style={{
                                background: '#475569',
                                color: '#FFFFFF',
                                flex: 1
                            }}
                        >
                            Hủy
                        </button>
                        <button
                            type="submit"
                            className="place-battery-button"
                            disabled={isLoading}
                            style={{ flex: 1, whiteSpace: 'nowrap' }}
                        >
                            {isLoading ? "Đang xác nhận..." : "Tôi đã đặt pin"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default PlaceOldBattery;