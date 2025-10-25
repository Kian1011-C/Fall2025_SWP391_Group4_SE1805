// Payment Service
// Handle payment processing and transactions

import { API_CONFIG, apiUtils } from '../config/api.js';

class PaymentService {
  async processPayment(paymentData) {
    try {
      console.log('PaymentService: Process payment', paymentData);
      
      const response = await apiUtils.post(API_CONFIG.ENDPOINTS.PAYMENTS.PROCESS, {
        amount: paymentData.amount,
        userId: paymentData.userId,
        contractId: paymentData.contractId,
        paymentMethod: paymentData.paymentMethod,
        description: paymentData.description
      });
      
      if (response.success) {
        return {
          success: true,
          data: response.data,
          message: 'Thanh toán thành công'
        };
      } else {
        throw new Error(response.message || 'Thanh toán thất bại');
      }
    } catch (error) {
      console.error('Process payment error:', error);
      const errorInfo = apiUtils.handleError(error);
      return {
        success: false,
        message: errorInfo.message || 'Lỗi khi xử lý thanh toán',
        error: errorInfo
      };
    }
  }

  async getPaymentHistory(userId) {
    try {
      console.log('PaymentService: Get payment history for user', userId);
      
      // Try the correct API endpoint first: GET /api/users/{userId}/payments
      let response;
      try {
        response = await apiUtils.get(`/api/users/${userId}/payments`);
      } catch (error) {
        // If 404, try the old endpoint as fallback
        if (error.response?.status === 404) {
          console.log('⚠️ /api/users/{userId}/payments not found, trying fallback endpoint...');
          try {
            response = await apiUtils.get(API_CONFIG.ENDPOINTS.PAYMENTS.HISTORY(userId));
          } catch (fallbackError) {
            // If both endpoints fail, return mock data for development
            console.log('⚠️ Both payment endpoints failed, returning mock data');
            return {
              success: true,
              data: this.getMockPaymentHistory(),
              message: 'Lấy lịch sử thanh toán (dữ liệu mẫu)'
            };
          }
        } else {
          throw error;
        }
      }
      
      if (response.success) {
        return {
          success: true,
          data: response.data,
          message: 'Lấy lịch sử thanh toán thành công'
        };
      } else {
        throw new Error(response.message || 'Không thể lấy lịch sử thanh toán');
      }
    } catch (error) {
      console.error('Get payment history error:', error);
      
      // Nếu tất cả API đều lỗi, trả về mock data để trang hoạt động
      console.log('⚠️ Payment API failed, returning mock data for development');
      return {
        success: true,
        data: this.getMockPaymentHistory(),
        message: 'Lấy lịch sử thanh toán (dữ liệu mẫu)'
      };
    }
  }

  async setupAutoPayment(userId, paymentMethod) {
    try {
      console.log('PaymentService: Setup auto payment', userId, paymentMethod);
      
      const response = await apiUtils.post(`/api/payments/auto-payment/setup`, {
        userId: userId,
        paymentMethod: paymentMethod
      });
      
      if (response.success) {
        return {
          success: true,
          data: response.data,
          message: 'Thiết lập thanh toán tự động thành công'
        };
      } else {
        throw new Error(response.message || 'Không thể thiết lập thanh toán tự động');
      }
    } catch (error) {
      console.error('Setup auto payment error:', error);
      const errorInfo = apiUtils.handleError(error);
      return {
        success: false,
        message: errorInfo.message || 'Lỗi khi thiết lập thanh toán tự động',
        error: errorInfo
      };
    }
  }

  async cancelAutoPayment(userId) {
    try {
      console.log('PaymentService: Cancel auto payment', userId);
      
      const response = await apiUtils.delete(`/api/payments/auto-payment/${userId}`);
      
      if (response.success) {
        return {
          success: true,
          message: 'Hủy thanh toán tự động thành công'
        };
      } else {
        throw new Error(response.message || 'Không thể hủy thanh toán tự động');
      }
    } catch (error) {
      console.error('Cancel auto payment error:', error);
      const errorInfo = apiUtils.handleError(error);
      return {
        success: false,
        message: errorInfo.message || 'Lỗi khi hủy thanh toán tự động',
        error: errorInfo
      };
    }
  }

