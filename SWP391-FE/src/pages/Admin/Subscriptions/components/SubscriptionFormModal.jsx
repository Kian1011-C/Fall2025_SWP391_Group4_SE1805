import React, { useState, useEffect } from 'react';

const SubscriptionFormModal = ({ isOpen, onClose, onSave, plan }) => {
  const [formData, setFormData] = useState({
    planName: '', 
    basePrice: '', 
    baseDistance: '', 
    depositFee: '', 
    description: '', 
    isUnlimited: false
  });
  
  const isEditing = !!plan;

  useEffect(() => {
    if (isOpen) {
      if (isEditing) {
        const isUnlimited = plan.isUnlimited || plan.baseDistance === -1;
        setFormData({
          planName: plan.planName || '',
          basePrice: plan.basePrice || '',
          baseDistance: isUnlimited ? '' : (plan.baseDistance || ''),
          depositFee: plan.depositFee || '',
          description: plan.description || '',
          isUnlimited: isUnlimited,
        });
      } else {
        setFormData({ 
          planName: '', 
          basePrice: '', 
          baseDistance: '', 
          depositFee: '', 
          description: '', 
          isUnlimited: false 
        });
      }
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
    
    // Validation
    if (!formData.planName.trim()) {
      alert('Vui lòng nhập tên gói cước!');
      return;
    }
    if (!formData.basePrice || formData.basePrice <= 0) {
      alert('Vui lòng nhập phí cơ bản hợp lệ!');
      return;
    }
    if (!formData.isUnlimited && (!formData.baseDistance || formData.baseDistance <= 0)) {
      alert('Vui lòng nhập quãng đường hợp lệ hoặc chọn không giới hạn!');
      return;
    }
    if (!formData.depositFee || formData.depositFee < 0) {
      alert('Vui lòng nhập phí đặt cọc hợp lệ!');
      return;
    }
    
    onSave(formData, plan?.planId);
  };

  if (!isOpen) return null;

  return (
    <div className="subscription-modal-overlay" onClick={onClose}>
      <div className="subscription-modal" onClick={e => e.stopPropagation()}>
        <form onSubmit={handleSubmit}>
          <div className="subscription-modal-header">
            <h2>{isEditing ? ' Chỉnh sửa Gói cước' : ' Tạo Gói cước Mới'}</h2>
          </div>
          
          <div className="subscription-modal-body">
            <div className="subscription-form-row">
              <div>
                <label className="subscription-form-label">Tên Gói cước *</label>
                <input 
                  type="text" 
                  name="planName" 
                  value={formData.planName} 
                  onChange={handleChange} 
                  className="subscription-form-input"
                  placeholder="Ví dụ: Gói Cơ bản, Gói Premium..."
                  required 
                />
              </div>
              <div>
                <label className="subscription-form-label">Phí đặt cọc (VNĐ) *</label>
                <input 
                  type="number" 
                  name="depositFee" 
                  value={formData.depositFee} 
                  onChange={handleChange} 
                  className="subscription-form-input"
                  placeholder="500000"
                  min="0"
                  required 
                />
              </div>
            </div>
            
            <div className="subscription-form-group">
              <label className="subscription-form-label">Mô tả</label>
              <textarea 
                name="description" 
                value={formData.description} 
                onChange={handleChange} 
                className="subscription-form-textarea"
                placeholder="Mô tả chi tiết về gói cước..."
                rows="3"
              />
            </div>
            
            <div className="subscription-form-row">
              <div>
                <label className="subscription-form-label">Phí cơ bản (VNĐ/tháng) *</label>
                <input 
                  type="number" 
                  name="basePrice" 
                  value={formData.basePrice} 
                  onChange={handleChange} 
                  className="subscription-form-input"
                  placeholder="350000"
                  min="0"
                  required 
                />
              </div>
              <div>
                <label className="subscription-form-label">Quãng đường cơ bản (km) *</label>
                <input 
                  type="number" 
                  name="baseDistance" 
                  value={formData.baseDistance} 
                  onChange={handleChange} 
                  className="subscription-form-input"
                  placeholder="400"
                  min="0"
                  disabled={formData.isUnlimited}
                  required={!formData.isUnlimited}
                />
              </div>
            </div>
            
            <div className="subscription-form-group">
              <div className="subscription-form-checkbox-container">
                <input 
                  type="checkbox" 
                  id="isUnlimited"
                  name="isUnlimited" 
                  checked={formData.isUnlimited} 
                  onChange={handleChange} 
                  className="subscription-form-checkbox"
                />
                <label htmlFor="isUnlimited" className="subscription-form-checkbox-label">
                   Không giới hạn quãng đường
                </label>
              </div>
            </div>
          </div>
          
          <div className="subscription-modal-footer">
            <button 
              type="button" 
              onClick={onClose} 
              className="subscription-modal-btn subscription-modal-btn-cancel"
            >
              Hủy
            </button>
            <button 
              type="submit" 
              className="subscription-modal-btn subscription-modal-btn-save"
            >
              {isEditing ? ' Cập nhật' : ' Tạo mới'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SubscriptionFormModal;