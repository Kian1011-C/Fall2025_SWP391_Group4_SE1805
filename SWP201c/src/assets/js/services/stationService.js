// src/assets/js/services/stationService.js

// (Đảm bảo đường dẫn này đúng, có thể là ../../config/api.js)
import { apiUtils, API_CONFIG } from '../config/api.js';
const { ENDPOINTS } = API_CONFIG;

const stationService = {
    /**
     * API 1 (Driver - Bước 1): Lấy tất cả các trạm
     * (Hàm này đã có)
     */
    getAllStations: async (filters = {}) => { // <-- 1. Chấp nhận 'filters'
        try {
            console.log("StationService: Đang lấy tất cả trạm...", filters);
            // 2. Truyền 'filters' vào làm query params
            const response = await apiUtils.get(ENDPOINTS.STATIONS.BASE, filters); 
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
    
    // ==========================================================
    // === CODE MỚI THÊM CHO TRANG STAFF (BẮT ĐẦU TỪ ĐÂY) ===
    // ==========================================================

    /**
     * API 4 (Staff): Lấy các Trụ (Cabinets) của 1 Trạm
     * Được gọi bởi hook: useStationDetailsData.js
     * Gọi: GET /api/staff/stations/{stationId}/cabinets
     */
    getStaffCabinetsByStation: async (stationId) => {
      try {
        console.log(`StationService (STAFF): Lấy trụ của trạm ${stationId}...`);
        
        // Do endpoint này không có trong 'ENDPOINTS' của Driver,
        // chúng ta tạm thời hardcode.
        // Bạn nên thêm nó vào file API_CONFIG sau.
        const endpoint = `/api/staff/stations/${stationId}/cabinets`; 
        
        const response = await apiUtils.get(endpoint);
        
        // Trả về toàn bộ response để useStationDetailsData xử lý
        // (response nên có dạng { success: true, data: [...], stationName: "..." })
        return response; 
        
      } catch (error) {
        console.error(`Lỗi khi lấy trụ (Staff) của trạm ${stationId}:`, error);
        throw error; // Ném lỗi để hook (useStationDetailsData) bắt
      }
    },
    
    /**
     * API 5 (Staff): Lấy các Hộc (Slots) của 1 Trụ
     * Được gọi bởi hook: useCabinetDetailsData.js
     * Gọi: GET /api/staff/cabinets/{cabinetId}/slots
     */
    getStaffSlotsByCabinet: async (cabinetId) => {
      try {
        console.log(`StationService (STAFF): Lấy hộc của trụ ${cabinetId}...`);
        
        // Tương tự, endpoint này là của Staff, nên tạm hardcode
        const endpoint = `/api/staff/cabinets/${cabinetId}/slots`;
        
        const response = await apiUtils.get(endpoint);
        
        // Trả về toàn bộ response để useCabinetDetailsData xử lý
        // (response nên có dạng { success: true, data: [...], cabinetName: "..." })
        return response;
        
      } catch (error) {
        console.error(`Lỗi khi lấy hộc (Staff) của trụ ${cabinetId}:`, error);
        throw error; // Ném lỗi để hook (useCabinetDetailsData) bắt
      }
    },
};

// Đảm bảo bạn dùng 'export default'
export default stationService;