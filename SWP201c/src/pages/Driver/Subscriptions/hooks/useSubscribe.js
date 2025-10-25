// Driver/Subscriptions/hooks/useSubscribe.js
// Hook for handling subscription/unsubscription actions

import { useState } from 'react';
import contractService from '../../../../assets/js/services/contractService';
import {
  getUserId,
  createSubscriptionRequest,
  getSubscriptionConfirmMessage,
  getSubscriptionSuccessMessage
} from '../utils';

export const useSubscribe = (currentUser, onSuccess) => {
  const [subscribing, setSubscribing] = useState(false);

  const subscribe = async (plan) => {
    const confirmMessage = getSubscriptionConfirmMessage(plan);
    
    if (!window.confirm(confirmMessage)) {
      return;
    }

    try {
      setSubscribing(true);
      
      const userId = getUserId(currentUser);
      
      console.log('📝 Creating contract for plan:', plan);
      console.log('👤 User ID:', userId);
      
      // Create subscription request
      const requestData = createSubscriptionRequest(plan, userId);
      
      // Create contract via API
      const result = await contractService.createContract(requestData);

      console.log('📝 Contract creation result:', result);

      if (result.success) {
        const successMessage = getSubscriptionSuccessMessage(plan);
        alert(successMessage);
        
        // Call success callback to refresh data
        if (onSuccess) {
          onSuccess();
        }
      } else {
        alert(result.message || 'Đăng ký thất bại');
      }
    } catch (err) {
      console.error('❌ Error subscribing:', err);
      alert('Có lỗi xảy ra khi đăng ký: ' + err.message);
    } finally {
      setSubscribing(false);
    }
  };

  return {
    subscribe,
    subscribing
  };
};
