import { useState, useEffect, useCallback } from 'react';
import stationService from '../../../../assets/js/services/stationService';

// Hàm helper "thông minh" để lấy dữ liệu an toàn
const safeExtractData = (response) => {
  if (response && response.success && Array.isArray(response.data)) {
    return response.data;
  }
  if (response && response.success === false) {
    throw new Error(response.message || 'Lỗi không xác định');
  }
  if (Array.isArray(response)) {
    return response;
  }
  return [];
};

export const useStationsDrilldown = () => {
  const [stations, setStations] = useState([]);
  const [towers, setTowers] = useState([]);
  const [slots, setSlots] = useState([]);
  
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Cấp 1: Lấy tất cả Trạm
  const fetchStations = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await stationService.getAllStations();
      setStations(safeExtractData(response));
    } catch (err) {
      setError(err.message || "Không thể tải danh sách trạm.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Cấp 2: Lấy các Trụ của 1 Trạm (Dùng API Staff)
  const fetchTowers = useCallback(async (stationId) => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await stationService.getStaffCabinetsByStation(stationId); 
      setTowers(safeExtractData(response));
    } catch (err) {
      setError(err.message || "Không thể tải danh sách trụ.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Cấp 3: Lấy các Hộc của 1 Trụ (Dùng API Staff)
  const fetchSlots = useCallback(async (towerId) => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await stationService.getStaffSlotsByCabinet(towerId);
      setSlots(safeExtractData(response));
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