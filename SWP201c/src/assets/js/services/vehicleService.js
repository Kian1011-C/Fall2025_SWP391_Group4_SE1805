// Vehicle Service
// Handle vehicle operations and management

import { apiUtils, API_CONFIG } from '../config/api.js';

// Demo fallback data khi backend không khả dụng
const DEMO_VEHICLES = {
  'driver001': [
    {
      id: 'vehicle001',
      userId: 'driver001',
      licensePlate: '30B-67890',
      brand: 'VinFast',
      model: 'VF-8',
      year: 2024,
      color: 'Đỏ',
      vin: '__90IBCDEF',
      batteryType: 'LiFePO4-60kWh',
      status: 'active',
      currentBatteryId: 'battery001',
      batteryHealth: 91.2,
      mileage: 8785.6
    },
    {
      id: 'vehicle002',
      userId: 'driver001',
      licensePlate: '30A-12345',
      brand: 'VinFast',
      model: 'VF-e34',
      year: 2024,
      color: 'Xanh',
      vin: '__89OABCDE',
      batteryType: 'LiFePO4-60kWh',
      status: 'active',
      currentBatteryId: 'battery002',
      batteryHealth: 88.7,
      mileage: 15490.7
    }
  ],
  'driver002': [
    {
      id: 'vehicle003',
      userId: 'driver002',
      licensePlate: '29C-54321',
      brand: 'VinFast',
      model: 'VF-9',
      year: 2024,
      color: 'Trắng',
      vin: '__88XYZABC',
      batteryType: 'LiFePO4-90kWh',
      status: 'active',
      currentBatteryId: 'battery003',
      batteryHealth: 95.5,
      mileage: 12300
    }
  ]
};

class VehicleService {
  // Get all vehicles for a user
  async getUserVehicles(userId) {
    try {
      console.log('VehicleService: Get user vehicles', userId);
      
      const response = await apiUtils.get(`/api/users/${userId}/vehicles`);
      
      if (response.success) {
        return {
          success: true,
          data: response.data || [],
          total: response.total || 0,
          message: 'Lấy danh sách phương tiện thành công'
        };
      } else {
        throw new Error(response.message || 'Không thể lấy danh sách phương tiện');
      }
    } catch (error) {
      console.error('Get user vehicles error:', error);
      const errorInfo = apiUtils.handleError(error);
      
      // Yêu cầu: Không sử dụng mock data cho màn chọn xe → không fallback demo
      
      return {
        success: false,
        message: errorInfo.message || 'Lỗi khi lấy danh sách phương tiện',
        data: [],
        error: errorInfo
      };
    }
  }

  // Get vehicle by ID
  async getVehicleById(vehicleId) {
    try {
      console.log('VehicleService: Get vehicle by ID', vehicleId);
      
      const response = await apiUtils.get(`/api/vehicles/${vehicleId}`);
      
      if (response.success) {
        return {
          success: true,
          data: response.data,
          message: 'Lấy thông tin phương tiện thành công'
        };
      } else {
        throw new Error(response.message || 'Không thể lấy thông tin phương tiện');
      }
    } catch (error) {
      console.error('Get vehicle by ID error:', error);
      const errorInfo = apiUtils.handleError(error);
      return {
        success: false,
        message: errorInfo.message || 'Lỗi khi lấy thông tin phương tiện',
        error: errorInfo
      };
    }
  }

  // Add new vehicle
  async addVehicle(vehicleData) {
    try {
      console.log('VehicleService: Add vehicle', vehicleData);
      
      const response = await apiUtils.post('/api/vehicles', vehicleData);
      
      if (response.success) {
        return {
          success: true,
          data: response.data,
          message: 'Thêm phương tiện thành công'
        };
      } else {
        throw new Error(response.message || 'Không thể thêm phương tiện');
      }
    } catch (error) {
      console.error('Add vehicle error:', error);
      const errorInfo = apiUtils.handleError(error);
      return {
        success: false,
        message: errorInfo.message || 'Lỗi khi thêm phương tiện',
        error: errorInfo
      };
    }
  }

  // Update vehicle
  async updateVehicle(vehicleId, vehicleData) {
    try {
      console.log('VehicleService: Update vehicle', vehicleId, vehicleData);
      
      const response = await apiUtils.put(`/api/vehicles/${vehicleId}`, vehicleData);
      
      if (response.success) {
        return {
          success: true,
          data: response.data,
          message: 'Cập nhật phương tiện thành công'
        };
      } else {
        throw new Error(response.message || 'Không thể cập nhật phương tiện');
      }
    } catch (error) {
      console.error('Update vehicle error:', error);
      const errorInfo = apiUtils.handleError(error);
      return {
        success: false,
        message: errorInfo.message || 'Lỗi khi cập nhật phương tiện',
        error: errorInfo
      };
    }
  }

  // Delete vehicle
  async deleteVehicle(vehicleId) {
    try {
      console.log('VehicleService: Delete vehicle', vehicleId);
      
      const response = await apiUtils.delete(`/api/vehicles/${vehicleId}`);
      
      if (response.success) {
        return {
          success: true,
          message: 'Xóa phương tiện thành công'
        };
      } else {
        throw new Error(response.message || 'Không thể xóa phương tiện');
      }
    } catch (error) {
      console.error('Delete vehicle error:', error);
      const errorInfo = apiUtils.handleError(error);
      return {
        success: false,
        message: errorInfo.message || 'Lỗi khi xóa phương tiện',
        error: errorInfo
      };
    }
  }

