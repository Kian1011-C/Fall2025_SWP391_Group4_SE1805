// Driver/Support/hooks/useSupportSubmit.js
// Hook for handling support ticket submission

import { useState } from 'react';
import { createSupportRequest } from '../utils';
import supportService from '../../../../assets/js/services/supportService.js';

export const useSupportSubmit = () => {
  const [loading, setLoading] = useState(false);

  const submitTicket = async (formData, userId) => {
    try {
      setLoading(true);
      
      const requestData = createSupportRequest(formData, userId);
      
      console.log('📝 Submitting support ticket:', requestData);
      const response = await supportService.createIssue({
        userId: requestData.userId,
        stationId: requestData.stationId || 0,
        description: requestData.message || requestData.description
      });

      if (response.success) {
        return { success: true };
      }
      throw new Error(response.message || 'Gửi yêu cầu thất bại');
    } catch (err) {
      console.error('❌ Error submitting ticket:', err);
      alert('Có lỗi xảy ra: ' + err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  return {
    submitTicket,
    loading
  };
};
