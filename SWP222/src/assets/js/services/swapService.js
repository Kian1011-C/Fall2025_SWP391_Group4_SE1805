// Swap Service
// Handle battery swap transactions and operations

import { apiUtils } from '../config/api.js';

class SwapService {
  // Get active swap sessions for user
  async getActiveSwaps(userId) {
    try {
      console.log('SwapService: Get active swaps', userId);
      
      const response = await apiUtils.get('/api/batteries/swap/active', { userId });
      
      if (response.success) {
        return {
          success: true,
          data: response.data || [],
          total: response.total || 0,
          message: 'Lấy giao dịch đang thực hiện thành công'
        };
      } else {
        throw new Error(response.message || 'Không thể lấy giao dịch đang thực hiện');
      }
    } catch (error) {
      console.error('Get active swaps error:', error);
      const errorInfo = apiUtils.handleError(error);
      return {
        success: false,
        message: errorInfo.message || 'Lỗi khi lấy giao dịch đang thực hiện',
        data: [],
        error: errorInfo
      };
    }
  }

  // Get swap history for user
  async getSwapHistory(userId, filters = {}) {
    try {
      console.log('SwapService: Get swap history', userId);
      
      const response = await apiUtils.get(`/api/users/${userId}/swaps`, filters);
      
      if (response.success) {
        return {
          success: true,
          data: response.data || [],
          total: response.total || 0,
          message: 'Lấy lịch sử đổi pin thành công'
        };
      } else {
        throw new Error(response.message || 'Không thể lấy lịch sử đổi pin');
      }
    } catch (error) {
      console.error('Get swap history error:', error);
      const errorInfo = apiUtils.handleError(error);
      
      // SwapController chưa được implement, return empty data
      console.warn('SwapController chưa được implement, trả về dữ liệu rỗng');
      return {
        success: true,
        data: [],
        total: 0,
        message: 'Chưa có lịch sử đổi pin (API chưa được triển khai)',
        error: errorInfo
      };
    }
  }

  // Get swap details by ID
  async getSwapDetails(swapId) {
    try {
      console.log('SwapService: Get swap details', swapId);
      
      const response = await apiUtils.get(`/api/swaps/${swapId}`);
      
      if (response.success) {
        return {
          success: true,
          data: response.data,
          message: 'Lấy chi tiết giao dịch thành công'
        };
      } else {
        throw new Error(response.message || 'Không thể lấy chi tiết giao dịch');
      }
    } catch (error) {
      console.error('Get swap details error:', error);
      const errorInfo = apiUtils.handleError(error);
      return {
        success: false,
        message: errorInfo.message || 'Lỗi khi lấy chi tiết giao dịch',
        error: errorInfo
      };
    }
  }

  // Initiate battery swap
  async initiateSwap(swapData) {
    try {
      console.log('SwapService: Initiate swap', swapData);
      
      const response = await apiUtils.post('/api/batteries/swap/initiate', swapData);
      
      if (response.success) {
        return {
          success: true,
          data: response.data,
          message: 'Khởi tạo đổi pin thành công'
        };
      } else {
        throw new Error(response.message || 'Không thể khởi tạo đổi pin');
      }
    } catch (error) {
      console.error('Initiate swap error:', error);
      const errorInfo = apiUtils.handleError(error);
      return {
        success: false,
        message: errorInfo.message || 'Lỗi khi khởi tạo đổi pin',
        error: errorInfo
      };
    }
  }

  // Confirm battery swap
  async confirmSwap(swapId, confirmationData = {}) {
    try {
      console.log('SwapService: Confirm swap', swapId, confirmationData);
      
      const response = await apiUtils.post(`/api/batteries/swap/${swapId}/confirm`, confirmationData);
      
      if (response.success) {
        return {
          success: true,
          data: response.data,
          message: 'Xác nhận đổi pin thành công'
        };
      } else {
        throw new Error(response.message || 'Không thể xác nhận đổi pin');
      }
    } catch (error) {
      console.error('Confirm swap error:', error);
      const errorInfo = apiUtils.handleError(error);
      return {
        success: false,
        message: errorInfo.message || 'Lỗi khi xác nhận đổi pin',
        error: errorInfo
      };
    }
  }

  // Cancel battery swap
  async cancelSwap(swapId, cancelReason = '') {
    try {
      console.log('SwapService: Cancel swap', swapId, cancelReason);
      
      const response = await apiUtils.post(`/api/swaps/${swapId}/cancel`, { reason: cancelReason });
      
      if (response.success) {
        return {
          success: true,
          data: response.data,
          message: 'Hủy đổi pin thành công'
        };
      } else {
        throw new Error(response.message || 'Không thể hủy đổi pin');
      }
    } catch (error) {
      console.error('Cancel swap error:', error);
      const errorInfo = apiUtils.handleError(error);
      return {
        success: false,
        message: errorInfo.message || 'Lỗi khi hủy đổi pin',
        error: errorInfo
      };
    }
  }

  // Book a swap slot at station
  async bookSwapSlot(bookingData) {
    try {
      console.log('SwapService: Book swap slot', bookingData);
      
      const response = await apiUtils.post('/api/swaps/book-slot', bookingData);
      
      if (response.success) {
        return {
          success: true,
          data: response.data,
          message: 'Đặt chỗ đổi pin thành công'
        };
      } else {
        throw new Error(response.message || 'Không thể đặt chỗ đổi pin');
      }
    } catch (error) {
      console.error('Book swap slot error:', error);
      const errorInfo = apiUtils.handleError(error);
      return {
        success: false,
        message: errorInfo.message || 'Lỗi khi đặt chỗ đổi pin',
        error: errorInfo
      };
    }
  }

