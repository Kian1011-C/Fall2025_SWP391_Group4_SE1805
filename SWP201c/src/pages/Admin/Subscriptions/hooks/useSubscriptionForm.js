// Admin/Subscriptions/hooks/useSubscriptionForm.js
// Custom hook for managing subscription plan form state

import { useState } from 'react';
import { getInitialFormData, planToFormData } from '../utils';

export const useSubscriptionForm = () => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingPlan, setEditingPlan] = useState(null);
  const [formData, setFormData] = useState(getInitialFormData());

  /**
   * Open modal for creating new plan
   */
  const handleOpenCreate = () => {
    setEditingPlan(null);
    setFormData(getInitialFormData());
    setShowAddModal(true);
  };

  /**
   * Open modal for editing existing plan
   */
  const handleOpenEdit = (plan) => {
    setEditingPlan(plan);
    setFormData(planToFormData(plan));
    setShowAddModal(true);
  };

  /**
   * Close modal and reset form
   */
  const handleClose = () => {
    setShowAddModal(false);
    setEditingPlan(null);
    setFormData(getInitialFormData());
  };

  /**
   * Update form field
   */
  const handleFieldChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return {
    showAddModal,
    editingPlan,
    formData,
    handleOpenCreate,
    handleOpenEdit,
    handleClose,
    handleFieldChange,
    setFormData
  };
};
