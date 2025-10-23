// Driver/StationsMap/hooks/useStationSelection.js
// Hook for managing selected station

import { useState, useCallback } from 'react';

export const useStationSelection = () => {
  const [selectedStation, setSelectedStation] = useState(null);

  const selectStation = useCallback((station) => {
    setSelectedStation(station);
  }, []);

  const clearSelection = useCallback(() => {
    setSelectedStation(null);
  }, []);

  return {
    selectedStation,
    selectStation,
    clearSelection
  };
};
