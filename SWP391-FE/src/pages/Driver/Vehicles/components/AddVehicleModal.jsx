// Add Vehicle Modal Component
import React from 'react';

const AddVehicleModal = ({ 
  show, 
  onClose, 
  formData, 
  formErrors,
  onUpdateField,
  onSubmit, 
  submitting 
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
           Thêm phương tiện mới
        </h2>
        
        {/* Hiển thị lỗi submit nếu có */}
        {formErrors?.submit && (
          <div style={{
            background: 'rgba(239, 68, 68, 0.2)',
            border: '1px solid rgba(239, 68, 68, 0.5)',
            color: '#fecaca',
            padding: '12px',
            borderRadius: '8px',
            marginBottom: '20px',
            fontSize: '0.9rem'
          }}>
             {formErrors.submit}
          </div>
        )}
        
        <form onSubmit={(e) => {
          e.preventDefault();
          onSubmit(e);
        }}>
          <div style={{ marginBottom: '20px' }}>
            <label style={{ color: '#E0E0E0', display: 'block', marginBottom: '8px' }}>
              Biển số xe *
            </label>
            <input
              type="text"
              value={formData.plateNumber || ''}
              onChange={(e) => onUpdateField('plateNumber', e.target.value)}
              required
              placeholder="VD: 30A-12345"
              style={{
                width: '100%',
                padding: '12px',
                background: 'rgba(255, 255, 255, 0.1)',
                border: formErrors?.plateNumber ? '1px solid #ef4444' : '1px solid rgba(255, 255, 255, 0.2)',
                borderRadius: '8px',
                color: '#FFFFFF',
                fontSize: '1rem'
              }}
            />
            {formErrors?.plateNumber && (
              <div style={{ color: '#fecaca', fontSize: '0.85rem', marginTop: '4px' }}>
                {formErrors.plateNumber}
              </div>
            )}
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{ color: '#E0E0E0', display: 'block', marginBottom: '8px' }}>
              Model xe *
            </label>
            <input
              type="text"
              value={formData.vehicleModel || ''}
              onChange={(e) => onUpdateField('vehicleModel', e.target.value)}
              required
              placeholder="VD: VinFast VF-8"
              style={{
                width: '100%',
                padding: '12px',
                background: 'rgba(255, 255, 255, 0.1)',
                border: formErrors?.vehicleModel ? '1px solid #ef4444' : '1px solid rgba(255, 255, 255, 0.2)',
                borderRadius: '8px',
                color: '#FFFFFF',
                fontSize: '1rem'
              }}
            />
            {formErrors?.vehicleModel && (
              <div style={{ color: '#fecaca', fontSize: '0.85rem', marginTop: '4px' }}>
                {formErrors.vehicleModel}
              </div>
            )}
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{ color: '#E0E0E0', display: 'block', marginBottom: '8px' }}>
              Số VIN *
            </label>
            <input
              type="text"
              value={formData.vinNumber || ''}
              onChange={(e) => onUpdateField('vinNumber', e.target.value)}
              required
              placeholder="VD: VF1234567890ABCDE"
              style={{
                width: '100%',
                padding: '12px',
                background: 'rgba(255, 255, 255, 0.1)',
                border: formErrors?.vinNumber ? '1px solid #ef4444' : '1px solid rgba(255, 255, 255, 0.2)',
                borderRadius: '8px',
                color: '#FFFFFF',
                fontSize: '1rem'
              }}
            />
            {formErrors?.vinNumber && (
              <div style={{ color: '#fecaca', fontSize: '0.85rem', marginTop: '4px' }}>
                {formErrors.vinNumber}
              </div>
            )}
          </div>

          <div style={{ marginBottom: '25px' }}>
            <label style={{ color: '#E0E0E0', display: 'block', marginBottom: '8px' }}>
              Loại pin (Tùy chọn)
            </label>
            <select
              value={formData.batteryType || 'LiFePO4-60kWh'}
              onChange={(e) => onUpdateField('batteryType', e.target.value)}
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
            <div style={{ color: '#9ca3af', fontSize: '0.85rem', marginTop: '4px' }}>
              ⓘ Loại pin sẽ được cấu hình sau khi đăng ký xe thành công
            </div>
          </div>

          <div style={{
            background: 'rgba(34, 197, 94, 0.1)',
            border: '1px solid rgba(34, 197, 94, 0.3)',
            borderRadius: '8px',
            padding: '12px',
            marginBottom: '20px'
          }}>
            <div style={{ color: '#22c55e', fontSize: '0.9rem' }}>
               <strong>Thông tin:</strong> Xe sẽ được đăng ký ngay sau khi bạn nhấn "Đăng ký xe".
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
              disabled={submitting}
              style={{
                flex: 1,
                padding: '12px',
                background: submitting ? '#666' : 'linear-gradient(135deg, #19c37d, #15a36a)',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: submitting ? 'not-allowed' : 'pointer',
                fontSize: '1rem',
                fontWeight: '600'
              }}
            >
              {submitting ? 'Đang đăng ký...' : ' Đăng ký xe'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddVehicleModal;
