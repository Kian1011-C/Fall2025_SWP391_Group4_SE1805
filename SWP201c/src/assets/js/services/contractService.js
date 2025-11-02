import { apiUtils, API_CONFIG } from '../config/api.js';

const contractService = {
  /**
   * Lấy danh sách hợp đồng của một user cụ thể
   * API: GET /api/contracts/user/{userId}
   */
  getUserContracts: async (userId) => {
    try {
      // Gọi đến API đúng theo documentation
      const response = await apiUtils.get(API_CONFIG.ENDPOINTS.CONTRACTS.BY_USER(userId));
      
      if (response.success) {
        return { success: true, data: response.data, message: 'Lấy danh sách hợp đồng thành công' };
      } else {
        throw new Error(response.message || 'Không thể lấy danh sách hợp đồng');
      }
    } catch (error) {
      console.error('Lỗi khi lấy danh sách hợp đồng:', error);
      const errorInfo = apiUtils.handleError(error);
      return { success: false, message: errorInfo.message || 'Lỗi API', data: [] };
    }
  },

  /**
   * Lấy plan của một vehicle cụ thể
   * API: GET /api/contracts/vehicle/{vehicleId}/plan
   */
  getVehiclePlan: async (vehicleId) => {
    try {
      const response = await apiUtils.get(`/api/contracts/vehicle/${vehicleId}/plan`);
      
      if (response.success) {
        return { success: true, data: response.data, message: 'Lấy plan thành công' };
      } else {
        throw new Error(response.message || 'Không thể lấy plan');
      }
    } catch (error) {
      console.error('Lỗi khi lấy plan của vehicle:', error);
      const errorInfo = apiUtils.handleError(error);
      return { success: false, message: errorInfo.message || 'Lỗi API', data: null };
    }
  },

  /**
   * Lấy tất cả contracts (cho Admin/Staff)
   * Fallback method để tương thích với code cũ
   */
  getAllContracts: async (filters = {}) => {
    try {
      // Thử gọi API (có thể không tồn tại trong backend)
      const response = await apiUtils.get(API_CONFIG.ENDPOINTS.CONTRACTS.BASE, filters);
      
      if (response.success) {
        return { success: true, data: response.data, message: 'Lấy danh sách hợp đồng thành công' };
      } else {
        throw new Error(response.message || 'Không thể lấy danh sách hợp đồng');
      }
    } catch (error) {
      console.error('Lỗi khi lấy danh sách hợp đồng:', error);
      const errorInfo = apiUtils.handleError(error);
      return { success: false, message: errorInfo.message || 'Lỗi API', data: [] };
    }
  },

  /**
   * Lấy danh sách các gói cước (plans)
   * API: GET /api/contracts/plans
   */
  getPlans: async () => {
    try {
      const response = await apiUtils.get(API_CONFIG.ENDPOINTS.CONTRACTS.PLANS);
      
      if (response.success) {
        return { success: true, data: response.data, message: 'Lấy danh sách gói cước thành công' };
      } else {
        throw new Error(response.message || 'Không thể lấy danh sách gói cước');
      }
    } catch (error) {
      console.error('Lỗi khi lấy danh sách gói cước:', error);
      const errorInfo = apiUtils.handleError(error);
      return { success: false, message: errorInfo.message || 'Lỗi API', data: [] };
    }
  },

  // Alias to match hook naming
  getContractPlans: async () => {
    return await contractService.getPlans();
  },

  /**
   * Tạo hợp đồng mới (theo API BE: POST /api/contracts)
   * Required: userId, vehicleId, startDate, endDate
   * Optional: planId (hoặc planName), signedPlace (mặc định "Hà Nội")
   */
  createContract: async (contractData) => {
    try {
      console.log('ContractService: Create contract', contractData);

      // Validate required fields (theo logic của BE)
      const { userId, vehicleId, startDate, endDate } = contractData;
      
      if (!userId || !vehicleId || !startDate || !endDate) {
        return {
          success: false,
          message: 'Thiếu tham số: userId, vehicleId, startDate, endDate là bắt buộc.'
        };
      }

      // Format date theo yyyy-MM-dd (theo yêu cầu BE)
      let formattedStartDate = startDate;
      let formattedEndDate = endDate;

      // Nếu là Date object, format thành yyyy-MM-dd
      if (startDate instanceof Date) {
        formattedStartDate = startDate.toISOString().split('T')[0];
      }
      if (endDate instanceof Date) {
        formattedEndDate = endDate.toISOString().split('T')[0];
      }

      // Prepare request body (theo logic của BE)
      const requestBody = {
        userId: userId,
        vehicleId: parseInt(vehicleId), // BE yêu cầu Integer
        startDate: formattedStartDate,
        endDate: formattedEndDate,
        signedPlace: contractData.signedPlace || 'Hà Nội' // Mặc định "Hà Nội"
      };

      // Thêm planId hoặc planName (theo logic của BE)
      if (contractData.planId) {
        requestBody.planId = parseInt(contractData.planId);
      } else if (contractData.planName) {
        requestBody.planName = contractData.planName;
      }

      console.log('ContractService: Sending create contract request to /api/contracts', requestBody);
      
      // Gọi API POST /api/contracts
      const response = await apiUtils.post('/api/contracts', requestBody);

      console.log('ContractService: Create contract response:', response);

      // BE trả về { success: boolean, message: string, data: {...} }
      if (response.success) {
        return {
          success: true,
          message: response.message || 'Tạo hợp đồng thành công.',
          data: response.data || {}
        };
      } else {
        return {
          success: false,
          message: response.message || 'Tạo hợp đồng thất bại. Vui lòng thử lại.',
          data: null
        };
      }
    } catch (error) {
      console.error('ContractService: Create contract error:', error);
      const errorInfo = apiUtils.handleError(error);
      
      // Xử lý các error messages từ BE
      let errorMessage = errorInfo.message || 'Lỗi hệ thống khi tạo hợp đồng.';
      
      // Check specific error messages từ BE
      if (errorMessage.includes('Thiếu tham số') || 
          errorMessage.includes('Định dạng ngày') ||
          errorMessage.includes('endDate phải') ||
          errorMessage.includes('Tài khoản không tồn tại') ||
          errorMessage.includes('Xe không thuộc') ||
          errorMessage.includes('Thiếu planId') ||
          errorMessage.includes('Không tìm thấy gói') ||
          errorMessage.includes('đã có hợp đồng active')) {
        // Giữ nguyên message từ BE
      } else {
        errorMessage = 'Lỗi hệ thống: ' + errorMessage;
      }
      
      return {
        success: false,
        message: errorMessage,
        error: errorInfo,
        data: null
      };
    }
  }
};

export default contractService;