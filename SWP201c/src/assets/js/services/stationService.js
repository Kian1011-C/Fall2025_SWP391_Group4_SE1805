// src/services/stationService.js

// Import file API gốc (đường dẫn này bạn cần kiểm tra lại)
// Nó có thể là '../config/api.js' hoặc '/src/config/api.js'
import { apiUtils, API_CONFIG } from '../config/api.js';

const { ENDPOINTS } = API_CONFIG;

const stationService = {
    /**
     * API 1 (Driver - Bước 1): Lấy tất cả các trạm
     * Dùng: STATIONS.BASE
     */
    getAllStations: async () => {
        try {
            console.log("StationService: Đang lấy tất cả trạm...");
            // Dùng hằng số từ file config
            const response = await apiUtils.get(ENDPOINTS.STATIONS.BASE);
            return response; // Trả về dữ liệu
        } catch (error) {
            console.error('Lỗi khi lấy danh sách trạm:', error);
            throw error; // Ném lỗi để component (StationSelector) bắt được
        }
    },

    /**
     * API 2 (Driver - Bước 2): Lấy các trụ/hộc của 1 trạm
     * @param {string} stationId
     */
    getCabinetsByStation: async (stationId) => {
        try {
            console.log(`StationService: Lấy trụ/hộc của trạm ${stationId}...`);
            
            // ĐÃ SỬA LỖI 404: Dùng endpoint AVAILABLE_SLOTS
            const endpoint = ENDPOINTS.STATIONS.AVAILABLE_SLOTS(stationId);
            
            console.log("Đang gọi URL:", endpoint); // Để kiểm tra
            
            const response = await apiUtils.get(endpoint);
            return response;
        } catch (error) {
            console.error(`Lỗi khi lấy trụ của trạm ${stationId}:`, error);
            throw error;
        }
    },
};

export default stationService;