import { useState, useEffect, useCallback } from 'react';
import swapService from '../../../../assets/js/services/swapService';

export const useSwapConfirmData = () => {
  const [requests, setRequests] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const fetchRequests = useCallback(async () => {
    try {
      setError(null);
      // 1. Gọi API để lấy TẤT CẢ các phiên đổi pin
      const response = await swapService.getAllSwaps();
      
      if (response.success) {
        // 2. LỌC ở Frontend: Chỉ giữ lại các yêu cầu có trạng thái 'INITIATED'
        const pendingRequests = response.data.filter(swap => swap.swapStatus === 'INITIATED');
        setRequests(pendingRequests);
      } else {
        throw new Error(response.message);
      }
    } catch (err) {
      setError(err.message || "Không thể tải danh sách yêu cầu.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRequests();
    const interval = setInterval(fetchRequests, 30000);
    return () => clearInterval(interval);
  }, [fetchRequests]);

  const handleAcceptRequest = async (swapId) => {
    setIsSubmitting(true);
    try {
      await swapService.updateSwapStatus(swapId, 'IN_PROGRESS');
      await fetchRequests(); // Tải lại danh sách sau khi cập nhật
    } catch (err) {
      setError("Lỗi khi chấp nhận yêu cầu.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeclineRequest = async (swapId) => {
    setIsSubmitting(true);
    try {
      await swapService.updateSwapStatus(swapId, 'CANCELLED');
      await fetchRequests();
    } catch (err) {
      setError("Lỗi khi từ chối yêu cầu.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return { requests, isLoading, error, isSubmitting, handleAcceptRequest, handleDeclineRequest };
};