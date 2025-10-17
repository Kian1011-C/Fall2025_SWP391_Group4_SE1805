// Driver/Vehicles/hooks/useVehicleForm.js
import { useState } from 'react';
import vehicleService from '../../../../assets/js/services/vehicleService';
import { 
  getInitialFormData, 
  validateVehicleForm, 
  createVehicleData,
  getUserId
} from '../utils';

/**
 * Custom hook for vehicle form management
 */
export const useVehicleForm = (onSuccess) => {
  const [formData, setFormData] = useState(getInitialFormData());
  const [submitting, setSubmitting] = useState(false);
  const [formErrors, setFormErrors] = useState({});

  const updateField = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    // Clear error when user types
    if (formErrors[field]) {
      setFormErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const resetForm = () => {
    setFormData(getInitialFormData());
    setFormErrors({});
  };

  const handleSubmit = async () => {
    // Validate form
    const validation = validateVehicleForm(formData);
    if (!validation.isValid) {
      setFormErrors(validation.errors);
      return false;
    }

    setSubmitting(true);
    setFormErrors({});

    try {
      const user = JSON.parse(sessionStorage.getItem('user'));
      const userId = getUserId(user);

      if (!userId) {
        throw new Error('User not found. Please login again.');
      }

      // Create vehicle data
      const vehicleData = createVehicleData(formData, userId);
      console.log('🚗 Adding vehicle:', vehicleData);

      // Call API
      const response = await vehicleService.addVehicle(vehicleData);
      console.log('✅ Vehicle added:', response);

      if (response.success) {
        resetForm();
        if (onSuccess) {
          onSuccess();
        }
        return true;
      } else {
        throw new Error(response.message || 'Failed to add vehicle');
      }
    } catch (err) {
      console.error('❌ Error adding vehicle:', err);
      setFormErrors({ submit: err.message });
      return false;
    } finally {
      setSubmitting(false);
    }
  };

  return {
    formData,
    formErrors,
    submitting,
    updateField,
    resetForm,
    handleSubmit
  };
};
