import { useState, useEffect, useCallback, useMemo } from 'react';
import batteryService from '../../../../assets/js/services/batteryService';

export const useBatteriesData = () => {
  const [batteries, setBatteries] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [filterStatus, setFilterStatus] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  // Hàm gọi API
  const fetchBatteries = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await batteryService.getAllBatteries();
      if (response.success && Array.isArray(response.data)) {
        setBatteries(response.data);
      } else {
        throw new Error(response.message || "Dữ liệu pin không hợp lệ.");
      }
    } catch (err) {
      setError(err.message || "Không thể tải danh sách pin.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBatteries();
  }, [fetchBatteries]);

  // Logic lọc
  const filteredBatteries = useMemo(() => {
    return batteries.filter(bat => {
      // So sánh status không phân biệt chữ hoa/thường
      const statusMatch = filterStatus ? 
        (bat.status?.toLowerCase() === filterStatus.toLowerCase()) : true;
      const searchMatch = searchQuery ? 
        (bat.batteryId.toString().includes(searchQuery) || 
         bat.model?.toLowerCase().includes(searchQuery.toLowerCase()))
        : true;
      return statusMatch && searchMatch;
    });
  }, [batteries, filterStatus, searchQuery]);

  // Các hàm CRUD
  const handleCreate = async (batteryData) => {
    console.log(' useBatteriesData: handleCreate called with:', batteryData);
    const response = await batteryService.createBattery(batteryData);
    console.log(' useBatteriesData: createBattery response:', response);
    if (response.success) {
      fetchBatteries(); // Tải lại danh sách
    }
    return response;
  };

  const handleUpdate = async (batteryId, batteryData) => {
    console.log(' useBatteriesData: handleUpdate called with:', batteryId, batteryData);
    const response = await batteryService.updateBattery(batteryId, batteryData);
    console.log(' useBatteriesData: updateBattery response:', response);
    if (response.success) {
      fetchBatteries(); // Tải lại danh sách
    }
    return response;
  };

  const handleDelete = async (batteryId) => {
    console.log(' useBatteriesData: handleDelete called with:', batteryId);
    const response = await batteryService.deleteBattery(batteryId);
    console.log(' useBatteriesData: deleteBattery response:', response);
    if (response.success) {
      fetchBatteries(); // Tải lại danh sách
    }
    return response;
  };

  return {
    batteries: filteredBatteries,
    isLoading, error, refetch: fetchBatteries,
    filterStatus, setFilterStatus,
    searchQuery, setSearchQuery,
    handleCreate, handleUpdate, handleDelete,
  };
};