import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, useSearchParams } from 'react-router-dom';
import { showToast } from '../../../assets/js/helpers/helpers';
import authService from '../../../assets/js/services/authService';
import '../../../assets/css/modal.css';
import './verify-otp.css';

const VerifyOTPPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [countdown, setCountdown] = useState(0);
  const [canResend, setCanResend] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const inputRefs = React.useRef([]);
  
  // Get userId from URL params or navigation state
  const userIdFromUrl = searchParams.get('userId');
  const { userId: userIdFromState, email } = location.state || {};
  const userId = userIdFromUrl || userIdFromState;
  
  // Debug: Log component mount and data
  React.useEffect(() => {
    console.log(' VerifyOTPPage: Component mounted');
    console.log(' VerifyOTPPage: userId:', userId);
    console.log(' VerifyOTPPage: email:', email);
  }, [userId, email]);

  useEffect(() => {
    if (!userId) {
      showToast('Thông tin xác thực không hợp lệ!', 'error');
      navigate('/register');
      return;
    }

    // Start countdown for resend OTP
    setCountdown(60);
    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          setCanResend(true);
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [userId, navigate]);

  // Handle OTP input changes
  const handleOtpChange = (index, value) => {
    // Only allow digits
    const digit = value.replace(/\D/g, '');
    
    if (digit.length > 1) {
      // Handle paste: split the pasted value
      const pastedDigits = digit.split('').slice(0, 6);
      const newOtp = [...otp];
      
      pastedDigits.forEach((d, i) => {
        if (index + i < 6) {
          newOtp[index + i] = d;
        }
      });
      
      setOtp(newOtp);
      
      // Focus the next empty field or the last filled field
      const nextEmptyIndex = newOtp.findIndex((val, i) => i >= index && val === '');
      const focusIndex = nextEmptyIndex !== -1 ? nextEmptyIndex : Math.min(index + pastedDigits.length, 5);
      
      if (inputRefs.current[focusIndex]) {
        inputRefs.current[focusIndex].focus();
      }
    } else {
      // Handle single digit input
      const newOtp = [...otp];
      newOtp[index] = digit;
      setOtp(newOtp);
      
      // Auto-advance to next field if digit was entered
      if (digit && index < 5) {
        if (inputRefs.current[index + 1]) {
          inputRefs.current[index + 1].focus();
        }
      }
    }
  };

  // Handle key down events (backspace, arrow keys)
  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace') {
      if (!otp[index] && index > 0) {
        // If current field is empty, move to previous field
        if (inputRefs.current[index - 1]) {
          inputRefs.current[index - 1].focus();
        }
      } else {
        // Clear current field
        const newOtp = [...otp];
        newOtp[index] = '';
        setOtp(newOtp);
      }
    } else if (e.key === 'ArrowLeft' && index > 0) {
      if (inputRefs.current[index - 1]) {
        inputRefs.current[index - 1].focus();
      }
    } else if (e.key === 'ArrowRight' && index < 5) {
      if (inputRefs.current[index + 1]) {
        inputRefs.current[index + 1].focus();
      }
    }
  };

  // Handle paste event
  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').replace(/\D/g, '');
    
    if (pastedData.length > 0) {
      const pastedDigits = pastedData.split('').slice(0, 6);
      const newOtp = [...otp];
      
      pastedDigits.forEach((digit, i) => {
        if (i < 6) {
          newOtp[i] = digit;
        }
      });
      
      setOtp(newOtp);
      
      // Focus the next empty field or the last field
      const nextEmptyIndex = newOtp.findIndex(val => val === '');
      const focusIndex = nextEmptyIndex !== -1 ? nextEmptyIndex : 5;
      
      if (inputRefs.current[focusIndex]) {
        inputRefs.current[focusIndex].focus();
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const otpString = otp.join('');
    if (!otpString || otpString.length !== 6) {
      showToast('Vui lòng nhập đầy đủ 6 chữ số OTP!', 'error');
      return;
    }

    setIsLoading(true);
    try {
      console.log(' VerifyOTPPage: Verifying OTP', { userId, otp: otpString });
      
      const response = await authService.verifyOTP(userId, otpString);
      
      console.log(' VerifyOTPPage: OTP verification response:', response);

      if (response.success) {
        showToast(response.message || 'Xác thực thành công!', 'success');
        
        // Use redirect field from API response
        const redirectPath = response.redirect || '/driver/dashboard';
        console.log(' VerifyOTPPage: Redirecting to:', redirectPath);
        
        // Navigate to dashboard or login page
        navigate(redirectPath, { 
          state: { 
            message: response.message,
            email: email,
            userId: userId
          }
        });
      } else {
        showToast(response.message || 'Mã OTP không đúng!', 'error');
      }
    } catch (error) {
      console.error(' VerifyOTPPage: OTP verification error:', error);
      showToast('Có lỗi xảy ra khi xác thực OTP!', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOTP = async () => {
    if (!canResend) return;

    setIsResending(true);
    try {
      console.log(' VerifyOTPPage: Resending OTP', { userId });
      
      const response = await authService.resendOTP(userId);
      
      if (response.success) {
        showToast(response.message || 'Đã gửi lại mã OTP!', 'success');
        setCountdown(60);
        setCanResend(false);
        
        // Restart countdown
        const timer = setInterval(() => {
          setCountdown(prev => {
            if (prev <= 1) {
              setCanResend(true);
              clearInterval(timer);
              return 0;
            }
            return prev - 1;
          });
        }, 1000);
      } else {
        showToast(response.message || 'Không thể gửi lại mã OTP!', 'error');
      }
    } catch (error) {
      console.error(' VerifyOTPPage: Resend OTP error:', error);
      showToast('Có lỗi xảy ra khi gửi lại mã OTP!', 'error');
    } finally {
      setIsResending(false);
    }
  };

  const handleBackToRegister = () => {
    navigate('/');
  };

  return (
    <div className="otp-page">
      {/* Animated background elements */}
      <div className="otp-bubble otp-bubble-1" />
      <div className="otp-bubble otp-bubble-2" />
      <div className="otp-bubble otp-bubble-3" />

      <div className="otp-card">
        {/* Header */}
        <div className="otp-header">
          <div className="otp-icon">
            
          </div>
          <h2 className="otp-title">
            Xác thực OTP
          </h2>
          <p className="otp-subtitle">
            Chúng tôi đã gửi mã xác thực đến email của bạn
          </p>
        </div>

        {/* Email Info */}
        <div className="otp-info">
          <div className="otp-info-dot" />
          <div className="otp-info-email">
             {email || 'Email đã được gửi'}
          </div>
          <div className="otp-info-note">
            Vui lòng kiểm tra hộp thư và nhập mã OTP 6 chữ số
          </div>
          {userId && (
            <div className="otp-info-id">
              User ID: {userId}
            </div>
          )}
        </div>

        <form onSubmit={handleSubmit}>
          {/* OTP Input */}
          <div className="otp-input-group">
            <label className="otp-input-label">
              Mã OTP *
            </label>
            <div className="otp-inputs">
              {Array.from({ length: 6 }, (_, index) => (
                <input
                  key={index}
                  ref={(el) => (inputRefs.current[index] = el)}
                  type="text"
                  maxLength="6"
                  value={otp[index] || ''}
                  onChange={(e) => handleOtpChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  onPaste={handlePaste}
                  disabled={isLoading}
                  className="otp-input"
                  onFocus={(e) => {
                    e.target.style.borderColor = '#667eea';
                    e.target.style.background = '#ffffff';
                    e.target.style.transform = 'scale(1.05)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = '#e2e8f0';
                    e.target.style.background = '#f8fafc';
                    e.target.style.transform = 'scale(1)';
                  }}
                />
              ))}
            </div>
            <p className="otp-help">
              Nhập đầy đủ 6 chữ số để tiếp tục
            </p>
          </div>

          {/* Resend OTP */}
          <div className="otp-resend">
            {countdown > 0 ? (
              <div className="otp-resend-timer">
                ⏰ Gửi lại mã sau: <span style={{ fontWeight: '700' }}>{countdown}s</span>
              </div>
            ) : (
              <button
                type="button"
                onClick={handleResendOTP}
                disabled={isResending || isLoading}
                className={`btn btn-gradient ${isResending || isLoading ? 'btn-disabled' : ''}`}
                onMouseEnter={(e) => {
                  if (!isResending && !isLoading) {
                    e.target.style.transform = 'translateY(-2px)';
                    e.target.style.boxShadow = '0 6px 20px rgba(102, 126, 234, 0.4)';
                  }
                }}
                onMouseLeave={(e) => {
                  e.target.style.transform = 'translateY(0)';
                  e.target.style.boxShadow = '0 4px 12px rgba(102, 126, 234, 0.3)';
                }}
              >
                {isResending ? '⏳ Đang gửi lại...' : ' Gửi lại mã OTP'}
              </button>
            )}
          </div>

          {/* Action Buttons */}
          <div className="otp-actions">
            <button
              type="button"
              onClick={handleBackToRegister}
              disabled={isLoading}
              className="btn btn-ghost"
              onMouseEnter={(e) => {
                if (!isLoading) {
                  e.target.style.background = 'rgba(107, 114, 128, 0.15)';
                  e.target.style.transform = 'translateY(-1px)';
                }
              }}
              onMouseLeave={(e) => {
                e.target.style.background = 'rgba(107, 114, 128, 0.1)';
                e.target.style.transform = 'translateY(0)';
              }}
            >
              ← Quay lại
            </button>
            <button
              type="submit"
              disabled={isLoading || otp.join('').length !== 6}
              className={`btn btn-gradient ${isLoading || otp.join('').length !== 6 ? 'btn-disabled' : ''}`}
              onMouseEnter={(e) => {
                if (!isLoading && otp.join('').length === 6) {
                  e.target.style.transform = 'translateY(-2px)';
                  e.target.style.boxShadow = '0 6px 20px rgba(102, 126, 234, 0.4)';
                }
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = isLoading || otp.join('').length !== 6 
                  ? 'none' 
                  : '0 4px 12px rgba(102, 126, 234, 0.3)';
              }}
            >
              {isLoading ? (
                <>
                  <div className="spinner-light" />
                  Đang xác thực...
                </>
              ) : (
                <>
                   Xác thực
                </>
              )}
            </button>
          </div>
        </form>

        {/* Help Text */}
        <div className="otp-help-box">
          <div className="otp-help-text">
             Không nhận được email? Kiểm tra thư mục spam hoặc nhấn "Gửi lại mã OTP"
          </div>
        </div>
      </div>
    </div>
  );
};

export default VerifyOTPPage;
