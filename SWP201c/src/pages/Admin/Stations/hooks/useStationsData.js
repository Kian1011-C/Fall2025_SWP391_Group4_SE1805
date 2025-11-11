import { useState, useEffect, useCallback, useMemo } from 'react';
import stationService from '../../../../assets/js/services/stationService';

export const useStationsData = () => {
  const [stations, setStations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [filterStatus, setFilterStatus] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  // Hàm gọi API
  const fetchStations = useCallback(async (filters = {}) => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Gửi bộ lọc lên service
      const finalFilters = { ...filters, status: filterStatus, q: searchQuery };
      const response = await stationService.getAllStations(finalFilters);

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
  }, [filterStatus, searchQuery]); // Phụ thuộc vào state của bộ lọc

  // Tải dữ liệu lần đầu
  useEffect(() => {
    fetchStations();
  }, [fetchStations]);

  // Các hàm CRUD
  const handleCreate = async (stationData) => {
    const response = await stationService.createStation(stationData);
    if (response.success) {
      fetchStations(); // Tải lại danh sách
    }
    return response;
  };

  const handleUpdate = async (stationId, stationData) => {
    const response = await stationService.updateStation(stationId, stationData);
    if (response.success) {
      fetchStations(); // Tải lại danh sách
    }
    return response;
  };

  return {
    stations, // Trả về danh sách đã được lọc bởi backend
    isLoading, error, refetch: fetchStations,
    filterStatus, setFilterStatus,
    searchQuery, setSearchQuery,
    handleCreate, handleUpdate,
  };
};