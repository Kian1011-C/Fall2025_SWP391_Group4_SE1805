import { useState, useEffect, useCallback, useMemo } from 'react';
import userService from '../../../../assets/js/services/userService';

export const useAdminUsersData = () => {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [filterRole, setFilterRole] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  // Hàm gọi API
  const fetchUsers = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await userService.getAllUsers();
      if (response.success && Array.isArray(response.data)) {
        setUsers(response.data);
      } else {
        throw new Error(response.message || "Dữ liệu người dùng không hợp lệ.");
      }
    } catch (err) {
      setError(err.message || "Không thể tải danh sách người dùng.");
    } finally {
      setIsLoading(false);
    }
    
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  // Logic lọc
  // TÌM ĐẾN KHỐI useMemo NÀY
  const filteredUsers = useMemo(() => {
    return users.filter(user => {
      // CODE CŨ CỦA BẠN:
      // const roleMatch = filterRole ? user.role === filterRole : true;
      
      // === SỬA LẠI NHƯ SAU: ===
      const roleMatch = filterRole 
        ? user.role.toLowerCase().includes(filterRole.toLowerCase()) 
        : true;
      // Ví dụ: "ev driver".includes("driver") => true
      // Ví dụ: "staff".includes("staff") => true
      // ==========================

      const searchMatch = searchQuery ? 
        ((user.firstName + ' ' + user.lastName).toLowerCase().includes(searchQuery.toLowerCase()) || 
         user.email?.toLowerCase().includes(searchQuery.toLowerCase()))
        : true;
      return roleMatch && searchMatch;
    });
  }, [users, filterRole, searchQuery]);

  // --- HÀM XỬ LÝ CRUD ---
  const handleCreate = async (userData) => {
    console.log('🔵 useAdminUsersData: handleCreate called', userData);
    const response = await userService.createUser(userData);
    if (response.success) {
      console.log('✅ Tạo người dùng thành công, tải lại danh sách...');
      fetchUsers(); // Tải lại danh sách
    } else {
      console.error('❌ Tạo người dùng thất bại:', response.message);
    }
    return response;
  };

  const handleUpdate = async (userId, userData) => {
    console.log('🔵 useAdminUsersData: handleUpdate called', userId, userData);
    const response = await userService.updateUser(userId, userData);
    if (response.success) {
      console.log('✅ Cập nhật người dùng thành công, tải lại danh sách...');
      fetchUsers(); // Tải lại danh sách
    } else {
      console.error('❌ Cập nhật người dùng thất bại:', response.message);
    }
    return response;
  };

  const handleDelete = async (userId) => {
    console.log('🔵 useAdminUsersData: handleDelete called', userId);
    const response = await userService.deleteUser(userId);
    if (response.success) {
      console.log('✅ Xóa người dùng thành công, tải lại danh sách...');
      fetchUsers(); // Tải lại danh sách
    } else {
      console.error('❌ Xóa người dùng thất bại:', response.message);
    }
    return response;
  };

  return {
    users: filteredUsers,
    isLoading, error, refetch: fetchUsers,
    filterRole, setFilterRole,
    searchQuery, setSearchQuery,
    handleCreate, handleUpdate, handleDelete, // <-- Xuất cả handleDelete
  };
};