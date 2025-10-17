// Admin/Stations/hooks/useStationsFilters.js
// Custom hook for managing station filters and search

import { useState, useMemo } from 'react';
import { filterStations, sortStations } from '../utils';

export const useStationsFilters = (stations) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('name');

  // Apply filters and sorting
  const filteredStations = useMemo(() => {
    let result = stations || [];
    
    // Apply search filter
    result = filterStations(result, searchQuery);
    
    // Apply sorting
    result = sortStations(result, sortBy);
    
    return result;
  }, [stations, searchQuery, sortBy]);

  return {
    searchQuery,
    sortBy,
    filteredStations,
    setSearchQuery,
    setSortBy
  };
};
