// src/assets/js/services/stationService.js

// (Đảm bảo đường dẫn này đúng, có thể là ../../config/api.js)
import { apiUtils, API_CONFIG } from '../config/api.js';
const { ENDPOINTS } = API_CONFIG;

const stationService = {
    /**
     * API 1 (Driver - Bước 1): Lấy tất cả các trạm
     * (Hàm này đã có)
     */
    getAllStations: async () => {
        try {
            console.log("StationService: Đang lấy tất cả trạm...");
            const response = await apiUtils.get(ENDPOINTS.STATIONS.BASE);
            return response;
        } catch (error) {
            console.error('Lỗi khi lấy danh sách trạm:', error);
            throw error; 
        }
    },

    /**
     * API 2 (Driver - Bước 2): Lấy các trụ của 1 trạm
     * (Hàm này đã có)
     */
    getCabinetsByStation: async (stationId) => {
        try {
            console.log(`StationService: Lấy trụ của trạm ${stationId}...`);
            
            const endpoint = ENDPOINTS.DRIVER.GET_TOWERS_BY_STATION;
            const params = { stationId: stationId };
            
            console.log("Đang gọi URL:", endpoint, "với params:", params);
            
            const response = await apiUtils.get(endpoint, params);
            
            if (response && response.success && Array.isArray(response.data)) {
                // Đổi tên để Component (FE) hiểu được
                const adaptedData = response.data.map(tower => ({
                    ...tower,
                    id: tower.id, 
                    cabinetId: tower.id, 
                    name: `Trụ ${tower.towerNumber}`, 
                }));
                return adaptedData;
            }
            return []; 
        } catch (error) {
            console.error(`Lỗi khi lấy trụ của trạm ${stationId}:`, error);
            throw error;
        }
    },
    
    // ==========================================================
    // SỬA LỖI: THÊM HÀM BỊ THIẾU
    // (Hàm này được gọi bởi useSwapData.js để tìm pin mới)
    // ==========================================================
    /**
     * API 3 (Driver - Bước 3): Lấy TẤT CẢ các hộc (slots) của 1 trụ
     * Gọi: GET /api/driver/slots?towerId=...
     */
    getSlotsByTower: async (towerId) => {
        try {
            console.log(`StationService: Lấy hộc của trụ ${towerId}...`);
            
            const endpoint = ENDPOINTS.DRIVER.GET_SLOTS_BY_TOWER;
            const params = { towerId: towerId };
            
            console.log("Đang gọi URL:", endpoint, "với params:", params);
            
            // BE trả về { success: true, data: [...] }
            const response = await apiUtils.get(endpoint, params);
            
            // Trả về toàn bộ response để useSwapData xử lý (check success, data)
            return response;
            
        } catch (error) {
            console.error(`Lỗi khi lấy hộc của trụ ${towerId}:`, error);
            throw error;
        }
    },
};

// Đảm bảo bạn dùng 'export default'
export default stationService;