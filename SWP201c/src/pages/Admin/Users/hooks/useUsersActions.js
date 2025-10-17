// Admin/Users/hooks/useUsersActions.js
// Custom hook for user CRUD operations

import { useState } from 'react';
import userService from '../../../../assets/js/services/userService';

export const useUsersActions = (onSuccess) => {
  const [actionLoading, setActionLoading] = useState(false);

  const createUser = async (userData) => {
    try {
      setActionLoading(true);
      const result = await userService.createUser(userData);
      
      if (result.success) {
        onSuccess?.();
        alert('Thêm người dùng thành công!');
        return { success: true };
      } else {
        alert(`Lỗi: ${result.message}`);
        return { success: false, error: result.message };
      }
    } catch (err) {
      console.error('Create user error:', err);
      alert('Có lỗi xảy ra khi tạo người dùng');
      return { success: false, error: 'Lỗi khi tạo người dùng' };
    } finally {
      setActionLoading(false);
    }
  };

  const updateUser = async (userId, userData) => {
    try {
      setActionLoading(true);
      const result = await userService.updateUser(userId, userData);
      
      if (result.success) {
        onSuccess?.();
        alert('Cập nhật người dùng thành công!');
        return { success: true };
      } else {
        alert(`Lỗi: ${result.message}`);
        return { success: false, error: result.message };
      }
    } catch (err) {
      console.error('Update user error:', err);
      alert('Có lỗi xảy ra khi cập nhật');
      return { success: false, error: 'Lỗi khi cập nhật người dùng' };
    } finally {
      setActionLoading(false);
    }
  };

  const deleteUser = async (userId) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa người dùng này?')) {
      return { success: false };
    }

    try {
      setActionLoading(true);
      const result = await userService.deleteUser(userId);
      
      if (result.success) {
        onSuccess?.();
        alert('Xóa người dùng thành công!');
        return { success: true };
      } else {
        alert(`Lỗi: ${result.message}`);
        return { success: false, error: result.message };
      }
    } catch (err) {
      console.error('Delete user error:', err);
      alert('Có lỗi xảy ra khi xóa!');
      return { success: false, error: 'Lỗi khi xóa người dùng' };
    } finally {
      setActionLoading(false);
    }
  };

  const toggleStatus = async (userId) => {
    try {
      setActionLoading(true);
      const result = await userService.toggleUserStatus(userId);
      
      if (result.success) {
        onSuccess?.();
        return { success: true };
      } else {
        alert(`Lỗi: ${result.message}`);
        return { success: false, error: result.message };
      }
    } catch (err) {
      console.error('Toggle status error:', err);
      alert('Có lỗi xảy ra!');
      return { success: false, error: 'Lỗi khi cập nhật trạng thái' };
    } finally {
      setActionLoading(false);
    }
  };

  return {
    createUser,
    updateUser,
    deleteUser,
    toggleStatus,
    actionLoading
  };
};
