import { useState, useEffect, useCallback } from 'react';
//  SỬ DỤNG staffSwapService cho Staff
import staffSwapService from '../../../../assets/js/services/staffSwapService';

export const useSwapConfirmData = () => {
  const [requests, setRequests] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const fetchRequests = useCallback(async () => {
    try {
      setError(null);
      // 1. Gọi API để lấy TẤT CẢ các phiên đổi pin (sử dụng staffSwapService)
      const allSwaps = await staffSwapService.getAllSwaps();
      
      if (allSwaps && Array.isArray(allSwaps)) {
        // 2. LỌC ở Frontend: Chỉ giữ lại các yêu cầu có trạng thái 'INITIATED'
        const pendingRequests = allSwaps.filter(swap => 
          swap.swapStatus === 'INITIATED' || swap.status === 'INITIATED'
        );
        setRequests(pendingRequests);
      } else {
        throw new Error('Dữ liệu không hợp lệ');
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
      //  Sử dụng staffSwapService.completeSwap() để chấp nhận và hoàn thành swap
      await staffSwapService.completeSwap(swapId);
      await fetchRequests(); // Tải lại danh sách sau khi cập nhật
    } catch (err) {
      setError("Lỗi khi chấp nhận yêu cầu: " + (err.message || ''));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeclineRequest = async (swapId) => {
    setIsSubmitting(true);
    try {
      //  Sử dụng staffSwapService.cancelSwap() để từ chối
      await staffSwapService.cancelSwap(swapId);
      await fetchRequests();
    } catch (err) {
      setError("Lỗi khi từ chối yêu cầu: " + (err.message || ''));
    } finally {
      setIsSubmitting(false);
    }
  };

  return { requests, isLoading, error, isSubmitting, handleAcceptRequest, handleDeclineRequest };
};