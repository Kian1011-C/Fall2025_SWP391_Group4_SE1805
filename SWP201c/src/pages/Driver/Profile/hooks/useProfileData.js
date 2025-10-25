// Driver/Profile/hooks/useProfileData.js
// Custom hook for fetching user profile data

import { useState, useEffect } from 'react';
import { useAuth } from '../../../../context/AuthContext';
import userService from '../../../../assets/js/services/userService';

export const useProfileData = () => {
  const { currentUser } = useAuth();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Get current user ID
      const userId = currentUser?.id || currentUser?.user_id;
      if (!userId) {
        setError('Không tìm thấy ID người dùng');
        return;
      }

      console.log('🔍 Fetching profile for user:', userId);
      
      // Call the new profile API
      const result = await userService.getUserProfile(userId);
      
      if (result.success) {
        console.log('✅ Profile data received:', result.data);
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
    if (currentUser) {
      fetchProfile();
    }
  }, [currentUser]);

  return {
    user,
    loading,
    error,
    refetch: fetchProfile
  };
};
