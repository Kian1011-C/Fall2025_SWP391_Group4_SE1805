// src/services/stationService.js
import { apiUtils, API_CONFIG } from '../config/api.js';

const { ENDPOINTS } = API_CONFIG;

const stationService = {
    /**
     * API 1 (Driver - Bước 1): Lấy tất cả các trạm
     * (Hàm này vẫn đúng, gọi GET /api/stations)
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
     * SỬA LỖI 404: Gọi đúng API từ DriverController
     * (GET /api/driver/towers?stationId=...)
     */
    getCabinetsByStation: async (stationId) => {
        try {
            console.log(`StationService: Lấy trụ của trạm ${stationId}...`);
            
            // 1. Lấy đúng endpoint
            const endpoint = ENDPOINTS.DRIVER.GET_TOWERS_BY_STATION;
            
            // 2. API này dùng Query Param (không phải Path Variable)
            // apiUtils.get(url, params) sẽ tự động chuyển thành ?stationId=...
            const params = { stationId: stationId };
            
            console.log("Đang gọi URL:", endpoint, "với params:", params);
            
            // 3. Gọi API
            const response = await apiUtils.get(endpoint, params);
            
            // BE trả về { success: true, data: [...] }
            // FE (TowerSelector) mong đợi một mảng
            if (response && response.success && Array.isArray(response.data)) {
                 // Đổi tên "id" thành "cabinetId" và "towerNumber" thành "name"
                 // để component TowerSelector (đã code) hiểu được
                const adaptedData = response.data.map(tower => ({
                    ...tower,
                    id: tower.id, // Giữ nguyên id (TowerSelector dùng .id)
                    cabinetId: tower.id, // Thêm cabinetId (nếu cần)
                    name: `Trụ ${tower.towerNumber}`, // Đổi tên cho đẹp
                    // status, availableSlots, totalSlots (đã khớp)
                }));
                return adaptedData;
            }
            
            return []; // Trả về mảng rỗng nếu không thành công
            
        } catch (error) {
            console.error(`Lỗi khi lấy trụ của trạm ${stationId}:`, error);
            throw error;
        }
    },
};

export default stationService;