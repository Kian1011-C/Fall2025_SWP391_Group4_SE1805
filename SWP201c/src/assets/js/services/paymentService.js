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
      
      // ✅ Sử dụng endpoint backend thực tế: /payment/user/{userId}
      const response = await apiUtils.get(API_CONFIG.ENDPOINTS.PAYMENTS.USER_PAYMENTS(userId));
      
      if (response.success) {
        return {
          success: true,
          data: response.data,
          total: response.total || 0,
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
   * ✅ LẤY DANH SÁCH THANH TOÁN CỦA USER (Đã có payment_url từ backend)
   * Driver chỉ cần lấy payment_url có sẵn để thanh toán
   * @param {string} userId - ID người dùng
   * @returns {Promise<{success: boolean, data?: array, total?: number, message: string}>}
   */
  async getUserPayments(userId) {
    try {
      console.log('PaymentService: Get user payments with payment URLs', userId);
      
      const response = await apiUtils.get(API_CONFIG.ENDPOINTS.PAYMENTS.USER_PAYMENTS(userId));
      
      if (response.success) {
        return {
          success: true,
          data: response.data, // Mảng payments đã có payment_url
          total: response.total || 0,
          message: 'Lấy danh sách thanh toán thành công'
        };
      } else {
        throw new Error(response.message || 'Không thể lấy danh sách thanh toán');
      }
    } catch (error) {
      console.error('Get user payments error:', error);
      const errorInfo = apiUtils.handleError(error);
      return {
        success: false,
        message: errorInfo.message || 'Lỗi khi lấy danh sách thanh toán',
        error: errorInfo
      };
    }
  }

  /**
   * ✅ ADMIN: Lấy tất cả thanh toán (có payment_url)
   * @returns {Promise<{success: boolean, data?: array, total?: number, message: string}>}
   */
  async getAllPayments() {
    try {
      console.log('PaymentService: Get all payments (Admin)');
      
      const response = await apiUtils.get(API_CONFIG.ENDPOINTS.PAYMENTS.ADMIN_ALL);
      
      if (response.success) {
        return {
          success: true,
          data: response.data,
          total: response.total || 0,
          message: 'Lấy tất cả thanh toán thành công'
        };
      } else {
        throw new Error(response.message || 'Không thể lấy danh sách thanh toán');
      }
    } catch (error) {
      console.error('Get all payments error:', error);
      const errorInfo = apiUtils.handleError(error);
      return {
        success: false,
        message: errorInfo.message || 'Lỗi khi lấy tất cả thanh toán',
        error: errorInfo
      };
    }
  }

  /**
   * ⚠️ DEPRECATED: Không cần dùng vì payment_url đã có sẵn từ backend
   * Giữ lại để tương thích với code cũ
   */
  async createVNPayPayment(userId, contractId, amount) {
    console.warn('⚠️ createVNPayPayment is deprecated. Use payment_url from getUserPayments() instead.');
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

  /* =============================================================
     ADMIN METHODS - Quản lý thanh toán
     ============================================================= */

  /**
   * ✅ ADMIN: Xuất hóa đơn tháng cho driver (Tạo payment với payment_url)
   * Backend sẽ tự động tính toán và tạo payment với status 'in_progress'
   * @param {string} userId - ID người dùng
   * @param {number} contractId - ID hợp đồng
   * @param {number} year - Năm
   * @param {number} month - Tháng
   * @returns {Promise<{success: boolean, billInfo?: object, paymentUrl?: string, message: string}>}
   */
  async adminGenerateMonthlyInvoice(userId, contractId, year, month) {
    try {
      console.log('PaymentService: Admin generate monthly invoice', { userId, contractId, year, month });
      
      const params = new URLSearchParams({
        userId: userId,
        contractId: contractId.toString(),
        year: year.toString(),
        month: month.toString()
      });

      // ✅ Gọi API backend /payment/pay-monthly (Admin xuất hóa đơn)
      const response = await apiUtils.get(
        `${API_CONFIG.ENDPOINTS.PAYMENTS.PAY_MONTHLY}?${params.toString()}`
      );
      
      if (response.success) {
        return {
          success: true,
          billInfo: response, // Chứa totalFee, totalKm, depositFee, vnpayUrl
          paymentUrl: response.vnpayUrl || response.payUrl,
          message: 'Xuất hóa đơn thành công'
        };
      } else {
        throw new Error(response.message || 'Không thể xuất hóa đơn');
      }
    } catch (error) {
      console.error('Admin generate invoice error:', error);
      const errorInfo = apiUtils.handleError(error);
      return {
        success: false,
        message: errorInfo.message || 'Lỗi khi xuất hóa đơn',
        error: errorInfo
      };
    }
  }

  /**
   * ✅ ADMIN: Lấy tất cả payments trong hệ thống
   * @returns {Promise<{success: boolean, data?: array, total?: number, message: string}>}
   */
  async adminGetAllPayments() {
    return this.getAllPayments();
  }

  /**
   * ✅ ADMIN/STAFF: Lấy danh sách payments của 1 user cụ thể
   * @param {string} userId - ID người dùng
   * @returns {Promise<{success: boolean, data?: array, total?: number, message: string}>}
   */
  async adminGetUserPayments(userId) {
    return this.getUserPayments(userId);
  }

  /**
   * ✅ ADMIN: Lấy danh sách users và thông tin thanh toán
   * Note: Backend cần có API riêng để lấy list users với payment summary
   * Tạm thời sử dụng getAllPayments và group by user
   * @returns {Promise<{success: boolean, data?: array, message: string}>}
   */
  async adminGetUsersWithPaymentSummary() {
    try {
      console.log('PaymentService: Get users with payment summary');
      
      // ✅ TODO: Backend cần tạo API /payment/admin/users-summary
      // Tạm thời lấy all payments và group by user
      const paymentsResult = await this.getAllPayments();
      
      if (!paymentsResult.success) {
        throw new Error(paymentsResult.message);
      }

      // Group payments by user
      const paymentsByUser = {};
      (paymentsResult.data || []).forEach(payment => {
        const userId = payment.userId;
        if (!paymentsByUser[userId]) {
          paymentsByUser[userId] = {
            userId: userId,
            payments: [],
            totalPaid: 0,
            unpaidBills: 0,
            lastPaymentDate: null
          };
        }
        
        paymentsByUser[userId].payments.push(payment);
        
        if (payment.status?.toLowerCase() === 'success') {
          paymentsByUser[userId].totalPaid += payment.amount || 0;
          
          const payDate = payment.vnpPayDate || payment.createdAt;
          if (payDate && (!paymentsByUser[userId].lastPaymentDate || 
              new Date(payDate) > new Date(paymentsByUser[userId].lastPaymentDate))) {
            paymentsByUser[userId].lastPaymentDate = payDate;
          }
        }
        
        if (payment.status?.toLowerCase() === 'in_progress') {
          paymentsByUser[userId].unpaidBills += 1;
        }
      });

      const usersData = Object.values(paymentsByUser);

      return {
        success: true,
        data: usersData,
        total: usersData.length,
        message: 'Lấy danh sách users thành công'
      };
    } catch (error) {
      console.error('Get users with payment summary error:', error);
      const errorInfo = apiUtils.handleError(error);
      return {
        success: false,
        message: errorInfo.message || 'Lỗi khi lấy danh sách users',
        error: errorInfo
      };
    }
  }
}

export default new PaymentService();
