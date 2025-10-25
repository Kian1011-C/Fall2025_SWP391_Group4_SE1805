//
// File: pages/staff/StationManagement/hooks/useCabinetDetailsData.js
//
import { useState, useEffect, useCallback } from 'react';
// Import file service của bạn
import stationService from '../../../../assets/js/services/stationService'; 

export const useCabinetDetailsData = (cabinetId) => {
  const [slots, setSlots] = useState([]);
  const [cabinetName, setCabinetName] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async () => {
    if (!cabinetId) return; // Không làm gì nếu chưa có ID

    setIsLoading(true);
    setError(null);
    try {
      // Gọi hàm "getStaffSlotsByCabinet" MỚI mà chúng ta đã thêm
      const response = await stationService.getStaffSlotsByCabinet(cabinetId);

      if (response.success && Array.isArray(response.data)) {
        setSlots(response.data);
        setCabinetName(response.cabinetName || ''); // Lấy tên trụ
      } else {
        throw new Error(response.message || "Dữ liệu slot không hợp lệ.");
      }
    } catch (err) {
      const errorMessage = err.message || "Không thể tải danh sách slot.";
      setError(errorMessage);
      console.error(errorMessage, err);
    } finally {
      setIsLoading(false);
    }
  }, [cabinetId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { slots, cabinetName, isLoading, error, refetch: fetchData };
};