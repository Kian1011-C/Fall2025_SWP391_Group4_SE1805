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
      
      console.log('🔍 Fetching stations data using new API...');
      
      // Sử dụng API mới GET /api/stations
      const stationsResult = await stationService.getAllStations();
      console.log('📊 GET /api/stations response:', stationsResult);
      
      // Lấy thống kê trạm
      const statsResult = await stationService.getStationsStats();
      console.log('📈 GET /api/stations/stats response:', statsResult);
      
      if (stationsResult.success) {
        let stationsData = stationsResult.data || [];
        console.log('✅ Stations loaded:', stationsData.length);
        console.log('🔍 First station data structure:', stationsData[0]);
        console.log('🔍 All stations status values:', stationsData.map(s => ({ 
          id: s.id, 
          name: s.name, 
          status: s.status, 
          availableSlots: s.availableSlots,
          totalSlots: s.totalSlots,
          address: s.address,
          latitude: s.latitude,
          longitude: s.longitude
        })));
        // 1) Chuẩn hóa tọa độ: nếu thiếu lat/lng → geocode từ địa chỉ (Nominatim)
        const geocodeCacheKey = 'stationGeocodeCache';
        const cache = JSON.parse(localStorage.getItem(geocodeCacheKey) || '{}');

        const geocodeAddress = async (address) => {
          if (!address) return null;
          if (cache[address]) return cache[address];
          try {
            const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}`;
            const res = await fetch(url, { headers: { 'Accept-Language': 'vi' } });
            const data = await res.json();
            const first = Array.isArray(data) && data.length > 0 ? data[0] : null;
            if (!first) return null;
            const coords = { lat: parseFloat(first.lat), lng: parseFloat(first.lon) };
            cache[address] = coords;
            localStorage.setItem(geocodeCacheKey, JSON.stringify(cache));
            return coords;
          } catch (e) {
            console.warn('⚠️ Geocode failed for', address, e);
            return null;
          }
        };

        const withCoords = await Promise.all(stationsData.map(async (s) => {
          const lat = s.latitude ?? s.lat ?? s.location?.lat;
          const lng = s.longitude ?? s.lng ?? s.location?.lng;
          if (lat && lng) return { ...s, latitude: Number(lat), longitude: Number(lng) };
          const coords = await geocodeAddress(s.address);
          return coords ? { ...s, latitude: coords.lat, longitude: coords.lng } : s;
        }));

        stationsData = withCoords;
        setStations(stationsData);
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
