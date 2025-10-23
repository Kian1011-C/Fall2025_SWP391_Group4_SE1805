// Swap State Management
// State management cho battery swap operations

import { create } from 'zustand';
import swapService from '../services/swapService';

const useSwapStore = create((set, get) => ({
  // State
  activeSwaps: [],
  swapHistory: [],
  currentSwap: null,
  availableSlots: [],
  swapStatistics: null,
  isLoading: false,
  error: null,

  // Actions
  setActiveSwaps: (swaps) => set({ activeSwaps: swaps }),
  
  setSwapHistory: (history) => set({ swapHistory: history }),
  
  setCurrentSwap: (swap) => set({ currentSwap: swap }),
  
  setAvailableSlots: (slots) => set({ availableSlots: slots }),
  
  setSwapStatistics: (stats) => set({ swapStatistics: stats }),
  
  setLoading: (isLoading) => set({ isLoading }),
  
  setError: (error) => set({ error }),
  
  // Fetch active swaps
  fetchActiveSwaps: async (userId) => {
    set({ isLoading: true, error: null });
    try {
      const response = await swapService.getActiveSwaps(userId);
      if (response.success) {
        set({ activeSwaps: response.data, isLoading: false });
        return response.data;
      } else {
        set({ error: response.message, isLoading: false });
        return [];
      }
    } catch (error) {
      set({ error: error.message, isLoading: false });
      return [];
    }
  },

  // Fetch swap history
  fetchSwapHistory: async (userId, filters = {}) => {
    set({ isLoading: true, error: null });
    try {
      const response = await swapService.getSwapHistory(userId, filters);
      if (response.success) {
        set({ swapHistory: response.data, isLoading: false });
        return response.data;
      } else {
        set({ error: response.message, isLoading: false });
        return [];
      }
    } catch (error) {
      set({ error: error.message, isLoading: false });
      return [];
    }
  },

  // Fetch swap details
  fetchSwapDetails: async (swapId) => {
    set({ isLoading: true, error: null });
    try {
      const response = await swapService.getSwapDetails(swapId);
      if (response.success) {
        set({ currentSwap: response.data, isLoading: false });
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

  // Initiate swap
  initiateSwap: async (swapData) => {
    set({ isLoading: true, error: null });
    try {
      const response = await swapService.initiateSwap(swapData);
      if (response.success) {
        // Add to active swaps
        const currentActiveSwaps = get().activeSwaps;
        set({ 
          activeSwaps: [...currentActiveSwaps, response.data],
          currentSwap: response.data,
          isLoading: false 
        });
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

  // Confirm swap
  confirmSwap: async (swapId, confirmationData) => {
    set({ isLoading: true, error: null });
    try {
      const response = await swapService.confirmSwap(swapId, confirmationData);
      if (response.success) {
        // Update active swaps and move to history
        const currentActiveSwaps = get().activeSwaps;
        const updatedActiveSwaps = currentActiveSwaps.filter(swap => swap.id !== swapId);
        
        set({ 
          activeSwaps: updatedActiveSwaps,
          currentSwap: response.data,
          isLoading: false 
        });
        
        // Refresh swap history
        if (response.data.userId) {
          await get().fetchSwapHistory(response.data.userId);
        }
        
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

  // Cancel swap
  cancelSwap: async (swapId, cancelReason) => {
    set({ isLoading: true, error: null });
    try {
      const response = await swapService.cancelSwap(swapId, cancelReason);
      if (response.success) {
        // Remove from active swaps
        const currentActiveSwaps = get().activeSwaps;
        const updatedActiveSwaps = currentActiveSwaps.filter(swap => swap.id !== swapId);
        
        set({ 
          activeSwaps: updatedActiveSwaps,
          currentSwap: null,
          isLoading: false 
        });
        
        return true;
      } else {
        set({ error: response.message, isLoading: false });
        return false;
      }
    } catch (error) {
      set({ error: error.message, isLoading: false });
      return false;
    }
  },

  // Book swap slot
  bookSwapSlot: async (bookingData) => {
    set({ isLoading: true, error: null });
    try {
      const response = await swapService.bookSwapSlot(bookingData);
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

  // Fetch available slots
  fetchAvailableSlots: async (stationId, dateTime) => {
    set({ isLoading: true, error: null });
    try {
      const response = await swapService.getAvailableSlots(stationId, dateTime);
      if (response.success) {
        set({ availableSlots: response.data, isLoading: false });
        return response.data;
      } else {
        set({ error: response.message, isLoading: false });
        return [];
      }
    } catch (error) {
      set({ error: error.message, isLoading: false });
      return [];
    }
  },

  // Fetch swap statistics
  fetchSwapStatistics: async (userId, period = 'month') => {
    set({ isLoading: true, error: null });
    try {
      const response = await swapService.getUserSwapStatistics(userId, period);
      if (response.success) {
        set({ swapStatistics: response.data, isLoading: false });
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

  // Rate swap experience
  rateSwap: async (swapId, rating, feedback) => {
    set({ isLoading: true, error: null });
    try {
      const response = await swapService.rateSwapExperience(swapId, rating, feedback);
      if (response.success) {
        // Update swap in history
        const currentHistory = get().swapHistory;
        const updatedHistory = currentHistory.map(swap => 
          swap.id === swapId ? { ...swap, rating, feedback, hasRating: true } : swap
        );
        
        set({ 
          swapHistory: updatedHistory,
          isLoading: false 
        });
        
        return true;
      } else {
        set({ error: response.message, isLoading: false });
        return false;
      }
    } catch (error) {
      set({ error: error.message, isLoading: false });
      return false;
    }
  },

  // Clear error
  clearError: () => set({ error: null }),

  // Reset state
  reset: () => set({ 
    activeSwaps: [],
    swapHistory: [],
    currentSwap: null,
    availableSlots: [],
    swapStatistics: null,
    isLoading: false, 
    error: null 
  }),
}));

export default useSwapStore;

