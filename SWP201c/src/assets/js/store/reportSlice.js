// Report State Management
// State management cho reports and analytics

import { create } from 'zustand';
import reportService from '../services/reportService';

const useReportStore = create((set, get) => ({
  // State
  overviewReport: null,
  revenueReport: null,
  usageReport: null,
  customerReport: null,
  isLoading: false,
  error: null,

  // Actions
  setOverviewReport: (report) => set({ overviewReport: report }),
  
  setRevenueReport: (report) => set({ revenueReport: report }),
  
  setUsageReport: (report) => set({ usageReport: report }),
  
  setCustomerReport: (report) => set({ customerReport: report }),
  
  setLoading: (isLoading) => set({ isLoading }),
  
  setError: (error) => set({ error }),
  
  // Fetch overview report
  fetchOverviewReport: async (dateRange = 'month') => {
    set({ isLoading: true, error: null });
    try {
      const response = await reportService.getOverviewReport(dateRange);
      if (response.success) {
        set({ overviewReport: response.data, isLoading: false });
        return response.data;
      } else {
        set({ error: response.message, isLoading: false });
        return null;
      }
    } catch (error) {
      set({ error: error.message, isLoading: false });
      return null;
    }
  },

  // Fetch revenue report
  fetchRevenueReport: async (dateRange = 'month') => {
    set({ isLoading: true, error: null });
    try {
      const response = await reportService.getRevenueReport(dateRange);
      if (response.success) {
        set({ revenueReport: response.data, isLoading: false });
        return response.data;
      } else {
        set({ error: response.message, isLoading: false });
        return null;
      }
    } catch (error) {
      set({ error: error.message, isLoading: false });
      return null;
    }
  },

  // Fetch usage report
  fetchUsageReport: async (dateRange = 'month') => {
    set({ isLoading: true, error: null });
    try {
      const response = await reportService.getUsageReport(dateRange);
      if (response.success) {
        set({ usageReport: response.data, isLoading: false });
        return response.data;
      } else {
        set({ error: response.message, isLoading: false });
        return null;
      }
    } catch (error) {
      set({ error: error.message, isLoading: false });
      return null;
    }
  },

  // Fetch customer report
  fetchCustomerReport: async (dateRange = 'month') => {
    set({ isLoading: true, error: null });
    try {
      const response = await reportService.getCustomerReport(dateRange);
      if (response.success) {
        set({ customerReport: response.data, isLoading: false });
        return response.data;
      } else {
        set({ error: response.message, isLoading: false });
        return null;
      }
    } catch (error) {
      set({ error: error.message, isLoading: false });
      return null;
    }
  },

  // Export report
  exportReport: async (reportType, dateRange, format = 'pdf') => {
    set({ isLoading: true, error: null });
    try {
      const response = await reportService.exportReport(reportType, dateRange, format);
      if (response.success) {
        set({ isLoading: false });
        return response.data;
      } else {
        set({ error: response.message, isLoading: false });
        return null;
      }
    } catch (error) {
      set({ error: error.message, isLoading: false });
      return null;
    }
  },

  // Clear error
  clearError: () => set({ error: null }),

  // Reset state
  reset: () => set({ 
    overviewReport: null,
    revenueReport: null,
    usageReport: null,
    customerReport: null,
    isLoading: false, 
    error: null 
  }),
}));

export default useReportStore;

