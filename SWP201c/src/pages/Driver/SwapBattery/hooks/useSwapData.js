// hooks/useSwapData.js
import { useState, useContext } from 'react'; // Thêm useContext
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

            // == BƯỚC 2: TÌM 1 PIN MỚI (NEW BATTERY ID) TRONG TRỤ ĐÃ CHỌN ==
            console.log("Đang tìm pin mới trong trụ (cabinet/tower):", realData.towerId);
            // Gọi API GET /api/driver/slots?towerId=...
            const slotsData = await stationService.getSlotsByTower(realData.towerId);

            let newBatteryId = null;
            let newBatterySlot = null;
            // Kiểm tra dữ liệu trả về từ API
            if (slotsData && slotsData.success && Array.isArray(slotsData.data)) {
                // Tìm một hộc (slot) có pin sẵn sàng ('available' hoặc 'full')
                for (const slot of slotsData.data) {
                    if ((slot.status === 'full' || slot.status === 'available') && slot.batteryId) {
                        newBatteryId = slot.batteryId; // Lấy ID pin mới
                        newBatterySlot = slot.slotNumber; // Lấy số hộc chứa pin mới
                        break; // Đã tìm thấy, thoát vòng lặp
                    }
                }
            }

            // Nếu không tìm thấy pin mới nào
            if (newBatteryId === null) {
                throw new Error("Trụ này đã hết pin đầy. Vui lòng chọn trụ khác.");
            }
            console.log(`Tìm thấy pin mới (ID: ${newBatteryId}) tại hộc ${newBatterySlot}`);

            // == BƯỚC 3: GỌI API TẠO SWAP (VỚI ĐẦY ĐỦ DATA THẬT) ==
            // Gọi hàm trong swapService.js (hàm này gọi POST /api/swaps)
            const response = await swapService.initiateSwap({
                ...realData,
                newBatteryId: newBatteryId, // Gửi ID pin mới thật
            });

            // Lưu dữ liệu trả về (đã được service giả lập: swapId, emptySlot, newBattery)
            setTransaction(response);
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
    const confirmSwap = async (oldBatteryData) => {
        setIsLoading(true);
        setError(null);
        try {
            // Lấy swapId từ transaction (được trả về/giả lập ở bước initiateSwap)
            const swapId = transaction.swapId;
            // Gọi hàm trong swapService.js (hàm này gọi POST /api/swaps/{id}/confirm)
            const response = await swapService.confirmSwap(swapId, oldBatteryData);
            // Lưu dữ liệu tóm tắt (swap đã update)
            setSummary(response);
            // Chuyển sang Bước 5: Thành công
            goToStep(STEPS.SUCCESS);
        } catch (err) {
            const apiError = err.response?.data?.message || err.message;
            setError(apiError || "Lỗi khi xác nhận hoàn tất");
            // Quay lại Bước 3: Trả pin cũ
            goToStep(STEPS.PLACE_OLD_BATTERY);
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
        resetSwapData,
        setError,
        // Cung cấp ID pin cũ thật cho component PlaceOldBattery.jsx
        // Dòng này sẽ lấy đúng số 20 từ 'currentVehicle' đã sửa ở trên
        oldBatteryId: currentVehicle?.currentBatteryId,
    };
};