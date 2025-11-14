// Driver/Subscriptions/hooks/useSubscribe.js
// Hook for handling subscription/unsubscription actions

import { useState } from 'react';
import contractService from '../../../../assets/js/services/contractService';
import {
  getUserId,
  createSubscriptionRequest,
  getSubscriptionSuccessMessage
} from '../utils';

export const useSubscribe = (currentUser, onSuccess) => {
  const [subscribing, setSubscribing] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);

  const subscribe = (plan) => {
    // Mở modal để thu thập thông tin hợp đồng
    setSelectedPlan(plan);
    setShowModal(true);
  };

  const handleConfirm = async (contractInfo) => {
    try {
      setSubscribing(true);
      setShowModal(false);
      
      const userId = getUserId(currentUser);
      
      if (!userId) {
        throw new Error('Không tìm thấy User ID. Vui lòng đăng nhập lại.');
      }

      console.log(' Creating contract for plan:', selectedPlan);
      console.log(' User ID:', userId);
      console.log(' Contract info:', contractInfo);
      
      // Create subscription request với đầy đủ thông tin (theo logic của BE)
      const requestData = createSubscriptionRequest(selectedPlan, userId, contractInfo);
      
      console.log(' Request data:', requestData);
      
      // Create contract via API
      const result = await contractService.createContract(requestData);

      console.log(' Contract creation result:', result);

      if (result.success) {
        const successMessage = getSubscriptionSuccessMessage(selectedPlan);
        alert(successMessage);
        
        // Call success callback to refresh data
        if (onSuccess) {
          onSuccess();
        }
      } else {
        alert(result.message || 'Đăng ký thất bại. Vui lòng thử lại.');
      }
    } catch (err) {
      console.error(' Error subscribing:', err);
      alert('Có lỗi xảy ra khi đăng ký: ' + (err.message || 'Lỗi không xác định'));
    } finally {
      setSubscribing(false);
      setSelectedPlan(null);
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedPlan(null);
  };

  return {
    subscribe,
    subscribing,
    showModal,
    selectedPlan,
    handleConfirm,
    handleCloseModal
  };
};
