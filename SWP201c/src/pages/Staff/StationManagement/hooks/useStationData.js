//
// File: pages/staff/StationManagement/hooks/useStationData.js
//
import { useState, useEffect, useCallback } from 'react';
// Import file service của bạn
import stationService from '../../../../assets/js/services/stationService';

export const useStationData = () => {
  const [stations, setStations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Dùng để lưu trữ filter hiện tại (ví dụ: { status: 'active' })
  const [currentFilters, setCurrentFilters] = useState({});

  const fetchData = useCallback(async (newFilters) => {
    // Nếu có filter mới (từ dropdown), dùng nó.
    // Nếu không (từ nút "Tải lại"), dùng filter đang lưu.
    const filtersToUse = newFilters || currentFilters;

    // Nếu có filter mới, lưu lại
    if (newFilters) {
      setCurrentFilters(newFilters);
    }

    setIsLoading(true);
    setError(null);
    try {
      // **QUAN TRỌNG**: Truyền 'filtersToUse' vào hàm service
      const response = await stationService.getAllStations(filtersToUse); 
      
      if (response.success && Array.isArray(response.data)) {
        setStations(response.data);
      } else {
        throw new Error(response.message || "Dữ liệu trạm không hợp lệ.");
      }
    } catch (err) {
      const errorMessage = err.message || "Không thể tải danh sách trạm.";
      setError(errorMessage);
      console.error(errorMessage, err);
    } finally {
      setIsLoading(false);
    }
  }, [currentFilters]); // Hook sẽ tạo lại hàm fetchData nếu filter thay đổi

  useEffect(() => {
    // Tải dữ liệu lần đầu khi component mount
    fetchData({}); // Bắt đầu với không filter
  }, []); // <-- Chỉ chạy 1 lần duy nhất

  // Trả về hàm 'fetchData' dưới tên 'refetch'
  return { stations, isLoading, error, refetch: fetchData };
};