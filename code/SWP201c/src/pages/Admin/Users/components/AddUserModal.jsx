// Admin/Users/components/AddUserModal.jsx
// Modal for adding new user

import React, { useState } from 'react';

export const AddUserModal = ({ onClose, onSave }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    role: 'driver'
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = () => {
    // Validate
    if (!formData.name || !formData.email || !formData.phone) {
      alert('Vui lòng điền đầy đủ thông tin');
      return;
    }

    onSave(formData);
    onClose();
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0,0,0,0.8)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000
    }}>
      <div style={{
        background: 'rgba(26, 32, 44, 0.95)',
        borderRadius: '12px',
        padding: '30px',
        width: '500px',
        maxWidth: '90%',
        border: '1px solid rgba(255, 255, 255, 0.2)'
      }}>
        <h3 style={{ color: '#FFFFFF', marginBottom: '20px' }}>
          Thêm người dùng mới
        </h3>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          <input
            type="text"
            name="name"
            placeholder="Họ tên"
            value={formData.name}
            onChange={handleChange}
            style={{
              padding: '12px',
              border: '2px solid rgba(255, 255, 255, 0.2)',
              borderRadius: '8px',
              background: 'rgba(255, 255, 255, 0.1)',
              color: '#FFFFFF',
              fontSize: '14px'
            }}
          />
          
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            style={{
              padding: '12px',
              border: '2px solid rgba(255, 255, 255, 0.2)',
              borderRadius: '8px',
              background: 'rgba(255, 255, 255, 0.1)',
              color: '#FFFFFF',
              fontSize: '14px'
            }}
          />
          
          <input
            type="tel"
            name="phone"
            placeholder="Số điện thoại"
            value={formData.phone}
            onChange={handleChange}
            style={{
              padding: '12px',
              border: '2px solid rgba(255, 255, 255, 0.2)',
              borderRadius: '8px',
              background: 'rgba(255, 255, 255, 0.1)',
              color: '#FFFFFF',
              fontSize: '14px'
            }}
          />
          
          <select
            name="role"
            value={formData.role}
            onChange={handleChange}
            style={{
              padding: '12px',
              border: '2px solid rgba(255, 255, 255, 0.2)',
              borderRadius: '8px',
              background: 'rgba(255, 255, 255, 0.1)',
              color: '#FFFFFF',
              fontSize: '14px',
              cursor: 'pointer'
            }}
          >
            <option value="driver">Tài xế</option>
            <option value="staff">Nhân viên</option>
            <option value="admin">Quản trị viên</option>
          </select>
        </div>
        
        <div style={{ display: 'flex', gap: '15px', marginTop: '25px' }}>
          <button
            onClick={onClose}
            style={{
              flex: 1,
              padding: '12px',
              background: 'rgba(255, 255, 255, 0.2)',
              color: '#FFFFFF',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '14px'
            }}
          >
            Hủy
          </button>
          <button
            onClick={handleSubmit}
            style={{
              flex: 1,
              padding: '12px',
              background: '#27ae60',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '14px'
            }}
          >
            Thêm mới
          </button>
        </div>
      </div>
    </div>
  );
};
