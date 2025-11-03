// Driver/Contracts/hooks/useContractsData.js
// Hook for fetching and managing contracts data

import { useState, useEffect, useCallback } from 'react';
import contractService from '../../../../assets/js/services/contractService';

export const useContractsData = () => {
  const [contracts, setContracts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchContracts = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      // Get user from localStorage (where authService saves it)
      const user = JSON.parse(localStorage.getItem('currentUser'));
      
      if (!user || !user.id) {
        throw new Error('Không tìm thấy thông tin người dùng');
      }

      // Gọi API đúng: /api/contracts/user/{userId}
      const response = await contractService.getUserContracts(user.id);
      
      if (response.success && response.data) {
        // Adapt BE fields -> FE model expected by UI components
        const adapted = (response.data || []).map((c) => ({
          id: c.contractId || c.id,
          contractId: c.contractId || c.id,
          contractNumber: c.contractNumber,
          vehicleId: c.vehicleId,
          planId: c.planId,
          planName: c.planName || c.planType || 'Gói dịch vụ',
          status: c.status,
          startDate: c.startDate,
          endDate: c.endDate,
          // Giá trị hiển thị: ưu tiên tổng phí tháng, sau đó phí tháng cơ bản
          amount: c.monthlyTotalFee ?? c.monthlyFee ?? c.monthlyBaseFee ?? 0,
          // Giới hạn sử dụng: dùng baseDistance như "số lượt/đơn vị" cho UI hiện tại
          swapLimit: c.swapLimit ?? c.baseDistance ?? 0,
          usedSwaps: c.usedSwaps ?? 0,
          usedDistance: c.usedDistance ?? 0,
          monthlyBaseFee: c.monthlyBaseFee,
          monthlyOverageFee: c.monthlyOverageFee,
          monthlyTotalFee: c.monthlyTotalFee,
          currentMonth: c.currentMonth,
          description: c.description,
          isUnlimited: c.isUnlimited ?? false,
          paymentStatus: c.paymentStatus // may be undefined depending on API
        }));
        setContracts(adapted);
      } else {
        // Mock data for development
        setContracts([]);
      }
    } catch (err) {
      console.error('Error fetching contracts:', err);
      setError(err.message || 'Không thể tải danh sách hợp đồng');
      setContracts([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchContracts();
  }, [fetchContracts]);

  return {
    contracts,
    loading,
    error,
    refetch: fetchContracts
  };
};
