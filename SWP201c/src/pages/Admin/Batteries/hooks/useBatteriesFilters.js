// Admin/Batteries/hooks/useBatteriesFilters.js
// Custom hook for battery filtering logic

import { useState, useMemo } from 'react';
import { filterBatteries, calculateBatteryStats } from '../utils';

export const useBatteriesFilters = (batteries) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');

  // Filter batteries based on search and status
  const filteredBatteries = useMemo(() => {
    return filterBatteries(batteries, searchTerm, selectedStatus);
  }, [batteries, searchTerm, selectedStatus]);

  // Calculate statistics from filtered batteries
  const stats = useMemo(() => {
    return calculateBatteryStats(batteries);
  }, [batteries]);

  return {
    searchTerm,
    setSearchTerm,
    selectedStatus,
    setSelectedStatus,
    filteredBatteries,
    stats
  };
};
