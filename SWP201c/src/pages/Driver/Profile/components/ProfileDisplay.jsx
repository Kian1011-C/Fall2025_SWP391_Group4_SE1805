// Driver/Profile/components/ProfileDisplay.jsx
// Display mode for profile information (read-only)

import React from 'react';
import { formatPhoneNumber } from '../utils';

export const ProfileDisplay = ({ user }) => {
  const infoItemStyle = {
    marginBottom: '25px'
  };

  const labelStyle = {
    color: '#B0B0B0',
    display: 'block',
    marginBottom: '8px',
    fontSize: '0.85rem',
    textTransform: 'uppercase',
    letterSpacing: '0.5px'
  };

  const valueStyle = {
    color: '#FFFFFF',
    fontSize: '1.1rem',
    fontWeight: '500'
  };

  return (
    <div style={{ 
      display: 'grid', 
      gridTemplateColumns: '1fr 1fr', 
      gap: '30px'
    }}>
      {/* Full Name */}
      <div style={infoItemStyle}>
        <div style={labelStyle}>Họ và tên</div>
        <div style={valueStyle}>
          {user?.name || user?.fullName || user?.username || 'Chưa cập nhật'}
        </div>
      </div>

      {/* Email */}
      <div style={infoItemStyle}>
        <div style={labelStyle}>Email</div>
        <div style={valueStyle}>
          {user?.email || 'Chưa cập nhật'}
        </div>
      </div>

      {/* Phone */}
      <div style={infoItemStyle}>
        <div style={labelStyle}>Số điện thoại</div>
        <div style={valueStyle}>
          {user?.phone ? formatPhoneNumber(user.phone) : 'Chưa cập nhật'}
        </div>
      </div>

      {/* CCCD */}
      <div style={infoItemStyle}>
        <div style={labelStyle}>CCCD</div>
        <div style={valueStyle}>
          {user?.cccd || 'Chưa cập nhật'}
        </div>
      </div>

      {/* Role */}
      <div style={infoItemStyle}>
        <div style={labelStyle}>Vai trò</div>
        <div style={valueStyle}>
          {user?.role || 'Chưa cập nhật'}
        </div>
      </div>

      {/* Status */}
      <div style={infoItemStyle}>
        <div style={labelStyle}>Trạng thái</div>
        <div style={valueStyle}>
          {user?.status || 'Chưa cập nhật'}
        </div>
      </div>

      {/* Join Date */}
      <div style={infoItemStyle}>
        <div style={labelStyle}>Ngày tham gia</div>
        <div style={valueStyle}>
          {user?.joinDate ? new Date(user.joinDate).toLocaleDateString('vi-VN') : 'Chưa cập nhật'}
        </div>
      </div>
    </div>
  );
};
