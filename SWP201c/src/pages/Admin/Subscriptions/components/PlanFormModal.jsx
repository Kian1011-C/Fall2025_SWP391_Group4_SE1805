// Admin/Subscriptions/components/PlanFormModal.jsx
// Modal for creating/editing subscription plans

import React from 'react';

export const PlanFormModal = ({ 
  isOpen, 
  editingPlan, 
  formData, 
  loading,
  onFieldChange, 
  onSubmit, 
  onClose 
}) => {
  if (!isOpen) return null;

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
      padding: '20px'
    }}>
      <div style={{
        background: '#1a202c',
        borderRadius: '20px',
        padding: '30px',
        maxWidth: '500px',
        width: '100%',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        maxHeight: '90vh',
        overflowY: 'auto'
      }}>
        <h2 style={{ color: '#FFFFFF', marginBottom: '20px' }}>
          {editingPlan ? 'Chỉnh sửa gói dịch vụ' : 'Thêm gói dịch vụ mới'}
        </h2>
        
        <form onSubmit={handleSubmit}>
          {/* Plan Name */}
          <div style={{ marginBottom: '20px' }}>
            <label style={{ 
              color: '#E0E0E0', 
              display: 'block', 
              marginBottom: '8px',
              fontSize: '0.9rem'
            }}>
              Tên gói <span style={{ color: '#ff6b6b' }}>*</span>
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => onFieldChange('name', e.target.value)}
              required
              placeholder="Ví dụ: Gói Cơ Bản"
              style={{
                width: '100%',
                padding: '12px',
                background: 'rgba(255, 255, 255, 0.1)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                borderRadius: '8px',
                color: '#FFFFFF',
                fontSize: '1rem'
              }}
            />
          </div>

          {/* Description */}
          <div style={{ marginBottom: '20px' }}>
            <label style={{ 
              color: '#E0E0E0', 
              display: 'block', 
              marginBottom: '8px',
              fontSize: '0.9rem'
            }}>
              Mô tả
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => onFieldChange('description', e.target.value)}
              rows={3}
              placeholder="Mô tả chi tiết về gói dịch vụ..."
              style={{
                width: '100%',
                padding: '12px',
                background: 'rgba(255, 255, 255, 0.1)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                borderRadius: '8px',
                color: '#FFFFFF',
                fontSize: '1rem',
                fontFamily: 'inherit',
                resize: 'vertical'
              }}
            />
          </div>

          {/* Price and Duration */}
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: '1fr 1fr', 
            gap: '15px', 
            marginBottom: '20px' 
          }}>
            {/* Price */}
            <div>
              <label style={{ 
                color: '#E0E0E0', 
                display: 'block', 
                marginBottom: '8px',
                fontSize: '0.9rem'
              }}>
                Giá (VND) <span style={{ color: '#ff6b6b' }}>*</span>
              </label>
              <input
                type="number"
                value={formData.price}
                onChange={(e) => onFieldChange('price', e.target.value)}
                required
                min="0"
                placeholder="0"
                style={{
                  width: '100%',
                  padding: '12px',
                  background: 'rgba(255, 255, 255, 0.1)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  borderRadius: '8px',
                  color: '#FFFFFF',
                  fontSize: '1rem'
                }}
              />
            </div>

            {/* Duration/Swap Limit */}
            <div>
              <label style={{ 
                color: '#E0E0E0', 
                display: 'block', 
                marginBottom: '8px',
                fontSize: '0.9rem'
              }}>
                Số lần đổi <span style={{ color: '#ff6b6b' }}>*</span>
              </label>
              <input
                type="number"
                value={formData.duration}
                onChange={(e) => onFieldChange('duration', e.target.value)}
                required
                min="1"
                placeholder="0"
                style={{
                  width: '100%',
                  padding: '12px',
                  background: 'rgba(255, 255, 255, 0.1)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  borderRadius: '8px',
                  color: '#FFFFFF',
                  fontSize: '1rem'
                }}
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div style={{ display: 'flex', gap: '10px', marginTop: '25px' }}>
            <button
              type="button"
              onClick={onClose}
              style={{
                flex: 1,
                padding: '12px',
                background: 'rgba(255, 255, 255, 0.1)',
                color: '#FFFFFF',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '1rem',
                fontWeight: '500'
              }}
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={loading}
              style={{
                flex: 1,
                padding: '12px',
                background: loading ? '#666' : 'linear-gradient(135deg, #19c37d, #15a36a)',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: loading ? 'not-allowed' : 'pointer',
                fontSize: '1rem',
                fontWeight: '600'
              }}
            >
              {loading ? 'Đang xử lý...' : editingPlan ? 'Cập nhật' : 'Thêm mới'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
