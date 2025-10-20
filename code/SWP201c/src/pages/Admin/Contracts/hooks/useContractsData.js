// Admin/Contracts/hooks/useContractsData.js
// Custom hook for fetching contracts data from API

import { useState, useEffect } from 'react';
import contractService from '../../../../assets/js/services/contractService';

export const useContractsData = () => {
  const [contracts] = useState([]); // setContracts will be used when API is ready
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchContracts = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Note: Backend cần API GET /api/contracts (get all)
      // Tạm thời dùng endpoint có sẵn
      const result = await contractService.getContractPlans();
      
      if (result.success) {
        // Map plans to contract format hoặc dùng endpoint khác
        // When API is ready, uncomment this:
        // setContracts(result.data);
        setError('Backend cần implement GET /api/contracts endpoint để lấy danh sách tất cả hợp đồng');
      } else {
        setError(result.message);
      }
    } catch (err) {
      setError('Không thể tải dữ liệu hợp đồng');
      console.error('Error fetching contracts:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContracts();
  }, []);

  return {
    contracts,
    loading,
    error,
    refetch: fetchContracts
  };
};
