import React, { useState, useEffect } from 'react';

// Style chung
const inputStyle = { width: '100%', padding: '10px', background: '#374151', color: 'white', border: '1px solid #4b5563', borderRadius: '8px', boxSizing: 'border-box' };
const labelStyle = { display: 'block', marginBottom: '8px', color: '#9ca3af' };

const StationFormModal = ({ isOpen, onClose, onSave, station }) => {
  const [formData, setFormData] = useState({ name: '', location: '', status: 'active' });
  const isEditing = !!station;

  useEffect(() => {
    if (isEditing) {
      setFormData({
        name: station.name || '',
        location: station.address || station.location || '',
        status: station.status || 'active',
      });
    } else {
      setFormData({ name: '', location: '', status: 'active' });
    }
  }, [station, isEditing, isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Backend expects stationId for edit
    const stationId = station?.stationId || station?.id;
    onSave(formData, stationId);
  };

  if (!isOpen) return null;

  return (
    <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0, 0, 0, 0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }} onClick={onClose}>
      <div style={{ background: '#1f2937', borderRadius: '16px', width: '90%', maxWidth: '500px', border: '1px solid #374151' }} onClick={e => e.stopPropagation()}>
        <form onSubmit={handleSubmit}>
          <div style={{ padding: '20px', borderBottom: '1px solid #374151' }}>
            <h2 style={{ margin: 0, fontSize: '20px' }}>{isEditing ? 'Chỉnh sửa Trạm' : 'Tạo Trạm Mới'}</h2>
          </div>
          <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div>
              <label style={labelStyle}>Tên Trạm</label>
              <input type="text" name="name" value={formData.name} onChange={handleChange} style={inputStyle} required />
            </div>
            <div>
              <label style={labelStyle}>Địa chỉ</label>
              <input type="text" name="location" value={formData.location} onChange={handleChange} style={inputStyle} required />
            </div>
            <div>
              <label style={labelStyle}>Trạng thái</label>
              <select name="status" value={formData.status} onChange={handleChange} style={inputStyle}>
                <option value="active">Hoạt động</option>
                <option value="maintenance">Bảo trì</option>
                <option value="offline">Ngoại tuyến</option>
              </select>
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

export default StationFormModal;