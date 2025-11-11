import { useState, useEffect, useCallback } from 'react';
import stationService from '../../../../assets/js/services/stationService'; // Đảm bảo đường dẫn này đúng

export const useStationData = () => {
  const [stations, setStations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Dùng useCallback để hàm này không bị tạo lại sau mỗi lần render
  const fetchStations = useCallback(async (filters = {}) => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await stationService.getAllStations(filters);
      
      if (response.success && Array.isArray(response.data)) {
        setStations(response.data);
      } else {
        // Ném lỗi nếu API trả về success: false
        throw new Error(response.message || "Dữ liệu trạm không hợp lệ.");
      }
    } catch (err) {
      setError(err.message || "Không thể tải danh sách trạm.");
    } finally {
      setIsLoading(false);
    }
  }, []); // Hàm này không phụ thuộc vào gì, chỉ tạo 1 lần

  // Tải dữ liệu lần đầu khi component được mở
  useEffect(() => {
    fetchStations(); // Gọi hàm với bộ lọc rỗng
  }, [fetchStations]);

  // Trả về dữ liệu, trạng thái, và hàm để tải lại (refetch)
  return { stations, isLoading, error, refetch: fetchStations };
};