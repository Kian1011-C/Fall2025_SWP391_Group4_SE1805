import { useState, useEffect, useCallback, useMemo } from 'react';
import stationService from '../../../../assets/js/services/stationService';

export const useStationsData = () => {
  const [stations, setStations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [filterStatus, setFilterStatus] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  // Hàm gọi API
  const fetchStations = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await stationService.getAllStations();
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

  useEffect(() => {
    fetchStations();
  }, [fetchStations]);

  // Logic lọc
  const filteredStations = useMemo(() => {
    return stations.filter(station => {
      const statusMatch = filterStatus ? station.status === filterStatus : true;
      const searchMatch = searchQuery ? 
        (station.name?.toLowerCase().includes(searchQuery.toLowerCase()) || 
         station.address?.toLowerCase().includes(searchQuery.toLowerCase()))
        : true;
      return statusMatch && searchMatch;
    });
  }, [stations, filterStatus, searchQuery]);

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
    stations: filteredStations,
    isLoading, error, refetch: fetchStations,
    filterStatus, setFilterStatus,
    searchQuery, setSearchQuery,
    handleCreate, handleUpdate,
  };
};