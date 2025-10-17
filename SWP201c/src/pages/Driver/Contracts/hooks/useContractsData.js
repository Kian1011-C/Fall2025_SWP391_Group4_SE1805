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
      const user = JSON.parse(localStorage.getItem('user'));
      
      if (!user || !user.id) {
        throw new Error('Không tìm thấy thông tin người dùng');
      }

      // Note: Backend cần API GET /api/users/:userId/contracts
      const response = await contractService.getContracts(user.id);
      
      if (response && Array.isArray(response)) {
        setContracts(response);
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
