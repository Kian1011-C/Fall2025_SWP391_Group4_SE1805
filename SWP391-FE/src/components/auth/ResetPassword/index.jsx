import React, { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import authService from '../../../assets/js/services/authService';

function useQuery() {
  const { search } = useLocation();
  return useMemo(() => new URLSearchParams(search), [search]);
}

const ResetPasswordPage = () => {
  const navigate = useNavigate();
  const query = useQuery();

  const [token, setToken] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const t = query.get('token') || '';
    setToken(t);
    if (!t) {
      setError('Liên kết đặt lại mật khẩu không hợp lệ hoặc thiếu token.');
    }
  }, [query]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Validate token
    if (!token) {
      setError('Liên kết đặt lại mật khẩu không hợp lệ hoặc thiếu token.');
      return;
    }

    // Validate các trường nhập liệu
    if (!newPassword || !confirmPassword) {
      setError('Vui lòng nhập đầy đủ mật khẩu mới và xác nhận.');
      return;
    }

    // Validate password length (theo logic của BE: tối thiểu 8 ký tự)
    if (newPassword.length < 8) {
      setError('Mật khẩu tối thiểu 8 ký tự.');
      return;
    }

    // Validate password match
    if (newPassword !== confirmPassword) {
      setError('Mật khẩu xác nhận không khớp.');
      return;
    }

    try {
      setSubmitting(true);
      
      // Gọi API reset password qua authService
      const response = await authService.resetPassword(token, newPassword);

      if (response.success) {
        setSuccess(response.message || 'Đặt lại mật khẩu thành công. Hãy đăng nhập bằng mật khẩu mới.');
        // Tự động chuyển hướng sau 2.5s
        setTimeout(() => {
          navigate('/login');
        }, 2500);
      } else {
        // Hiển thị message từ API hoặc thông báo lỗi rõ ràng hơn
        let errorMessage = response.message || 'Không thể đặt lại mật khẩu. Vui lòng thử lại.';
        
        // Kiểm tra nếu là lỗi CORS hoặc network
        if (response.error) {
          const errorInfo = response.error;
          if (errorInfo.message?.includes('CORS') || errorInfo.message?.includes('Network')) {
            errorMessage = 'Lỗi kết nối server. Vui lòng kiểm tra backend CORS configuration hoặc thử lại sau.';
          }
        }
        
        setError(errorMessage);
      }
    } catch (err) {
      console.error('Reset password error:', err);
      let errorMessage = err.message || 'Đã xảy ra lỗi. Vui lòng thử lại.';
      
      // Kiểm tra lỗi CORS
      if (err.message?.includes('CORS') || err.message?.includes('Network') || err.code === 'ERR_NETWORK') {
        errorMessage = 'Lỗi kết nối server (CORS). Vui lòng kiểm tra backend đã cấu hình CORS chưa hoặc liên hệ admin.';
      }
      
      setError(errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{ maxWidth: 420, margin: '60px auto', padding: 24, background: '#1f2937', color: '#fff', borderRadius: 12, boxShadow: '0 8px 24px rgba(0,0,0,0.25)' }}>
      <h2 style={{ margin: 0, marginBottom: 16, fontSize: 24, fontWeight: 700 }}>Tạo mật khẩu mới</h2>
      <p style={{ marginTop: 0, marginBottom: 24, color: '#d1d5db' }}>Vui lòng nhập mật khẩu mới cho tài khoản của bạn.</p>

      {error ? (
        <div style={{ background: '#7f1d1d', color: '#fecaca', padding: '10px 12px', borderRadius: 8, marginBottom: 16 }}>{error}</div>
      ) : null}

      {success ? (
        <div style={{ background: '#064e3b', color: '#bbf7d0', padding: '10px 12px', borderRadius: 8, marginBottom: 16 }}>{success}</div>
      ) : null}

      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: 12 }}>
          <label htmlFor="newPassword" style={{ display: 'block', marginBottom: 6 }}>Mật khẩu mới</label>
          <input
            id="newPassword"
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="Nhập mật khẩu mới"
            style={{ width: '100%', padding: '10px 12px', borderRadius: 8, border: '1px solid #374151', background: '#111827', color: '#e5e7eb' }}
            autoComplete="new-password"
          />
        </div>

        <div style={{ marginBottom: 16 }}>
          <label htmlFor="confirmPassword" style={{ display: 'block', marginBottom: 6 }}>Xác nhận mật khẩu mới</label>
          <input
            id="confirmPassword"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Nhập lại mật khẩu mới"
            style={{ width: '100%', padding: '10px 12px', borderRadius: 8, border: '1px solid #374151', background: '#111827', color: '#e5e7eb' }}
            autoComplete="new-password"
          />
        </div>

        <button
          type="submit"
          disabled={submitting}
          style={{ width: '100%', padding: '10px 12px', borderRadius: 8, background: submitting ? '#6b7280' : '#2563eb', color: '#fff', border: 'none', cursor: submitting ? 'not-allowed' : 'pointer', fontWeight: 600 }}
        >
          {submitting ? 'Đang cập nhật...' : 'Cập nhật mật khẩu'}
        </button>
      </form>
    </div>
  );
};

export default ResetPasswordPage;


