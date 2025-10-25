import { useState, useEffect, useCallback } from 'react';
import issueService from '../../../../assets/js/services/issueService';

export const useIssueData = () => {
  const [issues, setIssues] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchIssues = useCallback(async (filters = {}) => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await issueService.getAllIssues(filters);
      if (response.success && Array.isArray(response.data)) {
        setIssues(response.data);
      } else {
        throw new Error(response.message || "Dữ liệu sự cố không hợp lệ.");
      }
    } catch (err) {
      setError(err.message || "Không thể tải danh sách sự cố.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Tải dữ liệu lần đầu khi component được mở
  useEffect(() => {
    fetchIssues();
  }, [fetchIssues]);

  // Trả về dữ liệu, trạng thái, và hàm để tải lại
  return { issues, isLoading, error, refetch: fetchIssues };
};