//
// File: pages/staff/StationManagement/hooks/useStationDetailsData.js
//
import { useState, useEffect, useCallback } from 'react';
// Import file service của bạn
import stationService from '../../../../assets/js/services/stationService'; 

export const useStationDetailsData = (stationId) => {
  const [cabinets, setCabinets] = useState([]);
  const [stationName, setStationName] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async () => {
    if (!stationId) return; // Không làm gì nếu chưa có ID

    setIsLoading(true);
    setError(null);
    try {
      // Gọi hàm "getStaffCabinetsByStation" MỚI mà chúng ta đã thêm
      const response = await stationService.getStaffCabinetsByStation(stationId);
      
      if (response.success && Array.isArray(response.data)) {
        setCabinets(response.data);
        setStationName(response.stationName || ''); // Lấy tên trạm
      } else {
        throw new Error(response.message || "Dữ liệu trụ không hợp lệ.");
      }
    } catch (err) {
      const errorMessage = err.message || "Không thể tải danh sách trụ.";
      setError(errorMessage);
      console.error(errorMessage, err);
    } finally {
      setIsLoading(false);
    }
  }, [stationId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { 
    cabinets, 
    stationName, 
    isLoading, 
    error, 
    refetch: fetchData // Trả ra hàm refetch để tải lại
  };
};