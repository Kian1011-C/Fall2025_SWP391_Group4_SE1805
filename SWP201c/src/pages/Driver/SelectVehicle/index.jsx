// Driver/SelectVehicle/index.jsx
// Simple selection screen to choose an active vehicle before entering dashboard
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import DashboardLayout from '../../../layouts/DashboardLayout';
import { vehicleService } from '../../../assets/js/services';

const SelectVehiclePage = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let isMounted = true;
    const fetchData = async () => {
      try {
        setLoading(true);
        setError('');
        const res = await vehicleService.getUserVehicles(currentUser?.id || currentUser?.user_id);
        if (isMounted) {
          const list = Array.isArray(res.data) ? res.data : (res.data?.vehicles || []);
          setVehicles(list);
        }
      } catch (e) {
        if (isMounted) setError('Không thể tải danh sách phương tiện');
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    fetchData();
    return () => { isMounted = false; };
  }, [currentUser]);

  const handleSelect = (v) => {
    try {
      sessionStorage.setItem('selectedVehicle', JSON.stringify(v));
    } catch {}
    navigate('/driver/dashboard', { replace: true });
  };

  return (
    <DashboardLayout role="driver">
      <div style={{ padding: '24px' }}>
        <h2 style={{ marginBottom: '16px' }}>Chọn phương tiện để tiếp tục</h2>
        {loading && <div style={{ color: '#999' }}>Đang tải danh sách xe...</div>}
        {error && <div style={{ color: '#f44336', marginBottom: '12px' }}>{error}</div>}
        {!loading && vehicles.length === 0 && (
          <div style={{ color: '#999' }}>Bạn chưa có phương tiện nào. Hãy thêm xe trong mục Phương tiện.</div>
        )}
        <div style={{ display: 'grid', gap: '12px' }}>
          {vehicles.map((v, idx) => (
            <button
              key={v.id || v.vehicle_id || idx}
              onClick={() => handleSelect(v)}
              style={{
                textAlign: 'left',
                padding: '16px',
                borderRadius: '10px',
                border: '1px solid rgba(255,255,255,0.12)',
                background: 'rgba(255,255,255,0.04)',
                cursor: 'pointer'
              }}
            >
              <div style={{ fontWeight: 600 }}>
                {v.plateNumber || v.license_plate || v.licensePlate || 'N/A'}
              </div>
              <div style={{ fontSize: '13px', color: '#B0B0B0' }}>
                Loại: {v.model || v.vehicleModel || 'N/A'} — Pin: {v.health ?? v.batteryLevel ?? v.battery_level ?? 'N/A'}%
              </div>
            </button>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default SelectVehiclePage;


