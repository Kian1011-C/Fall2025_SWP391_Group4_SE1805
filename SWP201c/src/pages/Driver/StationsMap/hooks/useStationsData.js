// Driver/StationsMap/hooks/useStationsData.js
// Hook for fetching stations data

import { useState, useEffect, useCallback } from 'react';
import stationService from '../../../../assets/js/services/stationService';

export const useStationsData = () => {
  const [stations, setStations] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    availableSlots: 0,
    occupancyRate: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchStations = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('🔍 Fetching stations data...');
      
      // Lấy danh sách trạm
      const stationsResult = await stationService.getAllStations();
      console.log('📊 Stations API response:', stationsResult);
      
      // Lấy thống kê trạm
      const statsResult = await stationService.getStationsStats();
      console.log('📈 Stats API response:', statsResult);
      
      if (stationsResult.success) {
        setStations(stationsResult.data || []);
        console.log('✅ Stations loaded:', stationsResult.data?.length || 0);
      } else {
        setError(stationsResult.message || 'Không thể tải dữ liệu trạm');
      }
      
      if (statsResult.success) {
        setStats(statsResult.data || {
          total: 0,
          active: 0,
          availableSlots: 0,
          occupancyRate: 0
        });
        console.log('✅ Stats loaded:', statsResult.data);
      } else {
        console.warn('⚠️ Stats API failed:', statsResult.message);
        // Không set error vì stats không bắt buộc
      }
      
    } catch (err) {
      console.error('❌ Error fetching stations data:', err);
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
    stats,
    loading,
    error,
    refetch: fetchStations
  };
};
