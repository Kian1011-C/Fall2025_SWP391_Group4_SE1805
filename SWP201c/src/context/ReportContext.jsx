import React, { createContext, useContext, useState } from 'react';

const ReportContext = createContext();

export const useReports = () => {
  const ctx = useContext(ReportContext);
  if (!ctx) throw new Error('useReports must be used within ReportProvider');
  return ctx;
};

export const ReportProvider = ({ children }) => {
  const [reports, setReports] = useState([]);
  const [dateRange, setDateRange] = useState('week');
  const [chartData, setChartData] = useState({});

  const getFilteredReports = () => {
    if (!reports?.dailyStats) return [];
    const now = new Date();
    return reports.dailyStats.filter(stat => {
      const statDate = new Date(stat.date);
      const daysDiff = Math.floor((now - statDate) / (1000 * 60 * 60 * 24));
      switch (dateRange) {
        case 'day': return daysDiff === 0;
        case 'week': return daysDiff <= 7;
        case 'month': return daysDiff <= 30;
        default: return true;
      }
    });
  };

  const getChartData = () => {
    const filtered = getFilteredReports();
    return {
      labels: filtered.map(stat => stat.date),
      datasets: [
        { label: 'Số lượt đổi pin', data: filtered.map(stat => stat.swaps), borderColor: '#4F8CFF', backgroundColor: 'rgba(79, 140, 255, 0.1)' },
        { label: 'Doanh thu (VNĐ)', data: filtered.map(stat => stat.revenue), borderColor: '#19c37d', backgroundColor: 'rgba(25, 195, 125, 0.1)' }
      ]
    };
  };

  const value = {
    reports, setReports,
    dateRange, setDateRange,
    chartData, setChartData,
    getFilteredReports,
    getChartData
  };

  return <ReportContext.Provider value={value}>{children}</ReportContext.Provider>;
};


