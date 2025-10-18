// Battery Service
// Handle battery operations and monitoring

import { API_CONFIG, apiUtils } from '../config/api.js';

class BatteryService {
  async getBatteryStatus(batteryId) {
    try {
      console.log('BatteryService: Get battery status', batteryId);
      
      const response = await apiUtils.get(API_CONFIG.ENDPOINTS.BATTERIES.STATUS(batteryId));
      
      if (response.success) {
        return {
          success: true,
          data: response.data,
          message: 'Lấy trạng thái pin thành công'
        };
      } else {
        throw new Error(response.message || 'Không thể lấy trạng thái pin');
      }
    } catch (error) {
      console.error('Get battery status error:', error);
      const errorInfo = apiUtils.handleError(error);
      return {
        success: false,
        message: errorInfo.message || 'Lỗi khi lấy trạng thái pin',
        error: errorInfo
      };
    }
  }

  async getBatteryHistory(batteryId) {
    try {
      console.log('BatteryService: Get battery history', batteryId);
      
      const response = await apiUtils.get(API_CONFIG.ENDPOINTS.BATTERIES.HISTORY(batteryId));
      
      if (response.success) {
        return {
          success: true,
          data: response.data,
          message: 'Lấy lịch sử pin thành công'
        };
      } else {
        throw new Error(response.message || 'Không thể lấy lịch sử pin');
      }
    } catch (error) {
      console.error('Get battery history error:', error);
      const errorInfo = apiUtils.handleError(error);
      return {
        success: false,
        message: errorInfo.message || 'Lỗi khi lấy lịch sử pin',
        error: errorInfo
      };
    }
  }

  async initiateBatterySwap(swapData) {
    try {
      console.log('BatteryService: Initiate swap', swapData);
      
      const response = await apiUtils.post(API_CONFIG.ENDPOINTS.BATTERIES.SWAP_INITIATE, {
        userId: swapData.userId,
        stationId: swapData.stationId,
        currentBatteryId: swapData.currentBatteryId,
        vehicleId: swapData.vehicleId,
        contractId: swapData.contractId,
        contract_id: swapData.contractId // ✅ Gửi cả 2 format để backend nhận
      });
      
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
      console.error('Initiate battery swap error:', error);
      const errorInfo = apiUtils.handleError(error);
      return {
        success: false,
        message: errorInfo.message || 'Lỗi khi khởi tạo đổi pin',
        error: errorInfo
      };
    }
  }

  async confirmBatterySwap(swapId) {
    try {
      console.log('BatteryService: Confirm swap', swapId);
      
      const response = await apiUtils.post(API_CONFIG.ENDPOINTS.BATTERIES.SWAP_CONFIRM(swapId));
      
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
      console.error('Confirm battery swap error:', error);
      const errorInfo = apiUtils.handleError(error);
      return {
        success: false,
        message: errorInfo.message || 'Lỗi khi xác nhận đổi pin',
        error: errorInfo
      };
    }
  }

  async getBatteryHealth(batteryId) {
    try {
      console.log('BatteryService: Get battery health', batteryId);
      
      const response = await apiUtils.get(API_CONFIG.ENDPOINTS.BATTERIES.HEALTH(batteryId));
      
      if (response.success) {
        return {
          success: true,
          data: response.data,
          message: 'Lấy sức khỏe pin thành công'
        };
      } else {
        throw new Error(response.message || 'Không thể lấy sức khỏe pin');
      }
    } catch (error) {
      console.error('Get battery health error:', error);
      const errorInfo = apiUtils.handleError(error);
      return {
        success: false,
        message: errorInfo.message || 'Lỗi khi lấy sức khỏe pin',
        error: errorInfo
      };
    }
  }

  async getBatteriesByStation(stationId) {
    try {
      console.log('BatteryService: Get batteries by station', stationId);
      
      const response = await apiUtils.get(API_CONFIG.ENDPOINTS.BATTERIES.BY_STATION(stationId));
      
      if (response.success) {
        return {
          success: true,
          data: response.data,
          message: 'Lấy danh sách pin thành công'
        };
      } else {
        throw new Error(response.message || 'Không thể lấy danh sách pin');
      }
    } catch (error) {
      console.error('Get batteries by station error:', error);
      const errorInfo = apiUtils.handleError(error);
      return {
        success: false,
        message: errorInfo.message || 'Lỗi khi lấy danh sách pin',
        error: errorInfo
      };
    }
  }

