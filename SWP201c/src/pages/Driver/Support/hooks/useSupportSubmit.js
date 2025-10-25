// Driver/Support/hooks/useSupportSubmit.js
// Hook for handling support ticket submission

import { useState } from 'react';
import { reportService } from '../../../../assets/js/services';
import { createSupportRequest } from '../utils';

export const useSupportSubmit = () => {
  const [loading, setLoading] = useState(false);

  const submitTicket = async (formData, userId) => {
    try {
      setLoading(true);
      
      const requestData = createSupportRequest(formData, userId);
      
      console.log('📝 Submitting support ticket:', requestData);
      
      // Call the report API
      const response = await reportService.createReport(requestData);
      
      if (response.success) {
        console.log('✅ Support ticket submitted successfully:', response.data);
        return { success: true, data: response.data };
      } else {
        console.error('❌ Failed to submit support ticket:', response.message);
        return { success: false, error: response.message };
      }
    } catch (err) {
      console.error('❌ Error submitting ticket:', err);
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
