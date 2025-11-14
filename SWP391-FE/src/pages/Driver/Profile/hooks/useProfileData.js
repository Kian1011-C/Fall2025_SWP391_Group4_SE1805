// Driver/Profile/hooks/useProfileData.js
// Custom hook for fetching user profile data

import { useState, useEffect } from 'react';
import authService from '../../../../assets/js/services/authService';
import userService from '../../../../assets/js/services/userService';

export const useProfileData = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Lấy current user từ localStorage (không phải async)
      const currentUser = authService.getCurrentUser();
      
      let userId = null;
      
      if (currentUser) {
        userId = currentUser.id || currentUser.userId;
      } else {
        // Fallback: lấy từ sessionStorage
        userId = sessionStorage.getItem('userId') || sessionStorage.getItem('UserID');
        console.log(' Không có currentUser, sử dụng userId từ sessionStorage:', userId);
      }
      
      if (!userId) {
        setError('Không tìm thấy ID người dùng. Vui lòng đăng nhập lại.');
        return;
      }
      
      console.log(' Current user:', currentUser);
      console.log(' User ID:', userId);
      
      // Sử dụng API profile mới để lấy thông tin chi tiết
      const profileResult = await userService.getUserProfile(userId);
      
      if (profileResult.success) {
        console.log(' Profile data loaded:', profileResult.data);
        setUser(profileResult.data);
      } else {
        console.warn(' API profile failed, using fallback data');
        
        // Fallback: sử dụng currentUser hoặc demo data
        const fallbackUser = currentUser || {
          id: userId,
          fullName: 'Driver User',
          email: 'driver@example.com',
          phone: '0123456789',
          role: 'driver',
          cccd: '123456789',
          joinDate: new Date().toISOString(),
          address: 'Hà Nội, Việt Nam'
        };
        
        console.log(' Using fallback user data:', fallbackUser);
        setUser(fallbackUser);
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
