// Driver Vehicle Management
// Vehicle registration, battery status, maintenance

import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../layouts/DashboardLayout';
import { useAuth } from '../../context/AuthContext';
import userService from '../../assets/js/services/userService';

const DriverVehicles = () => {
  const { currentUser } = useAuth();
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [formData, setFormData] = useState({
    plateNumber: '',
    vehicleModel: '',
    vinNumber: '',
    batteryType: 'LiFePO4-60kWh'
  });

  useEffect(() => {
    fetchVehicles();
  }, []);

  const fetchVehicles = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('🚗 Fetching vehicles for user:', currentUser?.email);
      
      if (!currentUser) {
        setVehicles([]);
        return;
      }
      
      const userId = currentUser.id || currentUser.user_id || currentUser.userId;
      if (!userId) {
        setVehicles([]);
        return;
      }

      const response = await userService.getUserById(userId);
      console.log('📡 API Response:', response);
      
      let vehiclesList = [];
      
      if (response.success) {
        if (response.vehicles) {
          vehiclesList = response.vehicles;
        } else if (response.data && response.data.vehicles) {
          vehiclesList = response.data.vehicles;
        }
        
        console.log('🚗 Found vehicles:', vehiclesList);
        setVehicles(vehiclesList || []);
      } else {
        console.log('❌ API failed');
        setVehicles([]);
      }
    } catch (err) {
      console.error('❌ Error:', err);
      setError('Lỗi khi tải danh sách xe: ' + err.message);
      setVehicles([]);
    } finally {
      setLoading(false);
    }
  };

  const handleAddVehicle = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      
      const userId = currentUser.id || currentUser.user_id || currentUser.userId;
      
      // Tạo payload để gửi API
      const vehicleData = {
        plateNumber: formData.plateNumber,
        vehicleModel: formData.vehicleModel,
        vinNumber: formData.vinNumber,
        batteryType: formData.batteryType,
        userId: userId
      };
      
      console.log('📝 Adding vehicle:', vehicleData);
      
      // TODO: Gọi API thêm xe mới khi backend có endpoint
      // const response = await vehicleService.addVehicle(vehicleData);
      
      // Tạm thời thông báo và đóng modal
      alert(`Đã gửi yêu cầu thêm xe ${formData.vehicleModel} - ${formData.plateNumber}\nVui lòng liên hệ admin để xử lý.`);
      
      setShowAddModal(false);
      setFormData({
        plateNumber: '',
        vehicleModel: '',
        vinNumber: '',
        batteryType: 'LiFePO4-60kWh'
      });
      
      // Refresh danh sách xe
      fetchVehicles();
      
    } catch (err) {
      console.error('❌ Error adding vehicle:', err);
      alert('Có lỗi xảy ra: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <DashboardLayout role="driver">
        <div style={{ padding: '20px', textAlign: 'center' }}>
          <div style={{ color: '#19c37d', fontSize: '1.5rem' }}>⏳ Đang tải...</div>
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
          <button onClick={fetchVehicles} style={{
            padding: '10px 20px',
            background: '#19c37d',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer'
          }}>
            🔄 Thử lại
          </button>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout role="driver">
      <div style={{ padding: '20px', maxWidth: '1400px', margin: '0 auto' }}>
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          marginBottom: '30px' 
        }}>
          <div>
            <h1 style={{ color: '#FFFFFF', margin: '0 0 10px 0' }}>🚗 Quản lý phương tiện</h1>
            <p style={{ color: '#B0B0B0', margin: 0 }}>Danh sách xe của bạn ({vehicles.length} xe)</p>
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
              boxShadow: '0 4px 15px rgba(25, 195, 125, 0.3)',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            ➕ Thêm phương tiện
          </button>
        </div>

        {vehicles.length > 0 ? (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
            gap: '25px'
          }}>
            {vehicles.map((vehicle, index) => (
              <div
                key={vehicle.vehicleId || index}
                style={{
                  background: 'rgba(26, 32, 44, 0.8)',
                  borderRadius: '20px',
                  padding: '25px',
                  border: '1px solid rgba(255, 255, 255, 0.1)'
                }}
              >
                <div style={{ fontSize: '3rem', marginBottom: '15px', textAlign: 'center' }}>🚗</div>
                
                <h3 style={{ color: '#FFFFFF', margin: '0 0 15px 0', textAlign: 'center' }}>
                  {vehicle.vehicleModel || 'Xe điện'}
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
                      {vehicle.plateNumber || 'N/A'}
                    </span>
                  </div>
                  
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: '#B0B0B0' }}>Quãng đường:</span>
                    <span style={{ color: '#19c37d', fontWeight: '600' }}>
                      {(vehicle.currentOdometer || 0).toLocaleString()} km
                    </span>
                  </div>
                  
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: '#B0B0B0' }}>Sức khỏe pin:</span>
                    <span style={{ 
                      color: vehicle.health > 70 ? '#19c37d' : 
                             vehicle.health > 30 ? '#ffa500' : '#ff6b6b',
                      fontWeight: '600' 
                    }}>
                      🔋 {(vehicle.health || 0).toFixed(1)}%
                    </span>
                  </div>
                  
                  {vehicle.batteryModel && (
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: '#B0B0B0' }}>Loại pin:</span>
                      <span style={{ color: '#6ab7ff', fontWeight: '600' }}>
                        {vehicle.batteryModel}
                      </span>
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
                </div>
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
                boxShadow: '0 4px 15px rgba(25, 195, 125, 0.3)',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              ➕ Thêm phương tiện đầu tiên
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
              border: '1px solid rgba(255, 255, 255, 0.1)',
              maxHeight: '90vh',
              overflowY: 'auto'
            }}>
              <h2 style={{ color: '#FFFFFF', marginBottom: '25px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                🚗 Thêm phương tiện mới
              </h2>
              
              <form onSubmit={handleAddVehicle}>
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
                    onClick={() => {
                      setShowAddModal(false);
                      setFormData({
                        plateNumber: '',
                        vehicleModel: '',
                        vinNumber: '',
                        batteryType: 'LiFePO4-60kWh'
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
                    {loading ? 'Đang gửi...' : '➕ Gửi yêu cầu'}
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