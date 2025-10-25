import { useState, useEffect, useCallback } from 'react';
import stationService from '../../../../assets/js/services/stationService';

export const useStationsDrilldown = () => {
  const [stations, setStations] = useState([]);
  const [towers, setTowers] = useState([]); // Giữ tên 'towers' để component hoạt động
  const [slots, setSlots] = useState([]);
  
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Hàm gọi API
  const fetchStations = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await stationService.getAllStations();
      if (response.success) setStations(response.data);
      else throw new Error(response.message);
    } catch (err) {
      setError(err.message || "Không thể tải danh sách trạm.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  const fetchTowers = useCallback(async (stationId) => {
    try {
      setIsLoading(true);
      setError(null);
      
      // --- SỬA LỖI Ở ĐÂY ---
      // Gọi đúng tên hàm: getCabinetsByStation
      const response = await stationService.getCabinetsByStation(stationId);
      
      // File service của bạn đã xử lý và trả về data, không cần .success
      setTowers(response); 
    } catch (err) {
      setError(err.message || "Không thể tải danh sách trụ.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  const fetchSlots = useCallback(async (towerId) => {
    try {
      setIsLoading(true);
      setError(null);

      // --- SỬA LỖI Ở ĐÂY ---
      // Gọi đúng tên hàm: getSlotsByTower
      const response = await stationService.getSlotsByTower(towerId);
      
      if (response.success) setSlots(response.data);
      else throw new Error(response.message);
    } catch (err) {
      setError(err.message || "Không thể tải danh sách hộc pin.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Tải danh sách trạm ban đầu
  useEffect(() => {
    fetchStations();
  }, [fetchStations]);

  return {
    stations, towers, slots,
    isLoading, error,
    fetchStations, fetchTowers, fetchSlots,
  };
};