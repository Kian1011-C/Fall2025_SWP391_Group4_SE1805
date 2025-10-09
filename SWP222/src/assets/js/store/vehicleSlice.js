// Vehicle State Management
// State management cho vehicle operations

import { create } from 'zustand';
import vehicleService from '../services/vehicleService';

const useVehicleStore = create((set, get) => ({
  // State
  vehicles: [],
  selectedVehicle: null,
  vehicleBatteryInfo: null,
  serviceHistory: [],
  isLoading: false,
  error: null,

  // Actions
  setVehicles: (vehicles) => set({ vehicles }),
  
  setSelectedVehicle: (vehicle) => set({ selectedVehicle: vehicle }),
  
  setVehicleBatteryInfo: (info) => set({ vehicleBatteryInfo: info }),
  
  setServiceHistory: (history) => set({ serviceHistory: history }),
  
  setLoading: (isLoading) => set({ isLoading }),
  
  setError: (error) => set({ error }),
  
  // Fetch user vehicles
  fetchUserVehicles: async (userId) => {
    set({ isLoading: true, error: null });
    try {
      const response = await vehicleService.getUserVehicles(userId);
      if (response.success) {
        set({ vehicles: response.data, isLoading: false });
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

  // Fetch vehicle by ID
  fetchVehicleById: async (vehicleId) => {
    set({ isLoading: true, error: null });
    try {
      const response = await vehicleService.getVehicleById(vehicleId);
      if (response.success) {
        set({ selectedVehicle: response.data, isLoading: false });
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

  // Add vehicle
  addVehicle: async (vehicleData) => {
    set({ isLoading: true, error: null });
    try {
      const response = await vehicleService.addVehicle(vehicleData);
      if (response.success) {
        const currentVehicles = get().vehicles;
        set({ 
          vehicles: [...currentVehicles, response.data],
          selectedVehicle: response.data,
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

  // Update vehicle
  updateVehicle: async (vehicleId, vehicleData) => {
    set({ isLoading: true, error: null });
    try {
      const response = await vehicleService.updateVehicle(vehicleId, vehicleData);
      if (response.success) {
        const currentVehicles = get().vehicles;
        const updatedVehicles = currentVehicles.map(vehicle => 
          vehicle.id === vehicleId ? response.data : vehicle
        );
        
        set({ 
          vehicles: updatedVehicles,
          selectedVehicle: response.data,
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

  // Delete vehicle
  deleteVehicle: async (vehicleId) => {
    set({ isLoading: true, error: null });
    try {
      const response = await vehicleService.deleteVehicle(vehicleId);
      if (response.success) {
        const currentVehicles = get().vehicles;
        const filteredVehicles = currentVehicles.filter(vehicle => vehicle.id !== vehicleId);
        
        set({ 
          vehicles: filteredVehicles,
          selectedVehicle: null,
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

  // Fetch vehicle battery info
  fetchVehicleBatteryInfo: async (vehicleId) => {
    set({ isLoading: true, error: null });
    try {
      const response = await vehicleService.getVehicleBatteryInfo(vehicleId);
      if (response.success) {
        set({ vehicleBatteryInfo: response.data, isLoading: false });
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

  // Register vehicle for service
  registerVehicleForService: async (vehicleId, serviceData) => {
    set({ isLoading: true, error: null });
    try {
      const response = await vehicleService.registerVehicleForService(vehicleId, serviceData);
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

  // Fetch vehicle service history
  fetchVehicleServiceHistory: async (vehicleId) => {
    set({ isLoading: true, error: null });
    try {
      const response = await vehicleService.getVehicleServiceHistory(vehicleId);
      if (response.success) {
        set({ serviceHistory: response.data, isLoading: false });
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

  // Clear error
  clearError: () => set({ error: null }),

  // Reset state
  reset: () => set({ 
    vehicles: [],
    selectedVehicle: null,
    vehicleBatteryInfo: null,
    serviceHistory: [],
    isLoading: false, 
    error: null 
  }),
}));

export default useVehicleStore;

