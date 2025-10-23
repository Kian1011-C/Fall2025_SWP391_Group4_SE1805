// src/services/swapService.js
import { apiUtils, API_CONFIG } from '../config/api.js';

const { ENDPOINTS } = API_CONFIG;

const swapService = {
    /**
     * API 1 (Driver): Bắt đầu một phiên đổi pin mới.
     * BE CỦA BẠN KHÔNG CÓ API "INITIATE"
     * -> Chúng ta sẽ dùng API "Create Swap" (POST /api/swaps)
     */
    initiateSwap: async (cabinetData) => {
        try {
            console.log("SwapService: Bắt đầu đổi pin (dùng POST /api/swaps)...", cabinetData);
            
            // TẠO DỮ LIỆU GIẢ LẬP ĐỂ GỌI API 'createSwap' CỦA BẠN
            const fakeSwapData = {
                userId: 1, // BẠN CẦN LẤY USER ID THẬT TỪ AUTH CONTEXT
                oldBatteryId: 99, // ID pin cũ (mô phỏng)
                newBatteryId: 100, // ID pin mới (mô phỏng)
                stationId: cabinetData.stationId, // Cần truyền stationId vào
                status: "PENDING"
            };
            
            // DÙNG API POST /api/swaps (BE CỦA BẠN CÓ API NÀY)
            const response = await apiUtils.post(ENDPOINTS.SWAPS.BASE, fakeSwapData);
            
            // Giả lập dữ liệu trả về (vì API POST /swaps của bạn không trả về hộc trống)
            response.data = { 
                ...response.data, 
                swapId: response.data.swapId || 1, // Lấy swapId thật
                emptySlot: 5, // Dữ liệu mô phỏng
                newBattery: { code: "P13", slot: 8, percent: 100 } // Dữ liệu mô phỏng
            };
            
            return response.data; 
        } catch (error) {
            console.error('Lỗi khi bắt đầu đổi pin:', error);
            throw error; 
        }
    },

    /**
     * API 2 (Driver): Xác nhận hoàn tất đổi pin.
     * SỬA LẠI ĐỂ GỌI ĐÚNG API CỦA BẠN
     */
    confirmSwap: async (swapId, oldBatteryData) => {
        try {
            console.log(`SwapService: Xác nhận swap ${swapId}...`);
            
            // SỬA LỖI 404: DÙNG API 'SWAPS.CONFIRM' MỚI
            const endpoint = ENDPOINTS.SWAPS.CONFIRM(swapId);
            
            // API POST /api/swaps/{id}/confirm của bạn không nhận body
            // nên chúng ta không gửi 'oldBatteryData'
            const response = await apiUtils.post(endpoint); 
            
            // Trả về tóm tắt (API của bạn trả về swap đã update)
            return response.data; 
        } catch (error) {
            console.error('Lỗi khi xác nhận đổi pin:', error);
            throw error;
        }
    },
    
    // Giữ nguyên các hàm cũ của bạn
    getAllSwaps: async () => {
        // ...
    },
    updateSwapStatus: async (swapId, status) => {
        // ...
    },
};

export default swapService;