  async scheduleBatteryMaintenance(batteryId, maintenanceData) {
    try {
      console.log('BatteryService: Schedule maintenance', batteryId, maintenanceData);
      
      const response = await apiUtils.post(API_CONFIG.ENDPOINTS.BATTERIES.MAINTENANCE(batteryId), {
        scheduledDate: maintenanceData.scheduledDate || maintenanceData.maintenanceDate,
        type: maintenanceData.type || 'scheduled',
        notes: maintenanceData.notes || ''
      });
      
      if (response.success) {
        return {
          success: true,
          data: response.data,
          message: 'Lên lịch bảo trì pin thành công'
        };
      } else {
        throw new Error(response.message || 'Không thể lên lịch bảo trì pin');
      }
    } catch (error) {
      console.error('Schedule battery maintenance error:', error);
      const errorInfo = apiUtils.handleError(error);
      return {
        success: false,
        message: errorInfo.message || 'Lỗi khi lên lịch bảo trì pin',
        error: errorInfo
      };
    }
  }

  // Get battery by vehicle ID
  async getBatteryByVehicle(vehicleId) {
    try {
      console.log('BatteryService: Get battery by vehicle', vehicleId);
      
      const response = await apiUtils.get(API_CONFIG.ENDPOINTS.BATTERIES.BY_VEHICLE(vehicleId));
      
      if (response.success) {
        return {
          success: true,
          data: response.data,
          message: 'Lấy thông tin pin xe thành công'
        };
      } else {
        throw new Error(response.message || 'Không thể lấy thông tin pin xe');
      }
    } catch (error) {
      console.error('Get battery by vehicle error:', error);
      const errorInfo = apiUtils.handleError(error);
      return {
        success: false,
        message: errorInfo.message || 'Lỗi khi lấy thông tin pin xe',
        error: errorInfo
      };
    }
  }

  // Get active swaps
  async getActiveSwaps(userId = null) {
    try {
      console.log('BatteryService: Get active swaps', userId);
      
      const params = userId ? { userId } : {};
      const response = await apiUtils.get(API_CONFIG.ENDPOINTS.BATTERIES.SWAP_ACTIVE, params);
      
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

  // Get all batteries with filters
  async getAllBatteries(filters = {}) {
    try {
      const response = await apiUtils.get(API_CONFIG.ENDPOINTS.BATTERIES.BASE, filters);
      
      if (response.success) {
        return {
          success: true,
          data: response.data,
          message: 'Lấy danh sách pin thành công'
        };
      } else {
        throw new Error(response.message || 'Không thể lấy danh sách pin');
      }
    } catch (error) {
      console.error('Get all batteries error:', error);
      const errorInfo = apiUtils.handleError(error);
      return {
        success: false,
        message: errorInfo.message || 'Lỗi khi lấy danh sách pin',
        error: errorInfo
      };
    }
  }

  // Update battery information (Staff feature)
  async updateBattery(batteryId, updateData) {
    try {
      console.log('BatteryService: Update battery', batteryId, updateData);
      
      // Prepare update payload
      const payload = {
        status: updateData.status,
        stateOfHealth: parseFloat(updateData.health) || parseFloat(updateData.stateOfHealth),
        // Backend may use different field names, send both
        health: parseFloat(updateData.health) || parseFloat(updateData.stateOfHealth)
      };

      // Add optional fields if provided
      if (updateData.temperature !== undefined) {
        payload.temperature = parseFloat(updateData.temperature);
      }
      if (updateData.voltage !== undefined) {
        payload.voltage = parseFloat(updateData.voltage);
      }

      const response = await apiUtils.put(`${API_CONFIG.ENDPOINTS.BATTERIES.BASE}/${batteryId}`, payload);
      
      if (response.success) {
        return {
          success: true,
          data: response.data,
          message: 'Cập nhật pin thành công'
        };
      } else {
        throw new Error(response.message || 'Không thể cập nhật pin');
      }
    } catch (error) {
      console.error('Update battery error:', error);
      const errorInfo = apiUtils.handleError(error);
      return {
        success: false,
        message: errorInfo.message || 'Lỗi khi cập nhật pin',
        error: errorInfo
      };
    }
  }

  // Get batteries by station
  async getBatteriesByStation(stationId) {
    try {
      console.log('BatteryService: Get batteries by station', stationId);
      
      const response = await apiUtils.get(`/api/batteries/station/${stationId}`);
      
      if (response.success) {
        return {
          success: true,
          data: response.data,
          message: 'Lấy danh sách pin tại trạm thành công'
        };
      } else {
        throw new Error(response.message || 'Không thể lấy danh sách pin tại trạm');
      }
    } catch (error) {
      console.error('Get batteries by station error:', error);
      const errorInfo = apiUtils.handleError(error);
      return {
        success: false,
        message: errorInfo.message || 'Lỗi khi lấy danh sách pin tại trạm',
        error: errorInfo
      };
    }
  }
}

export default new BatteryService();