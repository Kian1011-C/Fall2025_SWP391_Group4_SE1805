// Auth State Management
// Redux / Zustand store cho authentication

import { create } from 'zustand';

const useAuthStore = create((set) => ({
  // State
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,

  // Actions
  setUser: (user) => set({ user, isAuthenticated: !!user }),
  
  setLoading: (isLoading) => set({ isLoading }),
  
  setError: (error) => set({ error }),
  
  login: async (credentials) => {
    set({ isLoading: true, error: null });
    try {
      // TODO: Implement login logic
      console.log('Auth Store: Login', credentials);
      // const user = await authService.login(credentials);
      // set({ user, isAuthenticated: true, isLoading: false });
    } catch (error) {
      set({ error: error.message, isLoading: false });
    }
  },
  
  logout: () => {
    set({ user: null, isAuthenticated: false });
    // TODO: Clear localStorage, redirect, etc.
  },
  
  clearError: () => set({ error: null }),
}));

export default useAuthStore;