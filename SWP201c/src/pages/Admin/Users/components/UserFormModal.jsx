import React, { useState, useEffect } from 'react';

// Style chung
const inputStyle = { width: '100%', padding: '10px', background: '#374151', color: 'white', border: '1px solid #4b5563', borderRadius: '8px', boxSizing: 'border-box' };
const labelStyle = { display: 'block', marginBottom: '8px', color: '#9ca3af' };

const UserFormModal = ({ isOpen, onClose, onSave, user }) => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    cccd: '',
    password: '',
    role: 'driver',
    status: 'active',
  });
  const isEditing = !!user;

  useEffect(() => {
    if (isEditing) {
      setFormData({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.email || '',
        phone: user.phone || '',
        cccd: user.cccd || '',
        password: '', // Không tải mật khẩu cũ
        role: user.role || 'driver',
        status: user.status || 'active',
      });
    } else {
      // Reset form khi mở modal để "Tạo mới"
      setFormData({
        firstName: '', lastName: '', email: '', phone: '', cccd: '',
        password: '', role: 'driver', status: 'active',
      });
    }
  }, [user, isEditing, isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData, user?.userId);
  };

  if (!isOpen) return null;

  return (
    <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0, 0, 0, 0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }} onClick={onClose}>
      <div style={{ background: '#1f2937', borderRadius: '16px', width: '90%', maxWidth: '500px', border: '1px solid #374151' }} onClick={e => e.stopPropagation()}>
        <form onSubmit={handleSubmit}>
          <div style={{ padding: '20px', borderBottom: '1px solid #374151' }}>
            <h2 style={{ margin: 0, fontSize: '20px' }}>{isEditing ? 'Chỉnh sửa Người dùng' : 'Tạo Người dùng Mới'}</h2>
          </div>
          <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '15px', maxHeight: '60vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', gap: '15px' }}>
              <div style={{ flex: 1 }}>
                <label style={labelStyle}>Họ</label>
                <input type="text" name="lastName" value={formData.lastName} onChange={handleChange} style={inputStyle} required />
              </div>
              <div style={{ flex: 1 }}>
                <label style={labelStyle}>Tên</label>
                <input type="text" name="firstName" value={formData.firstName} onChange={handleChange} style={inputStyle} required />
              </div>
            </div>
            <div>
              <label style={labelStyle}>Email</label>
              <input type="email" name="email" value={formData.email} onChange={handleChange} style={inputStyle} required />
            </div>
            {!isEditing && ( // Chỉ yêu cầu mật khẩu khi tạo mới
              <div>
                <label style={labelStyle}>Mật khẩu</label>
                <input type="password" name="password" value={formData.password} onChange={handleChange} style={inputStyle} required />
              </div>
            )}
            <div style={{ display: 'flex', gap: '15px' }}>
              <div style={{ flex: 1 }}>
                <label style={labelStyle}>Số điện thoại</label>
                <input type="tel" name="phone" value={formData.phone} onChange={handleChange} style={inputStyle} />
              </div>
              <div style={{ flex: 1 }}>
                <label style={labelStyle}>CCCD</label>
                <input type="text" name="cccd" value={formData.cccd} onChange={handleChange} style={inputStyle} />
              </div>
            </div>
            <div style={{ display: 'flex', gap: '15px' }}>
              <div style={{ flex: 1 }}>
                <label style={labelStyle}>Vai trò</label>
                <select name="role" value={formData.role} onChange={handleChange} style={inputStyle}>
                  <option value="driver">Driver</option>
                  <option value="staff">Staff</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              <div style={{ flex: 1 }}>
                <label style={labelStyle}>Trạng thái</label>
                <select name="status" value={formData.status} onChange={handleChange} style={inputStyle}>
                  <option value="active">Hoạt động</option>
                  <option value="inactive">Vô hiệu hóa</option>
                </select>
              </div>
            </div>
          </div>
          <div style={{ padding: '20px', background: '#111827', borderTop: '1px solid #374151', borderRadius: '0 0 16px 16px', display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
            <button type="button" onClick={onClose} style={{ background: '#374151', color: 'white', border: 'none', padding: '10px 15px', borderRadius: '8px', cursor: 'pointer' }}>Hủy</button>
            <button type="submit" style={{ background: '#f59e0b', color: '#111827', border: 'none', padding: '10px 15px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>Lưu</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserFormModal;