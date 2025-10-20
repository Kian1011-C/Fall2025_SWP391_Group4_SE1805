// Swap Service (Monolithic - restored)
// Handle battery swap transactions and operations

import { apiUtils } from '../config/api.js';
import stationService from './stationService.js';
import { devLog, DEV_CONFIG } from '../config/development.js';

class SwapService {
  // ------------- Helpers -------------
  normalizeSwapItem(item) {
    if (!item || typeof item !== 'object') return item;
    const station = item.station || item.stationInfo || {};
    const stationName = item.stationName || station.name || station.stationName || item.station_name || null;
    const id = item.swapId || item.id || item.swap_id || null;
    const time = item.time || item.swapDate || item.swapTime || item.timestamp || item.performedAt || null;
    const createdAt = item.createdAt || item.created_at || time || null;
    const oldBattery = item.oldBattery ?? item.oldBatteryLevel ?? item.beforeLevel ?? item.before_battery_level ?? null;
    const newBattery = item.newBattery ?? item.newBatteryLevel ?? item.afterLevel ?? item.after_battery_level ?? null;
    return { ...item, swapId: id, stationName, time, createdAt, oldBattery, newBattery };
  }

  getDefaultStatistics() {
    return {
      totalSwaps: 0,
      successRate: 0,
      averageTime: 0,
      totalTimeSaved: 0,
      favoriteStation: null,
      monthlySummary: { thisMonth: 0, lastMonth: 0, change: 0 }
    };
  }

  isSwapInProgress(status) { return ['INITIATED', 'IN_PROGRESS'].includes(status); }
  canCancelSwap(status) { return ['INITIATED'].includes(status); }
  canRateSwap(status, hasRating) { return status === 'COMPLETED' && !hasRating; }
  formatSwapDuration(startTime, endTime) {
    if (!startTime || !endTime) return 'N/A';
    const duration = new Date(endTime) - new Date(startTime);
    const minutes = Math.floor(duration / 60000);
    const seconds = Math.floor((duration % 60000) / 1000);
    return minutes > 0 ? `${minutes}:${String(seconds).padStart(2, '0')}` : `${seconds}s`;
  }

  // ------------- Core APIs -------------
  async initiateSwap(swapData) {
    const response = await apiUtils.post('/api/batteries/swap/initiate', swapData);
    return response;
  }

  async startSwap(swapData) {
    const response = await apiUtils.post('/api/batteries/swap/start', swapData);
    return response;
  }

  async placeOldBattery(placeData) {
    const response = await apiUtils.post('/api/batteries/swap/place-old-battery', placeData);
    return response;
  }

  async confirmSwap(swapId) {
    const response = await apiUtils.post(`/api/batteries/swap/${swapId}/confirm`);
    return response;
  }

  async getActiveSwaps(userId) {
    const response = await apiUtils.get('/api/batteries/swap/active', { userId });
    return response;
  }

  async getSwapHistory(userId, filters = {}) {
    const response = await apiUtils.get(`/api/users/${userId}/swaps`, filters);
    return response;
  }

  // Used by dashboard - includes normalization and station name enrichment
  async getUserSwaps(userId, filters = {}) {
    try {
      const response = await apiUtils.get(`/api/users/${userId}/swaps`, filters);
      const raw = Array.isArray(response?.data) ? response.data : (response?.data?.items || response?.data?.swaps || []);
      const normalized = (raw || []).map((s) => this.normalizeSwapItem(s));

      let enriched = normalized;
      const needStationNames = normalized.some(s => !s.stationName && (s.stationId || s.station_id));
      if (needStationNames) {
        try {
          const stationsResp = await stationService.getAllStations();
          const list = stationsResp?.data || [];
          const map = new Map(list.map(st => [st.id || st.stationId, st.name || st.stationName]));
          enriched = normalized.map(s => {
            const sid = s.stationId || s.station_id;
            const name = s.stationName || (sid ? map.get(sid) : null);
            return name ? { ...s, stationName: name } : s;
          });
        } catch (e) {
          console.warn('SwapService: station enrichment failed:', e?.message);
        }
      }

      return { success: true, data: enriched, total: enriched.length, message: 'Lấy lịch sử đổi pin thành công' };
    } catch (error) {
      const err = apiUtils.handleError(error);
      return { success: false, data: [], total: 0, message: err.message || 'Lỗi khi lấy lịch sử đổi pin', error: err };
    }
  }

  async getSwapDetails(swapId) {
    const response = await apiUtils.get(`/api/swaps/${swapId}`);
    return response;
  }

  async cancelSwap(swapId, cancelReason = '') {
    const response = await apiUtils.post(`/api/swaps/${swapId}/cancel`, { reason: cancelReason });
    return response;
  }

  async bookSwapSlot(bookingData) {
    const response = await apiUtils.post('/api/swaps/book-slot', bookingData);
    return response;
  }

