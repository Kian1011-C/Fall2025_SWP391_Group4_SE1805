import { useState, useEffect, useCallback, useMemo } from 'react';
import transactionService from '../../../../assets/js/services/transactionService';

export const useTransactionsData = () => {
  const [transactions, setTransactions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // State cho bộ lọc
  const [filterStatus, setFilterStatus] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [dateRange, setDateRange] = useState({ start: '', end: '' });

  // Hàm gọi API
  const fetchTransactions = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await transactionService.getAllTransactions();
      if (response.success && Array.isArray(response.data)) {
        setTransactions(response.data);
      } else {
        throw new Error(response.message || "Dữ liệu giao dịch không hợp lệ.");
      }
    } catch (err) {
      setError(err.message || "Không thể tải lịch sử giao dịch.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  // Logic lọc/tìm kiếm (thực hiện ở Frontend)
  const filteredTransactions = useMemo(() => {
    return transactions.filter(tx => {
      const statusMatch = filterStatus ? tx.swapStatus === filterStatus : true;
      const query = searchQuery.toLowerCase();
      const searchMatch = searchQuery ? 
        (tx.swapId?.toString().includes(query) || 
         tx.userId?.toLowerCase().includes(query))
        : true;
      
      // Lọc ngày tháng
      const txDate = new Date(tx.swapDate);
      const startDate = dateRange.start ? new Date(dateRange.start) : null;
      const endDate = dateRange.end ? new Date(dateRange.end) : null;
      if (startDate) startDate.setHours(0, 0, 0, 0); // Bắt đầu ngày
      if (endDate) endDate.setHours(23, 59, 59, 999); // Kết thúc ngày
      
      const dateMatch = 
        (!startDate || txDate >= startDate) && 
        (!endDate || txDate <= endDate);

      return statusMatch && searchMatch && dateMatch;
    });
  }, [transactions, filterStatus, searchQuery, dateRange]);

  return {
    transactions: filteredTransactions,
    isLoading, error, refetch: fetchTransactions,
    filterStatus, setFilterStatus,
    searchQuery, setSearchQuery,
    dateRange, setDateRange,
  };
};