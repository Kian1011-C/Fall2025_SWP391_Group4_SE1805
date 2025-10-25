import React, { useState } from 'react';
import { useAdminUsersData } from './hooks/useAdminUsersData';
import UserRow from './components/UserRow';
import UserFormModal from './components/UserFormModal'; // <-- Import Modal

const AdminUsers = () => {
  // Lấy thêm các hàm handleCreate và handleUpdate từ hook
  const { 
    users, isLoading, error, refetch, 
    filterRole, setFilterRole, 
    searchQuery, setSearchQuery,
    handleCreate, handleUpdate 
  } = useAdminUsersData();
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);

  const handleOpenCreateModal = () => {
    setEditingUser(null); // Đảm bảo là tạo mới
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (user) => {
    setEditingUser(user); // Đặt user cần sửa
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingUser(null);
  };

  // Hàm được gọi khi nhấn "Lưu" trên Modal
  const handleSave = async (formData, userId) => {
    let response;
    if (userId) {
      // Đây là trường hợp Cập nhật (Update)
      response = await handleUpdate(userId, formData);
    } else {
      // Đây là trường hợp Tạo mới (Create)
      response = await handleCreate(formData);
    }
    
    if (response.success) {
      handleCloseModal();
    } else {
      alert(response.message); // Hiển thị lỗi nếu có
    }
  };

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
            {/* Truyền hàm handleOpenEditModal xuống cho nút Sửa */}
            {users.map(user => <UserRow key={user.userId} user={user} onEdit={handleOpenEditModal} />)}
          </tbody>
        </table>
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