  async getAvailableSlots(stationId, dateTime) {
    const response = await apiUtils.get(`/api/stations/${stationId}/available-slots`, { dateTime });
    return response;
  }

  async getEstimatedSwapTime(stationId) {
    const response = await apiUtils.get(`/api/stations/${stationId}/estimated-time`);
    return response;
  }

  async rateSwapExperience(swapId, rating, feedback = '') {
    const response = await apiUtils.post(`/api/swaps/${swapId}/rate`, { rating, feedback });
    return response;
  }

  async getUserSwapStatistics(userId, period = 'month') {
    try {
      const response = await apiUtils.get(`/api/users/${userId}/swap-statistics`, { period });
      if (response?.success) return response;
      return { success: false, data: this.getDefaultStatistics() };
    } catch (error) {
      return { success: false, data: this.getDefaultStatistics(), message: error?.message };
    }
  }

  async getSwapCountSummary(userId) {
    try {
      const endpoints = [
        `/api/users/${userId}/swaps`,
        `/api/swaps?userId=${userId}`,
        `/api/batteries/swap/user/${userId}`,
        `/api/swaps/user/${userId}`
      ];
      for (const endpoint of endpoints) {
        try {
          const response = await apiUtils.get(endpoint);
          if (response?.success) {
            const swaps = Array.isArray(response.data) ? response.data : (response.data?.swaps || []);
            return { success: true, data: { totalSwaps: swaps.length, endpoint } };
          }
        } catch { /* try next */ }
      }
      return { success: false, data: { totalSwaps: 0, endpoint: 'none' }, message: 'Không thể kết nối đến server' };
    } catch (error) {
      return { success: false, data: { totalSwaps: 0, error: error?.message } };
    }
  }

  getSwapStatuses() {
    return [
      { id: 'INITIATED', name: 'Đã khởi tạo', color: '#ffa726', icon: '⏳' },
      { id: 'IN_PROGRESS', name: 'Đang thực hiện', color: '#42a5f5', icon: '🔄' },
      { id: 'COMPLETED', name: 'Hoàn thành', color: '#19c37d', icon: '✅' },
      { id: 'CANCELLED', name: 'Đã hủy', color: '#f44336', icon: '❌' },
      { id: 'FAILED', name: 'Thất bại', color: '#ff5722', icon: '⚠️' }
    ];
  }

  getCancelReasons() {
    return [
      'Không tìm thấy pin phù hợp',
      'Trạm bảo trì',
      'Thay đổi lịch trình',
      'Sự cố kỹ thuật',
      'Lý do cá nhân khác'
    ];
  }

  // ------------- Assistance (Staff) -------------
  async requestStaffAssistance(assistanceData) {
    const response = await apiUtils.post('/api/swaps/request-assistance', assistanceData);
    return response;
  }
  async getPendingAssistanceRequests(stationId = null) {
    const params = stationId ? { stationId } : {};
    const response = await apiUtils.get('/api/swaps/assistance-requests', params);
    return response;
  }
  async acceptAssistanceRequest(requestId, staffId) {
    const response = await apiUtils.post(`/api/swaps/assistance-requests/${requestId}/accept`, { staffId });
    return response;
  }
  async completeAssistanceRequest(requestId, completionData) {
    const response = await apiUtils.post(`/api/swaps/assistance-requests/${requestId}/complete`, completionData);
    return response;
  }

  // ------------- Misc -------------
  async checkBackendHealth() {
    try {
      const response = await apiUtils.get('/api/stations', {}, { timeout: 5000 });
      return response?.success || response?.data !== undefined;
    } catch {
      try {
        const response = await apiUtils.get('/api/vehicles', {}, { timeout: 5000 });
        return response?.success || response?.data !== undefined;
      } catch {
        devLog('warn', 'Backend health check failed, assuming backend is not available');
        return false;
      }
    }
  }

  async requestSwap(payload) {
    try {
      if (DEV_CONFIG.BACKEND_CHECK.ENABLED) {
        const ok = await this.checkBackendHealth();
        if (!ok) return { success: false, message: 'Không thể kết nối đến server.', endpoint: 'none' };
      }
      const endpoints = ['/api/swaps', '/api/batteries/swap', '/api/swaps/request', '/api/battery-swaps'];
      for (const endpoint of endpoints) {
        try {
          const response = await apiUtils.post(endpoint, payload);
          if (response?.success || response?.data) {
            return { success: true, data: response.data || response, message: response.message || 'Yêu cầu đổi pin thành công', endpoint };
          }
        } catch { continue; }
      }
      return { success: false, message: 'Không thể kết nối đến server. Vui lòng thử lại.', endpoint: 'none' };
    } catch (error) {
      return { success: false, message: 'Lỗi hệ thống khi gửi yêu cầu đổi pin.', error: error?.message, endpoint: 'none' };
    }
  }
}

const swapService = new SwapService();
export default swapService;
export { swapService };

