import { useMemo, useState } from 'react';

export const useTransactionsData = (initialTransactions) => {
  const [transactions, setTransactions] = useState(initialTransactions);
  const [filterStatus, setFilterStatus] = useState('Tất cả');
  const [filterStation, setFilterStation] = useState('Tất cả');
  const [filterDate, setFilterDate] = useState('');
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);

  const stations = useMemo(
    () => [...new Set(transactions.map(t => t.stationName))],
    [transactions]
  );

  const statusOptions = ['Hoàn thành', 'Đang xử lý', 'Thất bại'];

  const filteredTransactions = useMemo(() => {
    return transactions.filter(t => {
      const statusMatch = filterStatus === 'Tất cả' || t.status === filterStatus;
      const stationMatch = filterStation === 'Tất cả' || t.stationName === filterStation;
      const dateMatch = !filterDate || t.timestamp.startsWith(filterDate);
      return statusMatch && stationMatch && dateMatch;
    });
  }, [transactions, filterStatus, filterStation, filterDate]);

  const stats = useMemo(() => ({
    total: transactions.length,
    completed: transactions.filter(t => t.status === 'Hoàn thành').length,
    processing: transactions.filter(t => t.status === 'Đang xử lý').length,
    failed: transactions.filter(t => t.status === 'Thất bại').length,
    totalRevenue: transactions.reduce((sum, t) => sum + t.amount, 0)
  }), [transactions]);

  const openDetailModal = (transaction) => {
    setSelectedTransaction(transaction);
    setShowDetailModal(true);
  };

  return {
    // data
    transactions,
    setTransactions,
    filteredTransactions,
    stations,
    statusOptions,
    stats,
    // filters
    filterStatus, setFilterStatus,
    filterStation, setFilterStation,
    filterDate, setFilterDate,
    // modal
    showDetailModal, setShowDetailModal,
    selectedTransaction, setSelectedTransaction,
    openDetailModal
  };
};

export const useFormatters = () => {
  const getStatusColor = (status) => {
    switch (status) {
      case 'Hoàn thành': return '#19c37d';
      case 'Đang xử lý': return '#6ab7ff';
      case 'Thất bại': return '#ff4757';
      default: return '#6c757d';
    }
  };

  const getPaymentMethodColor = (method) => {
    switch (method) {
      case 'Gói dịch vụ': return '#19c37d';
      case 'Thanh toán lẻ': return '#ffa500';
      case 'Thẻ tín dụng': return '#6ab7ff';
      case 'Ví điện tử': return '#9c88ff';
      default: return '#6c757d';
    }
  };

  const formatCurrency = (amount) => new Intl.NumberFormat('vi-VN', {
    style: 'currency', currency: 'VND'
  }).format(amount);

  const formatDateTime = (ts) => new Date(ts).toLocaleString('vi-VN');

  return { getStatusColor, getPaymentMethodColor, formatCurrency, formatDateTime };
};


