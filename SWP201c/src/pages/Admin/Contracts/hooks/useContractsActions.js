// Admin/Contracts/hooks/useContractsActions.js
// Custom hook for contract operations

import { useState } from 'react';
import contractService from '../../../../assets/js/services/contractService';

export const useContractsActions = (refetchContracts) => {
  const [actionLoading, setActionLoading] = useState(false);

  /**
   * Update contract status
   */
  const handleUpdateStatus = async (contractId, newStatus) => {
    try {
      setActionLoading(true);
      const result = await contractService.updateContract(contractId, { status: newStatus });
      
      if (result.success) {
        await refetchContracts();
        return { success: true };
      } else {
        alert(`Lỗi: ${result.message}`);
        return { success: false, error: result.message };
      }
    } catch (error) {
      alert('Có lỗi xảy ra khi cập nhật trạng thái!');
      console.error('Update status error:', error);
      return { success: false, error: error.message };
    } finally {
      setActionLoading(false);
    }
  };

  /**
   * Approve contract (set to active)
   */
  const handleApproveContract = async (contractId) => {
    return handleUpdateStatus(contractId, 'active');
  };

  /**
   * Cancel contract
   */
  const handleCancelContract = async (contractId) => {
    const confirmed = window.confirm('Bạn có chắc chắn muốn hủy hợp đồng này?');
    
    if (!confirmed) {
      return { success: false, cancelled: true };
    }

    return handleUpdateStatus(contractId, 'cancelled');
  };

  return {
    handleUpdateStatus,
    handleApproveContract,
    handleCancelContract,
    actionLoading
  };
};
