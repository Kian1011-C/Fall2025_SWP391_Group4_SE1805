// Driver/Payments/hooks/usePaymentsData.js
import { useState, useEffect } from 'react';
import paymentService from '../../../../assets/js/services/paymentService';
import authService from '../../../../assets/js/services/authService';
import { getUserId } from '../utils';

/**
 * Custom hook for fetching payment history
 */
export const usePaymentsData = () => {
  const [paymentHistory, setPaymentHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchPaymentHistory = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const currentUser = authService.getCurrentUser();
      const userId = getUserId(currentUser);
      
      if (!userId) {
        throw new Error('User not found. Please login again.');
      }

      console.log('💳 Fetching payment history for user:', userId);
      
      const result = await paymentService.getPaymentHistory(userId);
      
      if (result.success) {
        console.log('✅ Payment history loaded:', result.data);
        setPaymentHistory(result.data || []);
      } else {
        console.warn('⚠️ Payment history failed:', result.message);
        setError(result.message || 'Failed to load payment history');
      }
    } catch (err) {
      console.error('❌ Payment history error:', err);
      setError(err.message || 'Không thể tải lịch sử thanh toán');
    } finally {
      setLoading(false);
    }
  };

  // Initial fetch
  useEffect(() => {
    fetchPaymentHistory();
  }, []);

  return {
    paymentHistory,
    loading,
    error,
    refetch: fetchPaymentHistory
  };
};
