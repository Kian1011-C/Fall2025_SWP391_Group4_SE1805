// Driver Profile Management
// Profile settings, personal information, vehicle registration

import React, { useState, useEffect } from 'react';
import authService from '../../assets/js/services/authService';
import DashboardLayout from '../../layouts/DashboardLayout';

const DriverProfile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    address: ''
  });

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await authService.getCurrentUser();
      
      if (result.success) {
        setUser(result.data);
        setFormData({
          fullName: result.data.fullName || '',
          email: result.data.email || '',
          phone: result.data.phone || '',
          address: result.data.address || ''
        });
      } else {
        setError(result.message || 'Không thể tải thông tin người dùng');
      }
    } catch (err) {
      setError('Lỗi khi tải thông tin người dùng');
      console.error('Error fetching user profile:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      
      // Note: Backend cần API PUT /api/users/:id để update profile
      alert('Backend cần implement API PUT /api/users/:id để cập nhật profile');
      
      // Tạm thời update local state
      setUser({ ...user, ...formData });
      setIsEditing(false);
    } catch (err) {
      alert('Có lỗi xảy ra: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading && !user) {
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <div style={{ color: '#19c37d', fontSize: '1.5rem' }}>⏳ Đang tải...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <div style={{ color: '#ff6b6b', fontSize: '1.2rem' }}>⚠️ {error}</div>
        <button 
          onClick={fetchUserProfile}
          style={{
            marginTop: '20px',
            padding: '10px 20px',
            background: '#19c37d',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer'
          }}
        >
          Thử lại
        </button>
      </div>
    );
  }

  return (
    <DashboardLayout role="driver">
      <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
        {/* Header */}
      <div style={{ marginBottom: '30px' }}>
        <h1 style={{ color: '#FFFFFF', margin: '0 0 10px 0' }}>👤 Hồ sơ của tôi</h1>
        <p style={{ color: '#B0B0B0', margin: 0 }}>Quản lý thông tin cá nhân và phương tiện</p>
      </div>

      {/* Profile Card */}
      <div style={{
        background: 'rgba(26, 32, 44, 0.8)',
        borderRadius: '20px',
        padding: '40px',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        marginBottom: '30px'
      }}>
        {/* Avatar Section */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '30px',
          marginBottom: '40px',
          paddingBottom: '30px',
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
        }}>
          <div style={{
            width: '120px',
            height: '120px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #19c37d, #6ab7ff)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '3rem',
            boxShadow: '0 10px 30px rgba(25, 195, 125, 0.3)'
          }}>
            👤
          </div>
          <div style={{ flex: 1 }}>
            <h2 style={{ color: '#FFFFFF', margin: '0 0 10px 0', fontSize: '1.8rem' }}>
              {user?.fullName || user?.username || 'Driver'}
            </h2>
            <p style={{ color: '#B0B0B0', margin: '0 0 10px 0' }}>
              {user?.email || 'email@example.com'}
            </p>
            <div style={{
              display: 'inline-block',
              padding: '6px 15px',
              background: user?.role === 'DRIVER' ? '#19c37d20' : '#6ab7ff20',
              color: user?.role === 'DRIVER' ? '#19c37d' : '#6ab7ff',
              borderRadius: '20px',
              fontSize: '0.9rem',
              fontWeight: '600',
              border: user?.role === 'DRIVER' ? '1px solid #19c37d40' : '1px solid #6ab7ff40'
            }}>
              {user?.role || 'DRIVER'}
            </div>
          </div>
          {!isEditing && (
            <button
              onClick={() => setIsEditing(true)}
              style={{
                padding: '12px 24px',
                background: 'linear-gradient(135deg, #19c37d, #15a36a)',
                color: 'white',
                border: 'none',
                borderRadius: '10px',
                cursor: 'pointer',
                fontSize: '1rem',
                fontWeight: '600',
                boxShadow: '0 4px 15px rgba(25, 195, 125, 0.3)'
              }}
            >
              Chỉnh sửa
            </button>
          )}
        </div>

        {/* Profile Form */}
        {isEditing ? (
          <form onSubmit={handleSubmit}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '25px', marginBottom: '25px' }}>
              <div>
                <label style={{ color: '#E0E0E0', display: 'block', marginBottom: '10px', fontSize: '0.95rem' }}>
                  Họ và tên
                </label>
                <input
                  type="text"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  required
                  style={{
                    width: '100%',
                    padding: '14px',
                    background: 'rgba(255, 255, 255, 0.1)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    borderRadius: '10px',
                    color: '#FFFFFF',
                    fontSize: '1rem'
                  }}
                />
              </div>
              <div>
                <label style={{ color: '#E0E0E0', display: 'block', marginBottom: '10px', fontSize: '0.95rem' }}>
                  Email
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                  style={{
                    width: '100%',
                    padding: '14px',
                    background: 'rgba(255, 255, 255, 0.1)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    borderRadius: '10px',
                    color: '#FFFFFF',
                    fontSize: '1rem'
                  }}
                />
              </div>
              <div>
                <label style={{ color: '#E0E0E0', display: 'block', marginBottom: '10px', fontSize: '0.95rem' }}>
                  Số điện thoại
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '14px',
                    background: 'rgba(255, 255, 255, 0.1)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    borderRadius: '10px',
                    color: '#FFFFFF',
                    fontSize: '1rem'
                  }}
                />
              </div>
              <div>
                <label style={{ color: '#E0E0E0', display: 'block', marginBottom: '10px', fontSize: '0.95rem' }}>
                  Địa chỉ
                </label>
                <input
                  type="text"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '14px',
                    background: 'rgba(255, 255, 255, 0.1)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    borderRadius: '10px',
                    color: '#FFFFFF',
                    fontSize: '1rem'
                  }}
                />
              </div>
            </div>
            <div style={{ display: 'flex', gap: '15px', justifyContent: 'flex-end' }}>
              <button
                type="button"
                onClick={() => {
                  setIsEditing(false);
                  setFormData({
                    fullName: user?.fullName || '',
                    email: user?.email || '',
                    phone: user?.phone || '',
                    address: user?.address || ''
                  });
                }}
                style={{
                  padding: '12px 24px',
                  background: 'rgba(255, 255, 255, 0.1)',
                  color: '#FFFFFF',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  borderRadius: '10px',
                  cursor: 'pointer',
                  fontSize: '1rem'
                }}
              >
                Hủy
              </button>
              <button
                type="submit"
                disabled={loading}
                style={{
                  padding: '12px 24px',
                  background: loading ? '#666' : 'linear-gradient(135deg, #19c37d, #15a36a)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '10px',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  fontSize: '1rem',
                  fontWeight: '600',
                  boxShadow: loading ? 'none' : '0 4px 15px rgba(25, 195, 125, 0.3)'
                }}
              >
                {loading ? 'Đang lưu...' : 'Lưu thay đổi'}
              </button>
            </div>
          </form>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px' }}>
            <div>
              <div style={{ color: '#B0B0B0', fontSize: '0.9rem', marginBottom: '8px' }}>Họ và tên</div>
              <div style={{ color: '#FFFFFF', fontSize: '1.1rem', fontWeight: '500' }}>
                {user?.fullName || 'Chưa cập nhật'}
              </div>
            </div>
            <div>
              <div style={{ color: '#B0B0B0', fontSize: '0.9rem', marginBottom: '8px' }}>Email</div>
              <div style={{ color: '#FFFFFF', fontSize: '1.1rem', fontWeight: '500' }}>
                {user?.email || 'Chưa cập nhật'}
              </div>
            </div>
            <div>
              <div style={{ color: '#B0B0B0', fontSize: '0.9rem', marginBottom: '8px' }}>Số điện thoại</div>
              <div style={{ color: '#FFFFFF', fontSize: '1.1rem', fontWeight: '500' }}>
                {user?.phone || 'Chưa cập nhật'}
              </div>
            </div>
            <div>
              <div style={{ color: '#B0B0B0', fontSize: '0.9rem', marginBottom: '8px' }}>Địa chỉ</div>
              <div style={{ color: '#FFFFFF', fontSize: '1.1rem', fontWeight: '500' }}>
                {user?.address || 'Chưa cập nhật'}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Vehicle Information */}
      <div style={{
        background: 'rgba(26, 32, 44, 0.8)',
        borderRadius: '20px',
        padding: '30px',
        border: '1px solid rgba(255, 255, 255, 0.1)'
      }}>
        <h3 style={{ 
          color: '#FFFFFF', 
          marginBottom: '20px',
          fontSize: '1.3rem',
          display: 'flex',
          alignItems: 'center',
          gap: '10px'
        }}>
          🚗 Thông tin phương tiện
        </h3>
        <div style={{ 
          textAlign: 'center', 
          padding: '40px',
          color: '#B0B0B0'
        }}>
          <div style={{ fontSize: '3rem', marginBottom: '15px' }}>🚙</div>
          <div style={{ fontSize: '1.1rem' }}>Chưa có thông tin phương tiện</div>
          <div style={{ fontSize: '0.9rem', marginTop: '10px' }}>
            Backend cần API GET /api/users/:id/vehicles để hiển thị
          </div>
          <button
            style={{
              marginTop: '20px',
              padding: '12px 24px',
              background: 'linear-gradient(135deg, #6ab7ff, #4a9eff)',
              color: 'white',
              border: 'none',
              borderRadius: '10px',
              cursor: 'pointer',
              fontSize: '1rem',
              fontWeight: '600'
            }}
          >
            Thêm phương tiện
          </button>
        </div>
      </div>
    </div>
    </DashboardLayout>
  );
};

export default DriverProfile;
