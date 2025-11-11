import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { showToast } from '../../assets/js/helpers/helpers';
import authService from '../../assets/js/services/authService';
import '../../assets/css/modal.css';
import '../../assets/css/LoginModal.css';

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
  const [isSendingReset, setIsSendingReset] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
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
    
    if (!validateForm()) {
      return;
    }

    await handleLogin(formData.email, formData.password);
  };

  const handleForgotPassword = async () => {
    // Validate email first
    if (!formData.email) {
      setErrors(prev => ({ ...prev, email: 'Vui lòng nhập email để đặt lại mật khẩu' }));
      return;
    }
    if (!/\S+@\S+\.\S+/.test(formData.email)) {
      setErrors(prev => ({ ...prev, email: 'Email không hợp lệ' }));
      return;
    }

    setIsSendingReset(true);
    try {
      const res = await authService.forgotPassword(formData.email.trim());
      if (res.success) {
        showToast(res.message || 'Nếu email tồn tại, hệ thống đã gửi liên kết đặt lại.', 'success');
      } else {
        showToast(res.message || 'Không thể xử lý yêu cầu', 'error');
      }
    } catch {
      showToast('Có lỗi xảy ra. Vui lòng thử lại sau.', 'error');
    } finally {
      setIsSendingReset(false);
    }
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
    <div 
      className="modal-overlay login-modal-overlay" 
    >
      <div
        className="modal-container login-modal-container"
      >
        {/* Header */}
        <div className="modal-header" style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{
            width: 44,
            height: 44,
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'linear-gradient(135deg, #06b6d4, #3b82f6)'
          }}>🔐</div>
          <h2 className="modal-title" style={{ margin: 0, fontSize: 22, fontWeight: 800, color: '#FFFFFF' }}>Đăng nhập</h2>
          <button
            onClick={handleClose}
            disabled={isLoggingIn}
            className="modal-close-btn"
          >
            ×
          </button>
        </div>

        {/* Demo Accounts Info */}
        <div
          className="modal-info-box"
          style={{
            background: 'linear-gradient(135deg, rgba(59,130,246,0.15), rgba(6,182,212,0.12))',
            border: '1px solid rgba(148,163,184,0.25)',
            borderRadius: 14,
            padding: 14,
            color: '#D1D5DB',
            marginTop: 14,
            marginBottom: 18
          }}
        >
          <h4 className="modal-info-title" style={{ margin: 0, marginBottom: 8, color: '#93C5FD', fontWeight: 700 }}>
            📋 Tài khoản Demo
          </h4>
          <div className="modal-info-content" style={{ lineHeight: 1.6 }}>
            <div><strong style={{ color: '#FFFFFF' }}>Admin:</strong> admin@evswap.com / admin123</div>
            <div><strong style={{ color: '#FFFFFF' }}>Staff:</strong> duc.staff@evswap.com / staff123</div>
            <div><strong style={{ color: '#FFFFFF' }}>Driver:</strong> minh.driver@gmail.com / driver123</div>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Email Field */}
          <div className="modal-form-group" style={{ marginBottom: 14 }}>
            <label className="modal-label">
              Email *
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              disabled={isLoggingIn}
              placeholder="Nhập email của bạn"
              className={`modal-input ${errors.email ? 'error' : ''}`}
              style={{
                background: 'rgba(2,6,23,0.6)',
                border: '1px solid rgba(148,163,184,0.25)',
                color: '#E5E7EB'
              }}
            />
            {errors.email && (
              <div className="modal-error-message">
                ⚠️ {errors.email}
              </div>
            )}
          </div>

          {/* Password Field */}
          <div className="modal-form-group" style={{ marginBottom: 6 }}>
            <label className="modal-label">
              Mật khẩu *
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              disabled={isLoggingIn}
              placeholder="Nhập mật khẩu của bạn"
              className={`modal-input ${errors.password ? 'error' : ''}`}
              style={{
                background: 'rgba(2,6,23,0.6)',
                border: '1px solid rgba(148,163,184,0.25)',
                color: '#E5E7EB'
              }}
            />
            {errors.password && (
              <div className="modal-error-message">
                ⚠️ {errors.password}
              </div>
            )}
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 8 }}>
              <button
                type="button"
                onClick={handleForgotPassword}
                disabled={isLoggingIn || isSendingReset}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#60a5fa',
                  textDecoration: 'underline',
                  cursor: isLoggingIn || isSendingReset ? 'not-allowed' : 'pointer',
                  padding: 0
                }}
              >
                {isSendingReset ? 'Đang gửi...' : 'Quên mật khẩu?'}
              </button>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="modal-actions">
            <button
              type="button"
              onClick={handleClose}
              disabled={isLoggingIn}
              className="modal-btn modal-btn-cancel"
              style={{ background: 'rgba(148,163,184,0.15)', color: '#E5E7EB', border: '1px solid rgba(148,163,184,0.25)' }}
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={isLoggingIn}
              className="modal-btn modal-btn-primary"
              style={{
                background: isLoggingIn ? 'rgba(16,185,129,0.35)' : 'linear-gradient(135deg, #22c55e, #16a34a)',
                border: 'none',
                boxShadow: '0 10px 30px rgba(34,197,94,0.25)'
              }}
            >
              {isLoggingIn ? (
                <>
                  <div className="modal-spinner"></div>
                  Đang đăng nhập...
                </>
              ) : (
                <>
                  🚀 Đăng nhập
                </>
              )}
            </button>
          </div>
        </form>

        {/* Quick Login Buttons */}
        <div className="modal-divider" style={{ borderTop: '1px dashed rgba(148,163,184,0.25)', marginTop: 18 }}>
          <div className="modal-quick-login-title">
            Đăng nhập nhanh:
          </div>
          <div className="modal-quick-login-buttons" style={{ gap: 10 }}>
            {[
              { label: 'Admin', email: 'admin@evswap.com', password: 'admin123', className: 'admin' },
              { label: 'Staff', email: 'duc.staff@evswap.com', password: 'staff123', className: 'staff' },
              { label: 'Driver', email: 'minh.driver@gmail.com', password: 'driver123', className: 'driver' }
            ].map((account, index) => (
              <button
                key={index}
                type="button"
                disabled={isLoggingIn}
                onClick={() => {
                  setFormData({ email: account.email, password: account.password });
                  setErrors({});
                }}
                className={`modal-quick-btn ${account.className}`}
                style={{
                  border: '1px solid rgba(148,163,184,0.25)',
                  background: 'rgba(2,6,23,0.6)',
                  color: '#E5E7EB'
                }}
              >
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

