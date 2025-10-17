// Notification Service
// Handle notifications and alerts

import { apiUtils } from '../config/api.js';

class NotificationService {
  constructor() {
    this.subscribers = [];
    this.unreadCount = 0;
  }

  // Get notifications for user
  async getUserNotifications(userId, filters = {}) {
    try {
      console.log('NotificationService: Get user notifications', userId);
      
      const response = await apiUtils.get(`/api/users/${userId}/notifications`, filters);
      
      if (response.success) {
        this.unreadCount = response.unreadCount || 0;
        return {
          success: true,
          data: response.data || [],
          unreadCount: this.unreadCount,
          total: response.total || 0,
          message: 'Lấy thông báo thành công'
        };
      } else {
        throw new Error(response.message || 'Không thể lấy thông báo');
      }
    } catch (error) {
      console.error('Get user notifications error:', error);
      const errorInfo = apiUtils.handleError(error);
      return {
        success: false,
        message: errorInfo.message || 'Lỗi khi lấy thông báo',
        data: this.getDefaultNotifications(),
        unreadCount: 0,
        error: errorInfo
      };
    }
  }

  // Mark notification as read
  async markAsRead(notificationId) {
    try {
      console.log('NotificationService: Mark as read', notificationId);
      
      const response = await apiUtils.put(`/api/notifications/${notificationId}/read`);
      
      if (response.success) {
        this.unreadCount = Math.max(0, this.unreadCount - 1);
        this.notifySubscribers();
        return {
          success: true,
          message: 'Đánh dấu đã đọc thành công'
        };
      } else {
        throw new Error(response.message || 'Không thể đánh dấu đã đọc');
      }
    } catch (error) {
      console.error('Mark as read error:', error);
      const errorInfo = apiUtils.handleError(error);
      return {
        success: false,
        message: errorInfo.message || 'Lỗi khi đánh dấu đã đọc',
        error: errorInfo
      };
    }
  }

  // Mark all notifications as read
  async markAllAsRead(userId) {
    try {
      console.log('NotificationService: Mark all as read', userId);
      
      const response = await apiUtils.put(`/api/users/${userId}/notifications/read-all`);
      
      if (response.success) {
        this.unreadCount = 0;
        this.notifySubscribers();
        return {
          success: true,
          message: 'Đánh dấu tất cả đã đọc thành công'
        };
      } else {
        throw new Error(response.message || 'Không thể đánh dấu tất cả đã đọc');
      }
    } catch (error) {
      console.error('Mark all as read error:', error);
      const errorInfo = apiUtils.handleError(error);
      return {
        success: false,
        message: errorInfo.message || 'Lỗi khi đánh dấu tất cả đã đọc',
        error: errorInfo
      };
    }
  }

  // Delete notification
  async deleteNotification(notificationId) {
    try {
      console.log('NotificationService: Delete notification', notificationId);
      
      const response = await apiUtils.delete(`/api/notifications/${notificationId}`);
      
      if (response.success) {
        return {
          success: true,
          message: 'Xóa thông báo thành công'
        };
      } else {
        throw new Error(response.message || 'Không thể xóa thông báo');
      }
    } catch (error) {
      console.error('Delete notification error:', error);
      const errorInfo = apiUtils.handleError(error);
      return {
        success: false,
        message: errorInfo.message || 'Lỗi khi xóa thông báo',
        error: errorInfo
      };
    }
  }

  // Send notification (Admin/Staff)
  async sendNotification(notificationData) {
    try {
      console.log('NotificationService: Send notification', notificationData);
      
      const response = await apiUtils.post('/api/notifications', notificationData);
      
      if (response.success) {
        return {
          success: true,
          data: response.data,
          message: 'Gửi thông báo thành công'
        };
      } else {
        throw new Error(response.message || 'Không thể gửi thông báo');
      }
    } catch (error) {
      console.error('Send notification error:', error);
      const errorInfo = apiUtils.handleError(error);
      return {
        success: false,
        message: errorInfo.message || 'Lỗi khi gửi thông báo',
        error: errorInfo
      };
    }
  }

  // Subscribe to notification updates
  subscribe(callback) {
    this.subscribers.push(callback);
    return () => {
      this.subscribers = this.subscribers.filter(cb => cb !== callback);
    };
  }