  // Get available slots at station
  async getAvailableSlots(stationId, dateTime) {
    try {
      console.log('SwapService: Get available slots', stationId, dateTime);
      
      const response = await apiUtils.get(`/api/stations/${stationId}/available-slots`, { dateTime });
      
      if (response.success) {
        return {
          success: true,
          data: response.data || [],
          message: 'Lấy chỗ trống thành công'
        };
      } else {
        throw new Error(response.message || 'Không thể lấy chỗ trống');
      }
    } catch (error) {
      console.error('Get available slots error:', error);
      const errorInfo = apiUtils.handleError(error);
      return {
        success: false,
        message: errorInfo.message || 'Lỗi khi lấy chỗ trống',
        data: [],
        error: errorInfo
      };
    }
  }

  // Get estimated swap time
  async getEstimatedSwapTime(stationId) {
    try {
      console.log('SwapService: Get estimated swap time', stationId);
      
      const response = await apiUtils.get(`/api/stations/${stationId}/estimated-time`);
      
      if (response.success) {
        return {
          success: true,
          data: response.data,
          message: 'Lấy thời gian ước tính thành công'
        };
      } else {
        // Return default estimate if API fails
        return {
          success: true,
          data: { estimatedTime: 300, queueLength: 0 }, // 5 minutes default
          message: 'Thời gian ước tính mặc định'
        };
      }
    } catch (error) {
      console.error('Get estimated swap time error:', error);
      return {
        success: true,
        data: { estimatedTime: 300, queueLength: 0 },
        message: 'Thời gian ước tính mặc định'
      };
    }
  }

  // Rate swap experience
  async rateSwapExperience(swapId, rating, feedback = '') {
    try {
      console.log('SwapService: Rate swap experience', swapId, rating);
      
      const response = await apiUtils.post(`/api/swaps/${swapId}/rate`, { 
        rating, 
        feedback 
      });
      
      if (response.success) {
        return {
          success: true,
          data: response.data,
          message: 'Đánh giá thành công'
        };
      } else {
        throw new Error(response.message || 'Không thể đánh giá');
      }
    } catch (error) {
      console.error('Rate swap experience error:', error);
      const errorInfo = apiUtils.handleError(error);
      return {
        success: false,
        message: errorInfo.message || 'Lỗi khi đánh giá',
        error: errorInfo
      };
    }
  }

  // Get swap statistics for user
  async getUserSwapStatistics(userId, period = 'month') {
    try {
      console.log('SwapService: Get user swap statistics', userId, period);
      
      const response = await apiUtils.get(`/api/users/${userId}/swap-statistics`, { period });
      
      if (response.success) {
        return {
          success: true,
          data: response.data,
          message: 'Lấy thống kê đổi pin thành công'
        };
      } else {
        throw new Error(response.message || 'Không thể lấy thống kê đổi pin');
      }
    } catch (error) {
      console.error('Get user swap statistics error:', error);
      const errorInfo = apiUtils.handleError(error);
      return {
        success: false,
        message: errorInfo.message || 'Lỗi khi lấy thống kê đổi pin',
        data: this.getDefaultStatistics(),
        error: errorInfo
      };
    }
  }

  // Get swap statuses
  getSwapStatuses() {
    return [
      { id: 'INITIATED', name: 'Đã khởi tạo', color: '#ffa726', icon: '⏳' },
      { id: 'IN_PROGRESS', name: 'Đang thực hiện', color: '#42a5f5', icon: '🔄' },
      { id: 'COMPLETED', name: 'Hoàn thành', color: '#19c37d', icon: '✅' },
      { id: 'CANCELLED', name: 'Đã hủy', color: '#f44336', icon: '❌' },
      { id: 'FAILED', name: 'Thất bại', color: '#ff5722', icon: '⚠️' }
    ];
  }

  // Get cancel reasons
  getCancelReasons() {
    return [
      'Không tìm thấy pin phù hợp',
      'Trạm bảo trì',
      'Thay đổi lịch trình',
      'Sự cố kỹ thuật',
      'Lý do cá nhân khác'
    ];
  }

  // Format swap duration
  formatSwapDuration(startTime, endTime) {
    if (!startTime || !endTime) return 'N/A';
    
    const duration = new Date(endTime) - new Date(startTime);
    const minutes = Math.floor(duration / 60000);
    const seconds = Math.floor((duration % 60000) / 1000);
    
    if (minutes > 0) {
      return `${minutes}:${seconds.toString().padStart(2, '0')}`;
    }
    return `${seconds}s`;
  }

  // Calculate swap efficiency
  calculateSwapEfficiency(estimatedTime, actualTime) {
    if (!estimatedTime || !actualTime) return null;
    
    const efficiency = (estimatedTime / actualTime) * 100;
    return Math.round(efficiency * 10) / 10; // Round to 1 decimal place
  }

  // Get default statistics (fallback)
  getDefaultStatistics() {
    return {
      totalSwaps: 0,
      successRate: 0,
      averageTime: 0,
      totalTimeSaved: 0,
      favoriteStation: null,
      monthlySummary: {
        thisMonth: 0,
        lastMonth: 0,
        change: 0
      }
    };
  }

  // Check if swap is in progress
  isSwapInProgress(swapStatus) {
    return ['INITIATED', 'IN_PROGRESS'].includes(swapStatus);
  }

  // Check if swap can be cancelled
  canCancelSwap(swapStatus) {
    return ['INITIATED'].includes(swapStatus);
  }

  // Check if swap can be rated
  canRateSwap(swapStatus, hasRating) {
    return swapStatus === 'COMPLETED' && !hasRating;
  }
}

export default new SwapService();