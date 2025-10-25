// Driver/Profile/hooks/useProfileForm.js
// Custom hook for managing profile edit form

import { useState } from 'react';
import { userToFormData, getInitialFormData, validateProfileForm } from '../utils';

export const useProfileForm = (user) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState(getInitialFormData());
  const [formErrors, setFormErrors] = useState({});

  // Update form data when user changes
  useState(() => {
    if (user) {
      setFormData(userToFormData(user));
    }
  }, [user]);

  const startEditing = () => {
    if (user) {
      setFormData(userToFormData(user));
    }
    setFormErrors({});
    setIsEditing(true);
  };

  const cancelEditing = () => {
    setIsEditing(false);
    setFormErrors({});
    if (user) {
      setFormData(userToFormData(user));
    }
  };

  const updateField = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear error for this field when user types
    if (formErrors[field]) {
      setFormErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const validateForm = () => {
    const { isValid, errors } = validateProfileForm(formData);
    setFormErrors(errors);
    return isValid;
  };

  return {
    isEditing,
    formData,
    formErrors,
    startEditing,
    cancelEditing,
    updateField,
    validateForm,
    setFormData
  };
};
