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
     * API MỚI: Lấy thống kê tổng hợp về tất cả các trạm
     * GET /api/stations/stats
     */
    getStationsStats: async () => {
        try {
            console.log("StationService: Lấy thống kê trạm từ API mới...");
            const response = await apiUtils.get('/api/stations/stats');
            
            if (response.success) {
                console.log('✅ API stats trả về dữ liệu:', response.data);
                return { success: true, data: response.data, message: 'Lấy thống kê trạm thành công' };
            } else {
                throw new Error(response.message || 'Không thể lấy thống kê trạm');
            }
        } catch (error) {
            console.error('❌ Lỗi khi lấy thống kê trạm:', error);
            const errorInfo = apiUtils.handleError(error);
            return { success: false, message: errorInfo.message || 'Lỗi API', error: errorInfo };
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
            
            console.log('🔍 getSlotsByTower response:', response);
            console.log('🔍 response.success:', response?.success);
            console.log('🔍 response.data:', response?.data);
            console.log('🔍 response.data length:', response?.data?.length);
            
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
    // Hàm này gọi lại hàm của Driver
    return await stationService.getTowersByStation(stationId);
  },
  
  /**
   * API 5 (Staff): Lấy các Hộc (Slots) của 1 Trụ
   * (Hiện tại dùng chung API của Driver)
   */
   getStaffSlotsByCabinet: async (cabinetId) => {
    // Hàm này gọi lại hàm của Driver
     return await stationService.getSlotsByTower(cabinetId);
   },
  // ==========================================================
  // === CODE MỚI THÊM CHO TRANG ADMIN (BẮT ĐẦU TỪ ĐÂY) ===
  // ==========================================================
    /**
     * API 7 (Admin): Tạo một trạm mới
     * @param {object} stationData - Dữ liệu của trạm mới
     */
    createStation: async (stationData) => {
        try {
            console.log('StationService (Admin): Tạo trạm mới', stationData);
            const response = await apiUtils.post(ENDPOINTS.STATIONS.BASE, stationData);
            
            if (response.success) {
                return { success: true, data: response.data, message: 'Tạo trạm thành công' };
            } else {
                throw new Error(response.message || 'Không thể tạo trạm');
            }
        } catch (error) {
            console.error('Lỗi khi tạo trạm (Admin):', error);
            const errorInfo = apiUtils.handleError(error);
            return { success: false, message: errorInfo.message || 'Lỗi API' };
        }
    },

    /**
     * API 8 (Admin): Cập nhật thông tin một trạm
     * @param {number} stationId - ID của trạm cần cập nhật
     * @param {object} stationData - Dữ liệu cập nhật
     */
    updateStation: async (stationId, stationData) => {
        try {
            console.log(`StationService (Admin): Cập nhật trạm ${stationId}`, stationData);
            const response = await apiUtils.put(ENDPOINTS.STATIONS.BY_ID(stationId), stationData);
            
            if (response.success) {
                return { success: true, data: response.data, message: 'Cập nhật trạm thành công' };
            } else {
                throw new Error(response.message || 'Không thể cập nhật trạm');
            }
        } catch (error) {
            console.error(`Lỗi khi cập nhật trạm ${stationId} (Admin):`, error);
            const errorInfo = apiUtils.handleError(error);
            return { success: false, message: errorInfo.message || 'Lỗi API' };
        }
    },

   getAllStations: async (filters = {}) => {
    try {
      const response = await apiUtils.get(ENDPOINTS.STATIONS.BASE, filters); 
      return response;
    } catch (error) { 
      console.error('Lỗi khi lấy danh sách trạm:', error);
      throw error; 
    }
  },

  /**
   * API 2 (Admin - Cấp 2): Lấy các Trụ của 1 Trạm
   * Sửa lại: Dùng chung API GET /api/driver/towers
   */
  getTowersByStation: async (stationId) => { // Đổi tên hàm cho rõ ràng
    try {
      console.log(`StationService (Admin): Lấy trụ của trạm ${stationId}...`);
      const endpoint = '/api/driver/towers'; // <-- ĐỊA CHỈ ĐÚNG
      const params = { stationId: stationId }; // <-- ĐÚNG PARAM
      const response = await apiUtils.get(endpoint, params);
      return response; 
    } catch (error) {
      console.error(`Lỗi khi lấy trụ (Admin) của trạm ${stationId}:`, error);
      throw error;
    }
  },
  
  /**
   * API 3 (Admin - Cấp 3): Lấy các Hộc (Slots) của 1 Trụ
   * Sửa lại: Dùng chung API GET /api/driver/slots
   */
  getSlotsByTower: async (towerId) => { // Đổi tên hàm cho rõ ràng
    try {
      console.log(`StationService (Admin): Lấy hộc của trụ ${towerId}...`);
      const endpoint = '/api/driver/slots'; // <-- ĐỊA CHỈ ĐÚNG
      const params = { towerId: towerId }; // <-- ĐÚNG PARAM
      const response = await apiUtils.get(endpoint, params);
      return response;
    } catch (error) {
      console.error(`Lỗi khi lấy hộc (Admin) của trụ ${towerId}:`, error);
      throw error;
    }
  },
};

// Đảm bảo bạn dùng 'export default'
export default stationService;