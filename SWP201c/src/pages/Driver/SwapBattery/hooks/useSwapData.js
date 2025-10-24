// hooks/useSwapData.js
import { useState } from 'react';
import swapService from '/src/assets/js/services/swapService.js';
import stationService from '/src/assets/js/services/stationService.js'; // Import API của trạm
// !!! GIẢ ĐỊNH QUAN TRỌNG:
// Bạn cần import AuthContext (hoặc UserContext) của bạn ở đây
// import { AuthContext } from '/src/context/AuthContext';

export const useSwapData = (goToStep, STEPS) => {
    // const { user, currentVehicle, activeContract } = useContext(AuthContext); // <-- Bạn cần dòng này

    // --- DỮ LIỆU GIẢ LẬP (XÓA KHI CÓ AUTHCONTEXT) ---
    // (Đã dùng ID thật từ file SQL)
    const user = { userId: 'driver001' };
    // --------------------------------------------------
    // SỬA LẠI ID PIN CŨ Ở ĐÂY CHO ĐÚNG VỚI SQL
    // --------------------------------------------------
    const currentVehicle = { vehicleId: 1, currentBatteryId: 20 }; // <<<<<<<<<< SỬA LẠI THÀNH 20
    // --------------------------------------------------
    const activeContract = { contractId: 1 };
    // --- HẾT DỮ LIỆU GIẢ LẬP ---


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

            // Lấy ID pin cũ thật (số 20)
            const realData = {
                userId: user.userId,
                vehicleId: currentVehicle.vehicleId,
                contractId: activeContract.contractId,
                oldBatteryId: currentVehicle.currentBatteryId, // Sẽ lấy số 20
                stationId: selectedStation.id || selectedStation.stationId,
                towerId: cabinet.id || cabinet.cabinetId,
            };

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
            // Gọi hàm trong swapService.js (hàm này gọi POST /api/swaps)
            const response = await swapService.initiateSwap({
                ...realData,
                newBatteryId: newBatteryId, // Gửi ID pin mới thật
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
            console.log('Transaction object:', tx);
            console.log('tx.swapId:', tx.swapId);
            console.log('response.swapId:', response.swapId);
            console.log('response.id:', response.id);
            console.log('response.swap_id:', response.swap_id);
            
            // Lưu vào session để Step 3 hiển thị
            try {
                if (tx.emptySlotNumber != null) {
                    sessionStorage.setItem('emptySlotNumber', String(tx.emptySlotNumber));
                }
            } catch (e) {
                console.error('Lỗi khi lưu vào sessionStorage:', e);
            }
            setTransaction(tx);
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
     * API 2: Xác nhận hoàn tất
     */
    const confirmSwap = async (swapId, confirmData) => {
        setIsLoading(true);
        setError(null);
        try {
            // Gọi hàm trong swapService.js (POST /api/batteries/swap/{swapId}/confirm)
            const response = await swapService.confirmSwap(swapId, confirmData);
            // Lưu dữ liệu tóm tắt (swap đã update)
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
            console.log('Transaction object trong completeSwap:', transaction);
            console.log('transaction.swapId:', transaction?.swapId);
            
            const swapId = transaction?.swapId;
            if (!swapId || swapId === 'UNKNOWN') {
                throw new Error('Không tìm thấy swapId trong transaction');
            }

            // Lấy dữ liệu từ sessionStorage theo yêu cầu
            const oldBatteryId = sessionStorage.getItem('old_battery_id');
            const newBatteryId = sessionStorage.getItem('new_battery_id');

            console.log('SwapId từ transaction:', swapId);
            console.log('Dữ liệu từ session:', { oldBatteryId, newBatteryId });

            // Gọi API POST /api/batteries/swap/{swapId}/confirm
            const confirmData = {
                oldBatteryId,
                newBatteryId
            };

            console.log('Gửi dữ liệu confirm:', confirmData);
            await confirmSwap(swapId, confirmData);
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