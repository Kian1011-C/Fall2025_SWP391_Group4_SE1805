import { useState, useEffect, useMemo, useCallback } from 'react';
import transactionService from '../../../../assets/js/services/transactionService';

export const useTransactionsData = () => {
  const [transactions, setTransactions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // State cho các bộ lọc
  const [filterStatus, setFilterStatus] = useState('');
  const [filterDate, setFilterDate] = useState('');

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

  // Lọc dữ liệu hiển thị dựa trên state của các bộ lọc
  const filteredTransactions = useMemo(() => {
    return transactions.filter(tx => {
      // API của bạn trả về `swapStatus` và `swapDate`
      const statusMatch = filterStatus ? tx.swapStatus === filterStatus : true;
      const dateMatch = filterDate ? new Date(tx.swapDate).toLocaleDateString('en-CA') === filterDate : true;
      return statusMatch && dateMatch;
    });
  }, [transactions, filterStatus, filterDate]);

  return {
    transactions: filteredTransactions,
    isLoading,
    error,
    refetch: fetchTransactions,
    filterStatus, setFilterStatus,
    filterDate, setFilterDate,
  };
};