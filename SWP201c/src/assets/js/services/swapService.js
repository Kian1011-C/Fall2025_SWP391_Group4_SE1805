// src/services/swapService.js
import { apiUtils, API_CONFIG } from '../config/api.js'; // (Đảm bảo đường dẫn này đúng)

const { ENDPOINTS } = API_CONFIG;

const swapService = {
    /**
     * API 1 (Driver): Bắt đầu một phiên đổi pin mới.
     * (Sử dụng POST /api/swaps của BE)
     */
    initiateSwap: async (cabinetData) => {
        try {
            console.log("SwapService: Bắt đầu đổi pin (dùng POST /api/swaps)...", cabinetData);
            
            // ==========================================================
            // SỬA LỖI DATABASE: CUNG CẤP CÁC ID CÓ THẬT
            // HÃY MỞ DATABASE VÀ THAY THẾ CÁC SỐ (1, 123, 456, 101, 102)
            // BẰNG CÁC ID CÓ THẬT TRONG BẢNG CỦA BẠN.
            // ==========================================================
            const fakeSwapData = {
                // 1. User ID thật (ví dụ: 'user1' hoặc '1')
                userId: 1, 
                
                // 2. Contract ID thật (từ bảng Contracts)
                contractId: 123, // <-- THAY SỐ NÀY
                
                // 3. Vehicle ID thật (từ bảng Vehicles)
                vehicleId: 456, // <-- THAY SỐ NÀY
                
                // 4. Station ID thật (đã lấy từ bước 1)
                stationId: cabinetData.stationId || cabinetData.id,
                
                // 5. Tower ID thật (đã lấy từ bước 2)
                towerId: cabinetData.id, // (cabinetData.id là ID của trụ/tower)

                // 6. Battery ID thật (từ bảng Batteries)
                oldBatteryId: 101, // <-- THAY SỐ NÀY
                
                // 7. Battery ID thật khác (từ bảng Batteries)
                newBatteryId: 102, // <-- THAY SỐ NÀY
                
                // 8. Các trường khác (có thể là NULL)
                staffId: null,
                odometerBefore: 10000,
                odometerAfter: null,
                status: "INITIATED" // Dùng 'INITIATED' (DAO của bạn có check)
            };
            
            console.log("Đang gửi data giả lên BE:", fakeSwapData);

            // Gọi API (BE sẽ trả về { success, data, message })
            const responseData = await apiUtils.post(ENDPOINTS.SWAPS.BASE, fakeSwapData); 
            
            if (!responseData.success || !responseData.data) {
                throw new Error(responseData.message || "Backend không thể tạo giao dịch swap");
            }

            // BE thành công, 'responseData.data' chứa swap
            // BE của bạn (hàm createSwap) KHÔNG trả về swapId, 
            // nó chỉ trả về { success: true, data: { ...swap object... } }
            
            const returnedSwap = responseData.data;

            // Giả lập dữ liệu trả về (gộp data thật từ BE và data giả)
            const simulatedResponse = { 
                ...returnedSwap, 
                
                // Lấy swapId thật (BE của bạn KHÔNG trả về ID sau khi INSERT)
                // Chúng ta phải gọi 1 API khác để lấy swapId vừa tạo
                // TẠM THỜI: Dùng ID giả 999 để test
                swapId: returnedSwap.swapId || 999, 
                
                // Thêm dữ liệu giả lập (vì BE không trả về)
                emptySlot: 5, 
                newBattery: { code: "P13", slot: 8, percent: 100 }
            };
            
            return simulatedResponse; // Trả về đối tượng đã gộp
        } catch (error) { 
            console.error('Lỗi khi bắt đầu đổi pin:', error);
            // Ném lỗi với message từ BE (nếu có)
            throw new Error(error.message || "Lỗi không xác định"); 
        }
    },

    /**
     * API 2 (Driver): Xác nhận hoàn tất đổi pin.
     * (Sử dụng POST /api/swaps/{id}/confirm của BE)
     */
    confirmSwap: async (swapId, oldBatteryData) => {
        try {
            console.log(`SwapService: Xác nhận swap ${swapId}...`);
            
            // Lấy endpoint từ API_CONFIG
            const endpoint = ENDPOINTS.SWAPS.CONFIRM(swapId);
            
            // API BE (confirmSwap) không cần body, nên chúng ta gọi POST rỗng
            const response = await apiUtils.post(endpoint); 
            
            if (response.success) {
                return response.data; // Trả về tóm tắt (swap đã update)
            } else {
                throw new Error(response.message || "Lỗi khi xác nhận swap");
            }
        } catch (error) {
            console.error('Lỗi khi xác nhận đổi pin:', error);
            throw error;
        }
    },
    
    // Giữ nguyên các hàm cũ của bạn (getAllSwaps, updateSwapStatus)
    getAllSwaps: async () => { /* ... */ },
    updateSwapStatus: async (swapId, status) => { /* ... */ },
};

export default swapService;