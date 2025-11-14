import React, { useState, useEffect } from 'react';
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

  // Lock body scroll when modal is open
  useEffect(() => {
    if (showRegisterModal) {
      // Save current scroll position
      const scrollY = window.scrollY;
      
      // Lock body scroll
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollY}px`;
      document.body.style.left = '0';
      document.body.style.right = '0';
      document.body.style.width = '100%';
      document.body.style.overflow = 'hidden';
    } else {
      // Restore scroll position
      const scrollY = document.body.style.top;
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.left = '';
      document.body.style.right = '';
      document.body.style.width = '';
      document.body.style.overflow = '';
      
      // Scroll back to original position
      if (scrollY) {
        window.scrollTo(0, parseInt(scrollY || '0') * -1);
      }
    }

    return () => {
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.left = '';
      document.body.style.right = '';
      document.body.style.width = '';
      document.body.style.overflow = '';
    };
  }, [showRegisterModal]);

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
      console.log(' RegisterModal: Submitting registration form', formData);
      
      const response = await authService.register({
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        password: formData.password,
        cccd: formData.cccd.trim()
      });

      console.log(' RegisterModal: Registration response:', response);

      if (response.success) {
        showToast(response.message || 'Đăng ký thành công! Vui lòng kiểm tra email để nhập OTP.', 'success');
        setShowRegisterModal(false);
        
        // Use redirect field from API response
        const redirectPath = response.redirect || `/verify-otp?userId=${response.userId}`;
        console.log(' RegisterModal: Redirecting to:', redirectPath);
        
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
      console.error(' RegisterModal: Registration error:', error);
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
    <div 
      className="modal-overlay"
      onClick={handleClose}
      style={{
        position: 'fixed',
        top: '0',
        left: '0',
        right: '0',
        bottom: '0',
        width: '100vw',
        height: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        backdropFilter: 'blur(8px)',
        zIndex: 999999,
        overflowY: 'auto'
      }}
    >
      <div 
        className="modal-container" 
        onClick={(e) => e.stopPropagation()}
        style={{ 
          maxWidth: '600px', 
          width: '100%',
          maxHeight: '90vh',
          overflowY: 'auto',
          margin: 'auto',
          boxSizing: 'border-box'
        }}
      >
        {/* Header */}
        <div className="modal-header" style={{ 
          display: 'flex', 
          alignItems: 'center', 
          position: 'relative',
          marginBottom: 8,
          paddingBottom: 0,
          borderBottom: 'none'
        }}>
          <h2 className="modal-title" style={{ 
            margin: 0,
            fontSize: 32, 
            fontWeight: 800, 
            background: 'linear-gradient(135deg, #10b981, #34d399)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            letterSpacing: '-0.5px',
            flex: 1,
            textAlign: 'center'
          }}>Đăng ký tài khoản</h2>
          <button
            onClick={handleClose}
            disabled={isLoading}
            className="modal-close-btn"
            style={{
              position: 'absolute',
              right: 0,
              width: 36,
              height: 36,
              borderRadius: '10px',
              border: '1px solid rgba(148, 163, 184, 0.2)',
              background: 'rgba(148, 163, 184, 0.1)',
              color: '#94a3b8',
              fontSize: 24,
              cursor: isLoading ? 'not-allowed' : 'pointer',
              transition: 'all 0.2s ease',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
            onMouseEnter={(e) => {
              if (!isLoading) {
                e.target.style.background = 'rgba(239, 68, 68, 0.2)';
                e.target.style.color = '#ef4444';
                e.target.style.borderColor = 'rgba(239, 68, 68, 0.3)';
              }
            }}
            onMouseLeave={(e) => {
              e.target.style.background = 'rgba(148, 163, 184, 0.1)';
              e.target.style.color = '#94a3b8';
              e.target.style.borderColor = 'rgba(148, 163, 184, 0.2)';
            }}
          >
            ×
          </button>
        </div>

        {/* Info Box */}
        <div className="modal-info-box">
          <h4 className="modal-info-title">
             Thông tin cần thiết
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
                   {errors.firstName}
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
                   {errors.lastName}
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
                 {errors.email}
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
                 {errors.phone}
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
                   {errors.password}
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
                   {errors.confirmPassword}
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
                 {errors.cccd}
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
              Đã có tài khoản? Đăng nhập ngay
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
                   Đăng ký
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