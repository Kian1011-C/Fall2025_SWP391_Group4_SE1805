// Driver Vehicle Management
// Vehicle registration, battery status, maintenance

import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../layouts/DashboardLayout';
import { useAuth } from '../../context/AuthContext';
import userService from '../../assets/js/services/userService';
import { normalizeVehicleData } from '../../assets/js/utils/apiHelpers';
import { API_CONFIG } from '../../assets/js/config/api';

const DriverVehicles = () => {
  const { currentUser } = useAuth();
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [formData, setFormData] = useState({
    vehicleType: 'motorcycle',
    brand: '',
    model: '',
    licensePlate: '',
    batteryCapacity: ''
  });

  useEffect(() => {
    fetchVehicles();
  }, []);

  const fetchVehicles = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('🚗 DriverVehicles: Starting fetch...');
      
      if (!currentUser) {
        console.log('❌ No current user found');
        setVehicles([]);
        return;
      }
      
      // Get userId for API call
      const userId = currentUser.id || currentUser.user_id || currentUser.userId;
      console.log('🆔 Using userId for API:', userId);
      
      if (!userId) {
        console.log('❌ No valid userId found');
        setVehicles([]);
        return;
      }

      // Call API
      const userResponse = await userService.getUserById(userId);
      console.log('📡 Full API Response:', userResponse);
      
      if (userResponse.success && userResponse.data) {
        const userData = userResponse.data;
        console.log('� User data received:', userData);
        
        // Extract vehicles from API response
        const userVehicles = userData.vehicles || [];
        console.log('🚗 Raw vehicles from API:', userVehicles);
        
        console.log('🚗 Raw vehicles before normalize:', userVehicles);
        
        // Normalize vehicle data but preserve vehicleModel
        const normalizedVehicles = userVehicles.map(vehicle => ({
          ...vehicle,
          // Keep all original fields and add normalized ones
          id: vehicle.vehicleId || vehicle.id,
          plateNumber: vehicle.plateNumber || vehicle.licensePlate,
          currentOdometer: vehicle.currentOdometer || vehicle.current_odometer || 0,
          batteryLevel: vehicle.health || vehicle.batteryLevel || 85,
          // Preserve vehicleModel specifically
          vehicleModel: vehicle.vehicleModel,
          model: vehicle.model || vehicle.vehicleModel
        }));
        
        console.log('✅ Normalized vehicles:', normalizedVehicles);
        
        // Debug: Log each vehicle structure
        normalizedVehicles.forEach((vehicle, index) => {
          console.log(`🚗 Vehicle ${index + 1}:`, {
            vehicleModel: vehicle.vehicleModel,
            model: vehicle.model,
            plateNumber: vehicle.plateNumber,
            health: vehicle.health,
            batteryModel: vehicle.batteryModel,
            originalVehicleModel: userVehicles[index]?.vehicleModel
          });
        });
        
        setVehicles(normalizedVehicles);
      } else {
        console.log('❌ API response indicates failure or no data');
        console.log('Response structure:', userResponse);
        throw new Error(userResponse.message || 'API không trả về dữ liệu hợp lệ');
      }
    } catch (err) {
      console.error('❌ Error fetching vehicles:', err);
      setError('Lỗi khi tải danh sách phương tiện: ' + err.message);
      setVehicles([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      
      // Note: Backend cần API POST /api/vehicles
      alert('Backend cần implement API POST /api/vehicles để thêm phương tiện');
      
      setShowAddModal(false);
      setFormData({
        vehicleType: 'motorcycle',
        brand: '',
        model: '',
        licensePlate: '',
        batteryCapacity: ''
      });
    } catch (err) {
      alert('Có lỗi xảy ra: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (vehicleId) => {
    if (!window.confirm('Bạn có chắc muốn xóa phương tiện này?')) return;
    
    try {
      setLoading(true);
      // Note: Backend cần API DELETE /api/vehicles/:id
      alert('Backend cần implement API DELETE /api/vehicles/:id');
    } catch (err) {
      alert('Có lỗi xảy ra: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading && vehicles.length === 0) {
    return (
      <DashboardLayout role="driver">
        <div style={{ padding: '20px', textAlign: 'center' }}>
          <div style={{ color: '#19c37d', fontSize: '1.5rem' }}>⏳ Đang tải danh sách xe...</div>
        </div>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout role="driver">
        <div style={{ padding: '20px', textAlign: 'center' }}>
          <div style={{ color: '#ff6b6b', fontSize: '1.2rem', marginBottom: '15px' }}>
            ❌ {error}
          </div>
          <button
            onClick={fetchVehicles}
            style={{
              padding: '10px 20px',
              background: '#19c37d',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '1rem'
            }}
          >
            🔄 Thử lại
          </button>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout role="driver">
      <div style={{ padding: '20px', maxWidth: '1400px', margin: '0 auto' }}>
      
      {/* Development Debug Info */}
      {import.meta.env.VITE_ENABLE_DEBUG === 'true' && (
        <div style={{
          background: 'rgba(255, 165, 0, 0.1)',
          border: '1px solid rgba(255, 165, 0, 0.3)',
          borderRadius: '10px',
          padding: '15px',
          marginBottom: '20px',
          fontSize: '0.9rem',
          color: '#ffa500'
        }}>
          <strong>🔧 Vehicles Page Debug Info:</strong><br/>
          API Base URL: {import.meta.env.VITE_API_BASE_URL}<br/>
          Current User ID: {currentUser?.id || currentUser?.user_id || currentUser?.userId}<br/>
          Vehicles Count: {vehicles.length}<br/>
          Loading: {loading ? 'Yes' : 'No'}<br/>
          Error: {error || 'None'}<br/>
          Data Source: {error ? 'API FAILED' : vehicles.length > 0 ? 'API SUCCESS' : loading ? 'LOADING...' : 'NO DATA'}<br/>
          <button 
            onClick={() => window.open(`http://localhost:8080/api/users/${currentUser?.id || currentUser?.user_id || currentUser?.userId}`, '_blank')} 
            style={{
              padding: '5px 10px',
              background: 'rgba(25, 195, 125, 0.2)',
              border: '1px solid rgba(25, 195, 125, 0.3)',
              borderRadius: '5px',
              color: '#19c37d',
              cursor: 'pointer',
              fontSize: '0.8rem',
              marginTop: '10px',
              marginRight: '10px'
            }}
          >
            Test API Direct
          </button>
          <button 
            onClick={fetchVehicles}
            style={{
              padding: '5px 10px',
              background: 'rgba(106, 183, 255, 0.2)',
              border: '1px solid rgba(106, 183, 255, 0.3)',
              borderRadius: '5px',
              color: '#6ab7ff',
              cursor: 'pointer',
              fontSize: '0.8rem',
              marginTop: '10px'
            }}
          >
            🔄 Retry Fetch
          </button>
        </div>
      )}
      
      {/* Header */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        marginBottom: '30px' 
      }}>
        <div>
          <h1 style={{ color: '#FFFFFF', margin: '0 0 10px 0' }}>🚗 Quản lý phương tiện</h1>
          <p style={{ color: '#B0B0B0', margin: 0 }}>Đăng ký và quản lý phương tiện của bạn</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          style={{
            padding: '12px 24px',
            background: 'linear-gradient(135deg, #19c37d, #15a36a)',
            color: 'white',
            border: 'none',
            borderRadius: '10px',
            cursor: 'pointer',
            fontSize: '1rem',
            fontWeight: '600',
            boxShadow: '0 4px 15px rgba(25, 195, 125, 0.3)'
          }}
        >
          + Thêm phương tiện
        </button>
      </div>

      {/* Vehicles Grid */}
      {vehicles.length > 0 ? (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
          gap: '25px'
        }}>
          {vehicles.map((vehicle, index) => (
            <div
              key={vehicle.id || index}
              style={{
                background: 'rgba(26, 32, 44, 0.8)',
                borderRadius: '20px',
                padding: '25px',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                backdropFilter: 'blur(10px)',
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-5px)';
                e.currentTarget.style.boxShadow = '0 10px 30px rgba(25, 195, 125, 0.2)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              <div style={{ fontSize: '3rem', marginBottom: '15px', textAlign: 'center' }}>
                {(() => {
                  const type = vehicle.vehicleType || vehicle.type || 'motorcycle';
                  return type.toLowerCase().includes('car') || type.toLowerCase().includes('oto') ? '🚗' : '🏍️';
                })()}
              </div>
              <h3 style={{ color: '#FFFFFF', margin: '0 0 15px 0', textAlign: 'center' }}>
                {vehicle.vehicleModel || vehicle.model || 'Xe điện'}
              </h3>
              <div style={{ 
                display: 'flex', 
                flexDirection: 'column', 
                gap: '12px',
                marginBottom: '20px'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#B0B0B0' }}>Biển số:</span>
                  <span style={{ color: '#FFFFFF', fontWeight: '600' }}>
                    {vehicle.plateNumber || vehicle.licensePlate || 'N/A'}
                  </span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#B0B0B0' }}>Quãng đường:</span>
                  <span style={{ color: '#19c37d', fontWeight: '600' }}>
                    {(vehicle.currentOdometer || vehicle.current_odometer || 0).toLocaleString()} km
                  </span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#B0B0B0' }}>Sức khỏe pin:</span>
                  <span style={{ 
                    color: (vehicle.health || vehicle.batteryLevel) > 70 ? '#19c37d' : 
                           (vehicle.health || vehicle.batteryLevel) > 30 ? '#ffa500' : '#ff6b6b',
                    fontWeight: '600' 
                  }}>
                    🔋 {(vehicle.health || vehicle.batteryLevel || 0).toFixed(1)}%
                  </span>
                </div>
                {vehicle.batteryModel && (
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: '#B0B0B0' }}>Loại pin:</span>
                    <span style={{ color: '#6ab7ff', fontWeight: '600' }}>{vehicle.batteryModel}</span>
                  </div>
                )}
                {vehicle.vinNumber && (
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: '#B0B0B0' }}>VIN:</span>
                    <span style={{ color: '#9c88ff', fontWeight: '600', fontSize: '0.8rem' }}>
                      ...{vehicle.vinNumber.slice(-8)}
                    </span>
                  </div>
                )}
                {vehicle.batteryType && (
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: '#B0B0B0' }}>Loại pin tương thích:</span>
                    <span style={{ color: '#ffa500', fontWeight: '600', fontSize: '0.8rem' }}>
                      {vehicle.batteryType}
                    </span>
                  </div>
                )}
              </div>
              <button
                onClick={() => handleDelete(vehicle.id)}
                style={{
                  width: '100%',
                  padding: '10px',
                  background: 'linear-gradient(135deg, #ff6b6b, #ee5a5a)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: '0.9rem',
                  fontWeight: '500'
                }}
              >
                Xóa
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div style={{
          background: 'rgba(26, 32, 44, 0.8)',
          borderRadius: '20px',
          padding: '60px 20px',
          textAlign: 'center',
          border: '1px solid rgba(255, 255, 255, 0.1)'
        }}>
          <div style={{ fontSize: '5rem', marginBottom: '20px' }}>🚙</div>
          <h3 style={{ color: '#FFFFFF', marginBottom: '10px' }}>Chưa có phương tiện nào</h3>
          <p style={{ color: '#B0B0B0', marginBottom: '25px' }}>
            Thêm phương tiện để bắt đầu sử dụng dịch vụ đổi pin
          </p>
          <button
            onClick={() => setShowAddModal(true)}
            style={{
              padding: '14px 28px',
              background: 'linear-gradient(135deg, #19c37d, #15a36a)',
              color: 'white',
              border: 'none',
              borderRadius: '10px',
              cursor: 'pointer',
              fontSize: '1.1rem',
              fontWeight: '600',
              boxShadow: '0 4px 15px rgba(25, 195, 125, 0.3)'
            }}
          >
            Thêm phương tiện đầu tiên
          </button>
        </div>
      )}

      {/* Add Vehicle Modal */}
      {showAddModal && (
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
            border: '1px solid rgba(255, 255, 255, 0.1)'
          }}>
            <h2 style={{ color: '#FFFFFF', marginBottom: '25px' }}>Thêm phương tiện mới</h2>
            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: '20px' }}>
                <label style={{ color: '#E0E0E0', display: 'block', marginBottom: '8px' }}>
                  Loại phương tiện
                </label>
                <select
                  value={formData.vehicleType}
                  onChange={(e) => setFormData({ ...formData, vehicleType: e.target.value })}
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
                  <option value="motorcycle">Xe máy điện</option>
                  <option value="car">Ô tô điện</option>
                </select>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '20px' }}>
                <div>
                  <label style={{ color: '#E0E0E0', display: 'block', marginBottom: '8px' }}>
                    Hãng xe
                  </label>
                  <input
                    type="text"
                    value={formData.brand}
                    onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                    required
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
                <div>
                  <label style={{ color: '#E0E0E0', display: 'block', marginBottom: '8px' }}>
                    Model
                  </label>
                  <input
                    type="text"
                    value={formData.model}
                    onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                    required
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
              </div>
              <div style={{ marginBottom: '20px' }}>
                <label style={{ color: '#E0E0E0', display: 'block', marginBottom: '8px' }}>
                  Biển số xe
                </label>
                <input
                  type="text"
                  value={formData.licensePlate}
                  onChange={(e) => setFormData({ ...formData, licensePlate: e.target.value })}
                  required
                  placeholder="VD: 29A-12345"
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
                  Dung lượng pin (kWh)
                </label>
                <input
                  type="number"
                  value={formData.batteryCapacity}
                  onChange={(e) => setFormData({ ...formData, batteryCapacity: e.target.value })}
                  required
                  step="0.1"
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
              <div style={{ display: 'flex', gap: '10px' }}>
                <button
                  type="button"
                  onClick={() => {
                    setShowAddModal(false);
                    setFormData({
                      vehicleType: 'motorcycle',
                      brand: '',
                      model: '',
                      licensePlate: '',
                      batteryCapacity: ''
                    });
                  }}
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
                  {loading ? 'Đang thêm...' : 'Thêm'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      </div>
    </DashboardLayout>
  );
};

export default DriverVehicles;