  async refundPayment(paymentId) {
    try {
      console.log('PaymentService: Refund payment', paymentId);
      
      const response = await apiUtils.post(`/api/payments/${paymentId}/refund`);
      
      if (response.success) {
        return {
          success: true,
          data: response.data,
          message: 'Hoàn tiền thành công'
        };
      } else {
        throw new Error(response.message || 'Không thể hoàn tiền');
      }
    } catch (error) {
      console.error('Refund payment error:', error);
      const errorInfo = apiUtils.handleError(error);
      return {
        success: false,
        message: errorInfo.message || 'Lỗi khi hoàn tiền',
        error: errorInfo
      };
    }
  }

  async getPaymentMethods(userId) {
    try {
      console.log('PaymentService: Get payment methods for user', userId);
      
      const response = await apiUtils.get(`/api/payments/methods/${userId}`);
      
      if (response.success) {
        return {
          success: true,
          data: response.data,
          message: 'Lấy phương thức thanh toán thành công'
        };
      } else {
        // Return default payment methods if API fails
        return {
          success: true,
          data: this.getDefaultPaymentMethods(),
          message: 'Lấy phương thức thanh toán mặc định'
        };
      }
    } catch (error) {
      console.error('Get payment methods error:', error);
      return {
        success: true,
        data: this.getDefaultPaymentMethods(),
        message: 'Lấy phương thức thanh toán mặc định'
      };
    }
  }

  // Helper methods
  getDefaultPaymentMethods() {
    return [
      { id: 'credit_card', name: 'Thẻ tín dụng', icon: '💳', enabled: true },
      { id: 'debit_card', name: 'Thẻ ghi nợ', icon: '💳', enabled: true },
      { id: 'bank_transfer', name: 'Chuyển khoản', icon: '🏦', enabled: true },
      { id: 'e_wallet', name: 'Ví điện tử', icon: '📱', enabled: true },
      { id: 'cash', name: 'Tiền mặt', icon: '💵', enabled: false }
    ];
  }

  getMockPaymentHistory() {
    return [
      {
        id: 'payment_001',
        amount: 500000,
        status: 'processing',
        type: 'payment',
        description: 'Thanh toán gói dịch vụ tháng 10',
        createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        paymentMethod: 'credit_card'
      },
      {
        id: 'payment_002', 
        amount: 600000,
        status: 'processing',
        type: 'payment',
        description: 'Thanh toán gói dịch vụ tháng 9',
        createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
        paymentMethod: 'bank_transfer'
      },
      {
        id: 'payment_003',
        amount: 50000,
        status: 'processing', 
        type: 'payment',
        description: 'Phí dịch vụ đổi pin',
        createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
        paymentMethod: 'e_wallet'
      }
    ];
  }

  formatCurrency(amount) {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  }

  async calculateMonthlyBill(contractId) {
    try {
      console.log('PaymentService: Calculate monthly bill', contractId);
      
      const response = await apiUtils.post(API_CONFIG.ENDPOINTS.PAYMENTS.CALCULATE_MONTHLY(contractId));
      
      if (response.success) {
        return {
          success: true,
          data: response.data,
          message: 'Tính hóa đơn tháng thành công'
        };
      } else {
        throw new Error(response.message || 'Không thể tính hóa đơn tháng');
      }
    } catch (error) {
      console.error('Calculate monthly bill error:', error);
      const errorInfo = apiUtils.handleError(error);
      return {
        success: false,
        message: errorInfo.message || 'Lỗi khi tính hóa đơn tháng',
        error: errorInfo
      };
    }
  }
}

export default new PaymentService();