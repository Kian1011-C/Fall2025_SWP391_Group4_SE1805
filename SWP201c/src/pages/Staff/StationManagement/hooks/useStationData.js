import { useState, useEffect, useCallback } from 'react';
import stationService from '../../../../assets/js/services/stationService';

export const useStationData = () => {
  const [stations, setStations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchStations = useCallback(async (filters = {}) => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await stationService.getAllStations(filters);
      if (response.success && Array.isArray(response.data)) {
        setStations(response.data);
      } else {
        throw new Error(response.message || "Dữ liệu trạm không hợp lệ.");
      }
    } catch (err) {
      setError(err.message || "Không thể tải danh sách trạm.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Tải dữ liệu lần đầu khi component được mở
  useEffect(() => {
    fetchStations();
  }, [fetchStations]);

  // Trả về dữ liệu, trạng thái, và hàm để tải lại
  return { stations, isLoading, error, refetch: fetchStations };
};