// Station State Management
// State management cho stations

import { create } from 'zustand';
import stationService from '../services/stationService';

const useStationStore = create((set, get) => ({
  // State
  stations: [],
  nearbyStations: [],
  selectedStation: null,
  stationStats: null,
  isLoading: false,
  error: null,

  // Actions
  setStations: (stations) => set({ stations }),
  
  setNearbyStations: (stations) => set({ nearbyStations: stations }),
  
  setSelectedStation: (station) => set({ selectedStation: station }),
  
  setStationStats: (stats) => set({ stationStats: stats }),
  
  setLoading: (isLoading) => set({ isLoading }),
  
  setError: (error) => set({ error }),
  
  // Fetch all stations
  fetchStations: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await stationService.getStations();
      if (response.success) {
        set({ stations: response.data, isLoading: false });
      } else {
        set({ error: response.message, isLoading: false });
      }
    } catch (error) {
      set({ error: error.message, isLoading: false });
    }
  },
  
  // Fetch station by ID
  fetchStationById: async (stationId) => {
    set({ isLoading: true, error: null });
    try {
      const response = await stationService.getStationById(stationId);
      if (response.success) {
        set({ selectedStation: response.data, isLoading: false });
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

  // Create new station
  createStation: async (stationData) => {
    set({ isLoading: true, error: null });
    try {
      const response = await stationService.createStation(stationData);
      if (response.success) {
        const currentStations = get().stations;
        set({ 
          stations: [...currentStations, response.data], 
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

  // Update station
  updateStation: async (stationId, updateData) => {
    set({ isLoading: true, error: null });
    try {
      const response = await stationService.updateStation(stationId, updateData);
      if (response.success) {
        const currentStations = get().stations;
        const updatedStations = currentStations.map(station => 
          station.id === stationId ? response.data : station
        );
        set({ 
          stations: updatedStations, 
          selectedStation: response.data,
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

  // Delete station
  deleteStation: async (stationId) => {
    set({ isLoading: true, error: null });
    try {
      const response = await stationService.deleteStation(stationId);
      if (response.success) {
        const currentStations = get().stations;
        const filteredStations = currentStations.filter(station => station.id !== stationId);
        set({ 
          stations: filteredStations, 
          selectedStation: null,
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
  
  // Fetch nearby stations
  fetchNearbyStations: async (location) => {
    set({ isLoading: true, error: null });
    try {
      const response = await stationService.getNearbyStations(location);
      if (response.success) {
        set({ nearbyStations: response.data, isLoading: false });
      } else {
        set({ error: response.message, isLoading: false });
      }
    } catch (error) {
      set({ error: error.message, isLoading: false });
    }
  },

  // Fetch station availability
  fetchStationAvailability: async (stationId) => {
    set({ isLoading: true, error: null });
    try {
      const response = await stationService.getStationAvailability(stationId);
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

  // Book station
  bookStation: async (stationId, userId, timeSlot) => {
    set({ isLoading: true, error: null });
    try {
      const response = await stationService.bookStation(stationId, userId, timeSlot);
      if (response.success) {
        // Update station availability after booking
        await get().fetchStations();
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

  // Update station status
  updateStationStatus: async (stationId, status) => {
    set({ isLoading: true, error: null });
    try {
      const response = await stationService.updateStationStatus(stationId, status);
      if (response.success) {
        const currentStations = get().stations;
        const updatedStations = currentStations.map(station => 
          station.id === stationId ? response.data : station
        );
        set({ 
          stations: updatedStations, 
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

  // Fetch station statistics
  fetchStationStats: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await stationService.getStationStats();
      if (response.success) {
        set({ stationStats: response.data, isLoading: false });
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
    stations: [], 
    nearbyStations: [], 
    selectedStation: null, 
    stationStats: null,
    isLoading: false, 
    error: null 
  }),
}));

export default useStationStore;