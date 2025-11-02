// Driver/Subscriptions/components/SubscribeModal.jsx
// Modal for collecting contract information when subscribing to a plan

import React, { useState, useEffect } from 'react';
import vehicleService from '../../../../assets/js/services/vehicleService';
import { getUserId } from '../utils';

const SubscribeModal = ({ 
  show, 
  plan, 
  currentUser, 
  onClose, 
  onConfirm 
}) => {
  const [vehicles, setVehicles] = useState([]);
  const [loadingVehicles, setLoadingVehicles] = useState(false);
  const [selectedVehicleId, setSelectedVehicleId] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [signedPlace, setSignedPlace] = useState('Hà Nội');
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (show && currentUser) {
      fetchVehicles();
      
      // Set default dates: startDate = today, endDate = today + 1 year
      const today = new Date();
      const nextYear = new Date(today);
      nextYear.setFullYear(today.getFullYear() + 1);
      
      setStartDate(today.toISOString().split('T')[0]);
      setEndDate(nextYear.toISOString().split('T')[0]);
    }
  }, [show, currentUser]);

  const fetchVehicles = async () => {
    setLoadingVehicles(true);
    try {
      const userId = getUserId(currentUser);
      if (!userId) {
        throw new Error('Không tìm thấy User ID');
      }
      
      const response = await vehicleService.getUserVehicles(userId);
      if (response.success && response.data) {
        setVehicles(response.data);
        // Auto-select first vehicle if available
        if (response.data.length > 0) {
          const firstVehicleId = response.data[0].id || response.data[0].vehicleId || response.data[0].vehicle_id;
          if (firstVehicleId) {
            setSelectedVehicleId(String(firstVehicleId));
          }
        }
      }
    } catch (error) {
      console.error('Error fetching vehicles:', error);
      setErrors({ vehicles: 'Không thể tải danh sách xe. Vui lòng thử lại.' });
    } finally {
      setLoadingVehicles(false);
    }
  };

  const validate = () => {
    const newErrors = {};
    
    if (!selectedVehicleId) {
      newErrors.vehicleId = 'Vui lòng chọn xe';
    }
    
    if (!startDate) {
      newErrors.startDate = 'Vui lòng chọn ngày bắt đầu';
    } else {
      const start = new Date(startDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (start < today) {
        newErrors.startDate = 'Ngày bắt đầu không được là quá khứ';
      }
    }
    
    if (!endDate) {
      newErrors.endDate = 'Vui lòng chọn ngày kết thúc';
    } else {
      const end = new Date(endDate);
      const start = startDate ? new Date(startDate) : null;
      if (start && end < start) {
        newErrors.endDate = 'Ngày kết thúc phải sau ngày bắt đầu';
      }
    }

    if (!signedPlace || signedPlace.trim() === '') {
      newErrors.signedPlace = 'Vui lòng chọn nơi ký';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validate()) {
      return;
    }

    onConfirm({
      vehicleId: parseInt(selectedVehicleId),
      startDate: startDate,
      endDate: endDate,
      signedPlace: signedPlace.trim() || 'Hà Nội'
    });
  };

  if (!show) return null;

  return (
    <React.Fragment>
      {/* Style for select options to be visible on dark theme */}
      <style>{`
        /* Style for all select options */
        select option {
          background: #1a202c !important;
          color: #FFFFFF !important;
          padding: 10px !important;
        }
        /* Style for selected option */
        select option:checked,
        select option:hover {
          background: #2563eb !important;
          color: #FFFFFF !important;
        }
        /* Style for the select dropdown itself */
        select {
          appearance: none !important;
          -webkit-appearance: none !important;
          -moz-appearance: none !important;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23FFFFFF' d='M6 9L1 4h10z'/%3E%3C/svg%3E") !important;
          background-repeat: no-repeat !important;
          background-position: right 12px center !important;
          padding-right: 35px !important;
        }
      `}</style>
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
          📝 Đăng ký gói dịch vụ
        </h2>

        {plan && (
          <div style={{
            background: 'rgba(156, 163, 175, 0.1)',
            padding: '15px',
            borderRadius: '10px',
            marginBottom: '20px'
          }}>
            <div style={{ color: '#E0E0E0', fontWeight: '600', marginBottom: '5px' }}>
              Gói: {plan.name || plan.planName || 'N/A'}
            </div>
            <div style={{ color: '#9CA3AF', fontSize: '0.9rem' }}>
              Giá: {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(plan.monthlyFee || plan.fee || plan.price || 0)}
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* Vehicle Selection */}
          <div style={{ marginBottom: '20px' }}>
            <label style={{ color: '#E0E0E0', display: 'block', marginBottom: '8px' }}>
              Chọn xe *
            </label>
            {loadingVehicles ? (
              <div style={{ color: '#9CA3AF', padding: '10px' }}>Đang tải danh sách xe...</div>
            ) : vehicles.length === 0 ? (
              <div style={{ color: '#fecaca', padding: '10px', background: 'rgba(239, 68, 68, 0.1)', borderRadius: '8px' }}>
                ⚠️ Bạn chưa có xe nào. Vui lòng thêm xe trước khi đăng ký.
              </div>
            ) : (
              <select
                value={selectedVehicleId}
                onChange={(e) => setSelectedVehicleId(e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px',
                  background: 'rgba(255, 255, 255, 0.1)',
                  border: errors.vehicleId ? '1px solid #ef4444' : '1px solid rgba(255, 255, 255, 0.2)',
                  borderRadius: '8px',
                  color: '#FFFFFF',
                  fontSize: '1rem'
                }}
              >
                <option value="">-- Chọn xe --</option>
                {vehicles.map((vehicle) => {
                  const vehicleId = vehicle.id || vehicle.vehicleId || vehicle.vehicle_id;
                  const plateNumber = vehicle.plateNumber || vehicle.plate_number || 'N/A';
                  const model = vehicle.model || vehicle.vehicleModel || '';
                  return (
                    <option key={vehicleId} value={vehicleId}>
                      {plateNumber} {model ? `- ${model}` : ''}
                    </option>
                  );
                })}
              </select>
            )}
            {errors.vehicleId && (
              <div style={{ color: '#fecaca', fontSize: '0.85rem', marginTop: '4px' }}>
                {errors.vehicleId}
              </div>
            )}
          </div>

          {/* Start Date */}
          <div style={{ marginBottom: '20px' }}>
            <label style={{ color: '#E0E0E0', display: 'block', marginBottom: '8px' }}>
              Ngày bắt đầu *
            </label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              style={{
                width: '100%',
                padding: '12px',
                background: 'rgba(255, 255, 255, 0.1)',
                border: errors.startDate ? '1px solid #ef4444' : '1px solid rgba(255, 255, 255, 0.2)',
                borderRadius: '8px',
                color: '#FFFFFF',
                fontSize: '1rem'
              }}
            />
            {errors.startDate && (
              <div style={{ color: '#fecaca', fontSize: '0.85rem', marginTop: '4px' }}>
                {errors.startDate}
              </div>
            )}
          </div>

          {/* End Date */}
          <div style={{ marginBottom: '20px' }}>
            <label style={{ color: '#E0E0E0', display: 'block', marginBottom: '8px' }}>
              Ngày kết thúc *
            </label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              min={startDate}
              style={{
                width: '100%',
                padding: '12px',
                background: 'rgba(255, 255, 255, 0.1)',
                border: errors.endDate ? '1px solid #ef4444' : '1px solid rgba(255, 255, 255, 0.2)',
                borderRadius: '8px',
                color: '#FFFFFF',
                fontSize: '1rem'
              }}
            />
            {errors.endDate && (
              <div style={{ color: '#fecaca', fontSize: '0.85rem', marginTop: '4px' }}>
                {errors.endDate}
              </div>
            )}
          </div>

          {/* Signed Place */}
          <div style={{ marginBottom: '25px' }}>
            <label style={{ color: '#E0E0E0', display: 'block', marginBottom: '8px' }}>
              Nơi ký hợp đồng *
            </label>
            <select
              value={signedPlace}
              onChange={(e) => setSignedPlace(e.target.value)}
              style={{
                width: '100%',
                padding: '12px',
                background: 'rgba(255, 255, 255, 0.1)',
                border: errors.signedPlace ? '1px solid #ef4444' : '1px solid rgba(255, 255, 255, 0.2)',
                borderRadius: '8px',
                color: '#FFFFFF',
                fontSize: '1rem'
              }}
            >
              <option value="Hà Nội">Hà Nội</option>
              <option value="Hồ Chí Minh">Hồ Chí Minh</option>
              <option value="Đà Nẵng">Đà Nẵng</option>
              <option value="Hải Phòng">Hải Phòng</option>
              <option value="Cần Thơ">Cần Thơ</option>
              <option value="An Giang">An Giang</option>
              <option value="Bà Rịa - Vũng Tàu">Bà Rịa - Vũng Tàu</option>
              <option value="Bạc Liêu">Bạc Liêu</option>
              <option value="Bắc Giang">Bắc Giang</option>
              <option value="Bắc Kạn">Bắc Kạn</option>
              <option value="Bắc Ninh">Bắc Ninh</option>
              <option value="Bến Tre">Bến Tre</option>
              <option value="Bình Định">Bình Định</option>
              <option value="Bình Dương">Bình Dương</option>
              <option value="Bình Phước">Bình Phước</option>
              <option value="Bình Thuận">Bình Thuận</option>
              <option value="Cà Mau">Cà Mau</option>
              <option value="Cao Bằng">Cao Bằng</option>
              <option value="Đắk Lắk">Đắk Lắk</option>
              <option value="Đắk Nông">Đắk Nông</option>
              <option value="Điện Biên">Điện Biên</option>
              <option value="Đồng Nai">Đồng Nai</option>
              <option value="Đồng Tháp">Đồng Tháp</option>
              <option value="Gia Lai">Gia Lai</option>
              <option value="Hà Giang">Hà Giang</option>
              <option value="Hà Nam">Hà Nam</option>
              <option value="Hà Tĩnh">Hà Tĩnh</option>
              <option value="Hải Dương">Hải Dương</option>
              <option value="Hậu Giang">Hậu Giang</option>
              <option value="Hòa Bình">Hòa Bình</option>
              <option value="Hưng Yên">Hưng Yên</option>
              <option value="Khánh Hòa">Khánh Hòa</option>
              <option value="Kiên Giang">Kiên Giang</option>
              <option value="Kon Tum">Kon Tum</option>
              <option value="Lai Châu">Lai Châu</option>
              <option value="Lâm Đồng">Lâm Đồng</option>
              <option value="Lạng Sơn">Lạng Sơn</option>
              <option value="Lào Cai">Lào Cai</option>
              <option value="Long An">Long An</option>
              <option value="Nam Định">Nam Định</option>
              <option value="Nghệ An">Nghệ An</option>
              <option value="Ninh Bình">Ninh Bình</option>
              <option value="Ninh Thuận">Ninh Thuận</option>
              <option value="Phú Thọ">Phú Thọ</option>
              <option value="Phú Yên">Phú Yên</option>
              <option value="Quảng Bình">Quảng Bình</option>
              <option value="Quảng Nam">Quảng Nam</option>
              <option value="Quảng Ngãi">Quảng Ngãi</option>
              <option value="Quảng Ninh">Quảng Ninh</option>
              <option value="Quảng Trị">Quảng Trị</option>
              <option value="Sóc Trăng">Sóc Trăng</option>
              <option value="Sơn La">Sơn La</option>
              <option value="Tây Ninh">Tây Ninh</option>
              <option value="Thái Bình">Thái Bình</option>
              <option value="Thái Nguyên">Thái Nguyên</option>
              <option value="Thanh Hóa">Thanh Hóa</option>
              <option value="Thừa Thiên Huế">Thừa Thiên Huế</option>
              <option value="Tiền Giang">Tiền Giang</option>
              <option value="Trà Vinh">Trà Vinh</option>
              <option value="Tuyên Quang">Tuyên Quang</option>
              <option value="Vĩnh Long">Vĩnh Long</option>
              <option value="Vĩnh Phúc">Vĩnh Phúc</option>
              <option value="Yên Bái">Yên Bái</option>
            </select>
            {errors.signedPlace && (
              <div style={{ color: '#fecaca', fontSize: '0.85rem', marginTop: '4px' }}>
                {errors.signedPlace}
              </div>
            )}
          </div>

          {/* Buttons */}
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
              disabled={loadingVehicles || vehicles.length === 0}
              style={{
                flex: 1,
                padding: '12px',
                background: (loadingVehicles || vehicles.length === 0) ? '#666' : 'linear-gradient(135deg, #19c37d, #15a36a)',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: (loadingVehicles || vehicles.length === 0) ? 'not-allowed' : 'pointer',
                fontSize: '1rem',
                fontWeight: '600'
              }}
            >
              {loadingVehicles ? 'Đang tải...' : 'Xác nhận đăng ký'}
            </button>
          </div>
        </form>
      </div>
      </div>
    </React.Fragment>
  );
};

export default SubscribeModal;

