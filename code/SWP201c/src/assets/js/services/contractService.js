// Contract Service
// Handle contract operations and management

import { API_CONFIG, apiUtils } from '../config/api.js';

class ContractService {
  async createContract(contractData) {
    try {
      console.log('ContractService: Create contract', contractData);
      
      const response = await apiUtils.post(API_CONFIG.ENDPOINTS.CONTRACTS.BASE, {
        userId: contractData.userId,
        planId: contractData.planId,
        startDate: contractData.startDate,
        terms: contractData.terms
      });
      
      if (response.success) {
        return {
          success: true,
          data: response.data,
          message: 'Tạo hợp đồng thành công'
        };
      } else {
        throw new Error(response.message || 'Không thể tạo hợp đồng');
      }
    } catch (error) {
      console.error('Create contract error:', error);
      const errorInfo = apiUtils.handleError(error);
      return {
        success: false,
        message: errorInfo.message || 'Lỗi khi tạo hợp đồng',
        error: errorInfo
      };
    }
  }

  async getContracts(userId) {
    try {
      console.log('ContractService: Get contracts for user', userId);
      
      const response = await apiUtils.get(API_CONFIG.ENDPOINTS.CONTRACTS.BY_USER(userId));
      
      if (response.success) {
        return {
          success: true,
          data: response.data,
          message: 'Lấy danh sách hợp đồng thành công'
        };
      } else {
        throw new Error(response.message || 'Không thể lấy danh sách hợp đồng');
      }
    } catch (error) {
      console.error('Get contracts error:', error);
      const errorInfo = apiUtils.handleError(error);
      
      // If it's a network error, try to parse the actual response
      if (error.response && error.response.data) {
        return {
          success: error.response.data.success || false,
          data: error.response.data.data || [],
          message: error.response.data.message || 'Lỗi từ server'
        };
      }
      
      return {
        success: false,
        data: [],
        message: errorInfo.message || 'Lỗi khi lấy danh sách hợp đồng',
        error: errorInfo
      };
    }
  }

  // Get active contract for a user
  async getActiveContract(userId) {
    try {
      const response = await apiUtils.get(`/api/contracts/user/${userId}`);
      if (response?.success) {
        const contracts = Array.isArray(response.data) ? response.data : (response.data?.contracts || []);
        const active = contracts.find(c => c.status === 'active') || null;
        return { success: true, data: active };
      }
      return { success: false, data: null, message: response?.message || 'Không thể lấy hợp đồng đang hoạt động' };
    } catch (error) {
      const errorInfo = apiUtils.handleError(error);
      return { success: false, data: null, message: errorInfo.message };
    }
  }

  async updateContract(contractId, updates) {
    try {
      console.log('ContractService: Update contract', contractId, updates);
      
      const response = await apiUtils.put(`${API_CONFIG.ENDPOINTS.CONTRACTS.BASE}/${contractId}`, updates);
      
      if (response.success) {
        return {
          success: true,
          data: response.data,
          message: 'Cập nhật hợp đồng thành công'
        };
      } else {
        throw new Error(response.message || 'Không thể cập nhật hợp đồng');
      }
    } catch (error) {
      console.error('Update contract error:', error);
      const errorInfo = apiUtils.handleError(error);
      return {
        success: false,
        message: errorInfo.message || 'Lỗi khi cập nhật hợp đồng',
        error: errorInfo
      };
    }
  }

  async terminateContract(contractId) {
    try {
      console.log('ContractService: Terminate contract', contractId);
      
      const response = await apiUtils.post(`${API_CONFIG.ENDPOINTS.CONTRACTS.BASE}/${contractId}/terminate`);
      
      if (response.success) {
        return {
          success: true,
          data: response.data,
          message: 'Chấm dứt hợp đồng thành công'
        };
      } else {
        throw new Error(response.message || 'Không thể chấm dứt hợp đồng');
      }
    } catch (error) {
      console.error('Terminate contract error:', error);
      const errorInfo = apiUtils.handleError(error);
      return {
        success: false,
        message: errorInfo.message || 'Lỗi khi chấm dứt hợp đồng',
        error: errorInfo
      };
    }
  }

  async getContractDetails(contractId) {
    try {
      console.log('ContractService: Get contract details', contractId);
      
      const response = await apiUtils.get(`${API_CONFIG.ENDPOINTS.CONTRACTS.BASE}/${contractId}`);
      
      if (response.success) {
        return {
          success: true,
          data: response.data,
          message: 'Lấy chi tiết hợp đồng thành công'
        };
      } else {
        throw new Error(response.message || 'Không thể lấy chi tiết hợp đồng');
      }
    } catch (error) {
      console.error('Get contract details error:', error);
      const errorInfo = apiUtils.handleError(error);
      return {
        success: false,
        message: errorInfo.message || 'Lỗi khi lấy chi tiết hợp đồng',
        error: errorInfo
      };
    }
  }

  async getContractPlans() {
    try {
      console.log('ContractService: Get contract plans');
      
      const response = await apiUtils.get(API_CONFIG.ENDPOINTS.CONTRACTS.PLANS);
      
      if (response.success) {
        return {
          success: true,
          data: response.data,
          message: 'Lấy gói dịch vụ thành công'
        };
      } else {
        throw new Error(response.message || 'Không thể lấy gói dịch vụ');
      }
    } catch (error) {
      console.error('Get contract plans error:', error);
      const errorInfo = apiUtils.handleError(error);
      return {
        success: false,
        message: errorInfo.message || 'Lỗi khi lấy gói dịch vụ',
        error: errorInfo
      };
    }
  }

  async processContractBilling(contractId) {
    try {
      console.log('ContractService: Process contract billing', contractId);
      
      const response = await apiUtils.post(API_CONFIG.ENDPOINTS.CONTRACTS.BILLING(contractId));
      
      if (response.success) {
        return {
          success: true,
          data: response.data,
          message: 'Xử lý thanh toán hợp đồng thành công'
        };
      } else {
        throw new Error(response.message || 'Không thể xử lý thanh toán hợp đồng');
      }
    } catch (error) {
      console.error('Process contract billing error:', error);
      const errorInfo = apiUtils.handleError(error);
      return {
        success: false,
        message: errorInfo.message || 'Lỗi khi xử lý thanh toán hợp đồng',
        error: errorInfo
      };
    }
  }

}

export default new ContractService();