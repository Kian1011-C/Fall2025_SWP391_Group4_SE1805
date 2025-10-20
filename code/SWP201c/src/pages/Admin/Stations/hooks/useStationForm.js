// Admin/Stations/hooks/useStationForm.js
// Custom hook for managing station form state and modal

import { useState } from 'react';
import { getInitialFormData, stationToFormData, validateStationForm } from '../utils';

export const useStationForm = () => {
  const [showModal, setShowModal] = useState(false);
  const [editingStation, setEditingStation] = useState(null);
  const [formData, setFormData] = useState(getInitialFormData());
  const [formErrors, setFormErrors] = useState({});

  // Open modal for creating new station
  const openCreateModal = () => {
    setEditingStation(null);
    setFormData(getInitialFormData());
    setFormErrors({});
    setShowModal(true);
  };

  // Open modal for editing existing station
  const openEditModal = (station) => {
    setEditingStation(station);
    setFormData(stationToFormData(station));
    setFormErrors({});
    setShowModal(true);
  };

  // Close modal and reset form
  const closeModal = () => {
    setShowModal(false);
    setEditingStation(null);
    setFormData(getInitialFormData());
    setFormErrors({});
  };

  // Update form field
  const updateField = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error for this field when user starts typing
    if (formErrors[field]) {
      setFormErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  // Validate form before submission
  const validateForm = () => {
    const { isValid, errors } = validateStationForm(formData);
    setFormErrors(errors);
    return isValid;
  };

  return {
    showModal,
    editingStation,
    formData,
    formErrors,
    openCreateModal,
    openEditModal,
    closeModal,
    updateField,
    validateForm,
    isEditMode: !!editingStation
  };
};
