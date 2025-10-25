// Driver/Support/hooks/useSupportSubmit.js
// Hook for handling support ticket submission

import { useState } from 'react';
import { createSupportRequest } from '../utils';

export const useSupportSubmit = () => {
  const [loading, setLoading] = useState(false);

  const submitTicket = async (formData, userId) => {
    try {
      setLoading(true);
      
      const requestData = createSupportRequest(formData, userId);
      
      console.log('📝 Submitting support ticket:', requestData);
      
      // Note: Backend cần API POST /api/support/tickets
      // const response = await supportService.createTicket(requestData);
      
      // Mock success for now
      alert('Backend cần implement API POST /api/support/tickets để gửi yêu cầu hỗ trợ');
      
      return { success: true };
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
