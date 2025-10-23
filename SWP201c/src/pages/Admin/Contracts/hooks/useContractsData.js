import { useState, useEffect, useMemo, useCallback } from 'react';
import contractService from '../../../../assets/js/services/contractService';

export const useContractsData = () => {
  const [contracts, setContracts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filterStatus, setFilterStatus] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const fetchContracts = useCallback(async (filters) => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await contractService.getAllContracts(filters);
      if (response.success && Array.isArray(response.data)) {
        setContracts(response.data);
      } else {
        throw new Error(response.message || "Dữ liệu hợp đồng không hợp lệ.");
      }
    } catch (err) {
      setError(err.message || "Không thể tải danh sách hợp đồng.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchContracts();
  }, [fetchContracts]);

  const filteredContracts = useMemo(() => {
    return contracts.filter(contract => {
      const statusMatch = filterStatus ? contract.status === filterStatus : true;
      const searchMatch = searchQuery ? 
        (contract.contractNumber?.toLowerCase().includes(searchQuery.toLowerCase()) || 
         contract.userId?.toLowerCase().includes(searchQuery.toLowerCase())) 
        : true;
      return statusMatch && searchMatch;
    });
  }, [contracts, filterStatus, searchQuery]);

  return {
    contracts: filteredContracts,
    isLoading, error, refetch: fetchContracts,
    filterStatus, setFilterStatus,
    searchQuery, setSearchQuery,
  };
};