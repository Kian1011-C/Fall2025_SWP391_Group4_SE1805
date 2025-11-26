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

    // --- LẤY DỮ LIỆU THẬT TỪ LOCALSTORAGE VÀ SESSIONSTORAGE ---
    const getRealData = () => {
        try {
            // Clear old battery data to avoid conflicts
            sessionStorage.removeItem('batteryId');
            sessionStorage.removeItem('oldBatteryId');
            
            // Lấy userId từ localStorage (currentUser)
            let userId = null;
            const currentUserStr = localStorage.getItem('currentUser');
            if (currentUserStr) {
                try {
                    const currentUser = JSON.parse(currentUserStr);
                    userId = currentUser?.id;
        
                } catch (parseErr) {
                    console.error(' Lỗi parse currentUser:', parseErr);
                }
            }
            
            if (!userId) {
                console.error(' KHÔNG TÌM THẤY userId - User chưa đăng nhập hoặc session hết hạn');
                throw new Error('Không tìm thấy thông tin user. Vui lòng đăng nhập lại.');
            }
            
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
                            sessionStorage.setItem('vehicleID', String(vehicleId));
                        }
                    }
                    
                    // Lấy contractId từ selectedVehicle nếu chưa có
                    if (!contractId) {
                        contractId = selectedVehicle?.contractId || 
                                    selectedVehicle?.contract_id ||
                                    selectedVehicle?.activeContractId;
                        if (contractId) {
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
                        batteryId = selectedVehicleBatteryId;
                    }
                } catch (parseErr) {
                    console.warn(' Không parse được selectedVehicle:', parseErr);
                }
            }
            
            // Fallback values nếu vẫn không tìm thấy
            vehicleId = vehicleId || 1;
            contractId = contractId || 1;
            
            return {
                user: { userId: userId },
                currentVehicle: { 
                    vehicleId: parseInt(vehicleId) || 1, 
                    currentBatteryId: batteryId ? parseInt(batteryId) : null 
                },
                activeContract: { contractId: parseInt(contractId) || 1 }
            };
        } catch (error) {
            console.error(' Lỗi nghiêm trọng khi lấy dữ liệu user:', error);
            // Không trả về fallback - throw error để component cha xử lý
            throw error;
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
            


            // Kiểm tra nếu swap đã được tạo trước đó
            if (transaction && transaction.swapId) {
                console.log(' Swap đã được tạo trước đó, swapId=', transaction.swapId);
                goToStep(STEPS.PLACE_OLD_BATTERY);
                setIsLoading(false);
                return;
            }

            // Gọi API POST /api/batteries/swap/initiate
            // Backend sẽ tự tìm pin sẵn có và tạo swap
            const response = await swapService.initiateSwap(realData);

            console.log('✅ Initiate swap thành công - swapId:', response.swapId);

            // GỌI API ĐỂ TÌM SLOT TRỐNG NƠI ĐẶT PIN CŨ
            // API initiateSwap chỉ trả về slotNumber của pin mới, không trả về slot trống
            let emptySlotNumber = null;
            try {
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
                    }
                }
            } catch (slotError) {
                console.warn('⚠️ Lỗi lấy slots:', slotError.message);
            }

            // Lưu transaction với swapId và emptySlotNumber (QUAN TRỌNG - dùng cho các bước sau)
            const tx = {
                ...response,
                swapId: response.swapId, // Đảm bảo có swapId
                emptySlot: emptySlotNumber, // Slot trống nơi đặt pin cũ (từ API)
                emptySlotNumber: emptySlotNumber, // Alias cho emptySlot
            };
            


            // Lưu vào sessionStorage để dùng cho các bước sau
            try {
                // Lưu swapId (QUAN TRỌNG NHẤT)
                if (tx.swapId) sessionStorage.setItem('swapId', String(tx.swapId));
                if (tx.newBatteryId) sessionStorage.setItem('new_battery_id', String(tx.newBatteryId));
                if (tx.slotNumber) sessionStorage.setItem('newBatterySlot', String(tx.slotNumber));
                if (tx.contractId) sessionStorage.setItem('contractID', String(tx.contractId));
                if (tx.oldBatteryId) sessionStorage.setItem('old_battery_id', String(tx.oldBatteryId));
                if (tx.emptySlotNumber) sessionStorage.setItem('emptySlotNumber', String(tx.emptySlotNumber));

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
                console.error(' Lỗi khi lưu vào sessionStorage:', e);
            }

            // Lưu transaction vào state
            setTransaction(tx);
            
            // Chuyển sang Bước 3: Trả pin cũ
            goToStep(STEPS.PLACE_OLD_BATTERY);

        } catch (err) {
            // Xử lý lỗi từ backend
            const apiError = err.response?.data?.message || err.message;
            
            console.error(' Lỗi khi initiate swap:', apiError);
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
            if (!selectedCabinet) {
                throw new Error('Không tìm thấy thông tin trụ');
            }
            
            const towerId = selectedCabinet.id || selectedCabinet.cabinetId;
            
            const slotsResponse = await stationService.getSlotsByTower(towerId);
            let newBatteryId = null;
            let newBatterySlot = null;
            let newBatteryLevel = null;

            const slotsArray = (slotsResponse && slotsResponse.success && Array.isArray(slotsResponse.data))
                ? slotsResponse.data
                : Array.isArray(slotsResponse) ? slotsResponse : [];
            
            // Tìm pin mới: ưu tiên pin 'full', sau đó 'available'
            for (const slot of slotsArray) {
                const status = (slot.status || '').toString().toLowerCase();
                if (status === 'full' || status === 'available') {
                    const derivedBatteryId = slot.batteryId || slot.battery_id || slot?.battery?.id;
                    const derivedSlotNumber = slot.slotNumber || slot.slot_number || slot.slot_id;
                    
                    //  CHỈ DÙNG batteryId THẬT (số), KHÔNG tạo ID giả
                    if (derivedBatteryId) {
                        newBatteryId = derivedBatteryId;
                        newBatterySlot = derivedSlotNumber;
                        newBatteryLevel = slot.stateOfHealth || slot.state_of_health || 
                                         slot.batteryLevel || slot.battery_level || 100;
                        break;
                    }
                }
            }

            if (newBatteryId === null) {
                throw new Error("Trụ này đã hết pin đầy. Vui lòng chọn trụ khác.");
            }

            sessionStorage.setItem('new_battery_id', String(newBatteryId));
            sessionStorage.setItem('newBatterySlot', String(newBatterySlot));
            sessionStorage.setItem('newBatteryLevel', String(newBatteryLevel));

            return {
                newBatteryId,
                newBatterySlot,
                newBatteryLevel
            };

        } catch (err) {
            console.error(' Lỗi khi lấy pin mới từ trụ:', err);
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

            
            // Gọi API POST /api/batteries/swap/{swapId}/confirm
            const response = await swapService.confirmSwap(swapId);
            
            console.log('✅ Confirm swap thành công - status:', response.status || response.swapStatus);
            
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
            

            
            // Lưu dữ liệu tóm tắt (swap đã update, status = "COMPLETED")
            setSummary(enrichedSummary);
            
            // Chuyển sang Bước 5: Thành công
            goToStep(STEPS.SUCCESS);
        } catch (err) {
            console.error(' Lỗi khi confirm swap:', err);
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
                    if (summary.newBatteryId || summary.newBatteryCode) {
                        sessionStorage.setItem('new_battery_id', String(summary.newBatteryId || summary.newBatteryCode));
                    }
                    if (summary.newBatteryPercent || summary.newBatteryLevel) {
                        sessionStorage.setItem('newBatteryLevel', String(summary.newBatteryPercent || summary.newBatteryLevel));
                    }
                    if (summary.newSlotNumber || summary.newSlot) {
                        sessionStorage.setItem('newBatterySlot', String(summary.newSlotNumber || summary.newSlot));
                    }
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
                    sessionStorage.setItem('vehicleNeedsReload', 'true');
                } catch (parseErr) {
                    console.error('❌ Lỗi cập nhật vehicle:', parseErr);
                }
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