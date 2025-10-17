// Driver/Profile/hooks/useProfileData.js
// Custom hook for fetching user profile data

import { useState, useEffect } from 'react';
import authService from '../../../../assets/js/services/authService';

export const useProfileData = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const result = await authService.getCurrentUser();
      
      if (result.success) {
        setUser(result.data);
      } else {
        setError(result.message || 'Không thể tải thông tin người dùng');
      }
    } catch (err) {
      setError('Lỗi khi tải thông tin người dùng');
      console.error('Error fetching user profile:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  return {
    user,
    loading,
    error,
    refetch: fetchProfile
  };
};
