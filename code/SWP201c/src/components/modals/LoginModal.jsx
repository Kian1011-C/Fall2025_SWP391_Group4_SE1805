import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import '../../assets/css/modal.css';

const LoginModal = () => {
  const { 
    showLoginModal, 
    setShowLoginModal, 
    isLoggingIn, 
    handleLogin 
  } = useAuth();

  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const [errors, setErrors] = useState({});

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.email) {
      newErrors.email = 'Email không được để trống';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email không hợp lệ';
    }
    if (!formData.password) {
      newErrors.password = 'Mật khẩu không được để trống';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Mật khẩu phải có ít nhất 6 ký tự';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    await handleLogin(formData.email, formData.password);
  };

  const handleClose = () => {
    if (!isLoggingIn) {
      setShowLoginModal(false);
      setFormData({ email: '', password: '' });
      setErrors({});
    }
  };

  if (!showLoginModal) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <div className="modal-header">
          <h2 className="modal-title">🔐 Đăng nhập</h2>
          <button onClick={handleClose} disabled={isLoggingIn} className="modal-close-btn">×</button>
        </div>
        <div className="modal-info-box">
          <h4 className="modal-info-title">📋 Tài khoản Demo</h4>
          <div className="modal-info-content">
            <div><strong>Admin:</strong> admin@evswap.com / admin123</div>
            <div><strong>Staff:</strong> duc.staff@evswap.com / staff123</div>
            <div><strong>Driver:</strong> minh.driver@gmail.com / driver123</div>
          </div>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="modal-form-group">
            <label className="modal-label">Email *</label>
            <input type="email" name="email" value={formData.email} onChange={handleInputChange} disabled={isLoggingIn} placeholder="Nhập email của bạn" className={`modal-input ${errors.email ? 'error' : ''}`} />
            {errors.email && <div className="modal-error-message">⚠️ {errors.email}</div>}
          </div>
          <div className="modal-form-group">
            <label className="modal-label">Mật khẩu *</label>
            <input type="password" name="password" value={formData.password} onChange={handleInputChange} disabled={isLoggingIn} placeholder="Nhập mật khẩu của bạn" className={`modal-input ${errors.password ? 'error' : ''}`} />
            {errors.password && <div className="modal-error-message">⚠️ {errors.password}</div>}
          </div>
          <div className="modal-actions">
            <button type="button" onClick={handleClose} disabled={isLoggingIn} className="modal-btn modal-btn-cancel">Hủy</button>
            <button type="submit" disabled={isLoggingIn} className="modal-btn modal-btn-primary">{isLoggingIn ? (<><div className="modal-spinner"></div>Đang đăng nhập...</>) : (<>🚀 Đăng nhập</>)}</button>
          </div>
        </form>
        <div className="modal-divider">
          <div className="modal-quick-login-title">Đăng nhập nhanh:</div>
          <div className="modal-quick-login-buttons">
            {[
              { label: 'Admin', email: 'admin@evswap.com', password: 'admin123', className: 'admin' },
              { label: 'Staff', email: 'duc.staff@evswap.com', password: 'staff123', className: 'staff' },
              { label: 'Driver', email: 'minh.driver@gmail.com', password: 'driver123', className: 'driver' }
            ].map((account, index) => (
              <button key={index} type="button" disabled={isLoggingIn} onClick={() => { setFormData({ email: account.email, password: account.password }); setErrors({}); }} className={`modal-quick-btn ${account.className}`}>
                {account.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginModal;


