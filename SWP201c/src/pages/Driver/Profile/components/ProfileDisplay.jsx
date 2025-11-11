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
      {/* User ID */}
      <div style={infoItemStyle}>
        <div style={labelStyle}>User ID</div>
        <div style={{
          ...valueStyle,
          fontFamily: 'monospace',
          color: '#19c37d',
          fontSize: '1rem',
          letterSpacing: '0.5px'
        }}>
          #{user?.id || user?.userId || 'N/A'}
        </div>
      </div>

      {/* Full Name */}
      <div style={infoItemStyle}>
        <div style={labelStyle}>Họ và tên</div>
        <div style={valueStyle}>
          {user?.fullName || user?.name || user?.username || 'Chưa cập nhật'}
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
          {user?.phone || user?.phoneNumber ? formatPhoneNumber(user.phone || user.phoneNumber) : 'Chưa cập nhật'}
        </div>
      </div>

      {/* Role */}
      <div style={infoItemStyle}>
        <div style={labelStyle}>Vai trò</div>
        <div style={valueStyle}>
          {user?.role || 'Chưa cập nhật'}
        </div>
      </div>

      {/* CCCD */}
      <div style={infoItemStyle}>
        <div style={labelStyle}>CCCD</div>
        <div style={valueStyle}>
          {user?.cccd || user?.citizenId || 'Chưa cập nhật'}
        </div>
      </div>

      {/* Join Date */}
      <div style={infoItemStyle}>
        <div style={labelStyle}>Ngày tham gia</div>
        <div style={valueStyle}>
          {user?.joinDate || user?.createdAt ? 
            new Date(user.joinDate || user.createdAt).toLocaleDateString('vi-VN') : 
            'Chưa cập nhật'}
        </div>
      </div>

      {/* Address */}
      <div style={infoItemStyle}>
        <div style={labelStyle}>Địa chỉ</div>
        <div style={valueStyle}>
          {user?.address || 'Chưa cập nhật'}
        </div>
      </div>
    </div>
  );
};
