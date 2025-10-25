// Driver/Support/hooks/useSupportForm.js
// Hook for managing support form state

import { useState } from 'react';
import { getInitialFormData, validateSupportForm } from '../utils';

export const useSupportForm = () => {
  const [formData, setFormData] = useState(getInitialFormData());
  const [errors, setErrors] = useState({});

  const updateField = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error for this field
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: undefined
      }));
    }
  };

  const validate = () => {
    const validation = validateSupportForm(formData);
    setErrors(validation.errors);
    return validation.isValid;
  };

  const reset = () => {
    setFormData(getInitialFormData());
    setErrors({});
  };

  return {
    formData,
    errors,
    updateField,
    validate,
    reset,
    setFormData
  };
};
