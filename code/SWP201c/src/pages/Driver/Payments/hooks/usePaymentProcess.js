// Driver/Payments/hooks/usePaymentProcess.js
import { useState } from 'react';
import paymentService from '../../../../assets/js/services/paymentService';

/**
 * Custom hook for processing payments
 */
export const usePaymentProcess = (onSuccess) => {
  const [processing, setProcessing] = useState(false);

  const processPayment = async (paymentData) => {
    setProcessing(true);
    
    try {
      console.log('💳 Processing payment:', paymentData);
      const result = await paymentService.processPayment(paymentData);
      
      if (result.success) {
        console.log('✅ Payment processed successfully');
        alert('Thanh toán thành công!');
        
        if (onSuccess) {
          onSuccess();
        }
        
        return true;
      } else {
        console.warn('⚠️ Payment failed:', result.message);
        alert(`Lỗi: ${result.message}`);
        return false;
      }
    } catch (err) {
      console.error('❌ Payment error:', err);
      alert('Có lỗi xảy ra khi thanh toán!');
      return false;
    } finally {
      setProcessing(false);
    }
  };

  return {
    processing,
    processPayment
  };
};
