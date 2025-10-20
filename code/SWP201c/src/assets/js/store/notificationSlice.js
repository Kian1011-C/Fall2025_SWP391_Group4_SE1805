// Notification State Management
// State management cho notifications

import { create } from 'zustand';
import notificationService from '../services/notificationService';

const useNotificationStore = create((set, get) => ({
  // State
  notifications: [],
  unreadCount: 0,
  isLoading: false,
  error: null,

  // Actions
  setNotifications: (notifications) => set({ notifications }),
  
  setUnreadCount: (count) => set({ unreadCount: count }),
  
  setLoading: (isLoading) => set({ isLoading }),
  
  setError: (error) => set({ error }),
  
  // Fetch user notifications
  fetchNotifications: async (userId, filters = {}) => {
    set({ isLoading: true, error: null });
    try {
      const response = await notificationService.getUserNotifications(userId, filters);
      if (response.success) {
        set({ 
          notifications: response.data,
          unreadCount: response.unreadCount || 0,
          isLoading: false 
        });
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

  // Mark notification as read
  markAsRead: async (notificationId) => {
    set({ isLoading: true, error: null });
    try {
      const response = await notificationService.markAsRead(notificationId);
      if (response.success) {
        const currentNotifications = get().notifications;
        const updatedNotifications = currentNotifications.map(notif => 
          notif.id === notificationId ? { ...notif, read: true } : notif
        );
        
        const newUnreadCount = Math.max(0, get().unreadCount - 1);
        
        set({ 
          notifications: updatedNotifications,
          unreadCount: newUnreadCount,
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

  // Mark all notifications as read
  markAllAsRead: async (userId) => {
    set({ isLoading: true, error: null });
    try {
      const response = await notificationService.markAllAsRead(userId);
      if (response.success) {
        const currentNotifications = get().notifications;
        const updatedNotifications = currentNotifications.map(notif => 
          ({ ...notif, read: true })
        );
        
        set({ 
          notifications: updatedNotifications,
          unreadCount: 0,
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

  // Delete notification
  deleteNotification: async (notificationId) => {
    set({ isLoading: true, error: null });
    try {
      const response = await notificationService.deleteNotification(notificationId);
      if (response.success) {
        const currentNotifications = get().notifications;
        const deletedNotif = currentNotifications.find(n => n.id === notificationId);
        const filteredNotifications = currentNotifications.filter(notif => notif.id !== notificationId);
        
        // Decrease unread count if deleted notification was unread
        const newUnreadCount = deletedNotif && !deletedNotif.read 
          ? Math.max(0, get().unreadCount - 1)
          : get().unreadCount;
        
        set({ 
          notifications: filteredNotifications,
          unreadCount: newUnreadCount,
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

  // Send notification (Admin/Staff)
  sendNotification: async (notificationData) => {
    set({ isLoading: true, error: null });
    try {
      const response = await notificationService.sendNotification(notificationData);
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

  // Add notification locally (for real-time updates)
  addNotification: (notification) => {
    const currentNotifications = get().notifications;
    const newUnreadCount = !notification.read ? get().unreadCount + 1 : get().unreadCount;
    
    set({ 
      notifications: [notification, ...currentNotifications],
      unreadCount: newUnreadCount
    });
  },

  // Setup real-time notifications
  setupRealTime: async (userId) => {
    try {
      await notificationService.setupRealTimeNotifications(userId);
      
      // Subscribe to notification updates
      notificationService.subscribe((unreadCount) => {
        set({ unreadCount });
      });
    } catch (error) {
      console.error('Setup real-time notifications error:', error);
    }
  },

  // Clear error
  clearError: () => set({ error: null }),

  // Reset state
  reset: () => set({ 
    notifications: [],
    unreadCount: 0,
    isLoading: false, 
    error: null 
  }),
}));

export default useNotificationStore;

