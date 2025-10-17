// Admin/Reports/hooks/useReportsFilters.js
// Custom hook for managing reports filters and tabs

import { useState } from 'react';

export const useReportsFilters = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [dateRange, setDateRange] = useState('month');

  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
  };

  const handleDateRangeChange = (newRange) => {
    setDateRange(newRange);
  };

  return {
    activeTab,
    dateRange,
    setActiveTab: handleTabChange,
    setDateRange: handleDateRangeChange
  };
};
