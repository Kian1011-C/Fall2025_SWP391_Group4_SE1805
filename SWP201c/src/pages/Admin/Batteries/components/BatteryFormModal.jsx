import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import './BatteryFormModal.css';

const BatteryFormModal = ({ isOpen, onClose, onSave, battery }) => {
  const [formData, setFormData] = useState({ model: '', capacity: 100, stateOfHealth: 100, cycleCount: 0, status: 'available' });
  const isEditing = !!battery;

  console.log('🔵 BatteryFormModal render:', { isOpen, isEditing, battery, formData });

  useEffect(() => {
    console.log('🔵 BatteryFormModal useEffect triggered:', { isOpen, isEditing, battery });
    if (isEditing) {
      setFormData({
        model: battery.model || '',
        capacity: battery.capacity || 100,
        stateOfHealth: battery.stateOfHealth || 100,
        cycleCount: battery.cycleCount || 0,
        status: (battery.status || 'available').toLowerCase(),
      });
    } else {
      // Reset form khi mở modal để "Tạo mới"
      setFormData({ model: '', capacity: 100, stateOfHealth: 100, cycleCount: 0, status: 'available' });
    }
  }, [battery, isEditing, isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('🔵 BatteryFormModal: Submit form');
    console.log('  ├─ isEditing:', isEditing);
    console.log('  ├─ batteryId:', battery?.batteryId);
    console.log('  ├─ formData:', formData);
    
    // Convert sang kiểu dữ liệu đúng
    const submitData = {
      model: formData.model,
      capacity: parseInt(formData.capacity, 10),
      stateOfHealth: parseFloat(formData.stateOfHealth),
      cycleCount: parseInt(formData.cycleCount, 10) || 0,
      status: formData.status
    };
    
    console.log('  └─ submitData (converted):', submitData);
    
    onSave(submitData, battery?.batteryId);
  };

  if (!isOpen) {
    console.log('🔵 BatteryFormModal: Modal is CLOSED, returning null');
    return null;
  }

  console.log('🔵 BatteryFormModal: Modal is OPEN, rendering with Portal...');

  const modalContent = (
    <div className="battery-modal-overlay" onClick={(e) => {
      console.log('🔵 Clicked on overlay');
      onClose();
    }}>
      <div className="battery-modal-content" onClick={(e) => {
        console.log('🔵 Clicked on modal content (should not close)');
        e.stopPropagation();
      }}>
        <form onSubmit={handleSubmit}>
          <div className="battery-modal-header">
            <h2>{isEditing ? 'Chỉnh sửa Pin' : 'Tạo Pin Mới'}</h2>
          </div>
          <div className="battery-modal-body">
            <div>
              <label className="battery-form-label">Mẫu Pin (Model) *</label>
              <input 
                type="text" 
                name="model" 
                value={formData.model} 
                onChange={handleChange} 
                className="battery-form-input"
                required 
                placeholder="VD: VinFast VF-e34 Battery" 
              />
            </div>
            <div>
              <label className="battery-form-label">Dung lượng (Capacity kWh) *</label>
              <input 
                type="number" 
                name="capacity" 
                value={formData.capacity} 
                onChange={handleChange} 
                className="battery-form-input"
                required 
                min="1" 
                placeholder="VD: 100" 
              />
            </div>
            <div>
              <label className="battery-form-label">Sức khỏe (State of Health %) *</label>
              <input 
                type="number" 
                name="stateOfHealth" 
                value={formData.stateOfHealth} 
                onChange={handleChange} 
                className="battery-form-input"
                required 
                min="0" 
                max="100" 
                step="0.1" 
                placeholder="VD: 95.5" 
              />
            </div>
            <div>
              <label className="battery-form-label">Chu kỳ sạc (Cycle Count)</label>
              <input 
                type="number" 
                name="cycleCount" 
                value={formData.cycleCount} 
                onChange={handleChange} 
                className="battery-form-input"
                min="0" 
                placeholder="VD: 150" 
              />
            </div>
            <div>
              <label className="battery-form-label">Trạng thái *</label>
              <select 
                name="status" 
                value={formData.status?.toLowerCase() || ''} 
                onChange={handleChange} 
                className="battery-form-input"
                required
              >
                <option value="available">Sẵn sàng (Available)</option>
                <option value="charging">Đang sạc (Charging)</option>
                <option value="faulty">Bảo trì (Maintenance)</option>
                <option value="in_use">Đang sử dụng (In Use)</option>
                <option value="in_stock">Trong kho (In Stock)</option>
              </select>
            </div>
          </div>
          <div className="battery-modal-footer">
            <button type="button" onClick={onClose} className="battery-modal-btn battery-modal-btn-cancel">
              Hủy
            </button>
            <button type="submit" className="battery-modal-btn battery-modal-btn-save">
              Lưu
            </button>
          </div>
        </form>
      </div>
    </div>
  );

  // Render modal vào document.body để tránh bị che bởi AdminLayout
  return createPortal(modalContent, document.body);
};

export default BatteryFormModal;