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

  // VNPay Integration Methods
  
  /**
   * Tạo URL thanh toán VNPay
   * @param {string} userId - ID người dùng
   * @param {number|null} contractId - ID hợp đồng (optional)
   * @param {number} amount - Số tiền thanh toán
   * @returns {Promise<{success: boolean, payUrl?: string, message: string}>}
   */
  async createVNPayPayment(userId, contractId, amount) {
    try {
      console.log('PaymentService: Create VNPay payment', { userId, contractId, amount });
      
      const params = new URLSearchParams({
        userId: userId,
        amount: amount.toString()
      });
      
      if (contractId) {
        params.append('contractId', contractId.toString());
      }

      const response = await apiUtils.post(
        `${API_CONFIG.ENDPOINTS.PAYMENTS.CREATE}?${params.toString()}`
      );
      
      // Backend có thể trả về vnpayUrl hoặc payUrl
      const paymentUrl = response.vnpayUrl || response.payUrl;
      
      if (response.success && paymentUrl) {
        return {
          success: true,
          payUrl: paymentUrl,
          message: 'Tạo link thanh toán thành công'
        };
      } else {
        throw new Error(response.message || 'Không thể tạo link thanh toán');
      }
    } catch (error) {
      console.error('Create VNPay payment error:', error);
      const errorInfo = apiUtils.handleError(error);
      return {
        success: false,
        message: errorInfo.message || 'Lỗi khi tạo link thanh toán VNPay',
        error: errorInfo
      };
    }
  }

  /**
   * Thanh toán hóa đơn tháng qua VNPay (auto calculate + create payment URL)
   * @param {string} userId - ID người dùng
   * @param {number} contractId - ID hợp đồng
   * @param {number} year - Năm
   * @param {number} month - Tháng
   * @returns {Promise<{success: boolean, payUrl?: string, billInfo?: object, message: string}>}
   */
  async payMonthlyBillVNPay(userId, contractId, year, month) {
    try {
      console.log('PaymentService: Pay monthly bill VNPay', { userId, contractId, year, month });
      
      const params = new URLSearchParams({
        userId: userId,
        contractId: contractId.toString(),
        year: year.toString(),
        month: month.toString()
      });

      const response = await apiUtils.get(
        `${API_CONFIG.ENDPOINTS.PAYMENTS.PAY_MONTHLY}?${params.toString()}`
      );
      
      // Backend trả về vnpayUrl, không phải payUrl
      const paymentUrl = response.vnpayUrl || response.payUrl;
      
      if (response.success && paymentUrl) {
        return {
          success: true,
          payUrl: paymentUrl,
          billInfo: response, // Chứa thông tin bill như totalAmount, totalKm, totalFee, etc.
          message: 'Tạo hóa đơn thanh toán thành công'
        };
      } else {
        throw new Error(response.message || 'Không thể tạo hóa đơn thanh toán');
      }
    } catch (error) {
      console.error('Pay monthly bill VNPay error:', error);
      const errorInfo = apiUtils.handleError(error);
      return {
        success: false,
        message: errorInfo.message || 'Lỗi khi tạo hóa đơn thanh toán tháng',
        error: errorInfo
      };
    }
  }

  /**
   * Xác thực kết quả thanh toán từ VNPay (JSON response)
   * @param {URLSearchParams} queryParams - Query parameters từ VNPay return URL
   * @returns {Promise<{success: boolean, payment?: object, message: string}>}
   */
  async verifyVNPayReturn(queryParams) {
    try {
      console.log('PaymentService: Verify VNPay return');
      
      const response = await apiUtils.get(
        `${API_CONFIG.ENDPOINTS.PAYMENTS.VNPAY_RETURN_JSON}?${queryParams.toString()}`
      );
      
      if (response.success) {
        return {
          success: true,
          payment: response,
          message: response.message || 'Xác thực thanh toán thành công'
        };
      } else {
        throw new Error(response.message || 'Xác thực thanh toán thất bại');
      }
    } catch (error) {
      console.error('Verify VNPay return error:', error);
      const errorInfo = apiUtils.handleError(error);
      return {
        success: false,
        message: errorInfo.message || 'Lỗi khi xác thực thanh toán',
        error: errorInfo
      };
    }
  }

  /**
   * Query transaction từ VNPay (đối soát)
   * @param {string} txnRef - Mã giao dịch
   * @param {string} transactionDate - Ngày giao dịch (yyyyMMddHHmmss)
   * @returns {Promise<{success: boolean, data?: object, message: string}>}
   */
  async queryVNPayTransaction(txnRef, transactionDate) {
    try {
      console.log('PaymentService: Query VNPay transaction', { txnRef, transactionDate });
      
      const params = new URLSearchParams({
        txnRef: txnRef,
        transactionDate: transactionDate
      });

      const response = await apiUtils.get(
        `${API_CONFIG.ENDPOINTS.PAYMENTS.QUERYDR}?${params.toString()}`
      );
      
      return {
        success: true,
        data: response,
        message: 'Đối soát giao dịch thành công'
      };
    } catch (error) {
      console.error('Query VNPay transaction error:', error);
      const errorInfo = apiUtils.handleError(error);
      return {
        success: false,
        message: errorInfo.message || 'Lỗi khi đối soát giao dịch',
        error: errorInfo
      };
    }
  }
}

export default new PaymentService();