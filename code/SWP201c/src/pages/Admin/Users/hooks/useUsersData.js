// Admin/Users/hooks/useUsersData.js
// Custom hook for fetching and managing users data

import { useState, useEffect } from 'react';
import userService from '../../../../assets/js/services/userService';

export const useUsersData = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const result = await userService.getAllUsers();
      
      if (result.success) {
        setUsers(result.data || []);
      } else {
        setError(result.message || 'Không thể tải dữ liệu người dùng');
      }
    } catch (err) {
      console.error('Fetch users error:', err);
      setError('Không thể tải dữ liệu người dùng');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return {
    users,
    loading,
    error,
    refetch: fetchUsers
  };
};
