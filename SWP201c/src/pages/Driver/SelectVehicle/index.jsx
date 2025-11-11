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
  const [vehicleBatteryInfo, setVehicleBatteryInfo] = useState({}); // Lưu thông tin pin của từng xe

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
          
          // Lấy thông tin pin cho từng xe nếu không có sẵn
          const batteryInfoMap = {};
          for (const vehicle of list) {
            const vehicleId = vehicle.id || vehicle.vehicle_id || vehicle.vehicleId;
            if (vehicleId && !vehicle.batteryId && !vehicle.battery_id && !vehicle.currentBatteryId && !vehicle.current_battery_id) {
              try {
                console.log('🔋 Lấy thông tin pin cho xe:', vehicleId);
                const batteryResponse = await vehicleService.getVehicleBatteryInfo(vehicleId);
                if (batteryResponse.success && batteryResponse.data) {
                  batteryInfoMap[vehicleId] = batteryResponse.data.batteryId || batteryResponse.data.id;
                  console.log('✅ Lấy được batteryId cho xe', vehicleId, ':', batteryInfoMap[vehicleId]);
                }
              } catch (err) {
                console.warn('⚠️ Không thể lấy thông tin pin cho xe', vehicleId, ':', err);
              }
            }
          }
          setVehicleBatteryInfo(batteryInfoMap);
        }
      } catch (error) {
        console.error('Lỗi khi tải danh sách xe:', error);
        if (isMounted) setError('Không thể tải danh sách phương tiện');
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    fetchData();
    return () => { isMounted = false; };
  }, [currentUser]);

  const handleSelect = async (v) => {
    try {
      // Lưu thông tin xe đã chọn
      sessionStorage.setItem('selectedVehicle', JSON.stringify(v));
      
      // Lưu thông tin xe đã chọn (chỉ 1 lần duy nhất)
      const vehicleId = v.id || v.vehicle_id || v.vehicleId;
      const batteryId = v.batteryId || v.battery_id || v.currentBatteryId || v.current_battery_id;
      const contractId = v.contractId || v.contract_id || v.activeContractId;
      
      // Debug dữ liệu xe
      console.log('🔍 Dữ liệu xe được chọn:', v);
      console.log('🔍 vehicleId:', vehicleId);
      console.log('🔍 batteryId:', batteryId);
      console.log('🔍 batteryId type:', typeof batteryId);
      console.log('🔍 batteryId is null:', batteryId === null);
      console.log('🔍 batteryId is undefined:', batteryId === undefined);
      console.log('🔍 contractId:', contractId);
      
      // Lưu vehicleId
      if (vehicleId) {
        sessionStorage.setItem('vehicleId', String(vehicleId));
      }
      
      // Lưu old_battery_id (pin hiện tại trên xe) - SỬ DỤNG DỮ LIỆU THẬT TỪ API
      try {
        console.log('🔋 Gọi API lấy pin cũ cho xe:', vehicleId);
        const batteryResponse = await vehicleService.getVehicleBatteryInfo(vehicleId);
        console.log('🔋 API response pin cũ:', batteryResponse);
        
        if (batteryResponse.success && batteryResponse.data) {
          const realOldBatteryId = batteryResponse.data.batteryId || batteryResponse.data.id || batteryId;
          console.log('🔍 realOldBatteryId:', realOldBatteryId);
          console.log('🔍 batteryResponse.data:', batteryResponse.data);
          
          if (realOldBatteryId) {
            sessionStorage.setItem('old_battery_id', String(realOldBatteryId));
            console.log('✅ Đã lưu old_battery_id từ API backend:', realOldBatteryId);
          } else if (batteryId) {
            sessionStorage.setItem('old_battery_id', String(batteryId));
            console.log('✅ Sử dụng batteryId từ xe đã chọn:', batteryId);
          }
        } else if (batteryId) {
          sessionStorage.setItem('old_battery_id', String(batteryId));
          console.log('⚠️ API response không thành công, sử dụng dữ liệu từ xe đã chọn');
        }
      } catch (error) {
        console.error('❌ Lỗi khi lấy pin cũ từ API:', error);
        if (batteryId) {
          sessionStorage.setItem('old_battery_id', String(batteryId));
          console.log('⚠️ Sử dụng batteryId từ xe đã chọn');
        }
      }
      
      // Lưu contractId - SỬ DỤNG DỮ LIỆU THẬT
      if (contractId) {
        sessionStorage.setItem('contractId', String(contractId));
        console.log('Lưu contractId thật từ API:', contractId);
      } else {
        console.warn('Xe không có thông tin contract, cần kiểm tra API response');
        // Không lưu gì nếu không có dữ liệu thật
      }
      
      console.log('Đã lưu thông tin xe (dữ liệu thật từ API):', {
        vehicleId: vehicleId,
        batteryId: batteryId,
        contractId: contractId,
        vehicle: v
      });
      
    } catch (error) {
      console.error('Lỗi khi lưu thông tin xe:', error);
    }
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
                Loại: {v.model || v.vehicleModel || 'N/A'} — ID pin: {v.batteryId || v.battery_id || v.currentBatteryId || v.current_battery_id || vehicleBatteryInfo[v.id || v.vehicle_id || v.vehicleId] || 'N/A'}
              </div>
            </button>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default SelectVehiclePage;


