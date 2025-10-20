// Staff/BatteryInventory/hooks/useBatteryFilters.js
import { useState, useMemo } from 'react';
import { filterBatteries, getUniqueStations } from '../utils';

/**
 * Custom hook for managing battery filters
 */
export const useBatteryFilters = (batteries) => {
  const [filterStatus, setFilterStatus] = useState('Tất cả');
  const [filterStation, setFilterStation] = useState('Tất cả');

  // Get unique stations
  const stations = useMemo(() => getUniqueStations(batteries), [batteries]);

  // Get filtered batteries
  const filteredBatteries = useMemo(() => 
    filterBatteries(batteries, filterStatus, filterStation),
    [batteries, filterStatus, filterStation]
  );

  return {
    filterStatus,
    setFilterStatus,
    filterStation,
    setFilterStation,
    stations,
    filteredBatteries
  };
};
