import React, { useState, useEffect } from 'react';
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
  const [loginAttempts, setLoginAttempts] = useState(0);
  const [showWarning, setShowWarning] = useState(false);

  // Lock scroll when modal is open
  useEffect(() => {
    if (showLoginModal) {
      // Save current scroll position
      const scrollY = window.scrollY;
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = '100%';
      document.body.style.overflow = 'hidden';
    } else {
      // Restore scroll position
      const scrollY = document.body.style.top;
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.width = '';
      document.body.style.overflow = '';
      window.scrollTo(0, parseInt(scrollY || '0') * -1);
    }

    // Cleanup when component unmounts
    return () => {
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.width = '';
      document.body.style.overflow = '';
    };
  }, [showLoginModal]);

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
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    
    console.log('LoginModal: Form submitted');
    
    if (!validateForm()) {
      console.log('LoginModal: Validation failed');
      return;
    }

    try {
      console.log('LoginModal: Calling handleLogin');
      const result = await handleLogin(formData.email, formData.password);
      console.log('LoginModal: Login result:', result);
      
      // Check if login failed
      if (!result || !result.success) {
        const newAttempts = loginAttempts + 1;
        console.log('LoginModal: Login failed, attempts:', newAttempts);
        setLoginAttempts(newAttempts);
        
        // Show warning after 3 failed attempts
        if (newAttempts >= 3) {
          setShowWarning(true);
        }
      } else {
        // Reset on successful login
        console.log('LoginModal: Login successful');
        setLoginAttempts(0);
        setShowWarning(false);
      }
    } catch (error) {
      console.error('LoginModal: Error during login:', error);
    }
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
      setLoginAttempts(0);
      setShowWarning(false);
    }
  };

  if (!showLoginModal) return null;

  return (
    <div 
      className="modal-overlay login-modal-overlay"
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
        overflow: 'hidden'
      }}
    >
      <div
        className="modal-container login-modal-container"
        onClick={(e) => e.stopPropagation()}
        style={{
          maxHeight: '90vh',
          overflowY: 'auto'
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
            background: 'linear-gradient(135deg, #60a5fa, #a78bfa)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            letterSpacing: '-0.5px',
            flex: 1,
            textAlign: 'center'
          }}>Đăng nhập</h2>
          <button
            onClick={handleClose}
            disabled={isLoggingIn}
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
              cursor: isLoggingIn ? 'not-allowed' : 'pointer',
              transition: 'all 0.2s ease',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
            onMouseEnter={(e) => {
              if (!isLoggingIn) {
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

        {/* Welcome Text */}
        <div style={{
          marginBottom: 24,
          textAlign: 'center'
        }}>
          <p style={{
            color: '#94a3b8',
            fontSize: 15,
            lineHeight: 1.6,
            margin: 0
          }}>
            Chào mừng bạn trở lại! Đăng nhập để tiếp tục sử dụng dịch vụ đổi pin xe điện của chúng tôi.
          </p>
        </div>

        {/* Warning after 3 failed attempts */}
        {showWarning && (
          <div style={{
            marginBottom: 20,
            padding: '16px',
            background: 'rgba(239, 68, 68, 0.1)',
            border: '2px solid rgba(239, 68, 68, 0.3)',
            borderRadius: '12px',
            display: 'flex',
            alignItems: 'flex-start',
            gap: '12px'
          }}>
            <span style={{ fontSize: '20px', flexShrink: 0 }}></span>
            <div style={{ flex: 1 }}>
              <p style={{
                margin: 0,
                color: '#fca5a5',
                fontSize: '14px',
                fontWeight: '600',
                lineHeight: '1.6'
              }}>
                <strong style={{ color: '#ef4444' }}>Cảnh báo bảo mật!</strong>
                <br />
                Bạn đã đăng nhập sai {loginAttempts} lần. Vui lòng kiểm tra lại email và mật khẩu. 
                Nếu quên mật khẩu, hãy sử dụng chức năng "Quên mật khẩu?" bên dưới.
              </p>
            </div>
          </div>
        )}

        <form 
          onSubmit={handleSubmit}
          onClick={(e) => e.stopPropagation()}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && e.target.type !== 'submit') {
              e.preventDefault();
            }
          }}
        >
          {/* Email Field */}
          <div className="modal-form-group" style={{ marginBottom: 20 }}>
            <label className="modal-label" style={{
              display: 'block',
              marginBottom: 8,
              fontSize: 14,
              fontWeight: 600,
              color: '#e2e8f0'
            }}>
              Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              disabled={isLoggingIn}
              placeholder="example@email.com"
              className={`modal-input ${errors.email ? 'error' : ''}`}
              style={{
                width: '100%',
                padding: '12px 16px',
                background: 'rgba(15, 23, 42, 0.8)',
                border: errors.email ? '2px solid #ef4444' : '2px solid rgba(148, 163, 184, 0.2)',
                borderRadius: '12px',
                color: '#E5E7EB',
                fontSize: 15,
                transition: 'all 0.2s ease',
                outline: 'none'
              }}
              onFocus={(e) => {
                if (!errors.email) {
                  e.target.style.borderColor = '#3b82f6';
                  e.target.style.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.1)';
                }
              }}
              onBlur={(e) => {
                if (!errors.email) {
                  e.target.style.borderColor = 'rgba(148, 163, 184, 0.2)';
                  e.target.style.boxShadow = 'none';
                }
              }}
            />
            {errors.email && (
              <div className="modal-error-message" style={{
                marginTop: 8,
                fontSize: 13,
                color: '#ef4444',
                display: 'flex',
                alignItems: 'center',
                gap: 6
              }}>
                 {errors.email}
              </div>
            )}
          </div>

          {/* Password Field */}
          <div className="modal-form-group" style={{ marginBottom: 8 }}>
            <label className="modal-label" style={{
              display: 'block',
              marginBottom: 8,
              fontSize: 14,
              fontWeight: 600,
              color: '#e2e8f0'
            }}>
              Mật khẩu
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              disabled={isLoggingIn}
              placeholder="••••••••"
              className={`modal-input ${errors.password ? 'error' : ''}`}
              style={{
                width: '100%',
                padding: '12px 16px',
                background: 'rgba(15, 23, 42, 0.8)',
                border: errors.password ? '2px solid #ef4444' : '2px solid rgba(148, 163, 184, 0.2)',
                borderRadius: '12px',
                color: '#E5E7EB',
                fontSize: 15,
                transition: 'all 0.2s ease',
                outline: 'none'
              }}
              onFocus={(e) => {
                if (!errors.password) {
                  e.target.style.borderColor = '#3b82f6';
                  e.target.style.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.1)';
                }
              }}
              onBlur={(e) => {
                if (!errors.password) {
                  e.target.style.borderColor = 'rgba(148, 163, 184, 0.2)';
                  e.target.style.boxShadow = 'none';
                }
              }}
            />
            {errors.password && (
              <div className="modal-error-message" style={{
                marginTop: 8,
                fontSize: 13,
                color: '#ef4444',
                display: 'flex',
                alignItems: 'center',
                gap: 6
              }}>
                 {errors.password}
              </div>
            )}
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 12, marginBottom: 24 }}>
              <button
                type="button"
                onClick={handleForgotPassword}
                disabled={isLoggingIn || isSendingReset}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#3b82f6',
                  fontSize: 14,
                  fontWeight: 500,
                  cursor: isLoggingIn || isSendingReset ? 'not-allowed' : 'pointer',
                  padding: 0,
                  transition: 'color 0.2s ease'
                }}
                onMouseEnter={(e) => {
                  if (!isLoggingIn && !isSendingReset) {
                    e.target.style.color = '#60a5fa';
                  }
                }}
                onMouseLeave={(e) => {
                  e.target.style.color = '#3b82f6';
                }}
              >
                {isSendingReset ? 'Đang gửi...' : 'Quên mật khẩu?'}
              </button>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="modal-actions" style={{ 
            display: 'flex', 
            gap: 12,
            marginTop: 8
          }}>
            <button
              type="button"
              onClick={handleClose}
              disabled={isLoggingIn}
              className="modal-btn modal-btn-cancel"
              style={{ 
                flex: 1,
                padding: '14px 24px',
                background: 'rgba(148, 163, 184, 0.1)', 
                color: '#cbd5e1', 
                border: '2px solid rgba(148, 163, 184, 0.2)',
                borderRadius: '12px',
                fontSize: 15,
                fontWeight: 600,
                cursor: isLoggingIn ? 'not-allowed' : 'pointer',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => {
                if (!isLoggingIn) {
                  e.target.style.background = 'rgba(148, 163, 184, 0.2)';
                  e.target.style.borderColor = 'rgba(148, 163, 184, 0.3)';
                }
              }}
              onMouseLeave={(e) => {
                e.target.style.background = 'rgba(148, 163, 184, 0.1)';
                e.target.style.borderColor = 'rgba(148, 163, 184, 0.2)';
              }}
            >
              Hủy
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              disabled={isLoggingIn}
              className="modal-btn modal-btn-primary"
              style={{
                flex: 2,
                padding: '14px 24px',
                background: isLoggingIn ? 'rgba(59, 130, 246, 0.5)' : 'linear-gradient(135deg, #3b82f6, #2563eb)',
                border: 'none',
                borderRadius: '12px',
                color: '#ffffff',
                fontSize: 15,
                fontWeight: 600,
                boxShadow: isLoggingIn ? 'none' : '0 4px 12px rgba(59, 130, 246, 0.4)',
                cursor: isLoggingIn ? 'not-allowed' : 'pointer',
                transition: 'all 0.2s ease',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8
              }}
              onMouseEnter={(e) => {
                if (!isLoggingIn) {
                  e.target.style.transform = 'translateY(-1px)';
                  e.target.style.boxShadow = '0 6px 16px rgba(59, 130, 246, 0.5)';
                }
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = '0 4px 12px rgba(59, 130, 246, 0.4)';
              }}
            >
              {isLoggingIn ? (
                <>
                  <div className="modal-spinner"></div>
                  Đang đăng nhập...
                </>
              ) : (
                <>
                  Đăng nhập
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginModal;

