import React, { createContext, useContext, useState } from 'react';

const TransactionContext = createContext();

export const useTransactions = () => {
  const ctx = useContext(TransactionContext);
  if (!ctx) throw new Error('useTransactions must be used within TransactionProvider');
  return ctx;
};

export const TransactionProvider = ({ children }) => {
  const [transactions, setTransactions] = useState([]);
  const [transactionFilter, setTransactionFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');
  const [showTransactionModal, setShowTransactionModal] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState(null);

  const getTransactionsForStation = (stationId) => transactions.filter(t => t.stationId === stationId);

  const getFilteredTransactions = () => {
    let filtered = transactions;
    if (transactionFilter !== 'all') {
      filtered = filtered.filter(t => t.paymentStatus === transactionFilter);
    }
    if (dateFilter !== 'all') {
      const now = new Date();
      filtered = filtered.filter(t => {
        const transactionDate = new Date(t.swapTime);
        const daysDiff = Math.floor((now - transactionDate) / (1000 * 60 * 60 * 24));
        switch (dateFilter) {
          case 'today': return daysDiff === 0;
          case 'week': return daysDiff <= 7;
          case 'month': return daysDiff <= 30;
          default: return true;
        }
      });
    }
    return filtered;
  };

  const value = {
    transactions, setTransactions,
    transactionFilter, setTransactionFilter,
    dateFilter, setDateFilter,
    showTransactionModal, setShowTransactionModal,
    selectedTransaction, setSelectedTransaction,
    getTransactionsForStation,
    getFilteredTransactions
  };

  return <TransactionContext.Provider value={value}>{children}</TransactionContext.Provider>;
};


