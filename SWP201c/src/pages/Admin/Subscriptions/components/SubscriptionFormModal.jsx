import React, { useState, useEffect } from 'react';

// Style chung
const inputStyle = { width: '100%', padding: '10px', background: '#374151', color: 'white', border: '1px solid #4b5563', borderRadius: '8px', boxSizing: 'border-box' };
const labelStyle = { display: 'block', marginBottom: '8px', color: '#9ca3af' };
const checkboxLabelStyle = { display: 'flex', alignItems: 'center', gap: '10px', color: 'white' };
const checkboxStyle = { width: '18px', height: '18px', accentColor: '#f59e0b' };

const SubscriptionFormModal = ({ isOpen, onClose, onSave, plan }) => {
  const [formData, setFormData] = useState({
    planName: '', basePrice: 0, baseDistance: 0, depositFee: 0, description: '', isUnlimited: false
  });
  const isEditing = !!plan;

  useEffect(() => {
    if (isEditing) {
      setFormData({
        planName: plan.planName || '',
        basePrice: plan.basePrice || 0,
        baseDistance: plan.baseDistance || 0,
        depositFee: plan.depositFee || 0,
        description: plan.description || '',
        isUnlimited: plan.isUnlimited || false,
      });
    } else {
      setFormData({ planName: '', basePrice: 0, baseDistance: 0, depositFee: 0, description: '', isUnlimited: false });
    }
  }, [plan, isEditing, isOpen]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({ 
      ...prev, 
      [name]: type === 'checkbox' ? checked : value 
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData, plan?.planId);
  };

  if (!isOpen) return null;

  return (
    <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0, 0, 0, 0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }} onClick={onClose}>
      <div style={{ background: '#1f2937', borderRadius: '16px', width: '90%', maxWidth: '600px', border: '1px solid #374151' }} onClick={e => e.stopPropagation()}>
        <form onSubmit={handleSubmit}>
          <div style={{ padding: '20px', borderBottom: '1px solid #374151' }}>
            <h2 style={{ margin: 0, fontSize: '20px' }}>{isEditing ? 'Chỉnh sửa Gói cước' : 'Tạo Gói cước Mới'}</h2>
          </div>
          <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '15px', maxHeight: '60vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', gap: '15px' }}>
              <div style={{ flex: 1 }}>
                <label style={labelStyle}>Tên Gói cước</label>
                <input type="text" name="planName" value={formData.planName} onChange={handleChange} style={inputStyle} required />
              </div>
              <div style={{ flex: 1 }}>
                <label style={labelStyle}>Phí đặt cọc</label>
                <input type="number" name="depositFee" value={formData.depositFee} onChange={handleChange} style={inputStyle} required />
              </div>
            </div>
            <div>
              <label style={labelStyle}>Mô tả</label>
              <textarea name="description" value={formData.description} onChange={handleChange} style={{...inputStyle, minHeight: '80px'}} />
            </div>
            <div style={{ display: 'flex', gap: '15px' }}>
              <div style={{ flex: 1 }}>
                <label style={labelStyle}>Phí cơ bản (VNĐ)</label>
                <input type="number" name="basePrice" value={formData.basePrice} onChange={handleChange} style={inputStyle} required />
              </div>
              <div style={{ flex: 1 }}>
                <label style={labelStyle}>Quãng đường cơ bản (km)</label>
                <input type="number" name="baseDistance" value={formData.baseDistance} onChange={handleChange} style={inputStyle} disabled={formData.isUnlimited} />
              </div>
            </div>
            <div>
              <label style={checkboxLabelStyle}>
                <input type="checkbox" name="isUnlimited" checked={formData.isUnlimited} onChange={handleChange} style={checkboxStyle} />
                Không giới hạn quãng đường
              </label>
            </div>
          </div>
          <div style={{ padding: '20px', background: '#111827', borderTop: '1px solid #374151', borderRadius: '0 0 16px 16px', display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
            <button type="button" onClick={onClose} style={{ background: '#374151', color: 'white', border: 'none', padding: '10px 15px', borderRadius: '8px', cursor: 'pointer' }}>Hủy</button>
            <button type="submit" style={{ background: '#f59e0b', color: '#111827', border: 'none', padding: '10px 15px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>Lưu</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SubscriptionFormModal;