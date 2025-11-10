// hooks/useSwapData.js
import { useState } from 'react';
import swapService from '/src/assets/js/services/swapService.js';
import stationService from '/src/assets/js/services/stationService.js'; // Import API của trạm
// import vehicleService from '/src/assets/js/services/vehicleService.js'; // Import API của xe - TẠM THỜI COMMENT OUT
// !!! GIẢ ĐỊNH QUAN TRỌNG:
// Bạn cần import AuthContext (hoặc UserContext) của bạn ở đây
// import { AuthContext } from '/src/context/AuthContext';

export const useSwapData = (goToStep, STEPS) => {
    // const { user, currentVehicle, activeContract } = useContext(AuthContext); // <-- Bạn cần dòng này

    // --- LẤY DỮ LIỆU THẬT TỪ SESSIONSTORAGE ---
    const getRealData = () => {
        try {
            // Clear old battery data to avoid conflicts
            sessionStorage.removeItem('batteryId');
            sessionStorage.removeItem('oldBatteryId');
            
            const userId = sessionStorage.getItem('userId') || sessionStorage.getItem('UserID') || 'driver001';
            
            // Lấy vehicleId, contractId, batteryId từ selectedVehicle (nguồn chính xác nhất)
            let vehicleId = sessionStorage.getItem('vehicleId') || sessionStorage.getItem('vehicleID');
            let contractId = sessionStorage.getItem('contractId') || sessionStorage.getItem('contractID');
            let batteryId = sessionStorage.getItem('old_battery_id'); // Chỉ lấy từ key chính
            
            // Nếu chưa có, thử parse từ selectedVehicle JSON
            const selectedVehicleStr = sessionStorage.getItem('selectedVehicle');
            if (selectedVehicleStr) {
                try {
                    const selectedVehicle = JSON.parse(selectedVehicleStr);
                    
                    // Lấy vehicleId từ selectedVehicle nếu chưa có
                    if (!vehicleId) {
                        vehicleId = selectedVehicle?.id || 
                                   selectedVehicle?.vehicleId || 
                                   selectedVehicle?.vehicle_id;
                        if (vehicleId) {
                            console.log('✅ Lấy vehicleId từ selectedVehicle:', vehicleId);
                            sessionStorage.setItem('vehicleID', String(vehicleId));
                        }
                    }
                    
                    // Lấy contractId từ selectedVehicle nếu chưa có
                    if (!contractId) {
                        contractId = selectedVehicle?.contractId || 
                                    selectedVehicle?.contract_id ||
                                    selectedVehicle?.activeContractId;
                        if (contractId) {
                            console.log('✅ Lấy contractId từ selectedVehicle:', contractId);
                            sessionStorage.setItem('contractID', String(contractId));
                        }
                    }
                    
                    // Lấy batteryId từ selectedVehicle - CHỈ ĐỂ HIỂN THỊ, KHÔNG GHI ĐÈ old_battery_id
                    const selectedVehicleBatteryId = selectedVehicle?.batteryId || 
                                                   selectedVehicle?.currentBatteryId || 
                                                   selectedVehicle?.current_battery_id ||
                                                   selectedVehicle?.battery?.id ||
                                                   selectedVehicle?.battery?.batteryId;
                    
                    if (selectedVehicleBatteryId) {
                        console.log('✅ Lấy batteryId từ selectedVehicle:', selectedVehicleBatteryId);
                        batteryId = selectedVehicleBatteryId; // Override với giá trị từ selectedVehicle
                        // KHÔNG GHI ĐÈ old_battery_id - Giữ nguyên giá trị cũ (pin cũ thật)
                        console.log('⚠️ KHÔNG GHI ĐÈ old_battery_id (để giữ pin cũ thật)');
                    } else if (!batteryId || batteryId === 'null' || batteryId === 'undefined') {
                        console.warn('⚠️ Không tìm thấy batteryId trong selectedVehicle');
                    }
                } catch (parseErr) {
                    console.warn('⚠️ Không parse được selectedVehicle:', parseErr);
                }
            }
            
            // Fallback values nếu vẫn không tìm thấy
            vehicleId = vehicleId || 1;
            contractId = contractId || 1;
            
            console.log('🔍 getRealData - sessionStorage values:');
            console.log('  - userId:', userId);
            console.log('  - vehicleId:', vehicleId);
            console.log('  - contractId:', contractId);
            console.log('  - batteryId (final):', batteryId);
            
            // Debug: Log all battery-related keys
            console.log('🔍 Debug - All battery keys in sessionStorage:');
            console.log('  - batteryId:', sessionStorage.getItem('batteryId'));
            console.log('  - oldBatteryId:', sessionStorage.getItem('oldBatteryId'));
            console.log('  - old_battery_id:', sessionStorage.getItem('old_battery_id'));
            console.log('  - selectedVehicle:', sessionStorage.getItem('selectedVehicle'));
            
            return {
                user: { userId: userId },
                currentVehicle: { 
                    vehicleId: parseInt(vehicleId) || 1, 
                    currentBatteryId: batteryId ? parseInt(batteryId) : null 
                },
                activeContract: { contractId: parseInt(contractId) || 1 }
            };
        } catch (error) {
            console.error('Lỗi khi lấy dữ liệu từ sessionStorage:', error);
            return {
                user: { userId: 'driver001' },
                currentVehicle: { vehicleId: 1, currentBatteryId: null },
                activeContract: { contractId: 1 }
            };
        }
    };
    
    const { user, currentVehicle } = getRealData(); // activeContract không cần vì BE tự tìm


    const [selectedStation, setSelectedStation] = useState(null);
    const [selectedCabinet, setSelectedCabinet] = useState(null); // (Cabinet/Tower)
    const [transaction, setTransaction] = useState(null); // Lưu { swapId, emptySlot, newBattery }
    const [summary, setSummary] = useState(null); // Tóm tắt cuối cùng
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    /**
     * API 1: Bắt đầu đổi pin
     */
    const initiateSwap = async (cabinet) => {
        // ===== LOG DEBUG CABINET =====
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log('🎯 INITIATE SWAP - CABINET OBJECT');
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log('Cabinet parameter:', cabinet);
        console.log('Cabinet.id:', cabinet.id);
        console.log('Cabinet.cabinetId:', cabinet.cabinetId);
        console.log('Cabinet towerId sẽ dùng:', cabinet.id || cabinet.cabinetId);
        
        setSelectedCabinet(cabinet);
        setIsLoading(true);
        setError(null);

        try {
            // Kiểm tra thông tin cần thiết
            if (!user) {
                throw new Error("Không tìm thấy thông tin User.");
            }
            if (!currentVehicle || !currentVehicle.vehicleId) {
                throw new Error("Không tìm thấy thông tin Xe.");
            }
            if (!selectedStation || !selectedStation.id) {
                throw new Error("Không tìm thấy thông tin Trạm.");
            }
            if (!cabinet || (!cabinet.id && !cabinet.cabinetId)) {
                throw new Error("Không tìm thấy thông tin Trụ.");
            }

            // Chuẩn bị data gửi lên API
            // Required: userId, stationId, towerId
            // Optional: vehicleId, batteryId (old battery id)
            const realData = {
                userId: user.userId,
                stationId: selectedStation.id || selectedStation.stationId,
                towerId: cabinet.id || cabinet.cabinetId,
                vehicleId: currentVehicle.vehicleId,
            };
            
            // Thêm old battery id nếu có (từ selectedVehicle)
            const oldBatteryIdFromStorage = sessionStorage.getItem('old_battery_id');
            if (oldBatteryIdFromStorage && oldBatteryIdFromStorage !== 'null' && oldBatteryIdFromStorage !== 'undefined') {
                realData.batteryId = oldBatteryIdFromStorage; // BE sẽ nhận field này là oldBatteryId
            } else if (currentVehicle?.currentBatteryId) {
                realData.batteryId = currentVehicle.currentBatteryId;
            }
            
            console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
            console.log('📤 BƯỚC 1: INITIATE BATTERY SWAP');
            console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
            console.log('Data gửi lên API:');
            console.log('  ├─ userId:', realData.userId, '(required - string)');
            console.log('  ├─ stationId:', realData.stationId, '(required - number)');
            console.log('  ├─ towerId:', realData.towerId, '(required - number)');
            console.log('  ├─ vehicleId:', realData.vehicleId, '(optional - number)');
            if (realData.batteryId) {
                console.log('  └─ batteryId:', realData.batteryId, '(optional - old battery id)');
            } else {
                console.log('  └─ batteryId: (not provided - BE sẽ tự tìm)');
            }
            console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

            // Kiểm tra nếu swap đã được tạo trước đó
            if (transaction && transaction.swapId) {
                console.log('✅ Swap đã được tạo trước đó, swapId=', transaction.swapId);
                goToStep(STEPS.PLACE_OLD_BATTERY);
                setIsLoading(false);
                return;
            }

            // Gọi API POST /api/batteries/swap/initiate
            // Backend sẽ tự tìm pin sẵn có và tạo swap
            const response = await swapService.initiateSwap(realData);

            console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
            console.log('✅ RESPONSE TỪ API INITIATE:');
            console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
            console.log('  ├─ swapId:', response.swapId, '(QUAN TRỌNG - ĐÃ LƯU)');
            console.log('  ├─ contractId:', response.contractId, '(BE tự tìm)');
            console.log('  ├─ vehicleId:', response.vehicleId);
            console.log('  ├─ newBatteryId:', response.newBatteryId, '(BE tự tìm trong trụ)');
            console.log('  ├─ slotNumber:', response.slotNumber, '(slot của pin mới)');
            console.log('  ├─ slotId:', response.slotId);
            console.log('  ├─ towerNumber:', response.towerNumber);
            console.log('  ├─ status:', response.status);
            console.log('  ├─ oldBatteryId:', response.oldBatteryId);
            console.log('  └─ Full response:', response);
            console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

            // GỌI API ĐỂ TÌM SLOT TRỐNG NƠI ĐẶT PIN CŨ
            // API initiateSwap chỉ trả về slotNumber của pin mới, không trả về slot trống
            let emptySlotNumber = null;
            try {
                console.log('📡 Gọi API GET slots để tìm slot trống nơi đặt pin cũ...');
                console.log('  └─ TowerId:', realData.towerId);
                
                const slotsResponse = await stationService.getSlotsByTower(realData.towerId);
                
                if (slotsResponse.success && Array.isArray(slotsResponse.data)) {
                    // Tìm slot trống (status = 'empty') - ưu tiên slot có số nhỏ nhất
                    const emptySlots = slotsResponse.data
                        .filter(slot => (slot.status || '').toString().toLowerCase() === 'empty')
                        .sort((a, b) => {
                            const aNum = a.slotNumber || a.slot_number || a.slot_id || 0;
                            const bNum = b.slotNumber || b.slot_number || b.slot_id || 0;
                            return aNum - bNum;
                        });
                    
                    if (emptySlots.length > 0) {
                        emptySlotNumber = emptySlots[0].slotNumber || emptySlots[0].slot_number || emptySlots[0].slot_id;
                        console.log('✅ Tìm thấy slot trống nơi đặt pin cũ:', emptySlotNumber);
                    } else {
                        console.warn('⚠️ Không tìm thấy slot trống trong trụ');
                    }
                } else {
                    console.warn('⚠️ Response từ getSlotsByTower không hợp lệ:', slotsResponse);
                }
            } catch (slotError) {
                console.warn('⚠️ Không lấy được slots từ API:', slotError);
                console.warn('⚠️ Sẽ dùng giá trị mặc định hoặc từ sessionStorage');
            }

            // Lưu transaction với swapId và emptySlotNumber (QUAN TRỌNG - dùng cho các bước sau)
            const tx = {
                ...response,
                swapId: response.swapId, // Đảm bảo có swapId
                emptySlot: emptySlotNumber, // Slot trống nơi đặt pin cũ (từ API)
                emptySlotNumber: emptySlotNumber, // Alias cho emptySlot
            };
            
            console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
            console.log('📦 TRANSACTION OBJECT (sau khi tìm slot trống):');
            console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
            console.log('  ├─ swapId:', tx.swapId);
            console.log('  ├─ slotNumber (pin mới):', tx.slotNumber, '(từ API initiateSwap)');
            console.log('  ├─ emptySlotNumber (pin cũ):', tx.emptySlotNumber, '(từ API getSlotsByTower)');
            console.log('  └─ Full transaction:', tx);
            console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

            // Lưu vào sessionStorage để dùng cho các bước sau
            try {
                // Lưu swapId (QUAN TRỌNG NHẤT)
                if (tx.swapId) {
                    sessionStorage.setItem('swapId', String(tx.swapId));
                    console.log('✅ Đã lưu swapId vào sessionStorage:', tx.swapId);
                }
                
                // Lưu newBatteryId và slotNumber để hiển thị ở bước "Lấy pin mới"
                if (tx.newBatteryId) {
                    sessionStorage.setItem('new_battery_id', String(tx.newBatteryId));
                    console.log('✅ Đã lưu newBatteryId vào sessionStorage:', tx.newBatteryId);
                }
                
                if (tx.slotNumber) {
                    sessionStorage.setItem('newBatterySlot', String(tx.slotNumber));
                    console.log('✅ Đã lưu slotNumber vào sessionStorage:', tx.slotNumber);
                }
                
                // Lưu contractId từ response (BE tự tìm và trả về)
                if (tx.contractId) {
                    sessionStorage.setItem('contractID', String(tx.contractId));
                    console.log('✅ Đã lưu contractId vào sessionStorage:', tx.contractId);
                }
                
                // Lưu oldBatteryId nếu có trong response
                if (tx.oldBatteryId) {
                    sessionStorage.setItem('old_battery_id', String(tx.oldBatteryId));
                    console.log('✅ Đã lưu oldBatteryId vào sessionStorage:', tx.oldBatteryId);
                }
                
                // Lưu emptySlotNumber (slot trống nơi đặt pin cũ) - QUAN TRỌNG
                if (tx.emptySlotNumber) {
                    sessionStorage.setItem('emptySlotNumber', String(tx.emptySlotNumber));
                    console.log('✅ Đã lưu emptySlotNumber vào sessionStorage:', tx.emptySlotNumber, '(từ API getSlotsByTower)');
                }

                // Lưu các thông tin khác
                sessionStorage.setItem('UserID', String(realData.userId));
                sessionStorage.setItem('stationID', String(realData.stationId));
                sessionStorage.setItem('towerID', String(realData.towerId));
                if (tx.vehicleId) {
                    sessionStorage.setItem('vehicleID', String(tx.vehicleId));
                } else if (realData.vehicleId) {
                    sessionStorage.setItem('vehicleID', String(realData.vehicleId));
                }
            } catch (e) {
                console.error('❌ Lỗi khi lưu vào sessionStorage:', e);
            }

            // Lưu transaction vào state
            setTransaction(tx);
            
            // Chuyển sang Bước 3: Trả pin cũ
            goToStep(STEPS.PLACE_OLD_BATTERY);

        } catch (err) {
            // Xử lý lỗi từ backend
            const apiError = err.response?.data?.message || err.message;
            
            console.error('❌ Lỗi khi initiate swap:', apiError);
            console.error('Full error:', err);
            
            // Xử lý các loại lỗi khác nhau từ BE
            let errorMessage = apiError || "Lỗi khi bắt đầu đổi pin. Vui lòng thử lại.";
            
            if (apiError) {
                if (apiError.includes('No available batteries') || apiError.includes('không có pin')) {
                    errorMessage = 'Trụ này không có pin sẵn có. Vui lòng chọn trụ khác.';
                } else if (apiError.includes('towerId is required') || apiError.includes('towerId')) {
                    errorMessage = 'Thiếu thông tin trụ. Vui lòng chọn lại trụ.';
                } else if (apiError.includes('hợp đồng active') || apiError.includes('contract') || apiError.includes('contractId')) {
                    errorMessage = 'Không tìm thấy hợp đồng active. Vui lòng kiểm tra lại hợp đồng của bạn.';
                } else if (apiError.includes('Failed to initiate')) {
                    errorMessage = 'Không thể khởi tạo đổi pin. Vui lòng thử lại.';
                }
            }
            
            setError(errorMessage);
            
            // Quay lại Bước 2: Chọn trụ để user chọn trụ khác hoặc thử lại
            goToStep(STEPS.SELECT_TOWER);
        }
        setIsLoading(false);
    };

    /**
     * API 1.5: Lấy pin mới từ trụ (gọi sau khi đặt pin cũ)
     */
    const selectNewBatteryFromTower = async () => {
        setIsLoading(true);
        setError(null);
        
        try {
            console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
            console.log('🔋 LẤY PIN MỚI TỪ TRỤ');
            console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
            
            if (!selectedCabinet) {
                throw new Error('Không tìm thấy thông tin trụ');
            }
            
            const towerId = selectedCabinet.id || selectedCabinet.cabinetId;
            console.log('TowerId để lấy pin mới:', towerId);
            
            // Gọi API GET /api/driver/slots?towerId=...
            const slotsResponse = await stationService.getSlotsByTower(towerId);
            console.log("Response từ API getSlotsByTower:", slotsResponse);

            let newBatteryId = null;
            let newBatterySlot = null;
            let newBatteryLevel = null;

            const slotsArray = (slotsResponse && slotsResponse.success && Array.isArray(slotsResponse.data))
                ? slotsResponse.data
                : Array.isArray(slotsResponse) ? slotsResponse : [];

            console.log('📋 DANH SÁCH SLOTS NHẬN ĐƯỢC TỪ API:', slotsArray.length);
            
            // Tìm pin mới: ưu tiên pin 'full', sau đó 'available'
            for (const slot of slotsArray) {
                const status = (slot.status || '').toString().toLowerCase();
                if (status === 'full' || status === 'available') {
                    const derivedBatteryId = slot.batteryId || slot.battery_id || slot?.battery?.id;
                    const derivedSlotNumber = slot.slotNumber || slot.slot_number || slot.slot_id;
                    
                    // ⚠️ CHỈ DÙNG batteryId THẬT (số), KHÔNG tạo ID giả
                    if (derivedBatteryId) {
                        newBatteryId = derivedBatteryId;
                        newBatterySlot = derivedSlotNumber;
                        newBatteryLevel = slot.stateOfHealth || slot.state_of_health || 
                                         slot.batteryLevel || slot.battery_level || 100;
                        
                        console.log('✅ ĐÃ CHỌN PIN MỚI:', {
                            batteryId: newBatteryId,
                            slotNumber: newBatterySlot,
                            level: newBatteryLevel,
                            status: status
                        });
                        break;
                    } else {
                        console.warn('⚠️ Slot', derivedSlotNumber, 'có status', status, 'nhưng KHÔNG CÓ batteryId!');
                        console.warn('   Backend cần sửa API /api/driver/slots để trả về batteryId.');
                    }
                }
            }

            if (newBatteryId === null) {
                throw new Error("Trụ này đã hết pin đầy. Vui lòng chọn trụ khác.");
            }

            // Lưu thông tin pin mới vào sessionStorage
            try {
                sessionStorage.setItem('new_battery_id', String(newBatteryId));
                sessionStorage.setItem('newBatterySlot', String(newBatterySlot));
                sessionStorage.setItem('newBatteryLevel', String(newBatteryLevel));
                
                console.log('✅ Đã lưu thông tin pin mới vào sessionStorage:');
                console.log('  - new_battery_id:', newBatteryId);
                console.log('  - newBatterySlot:', newBatterySlot);
                console.log('  - newBatteryLevel:', newBatteryLevel);
            } catch (sessionError) {
                console.error('❌ Lỗi khi lưu vào sessionStorage:', sessionError);
            }

            return {
                newBatteryId,
                newBatterySlot,
                newBatteryLevel
            };

        } catch (err) {
            console.error('❌ Lỗi khi lấy pin mới từ trụ:', err);
            const apiError = err.response?.data?.message || err.message;
            setError(apiError || "Lỗi khi lấy pin mới từ trụ");
            throw err;
        } finally {
            setIsLoading(false);
        }
    };

    /**
     * API 2: Xác nhận hoàn tất (Confirm Battery Swap)
     * Endpoint: POST /api/batteries/swap/{swapId}/confirm
     */
    const confirmSwap = async (swapId) => {
        setIsLoading(true);
        setError(null);
        try {
            console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
            console.log('📤 BƯỚC 2: CONFIRM BATTERY SWAP');
            console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
            console.log('SwapId:', swapId);
            
            // Gọi API POST /api/batteries/swap/{swapId}/confirm
            const response = await swapService.confirmSwap(swapId);
            
            console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
            console.log('✅ RESPONSE TỪ API CONFIRM:');
            console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
            console.log('  ├─ swapId:', response.swapId);
            console.log('  ├─ status:', response.status || response.swapStatus);
            console.log('  ├─ oldBatteryId:', response.oldBatteryId);
            console.log('  ├─ newBatteryId:', response.newBatteryId);
            console.log('  ├─ oldSlotNumber (từ API):', response.oldSlotNumber);
            console.log('  ├─ newSlotNumber (từ API):', response.newSlotNumber);
            console.log('  ├─ slotNumber (từ API):', response.slotNumber);
            console.log('  └─ Full response:', JSON.stringify(response, null, 2));
            console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
            
            // Sử dụng data trực tiếp từ response của POST /api/swaps/{swapId}/confirm
            const enrichedSummary = {
                ...response,
                // Đảm bảo có oldSlotNumber (slot trống nơi đặt pin cũ)
                // Ưu tiên: confirm response > sessionStorage
                oldSlotNumber: response.oldSlotNumber || 
                              response.old_slot_number ||
                              sessionStorage.getItem('emptySlotNumber') || 
                              null,
                // Đảm bảo có newSlotNumber (slot của pin mới)
                // Ưu tiên: confirm response > sessionStorage
                newSlotNumber: response.newSlotNumber || 
                              response.new_slot_number ||
                              response.newSlot || 
                              response.slotNumber ||
                              sessionStorage.getItem('newBatterySlot') || 
                              null,
            };
            
            console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
            console.log('📦 SUMMARY từ confirm response:');
            console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
            console.log('  ├─ oldSlotNumber:', enrichedSummary.oldSlotNumber, '(slot trống nơi đặt pin cũ)');
            console.log('  │  └─ Nguồn:', response.oldSlotNumber ? 'confirm response' : 'sessionStorage');
            console.log('  ├─ newSlotNumber:', enrichedSummary.newSlotNumber, '(slot của pin mới)');
            console.log('  │  └─ Nguồn:', response.newSlotNumber ? 'confirm response' : 'sessionStorage');
            console.log('  └─ Full summary:', JSON.stringify(enrichedSummary, null, 2));
            console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
            
            // Lưu dữ liệu tóm tắt (swap đã update, status = "COMPLETED")
            setSummary(enrichedSummary);
            
            // Chuyển sang Bước 5: Thành công
            goToStep(STEPS.SUCCESS);
        } catch (err) {
            console.error('❌ Lỗi khi confirm swap:', err);
            const apiError = err.response?.data?.message || err.message;
            
            // Nếu backend trả về "Swap not found" hoặc lỗi tương tự
            if (apiError && (apiError.includes('not found') || apiError.includes('không tìm thấy'))) {
                setError('Không tìm thấy giao dịch đổi pin. Vui lòng thử lại từ đầu.');
            } else {
                setError(apiError || 'Lỗi khi xác nhận hoàn tất. Vui lòng thử lại.');
            }
            
            // Quay lại Bước 4: Lấy pin mới
            goToStep(STEPS.TAKE_NEW_BATTERY);
        }
        setIsLoading(false);
    };

    // Hàm hoàn thành đổi pin (gọi từ TakeNewBattery khi user nhấn "Tôi đã lấy pin mới rồi")
    const completeSwap = async () => {
        setIsLoading(true);
        setError(null);
        try {
            // Lấy swapId từ transaction hoặc sessionStorage (đã lưu từ Bước 1)
            const swapId = transaction?.swapId || sessionStorage.getItem('swapId');
            
            console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
            console.log('🔄 HOÀN THÀNH ĐỔI PIN (Complete Swap)');
            console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
            console.log('SwapId từ transaction/sessionStorage:', swapId);
            
            if (!swapId || swapId === 'UNKNOWN' || swapId === 'null') {
                throw new Error('Không tìm thấy swapId. Vui lòng thử lại từ đầu.');
            }

            // Gọi API Bước 2: Confirm Battery Swap
            // Backend sẽ tự động cập nhật trạng thái pin cũ, pin mới, slot, và xe
            await confirmSwap(swapId);

            // ===== CẬP NHẬT SESSIONSTORAGE VỚI DỮ LIỆU TỪ SUMMARY =====
            // Đảm bảo tính nhất quán giữa sessionStorage và API response
            // Sử dụng setTimeout để đảm bảo summary đã được cập nhật
            setTimeout(() => {
                if (summary) {
                    console.log('🔄 Cập nhật sessionStorage với dữ liệu từ summary:', summary);
                    
                    // Cập nhật newBatteryId từ summary nếu có
                    if (summary.newBatteryId || summary.newBatteryCode) {
                        const apiNewBatteryId = summary.newBatteryId || summary.newBatteryCode;
                        sessionStorage.setItem('new_battery_id', String(apiNewBatteryId));
                        console.log('✅ Đã cập nhật new_battery_id từ summary:', apiNewBatteryId);
                    }
                    
                    // Cập nhật newBatteryLevel từ summary nếu có
                    if (summary.newBatteryPercent || summary.newBatteryLevel) {
                        const apiNewBatteryLevel = summary.newBatteryPercent || summary.newBatteryLevel;
                        sessionStorage.setItem('newBatteryLevel', String(apiNewBatteryLevel));
                        console.log('✅ Đã cập nhật newBatteryLevel từ summary:', apiNewBatteryLevel);
                    }
                    
                    // Cập nhật newBatterySlot từ summary nếu có
                    if (summary.newSlotNumber || summary.newSlot) {
                        const apiNewBatterySlot = summary.newSlotNumber || summary.newSlot;
                        sessionStorage.setItem('newBatterySlot', String(apiNewBatterySlot));
                        console.log('✅ Đã cập nhật newBatterySlot từ summary:', apiNewBatterySlot);
                    }
                } else {
                    console.log('⚠️ Summary chưa được cập nhật, bỏ qua cập nhật sessionStorage');
                }
            }, 100);

            // ===== CẬP NHẬT THÔNG TIN XE SAU KHI ĐỔI PIN THÀNH CÔNG =====
            // Backend đã tự động cập nhật vehicle.current_battery_id
            // Frontend cập nhật cả batteryId và batteryLevel
            
            const selectedVehicleStr = sessionStorage.getItem('selectedVehicle');
            const newBatteryIdFromSession = sessionStorage.getItem('new_battery_id');
            const newBatteryLevelFromSession = sessionStorage.getItem('newBatteryLevel') || '100';
            
            if (selectedVehicleStr) {
                try {
                    const selectedVehicle = JSON.parse(selectedVehicleStr);
                    
                    // Cập nhật CẢ batteryId VÀ batteryLevel
                    const updatedVehicle = {
                        ...selectedVehicle,
                        batteryId: newBatteryIdFromSession ? parseInt(newBatteryIdFromSession) : selectedVehicle.batteryId,
                        currentBatteryId: newBatteryIdFromSession ? parseInt(newBatteryIdFromSession) : selectedVehicle.currentBatteryId,
                        current_battery_id: newBatteryIdFromSession ? parseInt(newBatteryIdFromSession) : selectedVehicle.current_battery_id,
                        batteryLevel: parseInt(newBatteryLevelFromSession),
                        health: parseInt(newBatteryLevelFromSession),
                        // Flag để Dashboard biết cần reload data từ API
                        _needsReload: true,
                        _lastSwapTime: new Date().toISOString()
                    };
                    
                    // Lưu lại vào sessionStorage
                    sessionStorage.setItem('selectedVehicle', JSON.stringify(updatedVehicle));
                    sessionStorage.setItem('vehicleNeedsReload', 'true'); // Flag cho Dashboard
                    
                    console.log('✅ Đã cập nhật thông tin xe trong sessionStorage:');
                    console.log('  - Old batteryId:', selectedVehicle.batteryId);
                    console.log('  - New batteryId:', updatedVehicle.batteryId);
                    console.log('  - Battery Level:', updatedVehicle.batteryLevel + '%');
                } catch (parseErr) {
                    console.warn('⚠️ Không thể parse selectedVehicle từ sessionStorage:', parseErr);
                }
            } else {
                console.warn('⚠️ Không tìm thấy selectedVehicle trong sessionStorage');
            }
            // ===== HẾT PHẦN CẬP NHẬT THÔNG TIN XE =====

        } catch (err) {
            console.error('Lỗi khi hoàn thành đổi pin:', err);
            setError('Lỗi khi hoàn thành đổi pin');
        }
        setIsLoading(false);
    };

    // Hàm reset state khi hoàn thành hoặc hủy
    const resetSwapData = () => {
        setSelectedStation(null);
        setSelectedCabinet(null);
        setTransaction(null);
        setSummary(null);
        setError(null);
    };

    // Trả về state và các hàm cho "bộ não" (index.jsx) sử dụng
    return {
        selectedStation,
        selectedCabinet,
        transaction,
        summary,
        isLoading,
        error,
        setSelectedStation,
        initiateSwap,
        selectNewBatteryFromTower,
        confirmSwap,
        completeSwap,
        resetSwapData,
        setError,
        // Cung cấp ID pin cũ thật cho component PlaceOldBattery.jsx
        // Dòng này sẽ lấy đúng số 20 từ 'currentVehicle' đã sửa ở trên
        oldBatteryId: currentVehicle?.currentBatteryId,
    };
};