import React, { useState, useEffect } from 'react';

// Style chung
const inputStyle = { width: '100%', padding: '10px', background: '#374151', color: 'white', border: '1px solid #4b5563', borderRadius: '8px', boxSizing: 'border-box' };
const labelStyle = { display: 'block', marginBottom: '8px', color: '#9ca3af' };

const TowerFormModal = ({ isOpen, onClose, onSave, tower, stationName }) => {
  const [formData, setFormData] = useState({ status: 'active', numberOfSlots: 8 });
  const isEditing = !!tower;

  useEffect(() => {
    if (isEditing) {
      setFormData({
        status: tower.status || 'active',
        numberOfSlots: tower.totalSlots || 8,
      });
    } else {
      setFormData({ status: 'active', numberOfSlots: 8 });
    }
  }, [tower, isEditing, isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const towerId = tower?.towerId || tower?.id;
    onSave(formData, towerId);
  };

  if (!isOpen) return null;

  return (
    <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0, 0, 0, 0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }} onClick={onClose}>
      <div style={{ background: '#1f2937', borderRadius: '16px', width: '90%', maxWidth: '500px', border: '1px solid #374151' }} onClick={e => e.stopPropagation()}>
        <form onSubmit={handleSubmit}>
          <div style={{ padding: '20px', borderBottom: '1px solid #374151' }}>
            <h2 style={{ margin: 0, fontSize: '20px' }}>
              {isEditing ? `Chỉnh sửa Trụ ${tower?.towerNumber}` : `Thêm Trụ Mới - ${stationName}`}
            </h2>
          </div>
          <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {!isEditing && (
              <div>
                <label style={labelStyle}>Số hộc (Slots)</label>
                <input 
                  type="number" 
                  name="numberOfSlots" 
                  value={formData.numberOfSlots} 
                  onChange={handleChange} 
                  style={inputStyle} 
                  min="1"
                  max="20"
                  required 
                />
                <small style={{ color: '#9ca3af', marginTop: '4px', display: 'block' }}>
                  Số lượng hộc pin trong trụ (1-20)
                </small>
              </div>
            )}
            <div>
              <label style={labelStyle}>Trạng thái</label>
              <select name="status" value={formData.status} onChange={handleChange} style={inputStyle}>
                <option value="active">Hoạt động</option>
                <option value="maintenance">Bảo trì</option>
                <option value="offline">Ngoại tuyến</option>
              </select>
            </div>
            {isEditing && (
              <div style={{ padding: '12px', background: '#374151', borderRadius: '8px' }}>
                <p style={{ margin: 0, color: '#9ca3af', fontSize: '14px' }}>
                  <strong>Thông tin:</strong><br/>
                  Trụ số: {tower?.towerNumber}<br/>
                  Tổng hộc: {tower?.totalSlots}<br/>
                  Hộc trống: {tower?.emptySlots}
                </p>
              </div>
            )}
          </div>
          <div style={{ padding: '20px', background: '#111827', borderTop: '1px solid #374151', borderRadius: '0 0 16px 16px', display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
            <button type="button" onClick={onClose} style={{ background: '#374151', color: 'white', border: 'none', padding: '10px 15px', borderRadius: '8px', cursor: 'pointer' }}>Hủy</button>
            <button type="submit" style={{ background: '#f59e0b', color: '#111827', border: 'none', padding: '10px 15px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>
              {isEditing ? 'Cập nhật' : 'Thêm Trụ'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TowerFormModal;
