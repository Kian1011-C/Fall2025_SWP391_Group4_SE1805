import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import './UserFormModal.css';

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
    console.log('🔵 UserFormModal: useEffect triggered', { isOpen, user });
    if (isEditing) {
      setFormData({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.email || '',
        phone: user.phone || '',
        cccd: user.cccd || '',
        password: '', // Không tải mật khẩu cũ
        role: user.role?.toLowerCase() || 'driver', // Normalize role
        status: user.status?.toLowerCase() || 'active',
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
    console.log('🔵 UserFormModal: Submit form', formData);
    onSave(formData, user?.userId);
  };

  if (!isOpen) {
    console.log('🔵 UserFormModal: Modal is CLOSED, not rendering');
    return null;
  }

  console.log('🔵 UserFormModal: Modal is OPEN, rendering with Portal...');

  const modalContent = (
    <div className="user-modal-overlay" onClick={onClose}>
      <div className="user-modal-content" onClick={e => e.stopPropagation()}>
        <form onSubmit={handleSubmit}>
          <div className="user-modal-header">
            <h2 className="user-modal-title">{isEditing ? 'Chỉnh sửa Người dùng' : 'Tạo Người dùng Mới'}</h2>
          </div>
          <div className="user-modal-body">
            <div className="user-form-row">
              <div className="user-form-group">
                <label className="user-form-label">Họ</label>
                <input type="text" name="lastName" value={formData.lastName} onChange={handleChange} className="user-form-input" required />
              </div>
              <div className="user-form-group">
                <label className="user-form-label">Tên</label>
                <input type="text" name="firstName" value={formData.firstName} onChange={handleChange} className="user-form-input" required />
              </div>
            </div>
            <div className="user-form-group">
              <label className="user-form-label">Email</label>
              <input type="email" name="email" value={formData.email} onChange={handleChange} className="user-form-input" required />
            </div>
            {!isEditing && ( // Chỉ yêu cầu mật khẩu khi tạo mới
              <div className="user-form-group">
                <label className="user-form-label">Mật khẩu</label>
                <input type="password" name="password" value={formData.password} onChange={handleChange} className="user-form-input" required />
              </div>
            )}
            <div className="user-form-row">
              <div className="user-form-group">
                <label className="user-form-label">Số điện thoại</label>
                <input type="tel" name="phone" value={formData.phone} onChange={handleChange} className="user-form-input" />
              </div>
              <div className="user-form-group">
                <label className="user-form-label">CCCD</label>
                <input type="text" name="cccd" value={formData.cccd} onChange={handleChange} className="user-form-input" />
              </div>
            </div>
            <div className="user-form-row">
              <div className="user-form-group">
                <label className="user-form-label">Vai trò</label>
                <select name="role" value={formData.role} onChange={handleChange} className="user-form-select">
                  <option value="driver">Driver</option>
                  <option value="staff">Staff</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              <div className="user-form-group">
                <label className="user-form-label">Trạng thái</label>
                <select name="status" value={formData.status} onChange={handleChange} className="user-form-select">
                  <option value="active">Hoạt động</option>
                  <option value="inactive">Vô hiệu hóa</option>
                </select>
              </div>
            </div>
          </div>
          <div className="user-modal-footer">
            <button type="button" onClick={onClose} className="user-modal-btn-cancel">Hủy</button>
            <button type="submit" className="user-modal-btn-save">
              {isEditing ? 'Cập nhật' : 'Tạo'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
};

export default UserFormModal;