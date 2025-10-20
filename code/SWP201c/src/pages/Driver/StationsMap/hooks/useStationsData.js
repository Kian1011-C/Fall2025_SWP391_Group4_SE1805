// Driver/StationsMap/hooks/useStationsData.js
// Hook for fetching stations data

import { useState, useEffect, useCallback } from 'react';
import stationService from '../../../../assets/js/services/stationService';

export const useStationsData = () => {
  const [stations, setStations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchStations = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const result = await stationService.getAllStations();
      
      if (result.success) {
        console.log('🔍 Stations list data:', result.data);
        console.log('🔍 First station status:', result.data?.[0]?.status);
        setStations(result.data || []);
      } else {
        setError(result.message || 'Không thể tải dữ liệu trạm');
      }
    } catch (err) {
      console.error('Error fetching stations:', err);
      setError('Không thể tải dữ liệu trạm');
      setStations([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStations();
  }, [fetchStations]);

  return {
    stations,
    loading,
    error,
    refetch: fetchStations
  };
};
