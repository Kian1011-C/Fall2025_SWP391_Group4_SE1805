// User State Management
// State management cho user profile and settings

import { create } from 'zustand';
import userService from '../services/userService';

const useUserStore = create((set, get) => ({
  // State
  profile: null,
  dashboard: null,
  preferences: null,
  isLoading: false,
  error: null,

  // Actions
  setProfile: (profile) => set({ profile }),
  
  setDashboard: (dashboard) => set({ dashboard }),
  
  setPreferences: (preferences) => set({ preferences }),
  
  setLoading: (isLoading) => set({ isLoading }),
  
  setError: (error) => set({ error }),
  
  // Fetch user profile
  fetchProfile: async (userId) => {
    set({ isLoading: true, error: null });
    try {
      const response = await userService.getUserProfile(userId);
      if (response.success) {
        set({ profile: response.data, isLoading: false });
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

  // Update user profile
  updateProfile: async (userId, profileData) => {
    set({ isLoading: true, error: null });
    try {
      const response = await userService.updateUserProfile(userId, profileData);
      if (response.success) {
        set({ profile: response.data, isLoading: false });
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

  // Fetch user dashboard
  fetchDashboard: async (userId) => {
    set({ isLoading: true, error: null });
    try {
      const response = await userService.getUserDashboard(userId);
      if (response.success) {
        set({ dashboard: response.data, isLoading: false });
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

  // Update user preferences
  updatePreferences: async (userId, preferences) => {
    set({ isLoading: true, error: null });
    try {
      const response = await userService.updateUserPreferences(userId, preferences);
      if (response.success) {
        set({ preferences: response.data, isLoading: false });
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

  // Change password
  changePassword: async (userId, passwordData) => {
    set({ isLoading: true, error: null });
    try {
      const response = await userService.changePassword(userId, passwordData);
      if (response.success) {
        set({ isLoading: false });
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
    profile: null,
    dashboard: null,
    preferences: null,
    isLoading: false, 
    error: null 
  }),
}));

export default useUserStore;

