import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { showToast } from '../../assets/js/helpers/helpers';
import authService from '../../assets/js/services/authService';
import '../../assets/css/modal.css';

const RegisterModal = () => {
  const { showRegisterModal, setShowRegisterModal, setShowLoginModal } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    cccd: ''
  });
  const [errors, setErrors] = useState({});

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

    // First name validation
    if (!formData.firstName.trim()) {
      newErrors.firstName = 'Họ không được để trống';
    } else if (formData.firstName.trim().length < 2) {
      newErrors.firstName = 'Họ phải có ít nhất 2 ký tự';
    }

    // Last name validation
    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Tên không được để trống';
    } else if (formData.lastName.trim().length < 2) {
      newErrors.lastName = 'Tên phải có ít nhất 2 ký tự';
    }

    // Email validation
    if (!formData.email) {
      newErrors.email = 'Email không được để trống';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email không hợp lệ';
    }

    // Phone validation
    if (!formData.phone) {
      newErrors.phone = 'Số điện thoại không được để trống';
    } else if (!/^[0-9]{10,11}$/.test(formData.phone.replace(/\s/g, ''))) {
      newErrors.phone = 'Số điện thoại phải có 10-11 chữ số';
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = 'Mật khẩu không được để trống';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Mật khẩu phải có ít nhất 6 ký tự';
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
      newErrors.password = 'Mật khẩu phải có ít nhất 1 chữ hoa, 1 chữ thường và 1 số';
    }

    // Confirm password validation
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Xác nhận mật khẩu không được để trống';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Mật khẩu xác nhận không khớp';
    }

    // CCCD validation
    if (!formData.cccd) {
      newErrors.cccd = 'CCCD không được để trống';
    } else if (!/^[0-9]{9,12}$/.test(formData.cccd)) {
      newErrors.cccd = 'CCCD phải có 9-12 chữ số';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    try {
      console.log('🚀 RegisterModal: Submitting registration form', formData);
      
      const response = await authService.register({
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        password: formData.password,
        cccd: formData.cccd.trim()
      });

      console.log('📧 RegisterModal: Registration response:', response);

      if (response.success) {
        showToast(response.message || 'Đăng ký thành công! Vui lòng kiểm tra email để nhập OTP.', 'success');
        setShowRegisterModal(false);
        
        // Use redirect field from API response
        const redirectPath = response.redirect || `/verify-otp?userId=${response.userId}`;
        console.log('🎯 RegisterModal: Redirecting to:', redirectPath);
        
        // Navigate to OTP verification page
        navigate(redirectPath, { 
          state: { 
            userId: response.userId,
            email: formData.email,
            message: response.message 
          }
        });
      } else {
        showToast(response.message || 'Đăng ký thất bại!', 'error');
      }
    } catch (error) {
      console.error('❌ RegisterModal: Registration error:', error);
      showToast('Có lỗi xảy ra khi đăng ký!', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    if (!isLoading) {
      setShowRegisterModal(false);
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        password: '',
        confirmPassword: '',
        cccd: ''
      });
      setErrors({});
    }
  };

  const handleSwitchToLogin = () => {
    setShowRegisterModal(false);
    setShowLoginModal(true);
  };

  if (!showRegisterModal) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-container" style={{ maxWidth: '600px', maxHeight: '90vh', overflowY: 'auto' }}>
        {/* Header */}
        <div className="modal-header">
          <h2 className="modal-title">📝 Đăng ký tài khoản</h2>
          <button
            onClick={handleClose}
            disabled={isLoading}
            className="modal-close-btn"
          >
            ×
          </button>
        </div>

        {/* Info Box */}
        <div className="modal-info-box">
          <h4 className="modal-info-title">
            📋 Thông tin cần thiết
          </h4>
          <div className="modal-info-content">
            <div>• Tất cả thông tin đều bắt buộc</div>
            <div>• Email sẽ được dùng để xác thực OTP</div>
            <div>• CCCD để xác minh danh tính</div>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          {/* First Name & Last Name Row */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
            <div className="modal-form-group">
              <label className="modal-label">
                Họ *
              </label>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleInputChange}
                disabled={isLoading}
                placeholder="Nhập họ của bạn"
                className={`modal-input ${errors.firstName ? 'error' : ''}`}
              />
              {errors.firstName && (
                <div className="modal-error-message">
                  ⚠️ {errors.firstName}
                </div>
              )}
            </div>
            <div className="modal-form-group">
              <label className="modal-label">
                Tên *
              </label>
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleInputChange}
                disabled={isLoading}
                placeholder="Nhập tên của bạn"
                className={`modal-input ${errors.lastName ? 'error' : ''}`}
              />
              {errors.lastName && (
                <div className="modal-error-message">
                  ⚠️ {errors.lastName}
                </div>
              )}
            </div>
          </div>

          {/* Email Field */}
          <div className="modal-form-group" style={{ marginBottom: '16px' }}>
            <label className="modal-label">
              Email *
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              disabled={isLoading}
              placeholder="Nhập email của bạn"
              className={`modal-input ${errors.email ? 'error' : ''}`}
            />
            {errors.email && (
              <div className="modal-error-message">
                ⚠️ {errors.email}
              </div>
            )}
          </div>

          {/* Phone Field */}
          <div className="modal-form-group" style={{ marginBottom: '16px' }}>
            <label className="modal-label">
              Số điện thoại *
            </label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              disabled={isLoading}
              placeholder="Nhập số điện thoại"
              className={`modal-input ${errors.phone ? 'error' : ''}`}
            />
            {errors.phone && (
              <div className="modal-error-message">
                ⚠️ {errors.phone}
              </div>
            )}
          </div>

          {/* Password Fields Row */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
            <div className="modal-form-group">
              <label className="modal-label">
                Mật khẩu *
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                disabled={isLoading}
                placeholder="Nhập mật khẩu"
                className={`modal-input ${errors.password ? 'error' : ''}`}
              />
              {errors.password && (
                <div className="modal-error-message">
                  ⚠️ {errors.password}
                </div>
              )}
            </div>
            <div className="modal-form-group">
              <label className="modal-label">
                Xác nhận mật khẩu *
              </label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                disabled={isLoading}
                placeholder="Nhập lại mật khẩu"
                className={`modal-input ${errors.confirmPassword ? 'error' : ''}`}
              />
              {errors.confirmPassword && (
                <div className="modal-error-message">
                  ⚠️ {errors.confirmPassword}
                </div>
              )}
            </div>
          </div>

          {/* CCCD Field */}
          <div className="modal-form-group" style={{ marginBottom: '24px' }}>
            <label className="modal-label">
              CCCD *
            </label>
            <input
              type="text"
              name="cccd"
              value={formData.cccd}
              onChange={handleInputChange}
              disabled={isLoading}
              placeholder="Nhập số CCCD"
              className={`modal-input ${errors.cccd ? 'error' : ''}`}
            />
            {errors.cccd && (
              <div className="modal-error-message">
                ⚠️ {errors.cccd}
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="modal-actions">
            <button
              type="button"
              onClick={handleSwitchToLogin}
              disabled={isLoading}
              className="modal-btn modal-btn-cancel"
            >
              Đã có tài khoản? Đăng nhập
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="modal-btn modal-btn-primary"
            >
              {isLoading ? (
                <>
                  <div className="modal-spinner"></div>
                  Đang đăng ký...
                </>
              ) : (
                <>
                  🚀 Đăng ký
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RegisterModal;