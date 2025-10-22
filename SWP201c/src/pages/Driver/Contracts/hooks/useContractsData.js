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
        setContracts(response.data || []);
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
