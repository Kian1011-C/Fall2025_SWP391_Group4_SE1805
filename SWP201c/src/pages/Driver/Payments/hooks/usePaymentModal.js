// Driver/Payments/hooks/usePaymentModal.js
import { useState } from 'react';

/**
 * Custom hook for managing payment detail modal
 */
export const usePaymentModal = () => {
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState(null);

  const openDetailModal = (payment) => {
    setSelectedPayment(payment);
    setShowDetailModal(true);
  };

  const closeDetailModal = () => {
    setShowDetailModal(false);
    setSelectedPayment(null);
  };

  return {
    showDetailModal,
    selectedPayment,
    openDetailModal,
    closeDetailModal
  };
};
