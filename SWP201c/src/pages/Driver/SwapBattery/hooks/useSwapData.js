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
            const userId = sessionStorage.getItem('userId') || sessionStorage.getItem('UserID') || 'driver001';
            const vehicleId = sessionStorage.getItem('vehicleId') || sessionStorage.getItem('vehicleID') || 1;
            const contractId = sessionStorage.getItem('contractId') || sessionStorage.getItem('contractID') || 1;
            
            // Lấy batteryId từ nhiều nguồn (session keys hoặc parse từ selectedVehicle)
            let batteryId = sessionStorage.getItem('batteryId') || sessionStorage.getItem('oldBatteryId') || sessionStorage.getItem('old_battery_id');
            
            // Nếu chưa có, thử parse từ selectedVehicle JSON
            if (!batteryId || batteryId === 'null' || batteryId === 'undefined') {
                try {
                    const selectedVehicleStr = sessionStorage.getItem('selectedVehicle');
                    if (selectedVehicleStr) {
                        const selectedVehicle = JSON.parse(selectedVehicleStr);
                        batteryId = selectedVehicle?.batteryId || 
                                   selectedVehicle?.currentBatteryId || 
                                   selectedVehicle?.current_battery_id ||
                                   selectedVehicle?.battery?.id ||
                                   selectedVehicle?.battery?.batteryId;
                        
                        if (batteryId) {
                            console.log('✅ Lấy batteryId từ selectedVehicle:', batteryId);
                            // Lưu lại vào session để lần sau dùng
                            sessionStorage.setItem('old_battery_id', String(batteryId));
                        }
                    }
                } catch (parseErr) {
                    console.warn('⚠️ Không parse được selectedVehicle:', parseErr);
                }
            }
            
            console.log('🔍 getRealData - sessionStorage values:');
            console.log('  - userId:', userId);
            console.log('  - vehicleId:', vehicleId);
            console.log('  - contractId:', contractId);
            console.log('  - batteryId (final):', batteryId);
            
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
    
    const { user, currentVehicle, activeContract } = getRealData();


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
            // == BƯỚC 1: LẤY ID THẬT (TỪ DỮ LIỆU GIẢ LẬP Ở TRÊN) ==
            if (!user || !currentVehicle || !activeContract) {
                throw new Error("Không tìm thấy thông tin User, Xe, hoặc Hợp đồng.");
            }

            // Lấy ID pin cũ thật từ sessionStorage
            const realData = {
                userId: user.userId,
                vehicleId: currentVehicle.vehicleId,
                contractId: activeContract.contractId,
                oldBatteryId: currentVehicle.currentBatteryId, // Lấy từ sessionStorage
                stationId: selectedStation.id || selectedStation.stationId,
                towerId: cabinet.id || cabinet.cabinetId,
            };
            
            console.log('🔍 realData for initiateSwap:', realData);
            console.log('🔍 oldBatteryId value:', realData.oldBatteryId);
            console.log('🔍 oldBatteryId type:', typeof realData.oldBatteryId);
            
            // Validation: Đảm bảo oldBatteryId không null
            if (!realData.oldBatteryId || realData.oldBatteryId === null || realData.oldBatteryId === 'null') {
                console.error('❌ oldBatteryId is missing or null:', realData.oldBatteryId);
                console.error('❌ sessionStorage batteryId:', sessionStorage.getItem('batteryId'));
                console.error('❌ sessionStorage oldBatteryId:', sessionStorage.getItem('oldBatteryId'));
                console.error('❌ sessionStorage old_battery_id:', sessionStorage.getItem('old_battery_id'));
                console.error('❌ sessionStorage selectedVehicle:', sessionStorage.getItem('selectedVehicle'));
                
                // Hiển thị thông báo chi tiết cho user
                const errorMsg = 'Không tìm thấy thông tin pin của xe.\n\n' +
                    'Vui lòng:\n' +
                    '1. Quay lại trang Dashboard\n' +
                    '2. Chọn lại xe của bạn\n' +
                    '3. Đảm bảo xe đã được gắn pin\n' +
                    '4. Thử lại quy trình đổi pin';
                
                throw new Error(errorMsg);
            }

            // == BƯỚC 2: QUÉT TẤT CẢ SLOT CỦA TRỤ (để: 1) lấy pin mới; 2) tìm slot trống)
            console.log("Đang quét slots của trụ (cabinet/tower):", realData.towerId);
            // Gọi API GET /api/driver/slots?towerId=...
            const slotsResponse = await stationService.getSlotsByTower(realData.towerId);

            let newBatteryId = null;
            let newBatterySlot = null;
            let emptySlotNumber = null;

            const slotsArray = (slotsResponse && slotsResponse.success && Array.isArray(slotsResponse.data))
                ? slotsResponse.data
                : Array.isArray(slotsResponse) ? slotsResponse : [];

            // 2.1) Tìm pin mới: ưu tiên pin 'full', sau đó 'available'
            console.log('Slots nhận được từ API:', slotsArray);
            for (const slot of slotsArray) {
                const status = (slot.status || '').toString().toLowerCase();
                if (status === 'full' || status === 'available') {
                    const derivedBatteryId = slot.batteryId || slot.battery_id || slot?.battery?.id;
                    const derivedSlotNumber = slot.slotNumber || slot.slot_number || slot.slot_id;
                    newBatteryId = derivedBatteryId ?? `BAT-SLOT-${derivedSlotNumber}`; // fallback nếu API không cung cấp batteryId
                    newBatterySlot = derivedSlotNumber;
                    console.log('Chọn pin từ slot:', { status, derivedBatteryId, derivedSlotNumber });
                    break;
                }
            }

            // 2.2) Tìm slot trống theo SQL: status = 'empty', ORDER BY slot_number ASC, TOP 1
            const emptySlotsSorted = slotsArray
                .filter(s => (s.status || '').toString().toLowerCase() === 'empty')
                .sort((a, b) => {
                    const aNum = a.slotNumber || a.slot_number || a.slot_id || 0;
                    const bNum = b.slotNumber || b.slot_number || b.slot_id || 0;
                    return aNum - bNum;
                });
            if (emptySlotsSorted.length > 0) {
                const bestEmpty = emptySlotsSorted[0];
                emptySlotNumber = bestEmpty.slotNumber || bestEmpty.slot_number || bestEmpty.slot_id;
            }

            // Nếu không tìm thấy pin mới nào
            if (newBatteryId === null) {
                throw new Error("Trụ này đã hết pin đầy. Vui lòng chọn trụ khác.");
            }
            console.log(`Pin mới (ID: ${newBatteryId}) tại slot ${newBatterySlot}`);
            console.log(`Empty slot được chọn (nhỏ nhất theo số thứ tự): ${emptySlotNumber}`);

            // == BƯỚC 2.3: LƯU CÁC TRƯỜNG BẮT BUỘC VÀO sessionStorage THEO YÊU CẦU ==
            try {
                sessionStorage.setItem('UserID', String(user.userId));
                sessionStorage.setItem('contractID', String(activeContract.contractId));
                sessionStorage.setItem('vehicleID', String(currentVehicle.vehicleId));
                sessionStorage.setItem('stationID', String(realData.stationId));
                sessionStorage.setItem('towerID', String(realData.towerId));
                sessionStorage.setItem('old_battery_id', String(realData.oldBatteryId));
                sessionStorage.setItem('new_battery_id', String(newBatteryId));
                // distance_used sẽ được cập nhật khi hoàn tất (odometerAfter - odometerBefore)
                if (!sessionStorage.getItem('distance_used')) {
                    sessionStorage.setItem('distance_used', '0');
                }
            } catch {
                // ignore sessionStorage errors
            }

            // == BƯỚC 3: GỌI API TẠO SWAP (VỚI ĐẦY ĐỦ DATA THẬT) ==
            // Nếu transaction đã có swapId thì không tạo lại (bảo toàn 1 create duy nhất)
            if (transaction && transaction.swapId) {
                console.log('Swap đã được tạo trước đó, swapId=', transaction.swapId);
            } else {
                // Gọi hàm trong swapService.js (hàm này gọi POST /api/swaps)
                const response = await swapService.initiateSwap({
                    ...realData,
                    // đảm bảo gửi numeric nếu là numeric
                    newBatteryId: Number.isFinite(Number(newBatteryId)) ? parseInt(newBatteryId, 10) : newBatteryId,
                });

                // Lưu dữ liệu trả về kèm emptySlotNumber đã tính theo SQL
                const tx = {
                    ...response,
                    emptySlot: response?.emptySlot ?? emptySlotNumber,
                    emptySlotNumber: response?.emptySlot ?? emptySlotNumber,
                    // Đảm bảo swapId được lưu với fallback logic
                    swapId: response?.swapId || response?.id || response?.swap_id || 'UNKNOWN'
                };
                console.log('Response từ swapService:', response);
                console.log('Transaction object (after create):', tx);

                // Lưu vào session để Step 3 hiển thị
                try {
                    if (tx.emptySlotNumber != null) {
                        sessionStorage.setItem('emptySlotNumber', String(tx.emptySlotNumber));
                    }
                    // Lưu swapId để confirm sau này
                    if (tx.swapId && tx.swapId !== 'UNKNOWN') {
                        sessionStorage.setItem('swapId', String(tx.swapId));
                    }
                } catch (e) {
                    console.error('Lỗi khi lưu swap info vào sessionStorage:', e);
                }

                setTransaction(tx);
            }
            
            // Chuyển sang Bước 3: Trả pin cũ
            goToStep(STEPS.PLACE_OLD_BATTERY);

        } catch (err) {
            // Hiển thị lỗi ra màn hình
            const apiError = err.response?.data?.message || err.message;
            setError(apiError || "Lỗi khi bắt đầu đổi pin");
            // Quay lại Bước 2: Chọn trụ
            goToStep(STEPS.SELECT_TOWER);
        }
        setIsLoading(false);
    };

    /**
     * API 2: Xác nhận hoàn tất (backend tự xử lý old/new battery)
     */
    const confirmSwap = async (swapId) => {
        setIsLoading(true);
        setError(null);
        try {
            console.log('🚀 Calling confirmSwap API with swapId:', swapId);
            
            // Gọi hàm trong swapService.js (POST /api/swaps/{swapId}/confirm)
            const response = await swapService.confirmSwap(swapId);
            
            console.log('✅ confirmSwap response:', response);
            console.log('🔍 response type:', typeof response);
            console.log('🔍 response keys:', Object.keys(response || {}));
            console.log('🔍 response data:', JSON.stringify(response, null, 2));
            
            // Lưu dữ liệu tóm tắt (swap đã update)
            // response đã là data từ swapService.confirmSwap
            setSummary(response);
            // Chuyển sang Bước 5: Thành công
            goToStep(STEPS.SUCCESS);
        } catch (err) {
            const apiError = err.response?.data?.message || err.message;
            setError(apiError || 'Lỗi khi xác nhận hoàn tất');
            // Quay lại Bước 3: Trả pin cũ
            goToStep(STEPS.PLACE_OLD_BATTERY);
        }
        setIsLoading(false);
    };

    // Hàm hoàn thành đổi pin (gọi từ TakeNewBattery)
    const completeSwap = async () => {
        setIsLoading(true);
        setError(null);
        try {
            // Lấy swapId từ transaction
            console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
            console.log('🔄 HOÀN THÀNH ĐỔI PIN');
            console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
            console.log('Transaction object:', transaction);
            console.log('transaction.swapId:', transaction?.swapId);
            
            // Lấy swapId từ transaction hoặc sessionStorage
            const swapId = transaction?.swapId || sessionStorage.getItem('swapId');
            if (!swapId || swapId === 'UNKNOWN') {
                throw new Error('Không tìm thấy swapId trong transaction hoặc sessionStorage');
            }

            console.log('✅ SwapId for confirm:', swapId);
            console.log('Backend sẽ tự động xử lý old/new battery từ database');
            console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

            // Gọi API confirm - backend tự xử lý tất cả
            await confirmSwap(swapId);

            // ===== CẬP NHẬT THÔNG TIN XE SAU KHI ĐỔI PIN THÀNH CÔNG =====
            // Backend đã tự động cập nhật vehicle.current_battery_id
            // Frontend chỉ cập nhật UI để hiển thị mức pin mới (100%)
            
            const selectedVehicleStr = sessionStorage.getItem('selectedVehicle');
            const newBatteryLevelFromSession = sessionStorage.getItem('newBatteryLevel') || '100';
            
            if (selectedVehicleStr) {
                try {
                    const selectedVehicle = JSON.parse(selectedVehicleStr);
                    
                    // Cập nhật batteryLevel để hiển thị UI (backend đã update batteryId)
                    const updatedVehicle = {
                        ...selectedVehicle,
                        batteryLevel: parseInt(newBatteryLevelFromSession),
                        health: parseInt(newBatteryLevelFromSession)
                    };
                    
                    // Lưu lại vào sessionStorage
                    sessionStorage.setItem('selectedVehicle', JSON.stringify(updatedVehicle));
                    console.log('✅ Đã cập nhật mức pin xe trong sessionStorage:', updatedVehicle);
                    console.log('ℹ️ batteryId đã được backend cập nhật tự động');
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
        confirmSwap,
        completeSwap,
        resetSwapData,
        setError,
        // Cung cấp ID pin cũ thật cho component PlaceOldBattery.jsx
        // Dòng này sẽ lấy đúng số 20 từ 'currentVehicle' đã sửa ở trên
        oldBatteryId: currentVehicle?.currentBatteryId,
    };
};