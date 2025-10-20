// Admin/Subscriptions/hooks/useSubscriptionsActions.js
// Custom hook for subscription plan CRUD operations

import { useState } from 'react';
import contractService from '../../../../assets/js/services/contractService';
import { validatePlanForm } from '../utils';

export const useSubscriptionsActions = (refetchPlans) => {
  const [actionLoading, setActionLoading] = useState(false);

  /**
   * Create new subscription plan
   */
  const handleCreatePlan = async (formData) => {
    // Validate form
    const validation = validatePlanForm(formData);
    if (!validation.isValid) {
      alert(`Lỗi: ${validation.errors.join(', ')}`);
      return { success: false, errors: validation.errors };
    }

    try {
      setActionLoading(true);
      
      // Note: Backend cần endpoint POST /api/subscriptions/plans
      alert('Backend cần implement endpoint POST /api/subscriptions/plans để tạo gói mới');
      
      // Uncomment when API is ready:
      // const result = await contractService.createPlan(formData);
      // if (result.success) {
      //   await refetchPlans();
      //   return { success: true };
      // } else {
      //   alert(result.message || 'Tạo gói thất bại');
      //   return { success: false, error: result.message };
      // }
      
      return { success: false, notImplemented: true };
    } catch (err) {
      alert('Có lỗi xảy ra khi tạo gói: ' + err.message);
      console.error('Create plan error:', err);
      return { success: false, error: err.message };
    } finally {
      setActionLoading(false);
    }
  };

  /**
   * Update existing subscription plan
   */
  const handleUpdatePlan = async (planId, formData) => {
    // Validate form
    const validation = validatePlanForm(formData);
    if (!validation.isValid) {
      alert(`Lỗi: ${validation.errors.join(', ')}`);
      return { success: false, errors: validation.errors };
    }

    try {
      setActionLoading(true);
      
      const result = await contractService.updateContract(planId, formData);
      
      if (result.success) {
        alert('Cập nhật gói dịch vụ thành công!');
        await refetchPlans();
        return { success: true };
      } else {
        alert(result.message || 'Cập nhật thất bại');
        return { success: false, error: result.message };
      }
    } catch (err) {
      alert('Có lỗi xảy ra khi cập nhật: ' + err.message);
      console.error('Update plan error:', err);
      return { success: false, error: err.message };
    } finally {
      setActionLoading(false);
    }
  };

  /**
   * Delete subscription plan
   */
  const handleDeletePlan = async (planId) => {
    const confirmed = window.confirm('Bạn có chắc muốn xóa gói dịch vụ này?');
    
    if (!confirmed) {
      return { success: false, cancelled: true };
    }

    try {
      setActionLoading(true);
      
      // Note: Backend cần endpoint DELETE /api/subscriptions/plans/:id
      alert(`Backend cần implement endpoint DELETE /api/subscriptions/plans/${planId}`);
      
      // Uncomment when API is ready:
      // const result = await contractService.deletePlan(planId);
      // if (result.success) {
      //   await refetchPlans();
      //   return { success: true };
      // } else {
      //   alert(result.message || 'Xóa gói thất bại');
      //   return { success: false, error: result.message };
      // }
      
      return { success: false, notImplemented: true };
    } catch (err) {
      alert('Có lỗi xảy ra khi xóa: ' + err.message);
      console.error('Delete plan error:', err);
      return { success: false, error: err.message };
    } finally {
      setActionLoading(false);
    }
  };

  return {
    handleCreatePlan,
    handleUpdatePlan,
    handleDeletePlan,
    actionLoading
  };
};