  // Get vehicle battery info
  async getVehicleBatteryInfo(vehicleId) {
    try {
      console.log('VehicleService: Get vehicle battery info', vehicleId);
      
      const response = await apiUtils.get(`/api/batteries/vehicle/${vehicleId}`);
      
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
      console.error('Get vehicle battery info error:', error);
      const errorInfo = apiUtils.handleError(error);
      return {
        success: false,
        message: errorInfo.message || 'Lỗi khi lấy thông tin pin xe',
        error: errorInfo
      };
    }
  }

  // Register vehicle for service
  async registerVehicleForService(vehicleId, serviceData) {
    try {
      console.log('VehicleService: Register vehicle for service', vehicleId, serviceData);
      
      const response = await apiUtils.post(`/api/vehicles/${vehicleId}/register-service`, serviceData);
      
      if (response.success) {
        return {
          success: true,
          data: response.data,
          message: 'Đăng ký dịch vụ cho xe thành công'
        };
      } else {
        throw new Error(response.message || 'Không thể đăng ký dịch vụ cho xe');
      }
    } catch (error) {
      console.error('Register vehicle for service error:', error);
      const errorInfo = apiUtils.handleError(error);
      return {
        success: false,
        message: errorInfo.message || 'Lỗi khi đăng ký dịch vụ cho xe',
        error: errorInfo
      };
    }
  }

  // Get vehicle service history
  async getVehicleServiceHistory(vehicleId) {
    try {
      console.log('VehicleService: Get vehicle service history', vehicleId);
      
      const response = await apiUtils.get(`/api/vehicles/${vehicleId}/service-history`);
      
      if (response.success) {
        return {
          success: true,
          data: response.data || [],
          message: 'Lấy lịch sử dịch vụ xe thành công'
        };
      } else {
        throw new Error(response.message || 'Không thể lấy lịch sử dịch vụ xe');
      }
    } catch (error) {
      console.error('Get vehicle service history error:', error);
      const errorInfo = apiUtils.handleError(error);
      return {
        success: false,
        message: errorInfo.message || 'Lỗi khi lấy lịch sử dịch vụ xe',
        data: [],
        error: errorInfo
      };
    }
  }

  // Get vehicle types for dropdown
  getVehicleTypes() {
    return [
      { id: 'motorcycle', name: 'Xe máy điện', icon: '🏍️' },
      { id: 'scooter', name: 'Xe scooter điện', icon: '🛵' },
      { id: 'bicycle', name: 'Xe đạp điện', icon: '🚲' },
      { id: 'car', name: 'Ô tô điện', icon: '🚗' }
    ];
  }

  // Get popular vehicle brands
  getVehicleBrands() {
    return [
      'VinFast', 'Honda', 'Yamaha', 'SYM', 'Piaggio', 
      'BMW', 'Audi', 'Tesla', 'Gogoro', 'Yadea', 'Dibao'
    ];
  }

  // Validate license plate format
  validateLicensePlate(licensePlate) {
    // Vietnamese license plate format: XX-XXXXX or XXX-XXXX
    const patterns = [
      /^\d{2}[A-Z]-\d{4,5}$/,           // 29A-12345
      /^\d{2}[A-Z]\d-\d{4,5}$/,        // 29A1-12345
      /^\d{2}[A-Z]{2}-\d{3,4}$/,       // 29AB-1234
      /^\d{3}[A-Z]-\d{3,4}$/           // 123A-1234
    ];
    
    return patterns.some(pattern => pattern.test(licensePlate.toUpperCase()));
  }

  // Calculate estimated range based on battery capacity
  calculateEstimatedRange(batteryCapacity, vehicleType = 'motorcycle') {
    const efficiencyMap = {
      'motorcycle': 30,  // km per kWh
      'scooter': 35,
      'bicycle': 50,
      'car': 15
    };
    
    const efficiency = efficiencyMap[vehicleType] || 30;
    return Math.round(batteryCapacity * efficiency);
  }

  // Update vehicle battery level after swap
  async updateVehicleBattery(vehicleId, newBatteryLevel) {
    try {
      console.log('VehicleService: Update vehicle battery', vehicleId, newBatteryLevel);
      
      const response = await apiUtils.put(`/api/vehicles/${vehicleId}/battery`, {
        batteryLevel: newBatteryLevel,
        health: newBatteryLevel
      });
      
      if (response.success) {
        return {
          success: true,
          data: response.data,
          message: 'Cập nhật pin xe thành công'
        };
      } else {
        throw new Error(response.message || 'Không thể cập nhật pin xe');
      }
    } catch (error) {
      console.error('Update vehicle battery error:', error);
      const errorInfo = apiUtils.handleError(error);
      return {
        success: false,
        message: errorInfo.message || 'Lỗi khi cập nhật pin xe',
        error: errorInfo
      };
    }
  }
}

export default new VehicleService();