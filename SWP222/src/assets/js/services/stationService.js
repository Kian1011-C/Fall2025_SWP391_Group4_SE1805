// Station Service
// Handle station operations and data

import { API_CONFIG, apiUtils } from '../config/api.js';

class StationService {
  // Get all stations
  async getAllStations(filters = {}) {
    try {
      console.log('StationService: Get all stations', filters);
      
      const response = await apiUtils.get(API_CONFIG.ENDPOINTS.STATIONS.BASE, filters);
      
      if (response.success) {
        return {
          success: true,
          data: response.data,
          message: 'Lấy danh sách trạm thành công'
        };
      } else {
        throw new Error(response.message || 'Không thể lấy danh sách trạm');
      }
    } catch (error) {
      console.error('Get all stations error:', error);
      const errorInfo = apiUtils.handleError(error);
      return {
        success: false,
        message: errorInfo.message || 'Lỗi khi lấy danh sách trạm',
        error: errorInfo
      };
    }
  }

  // Get station by ID
  async getStationById(stationId) {
    try {
      console.log('StationService: Get station by ID', stationId);
      
      const response = await apiUtils.get(API_CONFIG.ENDPOINTS.STATIONS.BY_ID(stationId));
      
      if (response.success) {
        return {
          success: true,
          data: response.data,
          message: 'Lấy thông tin trạm thành công'
        };
      } else {
        throw new Error(response.message || 'Không thể lấy thông tin trạm');
      }
    } catch (error) {
      console.error('Get station by ID error:', error);
      const errorInfo = apiUtils.handleError(error);
      return {
        success: false,
        message: errorInfo.message || 'Lỗi khi lấy thông tin trạm',
        error: errorInfo
      };
    }
  }

  // Get nearby stations
  async getNearbyStations(latitude, longitude, radius = 10) {
    try {
      console.log('StationService: Get nearby stations', latitude, longitude, radius);
      
      const response = await apiUtils.get(API_CONFIG.ENDPOINTS.STATIONS.NEARBY, {
        lat: latitude,
        lng: longitude,
        radius: radius
      });
      
      if (response.success) {
        return {
          success: true,
          data: response.data,
          message: 'Lấy trạm gần đây thành công'
        };
      } else {
        throw new Error(response.message || 'Không thể lấy trạm gần đây');
      }
    } catch (error) {
      console.error('Get nearby stations error:', error);
      const errorInfo = apiUtils.handleError(error);
      return {
        success: false,
        message: errorInfo.message || 'Lỗi khi lấy trạm gần đây',
        error: errorInfo
      };
    }
  }

  // Create new station (Admin only)
  async createStation(stationData) {
    try {
      console.log('StationService: Create station', stationData);
      
      const response = await apiUtils.post(API_CONFIG.ENDPOINTS.STATIONS.BASE, stationData);
      
      if (response.success) {
        return {
          success: true,
          data: response.data,
          message: 'Tạo trạm mới thành công'
        };
      } else {
        throw new Error(response.message || 'Không thể tạo trạm mới');
      }
    } catch (error) {
      console.error('Create station error:', error);
      const errorInfo = apiUtils.handleError(error);
      return {
        success: false,
        message: errorInfo.message || 'Lỗi khi tạo trạm mới',
        error: errorInfo
      };
    }
  }

  // Update station (Admin only)
  async updateStation(stationId, stationData) {
    try {
      console.log('StationService: Update station', stationId, stationData);
      
      const response = await apiUtils.put(API_CONFIG.ENDPOINTS.STATIONS.BY_ID(stationId), stationData);
      
      if (response.success) {
        return {
          success: true,
          data: response.data,
          message: 'Cập nhật trạm thành công'
        };
      } else {
        throw new Error(response.message || 'Không thể cập nhật trạm');
      }
    } catch (error) {
      console.error('Update station error:', error);
      const errorInfo = apiUtils.handleError(error);
      return {
        success: false,
        message: errorInfo.message || 'Lỗi khi cập nhật trạm',
        error: errorInfo
      };
    }
  }

  // Delete station (Admin only)
  async deleteStation(stationId) {
    try {
      console.log('StationService: Delete station', stationId);
      
      const response = await apiUtils.delete(API_CONFIG.ENDPOINTS.STATIONS.BY_ID(stationId));
      
      if (response.success) {
        return {
          success: true,
          message: 'Xóa trạm thành công'
        };
      } else {
        throw new Error(response.message || 'Không thể xóa trạm');
      }
    } catch (error) {
      console.error('Delete station error:', error);
      const errorInfo = apiUtils.handleError(error);
      return {
        success: false,
        message: errorInfo.message || 'Lỗi khi xóa trạm',
        error: errorInfo
      };
    }
  }

  // Get station statistics
  async getStationStats(stationId) {
    try {
      console.log('StationService: Get station stats', stationId);
      
      const response = await apiUtils.get(`${API_CONFIG.ENDPOINTS.STATIONS.BY_ID(stationId)}/stats`);
      
      if (response.success) {
        return {
          success: true,
          data: response.data,
          message: 'Lấy thống kê trạm thành công'
        };
      } else {
        throw new Error(response.message || 'Không thể lấy thống kê trạm');
      }
    } catch (error) {
      console.error('Get station stats error:', error);
      const errorInfo = apiUtils.handleError(error);
      return {
        success: false,
        message: errorInfo.message || 'Lỗi khi lấy thống kê trạm',
        error: errorInfo
      };
    }
  }

  // Book station slot
  async bookStation(stationId, bookingData) {
    try {
      console.log('StationService: Book station', stationId, bookingData);
      
      const response = await apiUtils.post(`${API_CONFIG.ENDPOINTS.STATIONS.BY_ID(stationId)}/book`, bookingData);
      
      if (response.success) {
        return {
          success: true,
          data: response.data,
          message: 'Đặt chỗ trạm thành công'
        };
      } else {
        throw new Error(response.message || 'Không thể đặt chỗ trạm');
      }
    } catch (error) {
      console.error('Book station error:', error);
      const errorInfo = apiUtils.handleError(error);
      return {
        success: false,
        message: errorInfo.message || 'Lỗi khi đặt chỗ trạm',
        error: errorInfo
      };
    }
  }

  // Legacy methods for backward compatibility
  async getStations() {
    return this.getAllStations();
  }
  // Get towers by station ID
  async getTowersByStation(stationId) {
    try {
      console.log('StationService: Get towers by station', stationId);
      
      const response = await apiUtils.get(`/api/stations/${stationId}/towers`);
      
      if (response.success) {
        return {
          success: true,
          data: response.data,
          message: 'Lấy danh sách trụ thành công'
        };
      } else {
        throw new Error(response.message || 'Không thể lấy danh sách trụ');
      }
    } catch (error) {
      console.error('Get towers by station error:', error);
      const errorInfo = apiUtils.handleError(error);
      return {
        success: false,
        message: errorInfo.message || 'Lỗi khi lấy danh sách trụ',
        error: errorInfo,
        data: [] // Return empty array as fallback
      };
    }
  }
}

export default new StationService();