// Admin/Stations/hooks/useStationsData.js
// Custom hook for fetching stations data from store

import { useEffect } from 'react';
import useStationStore from '../../../../assets/js/store/stationSlice';

export const useStationsData = () => {
  const { 
    stations, 
    isLoading, 
    error,
    fetchStations 
  } = useStationStore();

  useEffect(() => {
    // Fetch stations on component mount if not already loaded
    if (!stations || stations.length === 0) {
      fetchStations?.();
    }
  }, [stations, fetchStations]);

  return {
    stations: stations || [],
    loading: isLoading,
    error
  };
};
