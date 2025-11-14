import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { showToast } from '../../../assets/js/helpers/helpers';
import authService from '../../../assets/js/services/authService';
import './register.css';

const RegisterPage = () => {
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

  // Debug: Log when component mounts
  React.useEffect(() => {
    console.log(' RegisterPage: Component mounted successfully');
  }, []);

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
      console.log(' RegisterPage: Submitting registration form', formData);
      
      const response = await authService.register({
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        password: formData.password,
        cccd: formData.cccd.trim()
      });

      console.log(' RegisterPage: Registration response:', response);

      if (response.success) {
        showToast(response.message || 'Đăng ký thành công! Vui lòng kiểm tra email để nhập OTP.', 'success');
        
        // Use redirect field from API response
        const redirectPath = response.redirect || '/verify-otp';
        console.log(' RegisterPage: Redirecting to:', redirectPath);
        
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
      console.error(' RegisterPage: Registration error:', error);
      showToast('Có lỗi xảy ra khi đăng ký!', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackToLogin = () => {
    navigate('/');
  };

  return (
    <div className="register-page">
      <div className="register-card">
        {/* Header */}
        <div className="register-header">
          <h2 className="register-title">
             Đăng ký tài khoản
          </h2>
          <button
            onClick={handleBackToLogin}
            disabled={isLoading}
            className="register-close"
          >
            ×
          </button>
        </div>

        {/* Info Box */}
        <div className="register-info">
          <h4 className="register-info-title">
             Thông tin cần thiết
          </h4>
          <div className="register-info-content">
            <div>• Tất cả thông tin đều bắt buộc</div>
            <div>• Email sẽ được dùng để xác thực OTP</div>
            <div>• CCCD để xác minh danh tính</div>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          {/* First Name & Last Name Row */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
            <div>
              <label style={{
                display: 'block',
                fontSize: '14px',
                fontWeight: '600',
                color: '#374151',
                marginBottom: '8px'
              }}>
                Họ *
              </label>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleInputChange}
                disabled={isLoading}
                placeholder="Nhập họ của bạn"
                style={{
                  width: '100%',
                  padding: '12px',
                  border: `2px solid ${errors.firstName ? '#ef4444' : '#d1d5db'}`,
                  borderRadius: '8px',
                  fontSize: '16px',
                  outline: 'none',
                  transition: 'border-color 0.2s'
                }}
              />
              {errors.firstName && (
                <div style={{
                  color: '#ef4444',
                  fontSize: '12px',
                  marginTop: '4px'
                }}>
                   {errors.firstName}
                </div>
              )}
            </div>
            <div>
              <label style={{
                display: 'block',
                fontSize: '14px',
                fontWeight: '600',
                color: '#374151',
                marginBottom: '8px'
              }}>
                Tên *
              </label>
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleInputChange}
                disabled={isLoading}
                placeholder="Nhập tên của bạn"
                style={{
                  width: '100%',
                  padding: '12px',
                  border: `2px solid ${errors.lastName ? '#ef4444' : '#d1d5db'}`,
                  borderRadius: '8px',
                  fontSize: '16px',
                  outline: 'none',
                  transition: 'border-color 0.2s'
                }}
              />
              {errors.lastName && (
                <div style={{
                  color: '#ef4444',
                  fontSize: '12px',
                  marginTop: '4px'
                }}>
                   {errors.lastName}
                </div>
              )}
            </div>
          </div>

          {/* Email Field */}
          <div style={{ marginBottom: '16px' }}>
            <label style={{
              display: 'block',
              fontSize: '14px',
              fontWeight: '600',
              color: '#374151',
              marginBottom: '8px'
            }}>
              Email *
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              disabled={isLoading}
              placeholder="Nhập email của bạn"
              style={{
                width: '100%',
                padding: '12px',
                border: `2px solid ${errors.email ? '#ef4444' : '#d1d5db'}`,
                borderRadius: '8px',
                fontSize: '16px',
                outline: 'none',
                transition: 'border-color 0.2s'
              }}
            />
            {errors.email && (
              <div style={{
                color: '#ef4444',
                fontSize: '12px',
                marginTop: '4px'
              }}>
                 {errors.email}
              </div>
            )}
          </div>

          {/* Phone Field */}
          <div style={{ marginBottom: '16px' }}>
            <label style={{
              display: 'block',
              fontSize: '14px',
              fontWeight: '600',
              color: '#374151',
              marginBottom: '8px'
            }}>
              Số điện thoại *
            </label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              disabled={isLoading}
              placeholder="Nhập số điện thoại"
              style={{
                width: '100%',
                padding: '12px',
                border: `2px solid ${errors.phone ? '#ef4444' : '#d1d5db'}`,
                borderRadius: '8px',
                fontSize: '16px',
                outline: 'none',
                transition: 'border-color 0.2s'
              }}
            />
            {errors.phone && (
              <div style={{
                color: '#ef4444',
                fontSize: '12px',
                marginTop: '4px'
              }}>
                 {errors.phone}
              </div>
            )}
          </div>

          {/* Password Fields Row */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
            <div>
              <label style={{
                display: 'block',
                fontSize: '14px',
                fontWeight: '600',
                color: '#374151',
                marginBottom: '8px'
              }}>
                Mật khẩu *
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                disabled={isLoading}
                placeholder="Nhập mật khẩu"
                style={{
                  width: '100%',
                  padding: '12px',
                  border: `2px solid ${errors.password ? '#ef4444' : '#d1d5db'}`,
                  borderRadius: '8px',
                  fontSize: '16px',
                  outline: 'none',
                  transition: 'border-color 0.2s'
                }}
              />
              {errors.password && (
                <div style={{
                  color: '#ef4444',
                  fontSize: '12px',
                  marginTop: '4px'
                }}>
                   {errors.password}
                </div>
              )}
            </div>
            <div>
              <label style={{
                display: 'block',
                fontSize: '14px',
                fontWeight: '600',
                color: '#374151',
                marginBottom: '8px'
              }}>
                Xác nhận mật khẩu *
              </label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                disabled={isLoading}
                placeholder="Nhập lại mật khẩu"
                style={{
                  width: '100%',
                  padding: '12px',
                  border: `2px solid ${errors.confirmPassword ? '#ef4444' : '#d1d5db'}`,
                  borderRadius: '8px',
                  fontSize: '16px',
                  outline: 'none',
                  transition: 'border-color 0.2s'
                }}
              />
              {errors.confirmPassword && (
                <div style={{
                  color: '#ef4444',
                  fontSize: '12px',
                  marginTop: '4px'
                }}>
                   {errors.confirmPassword}
                </div>
              )}
            </div>
          </div>

          {/* CCCD Field */}
          <div style={{ marginBottom: '24px' }}>
            <label style={{
              display: 'block',
              fontSize: '14px',
              fontWeight: '600',
              color: '#374151',
              marginBottom: '8px'
            }}>
              CCCD *
            </label>
            <input
              type="text"
              name="cccd"
              value={formData.cccd}
              onChange={handleInputChange}
              disabled={isLoading}
              placeholder="Nhập số CCCD"
              style={{
                width: '100%',
                padding: '12px',
                border: `2px solid ${errors.cccd ? '#ef4444' : '#d1d5db'}`,
                borderRadius: '8px',
                fontSize: '16px',
                outline: 'none',
                transition: 'border-color 0.2s'
              }}
            />
            {errors.cccd && (
              <div style={{
                color: '#ef4444',
                fontSize: '12px',
                marginTop: '4px'
              }}>
                 {errors.cccd}
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="register-actions">
            <button
              type="button"
              onClick={handleBackToLogin}
              disabled={isLoading}
              className="btn btn-cancel"
            >
              Quay lại đăng nhập
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className={`btn btn-primary ${isLoading ? 'btn-loading' : ''}`}
            >
              {isLoading ? (
                <>
                  <span className="spinner" style={{ marginRight: 8 }} />
                  Đang đăng ký...
                </>
              ) : (
                <>
                  <span style={{ marginRight: 8 }}></span>
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

export default RegisterPage;