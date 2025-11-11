import React, { useState, useMemo } from 'react';
import { useAdminUsersData } from './hooks/useAdminUsersData';
import UserRow from './components/UserRow';
import UserFormModal from './components/UserFormModal'; // <-- Import Modal

const AdminUsers = () => {
  // Lấy thêm các hàm handleCreate, handleUpdate và handleDelete từ hook
  const { 
    users, isLoading, error, refetch, 
    filterRole, setFilterRole, 
    searchQuery, setSearchQuery,
    handleCreate, handleUpdate, handleDelete
  } = useAdminUsersData();
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);

  const handleOpenCreateModal = () => {
    console.log('🔵 AdminUsers: Mở modal tạo người dùng mới');
    setEditingUser(null); // Đảm bảo là tạo mới
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (user) => {
    console.log('🔵 AdminUsers: Mở modal sửa người dùng', user.userId);
    setEditingUser(user); // Đặt user cần sửa
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    console.log('🔵 AdminUsers: Đóng modal');
    setIsModalOpen(false);
    setEditingUser(null);
  };

  // Hàm được gọi khi nhấn "Lưu" trên Modal
  const handleSave = async (formData, userId) => {
    console.log('🔵 AdminUsers: handleSave called', { userId, formData });
    let response;
    if (userId) {
      // Đây là trường hợp Cập nhật (Update)
      response = await handleUpdate(userId, formData);
    } else {
      // Đây là trường hợp Tạo mới (Create)
      response = await handleCreate(formData);
    }
    
    if (response.success) {
      console.log('✅ Lưu thành công, đóng modal');
      handleCloseModal();
    } else {
      console.error('❌ Lưu thất bại:', response.message);
      alert(response.message); // Hiển thị lỗi nếu có
    }
  };

  // Hàm xử lý xóa người dùng
  const handleDeleteUser = async (userId) => {
    console.log('🔵 AdminUsers: handleDeleteUser called', userId);
    const confirmed = window.confirm(`Bạn có chắc chắn muốn xóa người dùng ${userId}?`);
    if (!confirmed) {
      console.log('❌ Hủy xóa người dùng');
      return;
    }

    const response = await handleDelete(userId);
    if (response.success) {
      console.log('✅ Xóa người dùng thành công');
      alert('Xóa người dùng thành công!');
    } else {
      console.error('❌ Xóa người dùng thất bại:', response.message);
      alert(`Lỗi: ${response.message}`);
    }
  };

  // Pagination 8 users per page
  const itemsPerPage = 8;
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = useMemo(() => {
    return Math.max(1, Math.ceil((users || []).length / itemsPerPage));
  }, [users]);

  const currentUsers = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return (users || []).slice(start, start + itemsPerPage);
  }, [users, currentPage]);

  const renderContent = () => {
    if (isLoading) return <p style={{ color: '#9ca3af', textAlign: 'center' }}>Đang tải danh sách người dùng...</p>;
    if (error) return ( <div style={{ color: '#ef4444', textAlign: 'center' }}><p>Lỗi: {error}</p><button onClick={refetch}>Thử lại</button></div> );
    if (users.length === 0) return <p style={{ color: '#9ca3af', textAlign: 'center' }}>Không tìm thấy người dùng nào.</p>;

    return (
      <div style={{ background: '#1f2937', borderRadius: '12px', overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ background: '#374151' }}>
              <th style={{ padding: '15px 20px' }}>ID</th>
              <th style={{ padding: '15px 20px' }}>Tên</th>
              <th style={{ padding: '15px 20px' }}>Email</th>
              <th style={{ padding: '15px 20px' }}>Vai trò</th>
              <th style={{ padding: '15px 20px' }}>Trạng thái</th>
              <th style={{ padding: '15px 20px' }}>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {/* Truyền handleOpenEditModal và handleDeleteUser xuống cho các nút Sửa và Xóa */}
            {currentUsers.map(user => (
              <UserRow key={user.userId} user={user} onEdit={handleOpenEditModal} onDelete={handleDeleteUser} />
            ))}
          </tbody>
        </table>

        {/* Pagination controls */}
        {users.length > 0 && (
          <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', padding: '20px 0' }}>
            <button
              style={{ minWidth: 44, height: 44, padding: '0 14px', borderRadius: 12, border: '1px solid #4b5563', background: '#fff', color: '#111827', fontWeight: 700, cursor: currentPage===1 ? 'not-allowed' : 'pointer', opacity: currentPage===1 ? .5 : 1 }}
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
            >«</button>
            {Array.from({ length: totalPages }).map((_, idx) => {
              const page = idx + 1;
              const isActive = page === currentPage;
              return (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  style={{ minWidth: 44, height: 44, padding: '0 14px', borderRadius: 12, border: '1px solid #4b5563', background: isActive ? '#0b74e5' : '#fff', color: isActive ? '#fff' : '#111827', fontWeight: 700 }}
                >{page}</button>
              );
            })}
            <button
              style={{ minWidth: 44, height: 44, padding: '0 14px', borderRadius: 12, border: '1px solid #4b5563', background: '#fff', color: '#111827', fontWeight: 700, cursor: currentPage===totalPages ? 'not-allowed' : 'pointer', opacity: currentPage===totalPages ? .5 : 1 }}
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
            >»</button>
          </div>
        )}
      </div>
    );
  };

  return (
    <>
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
          <div>
            <h1 style={{ margin: 0, fontSize: '28px' }}>Quản lý Người dùng</h1>
            <p style={{ margin: '5px 0 0 0', color: '#9ca3af' }}>Tìm kiếm, lọc và chỉnh sửa thông tin người dùng.</p>
          </div>
          {/* Gắn sự kiện onClick vào nút Thêm mới */}
          <button onClick={handleOpenCreateModal} style={{ background: '#f59e0b', color: '#111827', border: 'none', padding: '10px 15px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>
            + Thêm người dùng mới
          </button>
        </div>
        <div style={{ display: 'flex', gap: '15px', marginBottom: '20px' }}>
          <input 
            type="text" 
            placeholder="Tìm theo tên hoặc email..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ flex: 1, background: '#374151', color: 'white', border: '1px solid #4b5563', padding: '10px', borderRadius: '8px' }}
          />
          <select value={filterRole} onChange={(e) => setFilterRole(e.target.value)} style={{ background: '#374151', color: 'white', border: '1px solid #4b5563', padding: '10px', borderRadius: '8px' }}>
            <option value="">Tất cả vai trò</option>
            <option value="driver">Driver</option>
            <option value="staff">Staff</option>
          </select>
        </div>
        {renderContent()}
      </div>
      
      {/* Render Modal */}
      <UserFormModal 
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSave={handleSave}
        user={editingUser}
      />
    </>
  );
};

export default AdminUsers;