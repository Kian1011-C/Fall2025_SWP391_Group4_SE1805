// Add Vehicle Modal Component
import React from 'react';

const AddVehicleModal = ({ 
  show, 
  onClose, 
  formData, 
  setFormData, 
  onSubmit, 
  loading 
}) => {
  if (!show) return null;

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
        <h2 style={{ color: '#FFFFFF', marginBottom: '25px', display: 'flex', alignItems: 'center', gap: '10px' }}>
          🚗 Thêm phương tiện mới
        </h2>
        
        <form onSubmit={onSubmit}>
          <div style={{ marginBottom: '20px' }}>
            <label style={{ color: '#E0E0E0', display: 'block', marginBottom: '8px' }}>
              Biển số xe *
            </label>
            <input
              type="text"
              value={formData.plateNumber}
              onChange={(e) => setFormData({ ...formData, plateNumber: e.target.value })}
              required
              placeholder="VD: 30A-12345"
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

          <div style={{ marginBottom: '20px' }}>
            <label style={{ color: '#E0E0E0', display: 'block', marginBottom: '8px' }}>
              Model xe *
            </label>
            <input
              type="text"
              value={formData.vehicleModel}
              onChange={(e) => setFormData({ ...formData, vehicleModel: e.target.value })}
              required
              placeholder="VD: VinFast VF-8"
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

          <div style={{ marginBottom: '20px' }}>
            <label style={{ color: '#E0E0E0', display: 'block', marginBottom: '8px' }}>
              Số VIN *
            </label>
            <input
              type="text"
              value={formData.vinNumber}
              onChange={(e) => setFormData({ ...formData, vinNumber: e.target.value })}
              required
              placeholder="VD: VF1234567890ABCDE"
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

          <div style={{ marginBottom: '25px' }}>
            <label style={{ color: '#E0E0E0', display: 'block', marginBottom: '8px' }}>
              Loại pin
            </label>
            <select
              value={formData.batteryType}
              onChange={(e) => setFormData({ ...formData, batteryType: e.target.value })}
              style={{
                width: '100%',
                padding: '12px',
                background: 'rgba(255, 255, 255, 0.1)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                borderRadius: '8px',
                color: '#FFFFFF',
                fontSize: '1rem'
              }}
            >
              <option value="LiFePO4-60kWh">LiFePO4-60kWh</option>
              <option value="LiFePO4-70kWh">LiFePO4-70kWh</option>
              <option value="LiFePO4-50kWh">LiFePO4-50kWh</option>
              <option value="Li-ion-80kWh">Li-ion-80kWh</option>
            </select>
          </div>

          <div style={{
            background: 'rgba(255, 165, 0, 0.1)',
            border: '1px solid rgba(255, 165, 0, 0.3)',
            borderRadius: '8px',
            padding: '12px',
            marginBottom: '20px'
          }}>
            <div style={{ color: '#ffa500', fontSize: '0.9rem' }}>
              ℹ️ <strong>Lưu ý:</strong> Yêu cầu thêm xe sẽ được gửi đến admin để xem xét và phê duyệt.
            </div>
          </div>

          <div style={{ display: 'flex', gap: '10px' }}>
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
                fontSize: '1rem'
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
              {loading ? 'Đang gửi...' : '➕ Gửi yêu cầu'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddVehicleModal;
