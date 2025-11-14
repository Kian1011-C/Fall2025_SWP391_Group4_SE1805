// Driver/Dashboard/components/SelectVehicleModal.jsx
import React from 'react';

const SelectVehicleModal = ({ vehicles = [], onSelect, vehicleBatteryInfo = {} }) => {
  return (
    <div
      className="modal-overlay scroll-follow"
      style={{
        backdropFilter: 'blur(2px)',
        background: 'rgba(0,0,0,0.55)'
      }}
    >
      <div
        className="modal-container"
        style={{
          maxWidth: 960,
          width: '95vw',
          color: '#E8EAF6',
          background: 'linear-gradient(180deg, #111827 0%, #0b1222 100%)',
          border: '1px solid rgba(255,255,255,0.08)',
          boxShadow: '0 20px 60px rgba(0,0,0,0.5)'
        }}
      >
        <div className="modal-header" style={{ borderBottom: '1px solid rgba(255,255,255,0.08)', padding: '16px 20px' }}>
          <h2 className="modal-title" style={{ color: '#FFFFFF', fontSize: 24, fontWeight: 800 }}>
             Chọn phương tiện để tiếp tục
          </h2>
        </div>
        <div style={{ display: 'grid', gap: '16px', padding: '16px 20px' }}>
          {vehicles.map((v, idx) => (
            <button
              key={v.id || v.vehicle_id || idx}
              onClick={() => onSelect(v)}
              className="modal-btn"
              style={{
                textAlign: 'left',
                background: 'rgba(30,41,59,0.6)',
                border: '1px solid rgba(148,163,184,0.24)',
                borderRadius: 16,
                padding: 22,
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                color: '#F1F5F9'
              }}
            >
              <div>
                <div style={{ fontWeight: 800, fontSize: 18, color: '#FFFFFF' }}>
                  {v.plateNumber || v.license_plate || v.licensePlate || 'N/A'}
                </div>
                <div style={{ fontSize: 14, color: '#CBD5E1' }}>
                  Loại: {v.model || v.vehicleModel || 'N/A'} — ID pin: {v.batteryId || v.battery_id || v.currentBatteryId || v.current_battery_id || vehicleBatteryInfo[v.id || v.vehicle_id || v.vehicleId] || 'N/A'}
                </div>
              </div>
              <span style={{ color: '#93C5FD', fontWeight: 700, fontSize: 16 }}>Chọn →</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SelectVehicleModal;


