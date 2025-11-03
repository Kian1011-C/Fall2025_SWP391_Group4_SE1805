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
      const statusMatch = filterStatus ? contract.status?.toLowerCase() === filterStatus.toLowerCase() : true;
      
      if (!searchQuery) return statusMatch;
      
      const query = searchQuery.toLowerCase();
      const searchMatch = 
        contract.contractNumber?.toLowerCase().includes(query) || 
        contract.email?.toLowerCase().includes(query) ||
        contract.phone?.toLowerCase().includes(query) ||
        contract.firstName?.toLowerCase().includes(query) ||
        contract.lastName?.toLowerCase().includes(query) ||
        contract.plateNumber?.toLowerCase().includes(query) ||
        `${contract.firstName} ${contract.lastName}`.toLowerCase().includes(query);
      
      return statusMatch && searchMatch;
    });
  }, [contracts, filterStatus, searchQuery]);

  // Calculate statistics
  const stats = useMemo(() => {
    const total = contracts.length;
    const active = contracts.filter(c => c.status?.toLowerCase() === 'active').length;
    const pending = contracts.filter(c => c.status?.toLowerCase() === 'pending').length;
    const expired = contracts.filter(c => c.status?.toLowerCase() === 'expired' || c.status?.toLowerCase() === 'terminated').length;
    
    return { total, active, pending, expired };
  }, [contracts]);

  return {
    contracts: filteredContracts,
    isLoading, 
    error, 
    refetch: fetchContracts,
    filterStatus, 
    setFilterStatus,
    searchQuery, 
    setSearchQuery,
    stats,
  };
};