// Driver/Profile/components/ProfileFormFields.jsx
// Form fields for editing profile

import React from 'react';

export const ProfileFormFields = ({ formData, formErrors, onFieldChange }) => {
  const inputStyle = (hasError) => ({
    width: '100%',
    padding: '14px',
    background: 'rgba(255, 255, 255, 0.05)',
    border: hasError 
      ? '1px solid #EF4444' 
      : '1px solid rgba(255, 255, 255, 0.2)',
    borderRadius: '10px',
    color: '#FFFFFF',
    fontSize: '1rem'
  });

  const labelStyle = {
    color: '#E0E0E0',
    display: 'block',
    marginBottom: '10px',
    fontSize: '0.95rem',
    fontWeight: '500'
  };

  const errorStyle = {
    color: '#EF4444',
    fontSize: '0.8rem',
    marginTop: '5px'
  };

  return (
    <div style={{ 
      display: 'grid', 
      gridTemplateColumns: '1fr 1fr', 
      gap: '25px'
    }}>
      {/* Full Name */}
      <div>
        <label style={labelStyle}>
          Họ và tên *
        </label>
        <input
          type="text"
          value={formData.fullName}
          onChange={(e) => onFieldChange('fullName', e.target.value)}
          required
          style={inputStyle(formErrors.fullName)}
          placeholder="VD: Nguyễn Văn A"
        />
        {formErrors.fullName && (
          <div style={errorStyle}>{formErrors.fullName}</div>
        )}
      </div>

      {/* Email */}
      <div>
        <label style={labelStyle}>
          Email *
        </label>
        <input
          type="email"
          value={formData.email}
          onChange={(e) => onFieldChange('email', e.target.value)}
          required
          style={inputStyle(formErrors.email)}
          placeholder="VD: example@email.com"
        />
        {formErrors.email && (
          <div style={errorStyle}>{formErrors.email}</div>
        )}
      </div>

      {/* Phone */}
      <div>
        <label style={labelStyle}>
          Số điện thoại
        </label>
        <input
          type="tel"
          value={formData.phone}
          onChange={(e) => onFieldChange('phone', e.target.value)}
          style={inputStyle(formErrors.phone)}
          placeholder="VD: 0123456789"
        />
        {formErrors.phone && (
          <div style={errorStyle}>{formErrors.phone}</div>
        )}
      </div>

      {/* Address */}
      <div>
        <label style={labelStyle}>
          Địa chỉ
        </label>
        <input
          type="text"
          value={formData.address}
          onChange={(e) => onFieldChange('address', e.target.value)}
          style={inputStyle(formErrors.address)}
          placeholder="VD: 123 Đường ABC, Quận 1, TP.HCM"
        />
        {formErrors.address && (
          <div style={errorStyle}>{formErrors.address}</div>
        )}
      </div>
    </div>
  );
};
