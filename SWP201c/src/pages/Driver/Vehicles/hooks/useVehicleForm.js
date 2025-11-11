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
      // Get user from localStorage (where authService saves it)
      const user = JSON.parse(localStorage.getItem('currentUser'));
      const userId = getUserId(user);

      if (!userId) {
        throw new Error('User not found. Please login again.');
      }

      // Validate các trường bắt buộc (theo logic của BE)
      const plateNumber = formData.plateNumber?.trim() || '';
      const model = formData.vehicleModel?.trim() || '';
      const vinNumber = formData.vinNumber?.trim() || '';

      if (!plateNumber || !model || !vinNumber) {
        setFormErrors({ submit: 'Vui lòng nhập đầy đủ thông tin: biển số, model và VIN.' });
        return false;
      }

      console.log('🚗 Registering vehicle:', { userId, plateNumber, model, vinNumber });

      // Gọi API đăng ký xe (theo logic của BE)
      // API: POST /api/users/{userId}/vehicles với params: plateNumber, model, vinNumber
      const response = await vehicleService.registerVehicleForUser(userId, plateNumber, model, vinNumber);
      console.log('✅ Vehicle registered:', response);

      if (response.success) {
        resetForm();
        
        // BE trả về danh sách xe mới nhất trong response.data
        if (response.data && Array.isArray(response.data) && response.data.length > 0) {
          console.log('✅ Danh sách xe sau khi đăng ký:', response.data);
        }
        
        if (onSuccess) {
          onSuccess();
        }
        return true;
      } else {
        // Hiển thị error message từ BE
        const errorMessage = response.message || 'Đăng ký xe thất bại. Vui lòng thử lại.';
        setFormErrors({ submit: errorMessage });
        return false;
      }
    } catch (err) {
      console.error('❌ Error registering vehicle:', err);
      const errorMessage = err.message || 'Lỗi hệ thống. Vui lòng thử lại sau.';
      setFormErrors({ submit: errorMessage });
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
