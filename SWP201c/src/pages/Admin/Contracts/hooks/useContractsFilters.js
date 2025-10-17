// Admin/Contracts/hooks/useContractsFilters.js
// Custom hook for contract filtering logic

import { useState, useMemo } from 'react';
import { filterContracts, calculateContractStats } from '../utils';

export const useContractsFilters = (contracts) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedType, setSelectedType] = useState('all');

  // Filter contracts based on search, status, and type
  const filteredContracts = useMemo(() => {
    return filterContracts(contracts, searchTerm, selectedStatus, selectedType);
  }, [contracts, searchTerm, selectedStatus, selectedType]);

  // Calculate statistics from all contracts (not filtered)
  const stats = useMemo(() => {
    return calculateContractStats(contracts);
  }, [contracts]);

  return {
    searchTerm,
    setSearchTerm,
    selectedStatus,
    setSelectedStatus,
    selectedType,
    setSelectedType,
    filteredContracts,
    stats
  };
};
