import { apiUtils } from '../config/api.js';

class SwapService {
  /**
   * Lấy lịch sử các lần đổi pin của một người dùng cụ thể.
   * API: GET /api/users/{userId}/swaps
   * @param {string} userId - ID của người dùng
   */
  async getSwapHistory(userId) {
    try {
      console.log('SwapService: Lấy lịch sử đổi pin cho người dùng', userId);

      const response = await apiUtils.get(`/api/users/${userId}/swaps`);

      if (response.success) {
        return {
          success: true,
          data: response.data,
          message: 'Lấy lịch sử đổi pin thành công'
        };
      } else {
        throw new Error(response.message || 'Không thể lấy lịch sử đổi pin');
      }
    } catch (error) {
      console.error('Lỗi khi lấy lịch sử đổi pin:', error);
      
      // Nếu API chưa sẵn sàng, trả về mock data để trang hoạt động
      if (error.response?.status === 404) {
        console.log('⚠️ API /api/users/{userId}/swaps chưa sẵn sàng, sử dụng mock data');
        return {
          success: true,
          data: this.getMockSwapHistory(),
          message: 'Lấy lịch sử đổi pin (dữ liệu mẫu)'
        };
      }
      
      const errorInfo = apiUtils.handleError(error);
      return {
        success: false,
        message: errorInfo.message || 'Lỗi khi lấy lịch sử đổi pin',
        error: errorInfo
      };
    }
  }

  /**
   * Lấy tất cả các lần đổi pin (cho Admin/Staff)
   * API: GET /api/swaps
   */
  async getAllSwaps() {
    try {
      console.log('SwapService: Lấy tất cả lịch sử đổi pin');
      
      const response = await apiUtils.get('/api/swaps');
      
      if (response.success) {
        return {
          success: true,
          data: response.data,
          message: 'Lấy tất cả lịch sử đổi pin thành công'
        };
      } else {
        throw new Error(response.message || 'Không thể lấy lịch sử đổi pin');
      }
    } catch (error) {
      console.error('Lỗi khi lấy tất cả lịch sử đổi pin:', error);
      const errorInfo = apiUtils.handleError(error);
      return {
        success: false,
        message: errorInfo.message || 'Lỗi khi lấy lịch sử đổi pin',
        error: errorInfo
      };
    }
  }

  /**
   * Lấy chi tiết một lần đổi pin
   * API: GET /api/swaps/{swapId}
   * @param {string} swapId - ID của lần đổi pin
   */
  async getSwapById(swapId) {
    try {
      console.log('SwapService: Lấy chi tiết lần đổi pin', swapId);
      
      const response = await apiUtils.get(`/api/swaps/${swapId}`);
      
      if (response.success) {
        return {
          success: true,
          data: response.data,
          message: 'Lấy chi tiết lần đổi pin thành công'
        };
      } else {
        throw new Error(response.message || 'Không thể lấy chi tiết lần đổi pin');
      }
    } catch (error) {
      console.error('Lỗi khi lấy chi tiết lần đổi pin:', error);
      const errorInfo = apiUtils.handleError(error);
      return {
        success: false,
        message: errorInfo.message || 'Lỗi khi lấy chi tiết lần đổi pin',
        error: errorInfo
      };
    }
  }

  /**
   * Hủy một lần đổi pin
   * API: DELETE /api/swaps/{swapId}/cancel
   * @param {string} swapId - ID của lần đổi pin
   */
  async cancelSwap(swapId) {
    try {
      console.log('SwapService: Hủy lần đổi pin', swapId);
      
      const response = await apiUtils.delete(`/api/swaps/${swapId}/cancel`);
      
      if (response.success) {
            return {
          success: true,
          data: response.data,
          message: 'Hủy lần đổi pin thành công'
        };
      } else {
        throw new Error(response.message || 'Không thể hủy lần đổi pin');
      }
        } catch (error) {
      console.error('Lỗi khi hủy lần đổi pin:', error);
      const errorInfo = apiUtils.handleError(error);
      return {
        success: false,
        message: errorInfo.message || 'Lỗi khi hủy lần đổi pin',
        error: errorInfo
      };
    }
  }

  /**
   * Đánh giá một lần đổi pin
   * API: POST /api/swaps/{swapId}/rate
   * @param {string} swapId - ID của lần đổi pin
   * @param {object} ratingData - Dữ liệu đánh giá
   */
  async rateSwap(swapId, ratingData) {
    try {
      console.log('SwapService: Đánh giá lần đổi pin', swapId, ratingData);
      
      const response = await apiUtils.post(`/api/swaps/${swapId}/rate`, ratingData);

            if (response.success) {
        return {
          success: true,
          data: response.data,
          message: 'Đánh giá lần đổi pin thành công'
        };
            } else {
        throw new Error(response.message || 'Không thể đánh giá lần đổi pin');
            }
        } catch (error) {
      console.error('Lỗi khi đánh giá lần đổi pin:', error);
      const errorInfo = apiUtils.handleError(error);
      return {
        success: false,
        message: errorInfo.message || 'Lỗi khi đánh giá lần đổi pin',
        error: errorInfo
      };
    }
  }

  /**
   * Mock data cho lịch sử đổi pin (khi API chưa sẵn sàng)
   */
  getMockSwapHistory() {
    return [
      {
        id: 'swap_001',
        userId: 'driver001',
        vehicleId: 'vehicle_001',
        oldBatteryId: 'battery_old_001',
        newBatteryId: 'battery_new_001',
        stationId: 'station_001',
        status: 'completed',
        createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        completedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000 + 5 * 60 * 1000).toISOString()
      },
      {
        id: 'swap_002',
        userId: 'driver001',
        vehicleId: 'vehicle_001',
        oldBatteryId: 'battery_old_002',
        newBatteryId: 'battery_new_002',
        stationId: 'station_002',
        status: 'completed',
        createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
        completedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000 + 4 * 60 * 1000).toISOString()
      },
      {
        id: 'swap_003',
        userId: 'driver001',
        vehicleId: 'vehicle_001',
        oldBatteryId: 'battery_old_003',
        newBatteryId: 'battery_new_003',
        stationId: 'station_001',
        status: 'completed',
        createdAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
        completedAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000 + 6 * 60 * 1000).toISOString()
      }
    ];
  }
}

export default new SwapService();