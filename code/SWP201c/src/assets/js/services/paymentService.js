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
      
      const response = await apiUtils.get(API_CONFIG.ENDPOINTS.PAYMENTS.HISTORY(userId));
      
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
      const errorInfo = apiUtils.handleError(error);
      return {
        success: false,
        message: errorInfo.message || 'Lỗi khi lấy lịch sử thanh toán',
        error: errorInfo
      };
    }
  }

  // Get current bill/payment status for a user
  async getCurrentPaymentStatus(userId) {
    try {
      const response = await apiUtils.get(`/api/payments/current-bill-status/user/${userId}`);
      if (response?.success) {
        return { success: true, data: response.data };
      }
      return { success: false, data: null, message: response?.message || 'Không thể lấy trạng thái thanh toán hiện tại' };
    } catch (error) {
      const errorInfo = apiUtils.handleError(error);
      return { success: false, data: null, message: errorInfo.message };
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