  // Notify all subscribers
  notifySubscribers() {
    this.subscribers.forEach(callback => {
      try {
        callback(this.unreadCount);
      } catch (error) {
        console.error('Error notifying subscriber:', error);
      }
    });
  }

  // Get unread count
  getUnreadCount() {
    return this.unreadCount;
  }

  // Set up real-time notifications (WebSocket/SSE)
  async setupRealTimeNotifications(userId) {
    try {
      // TODO: Implement WebSocket or Server-Sent Events for real-time notifications
      console.log('Setting up real-time notifications for user:', userId);
      
      // For now, poll every 30 seconds
      setInterval(async () => {
        try {
          const result = await this.getUserNotifications(userId, { unreadOnly: true });
          if (result.success && result.unreadCount !== this.unreadCount) {
            this.unreadCount = result.unreadCount;
            this.notifySubscribers();
          }
        } catch (error) {
          console.error('Error polling notifications:', error);
        }
      }, 30000);
      
    } catch (error) {
      console.error('Setup real-time notifications error:', error);
    }
  }

  // Get notification types
  getNotificationTypes() {
    return [
      { id: 'battery_low', name: 'Pin yếu', icon: '🔋', color: '#ff6b6b' },
      { id: 'swap_complete', name: 'Đổi pin thành công', icon: '✅', color: '#19c37d' },
      { id: 'payment_due', name: 'Thanh toán', icon: '💳', color: '#ffa726' },
      { id: 'maintenance', name: 'Bảo trì', icon: '🔧', color: '#42a5f5' },
      { id: 'system', name: 'Hệ thống', icon: '⚙️', color: '#ab47bc' },
      { id: 'promotion', name: 'Khuyến mãi', icon: '🎉', color: '#26a69a' },
      { id: 'contract', name: 'Hợp đồng', icon: '📄', color: '#5c6bc0' },
      { id: 'emergency', name: 'Khẩn cấp', icon: '🚨', color: '#f44336' }
    ];
  }

  // Get default notifications (fallback)
  getDefaultNotifications() {
    return [
      {
        id: 'welcome_1',
        type: 'system',
        title: 'Chào mừng bạn đến với hệ thống!',
        message: 'Cảm ơn bạn đã đăng ký sử dụng dịch vụ đổi pin thông minh.',
        timestamp: new Date().toISOString(),
        read: false,
        priority: 'normal',
        icon: '👋'
      },
      {
        id: 'setup_1',
        type: 'system',
        title: 'Hoàn tất thiết lập tài khoản',
        message: 'Hãy thêm phương tiện và đăng ký gói dịch vụ để bắt đầu sử dụng.',
        timestamp: new Date(Date.now() - 3600000).toISOString(),
        read: false,
        priority: 'high',
        icon: '⚙️'
      }
    ];
  }

  // Show browser notification
  async showBrowserNotification(title, options = {}) {
    if ('Notification' in window) {
      if (Notification.permission === 'granted') {
        return new Notification(title, {
          icon: '/vite.svg',
          badge: '/vite.svg',
          ...options
        });
      } else if (Notification.permission !== 'denied') {
        const permission = await Notification.requestPermission();
        if (permission === 'granted') {
          return new Notification(title, {
            icon: '/vite.svg',
            badge: '/vite.svg',
            ...options
          });
        }
      }
    }
    return null;
  }

  // Request notification permission
  async requestNotificationPermission() {
    if ('Notification' in window) {
      return await Notification.requestPermission();
    }
    return 'denied';
  }

  // Format notification for display
  formatNotification(notification) {
    const typeInfo = this.getNotificationTypes().find(t => t.id === notification.type) || 
                     { icon: '📢', color: '#666666' };
    
    return {
      ...notification,
      typeIcon: typeInfo.icon,
      typeColor: typeInfo.color,
      formattedTime: this.formatTimestamp(notification.timestamp),
      isRecent: this.isRecentNotification(notification.timestamp)
    };
  }

  // Format timestamp for display
  formatTimestamp(timestamp) {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Vừa xong';
    if (diffMins < 60) return `${diffMins} phút trước`;
    if (diffHours < 24) return `${diffHours} giờ trước`;
    if (diffDays < 7) return `${diffDays} ngày trước`;
    
    return date.toLocaleDateString('vi-VN');
  }

  // Check if notification is recent (within 24 hours)
  isRecentNotification(timestamp) {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now - date;
    return diffMs < 86400000; // 24 hours in milliseconds
  }
}

export default new NotificationService();