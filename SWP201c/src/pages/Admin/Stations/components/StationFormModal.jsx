// Admin/Stations/components/StationFormModal.jsx
// Modal for creating/editing station

import React from 'react';

export const StationFormModal = ({ 
  show,
  isEditMode,
  formData,
  formErrors,
  onClose,
  onSubmit,
  onFieldChange
}) => {
  if (!show) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit();
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0, 0, 0, 0.7)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      backdropFilter: 'blur(5px)'
    }}>
      <div style={{
        background: 'rgba(26, 32, 44, 0.98)',
        borderRadius: '16px',
        padding: '30px',
        width: '500px',
        maxWidth: '90vw',
        maxHeight: '90vh',
        overflowY: 'auto',
        border: '1px solid rgba(106, 183, 255, 0.3)',
        boxShadow: '0 10px 40px rgba(0, 0, 0, 0.5)'
      }}>
        {/* Modal Header */}
        <h3 style={{ 
          color: '#FFFFFF', 
          marginBottom: '25px',
          fontSize: '1.5rem',
          fontWeight: '600'
        }}>
          {isEditMode ? '✏️ Sửa thông tin trạm' : '➕ Thêm trạm mới'}
        </h3>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          {/* Station Name */}
          <div style={{ marginBottom: '20px' }}>
            <label style={{ 
              display: 'block', 
              color: '#B0B0B0', 
              marginBottom: '8px',
              fontSize: '0.9rem'
            }}>
              Tên trạm *
            </label>
            <input
              type="text"
              placeholder="VD: Trạm đổi pin Hà Nội"
              value={formData.name}
              onChange={(e) => onFieldChange('name', e.target.value)}
              style={{
                width: '100%',
                padding: '12px 16px',
                background: 'rgba(255, 255, 255, 0.05)',
                border: formErrors.name 
                  ? '1px solid #EF4444' 
                  : '1px solid rgba(255, 255, 255, 0.2)',
                borderRadius: '8px',
                color: '#FFFFFF',
                fontSize: '14px'
              }}
              required
            />
            {formErrors.name && (
              <div style={{ color: '#EF4444', fontSize: '0.8rem', marginTop: '5px' }}>
                {formErrors.name}
              </div>
            )}
          </div>

          {/* Address */}
          <div style={{ marginBottom: '20px' }}>
            <label style={{ 
              display: 'block', 
              color: '#B0B0B0', 
              marginBottom: '8px',
              fontSize: '0.9rem'
            }}>
              Địa chỉ *
            </label>
            <input
              type="text"
              placeholder="VD: 123 Đường ABC, Quận 1, TP.HCM"
              value={formData.address}
              onChange={(e) => onFieldChange('address', e.target.value)}
              style={{
                width: '100%',
                padding: '12px 16px',
                background: 'rgba(255, 255, 255, 0.05)',
                border: formErrors.address 
                  ? '1px solid #EF4444' 
                  : '1px solid rgba(255, 255, 255, 0.2)',
                borderRadius: '8px',
                color: '#FFFFFF',
                fontSize: '14px'
              }}
              required
            />
            {formErrors.address && (
              <div style={{ color: '#EF4444', fontSize: '0.8rem', marginTop: '5px' }}>
                {formErrors.address}
              </div>
            )}
          </div>

          {/* Manager */}
          <div style={{ marginBottom: '20px' }}>
            <label style={{ 
              display: 'block', 
              color: '#B0B0B0', 
              marginBottom: '8px',
              fontSize: '0.9rem'
            }}>
              Quản lý *
            </label>
            <input
              type="text"
              placeholder="VD: Nguyễn Văn A"
              value={formData.manager}
              onChange={(e) => onFieldChange('manager', e.target.value)}
              style={{
                width: '100%',
                padding: '12px 16px',
                background: 'rgba(255, 255, 255, 0.05)',
                border: formErrors.manager 
                  ? '1px solid #EF4444' 
                  : '1px solid rgba(255, 255, 255, 0.2)',
                borderRadius: '8px',
                color: '#FFFFFF',
                fontSize: '14px'
              }}
              required
            />
            {formErrors.manager && (
              <div style={{ color: '#EF4444', fontSize: '0.8rem', marginTop: '5px' }}>
                {formErrors.manager}
              </div>
            )}
          </div>

          {/* Phone */}
          <div style={{ marginBottom: '20px' }}>
            <label style={{ 
              display: 'block', 
              color: '#B0B0B0', 
              marginBottom: '8px',
              fontSize: '0.9rem'
            }}>
              Số điện thoại *
            </label>
            <input
              type="tel"
              placeholder="VD: 0123456789"
              value={formData.phone}
              onChange={(e) => onFieldChange('phone', e.target.value)}
              style={{
                width: '100%',
                padding: '12px 16px',
                background: 'rgba(255, 255, 255, 0.05)',
                border: formErrors.phone 
                  ? '1px solid #EF4444' 
                  : '1px solid rgba(255, 255, 255, 0.2)',
                borderRadius: '8px',
                color: '#FFFFFF',
                fontSize: '14px'
              }}
              required
            />
            {formErrors.phone && (
              <div style={{ color: '#EF4444', fontSize: '0.8rem', marginTop: '5px' }}>
                {formErrors.phone}
              </div>
            )}
          </div>

          {/* Total Slots */}
          <div style={{ marginBottom: '25px' }}>
            <label style={{ 
              display: 'block', 
              color: '#B0B0B0', 
              marginBottom: '8px',
              fontSize: '0.9rem'
            }}>
              Số lượng slots *
            </label>
            <input
              type="number"
              min="1"
              placeholder="VD: 20"
              value={formData.totalSlots}
              onChange={(e) => onFieldChange('totalSlots', parseInt(e.target.value))}
              style={{
                width: '100%',
                padding: '12px 16px',
                background: 'rgba(255, 255, 255, 0.05)',
                border: formErrors.totalSlots 
                  ? '1px solid #EF4444' 
                  : '1px solid rgba(255, 255, 255, 0.2)',
                borderRadius: '8px',
                color: '#FFFFFF',
                fontSize: '14px'
              }}
              required
            />
            {formErrors.totalSlots && (
              <div style={{ color: '#EF4444', fontSize: '0.8rem', marginTop: '5px' }}>
                {formErrors.totalSlots}
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div style={{ display: 'flex', gap: '10px' }}>
            <button
              type="button"
              onClick={onClose}
              style={{
                flex: 1,
                padding: '12px',
                background: 'rgba(255, 255, 255, 0.1)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                borderRadius: '8px',
                color: '#FFFFFF',
                cursor: 'pointer',
                fontWeight: '500',
                fontSize: '14px'
              }}
            >
              Hủy
            </button>
            
            <button
              type="submit"
              style={{
                flex: 1,
                padding: '12px',
                background: isEditMode 
                  ? 'linear-gradient(135deg, #6ab7ff, #4a9eff)'
                  : 'linear-gradient(135deg, #10B981, #059669)',
                border: 'none',
                borderRadius: '8px',
                color: '#FFFFFF',
                cursor: 'pointer',
                fontWeight: '600',
                fontSize: '14px'
              }}
            >
              {isEditMode ? 'Cập nhật' : 'Thêm trạm'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
