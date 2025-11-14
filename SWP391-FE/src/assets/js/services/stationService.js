// src/assets/js/services/stationService.js

// (Đảm bảo đường dẫn này đúng, có thể là ../../config/api.js)
import { apiUtils, API_CONFIG } from '../config/api.js';
const { ENDPOINTS } = API_CONFIG;

const stationService = {
    /**
     * API 1: GET /api/stations - Lấy danh sách tất cả các trạm
     * Sử dụng cho: Bản đồ trạm, danh sách trạm, quản lý trạm
     */
    getAllStations: async (filters = {}) => {
        try {
            console.log(" StationService: Lấy danh sách trạm từ GET /api/stations", filters);
            
            // Gọi API GET /api/stations
            const response = await apiUtils.get('/api/stations', filters);
            
            console.log(" GET /api/stations response:", response);
            
            if (response.success) {
                console.log(' Danh sách trạm loaded:', response.data?.length || 0);
                return {
                    success: true,
                    data: response.data || [],
                    message: 'Lấy danh sách trạm thành công'
                };
            } else {
                throw new Error(response.message || 'Không thể lấy danh sách trạm');
            }
        } catch (error) {
            console.error(' Lỗi khi lấy danh sách trạm:', error);
            const errorInfo = apiUtils.handleError ? apiUtils.handleError(error) : { message: error.message };
            return {
                success: false,
                message: errorInfo.message || 'Lỗi khi lấy danh sách trạm',
                error: errorInfo
            };
        }
    },

    /**
     * API 2: GET /api/stations/{id} - Lấy thông tin chi tiết của một trạm
     * Sử dụng cho: Chi tiết trạm, danh sách towers, thống kê trạm
     */
    getStationById: async (stationId) => {
        try {
            console.log(" StationService: Lấy chi tiết trạm từ GET /api/stations/" + stationId);
            
            // Gọi API GET /api/stations/{id}
            const response = await apiUtils.get(`/api/stations/${stationId}`);
            
            console.log(" GET /api/stations/" + stationId + " response:", response);
            
            if (response.success) {
                console.log(' Chi tiết trạm loaded:', response.data);
                return {
                    success: true,
                    data: response.data,
                    message: 'Lấy chi tiết trạm thành công'
                };
            } else {
                throw new Error(response.message || 'Không thể lấy chi tiết trạm');
            }
        } catch (error) {
            console.error(' Lỗi khi lấy chi tiết trạm:', error);
            const errorInfo = apiUtils.handleError ? apiUtils.handleError(error) : { message: error.message };
            return {
                success: false,
                message: errorInfo.message || 'Lỗi khi lấy chi tiết trạm',
                error: errorInfo
            };
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
                console.log(' API stats trả về dữ liệu:', response.data);
                return { success: true, data: response.data, message: 'Lấy thống kê trạm thành công' };
            } else {
                throw new Error(response.message || 'Không thể lấy thống kê trạm');
            }
        } catch (error) {
            console.error(' Lỗi khi lấy thống kê trạm:', error);
            const errorInfo = apiUtils.handleError(error);
            return { success: false, message: errorInfo.message || 'Lỗi API', error: errorInfo };
        }
    },

    /**
     * API 3: Lấy các trụ (towers) của một trạm
     * Sử dụng API getStationById để lấy thông tin chi tiết bao gồm towers
     */
    getTowersByStation: async (stationId) => {
        try {
            console.log(" StationService: Lấy towers của trạm", stationId);
            
            // Sử dụng API getStationById để lấy thông tin chi tiết
            const stationDetail = await stationService.getStationById(stationId);
            
            if (stationDetail.success && stationDetail.data) {
                const towers = stationDetail.data.towers || stationDetail.data.cabinets || [];
                console.log(' Towers loaded:', towers.length);
                return {
                    success: true,
                    data: towers,
                    message: 'Lấy danh sách towers thành công'
                };
            } else {
                throw new Error(stationDetail.message || 'Không thể lấy thông tin towers');
            }
        } catch (error) {
            console.error(' Lỗi khi lấy danh sách towers:', error);
            return {
                success: false,
                message: error.message || 'Lỗi khi lấy danh sách towers',
                error: error
            };
        }
    },

    /**
     * API 4: Lấy các trụ của 1 trạm (backward compatibility)
     * @deprecated Sử dụng getTowersByStation thay thế
     */
    getCabinetsByStation: async (stationId) => {
        console.warn(' getCabinetsByStation is deprecated, use getTowersByStation instead');
        
        try {
            // Sử dụng API mới getTowersByStation
            const towersResult = await stationService.getTowersByStation(stationId);
            
            if (towersResult.success && Array.isArray(towersResult.data)) {
                // Đổi tên để Component (FE) hiểu được
                const adaptedData = towersResult.data.map(tower => ({
                    ...tower,
                    id: tower.id, 
                    cabinetId: tower.id, 
                    name: `Trụ ${tower.towerNumber}`, 
                }));
                return adaptedData;
            }
            return []; 
        } catch (error) {
            console.error(' Lỗi khi lấy danh sách trụ:', error);
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
            
            console.log(' getSlotsByTower response:', response);
            console.log(' response.success:', response?.success);
            console.log(' response.data:', response?.data);
            console.log(' response.data length:', response?.data?.length);
            
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
            // Backend AdminController sử dụng /api/admin/stations
            const response = await apiUtils.post('/api/admin/stations', stationData);
            
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
            // Backend AdminController sử dụng /api/admin/stations/{id}
            const response = await apiUtils.put(`/api/admin/stations/${stationId}`, stationData);
            
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

    /**
     * API 9 (Admin): Xóa một trạm
     * @param {number} stationId - ID của trạm cần xóa
     */
    deleteStation: async (stationId) => {
        try {
            console.log(`StationService (Admin): Xóa trạm ${stationId}`);
            // Backend AdminController sử dụng /api/admin/stations/{id}
            const response = await apiUtils.delete(`/api/admin/stations/${stationId}`);
            
            if (response.success) {
                return { success: true, message: 'Xóa trạm thành công' };
            } else {
                throw new Error(response.message || 'Không thể xóa trạm');
            }
        } catch (error) {
            console.error(`Lỗi khi xóa trạm ${stationId} (Admin):`, error);
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

  // ==================== TOWER MANAGEMENT APIs ====================
  
  /**
   * API 10 (Admin): Thêm trụ mới vào trạm
   * @param {number} stationId - ID của trạm
   * @param {number} numberOfSlots - Số hộc cho trụ mới (mặc định 8)
   * @param {string} status - Trạng thái ban đầu (mặc định 'active')
   */
  addTowerToStation: async (stationId, numberOfSlots = 8, status = 'active') => {
    try {
      console.log(`StationService (Admin): Thêm trụ vào trạm ${stationId} với status: ${status}`);
      const response = await apiUtils.post(
        `/api/admin/stations/${stationId}/towers?numberOfSlots=${numberOfSlots}`,
        { status } // Gửi status trong body
      );
      
      if (response.success) {
        return { success: true, data: response.data, message: 'Thêm trụ thành công' };
      } else {
        throw new Error(response.message || 'Không thể thêm trụ');
      }
    } catch (error) {
      console.error(`Lỗi khi thêm trụ (Admin):`, error);
      const errorInfo = apiUtils.handleError(error);
      return { success: false, message: errorInfo.message || 'Lỗi API' };
    }
  },

  /**
   * API 11 (Admin): Cập nhật trạng thái trụ
   * @param {number} towerId - ID của trụ
   * @param {string} status - Trạng thái mới (active/maintenance/offline)
   */
  updateTower: async (towerId, status) => {
    try {
      console.log(`StationService (Admin): Cập nhật trụ ${towerId}`);
      const response = await apiUtils.put(`/api/admin/towers/${towerId}`, { status });
      
      if (response.success) {
        return { success: true, data: response.data, message: 'Cập nhật trụ thành công' };
      } else {
        throw new Error(response.message || 'Không thể cập nhật trụ');
      }
    } catch (error) {
      console.error(`Lỗi khi cập nhật trụ ${towerId} (Admin):`, error);
      const errorInfo = apiUtils.handleError(error);
      return { success: false, message: errorInfo.message || 'Lỗi API' };
    }
  },

  /**
   * API 12 (Admin): Xóa trụ
   * @param {number} towerId - ID của trụ cần xóa
   */
  deleteTower: async (towerId) => {
    try {
      console.log(`StationService (Admin): Xóa trụ ${towerId}`);
      const response = await apiUtils.delete(`/api/admin/towers/${towerId}`);
      
      if (response.success) {
        return { success: true, message: 'Xóa trụ thành công' };
      } else {
        throw new Error(response.message || 'Không thể xóa trụ');
      }
    } catch (error) {
      console.error(`Lỗi khi xóa trụ ${towerId} (Admin):`, error);
      const errorInfo = apiUtils.handleError(error);
      return { success: false, message: errorInfo.message || 'Lỗi API' };
    }
  },
};

// Đảm bảo bạn dùng 'export default'
export default stationService;