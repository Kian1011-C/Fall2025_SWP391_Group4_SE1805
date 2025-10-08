// Driver Battery Swap
// Quy trình đổi pin xe điện - 4 bước - Sử dụng API

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { QRCodeSVG } from 'qrcode.react';
import { useAuth } from '../../context/AuthContext';
import stationService from '../../assets/js/services/stationService';
import batteryService from '../../assets/js/services/batteryService';
import swapService from '../../assets/js/services/swapService';
import vehicleService from '../../assets/js/services/vehicleService';
import userService from '../../assets/js/services/userService';
import contractService from '../../assets/js/services/contractService';
import DashboardLayout from '../../layouts/DashboardLayout';
import '../../assets/css/battery-swap.css';

const DriverSwapBattery = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  
  // State quản lý bước hiện tại (1-5: Chọn trạm → Chọn trụ → Xác nhận → Xử lý → Thành công)
  const [currentStep, setCurrentStep] = useState(1);
  
  // State quản lý trạm và trụ được chọn
  const [selectedStation, setSelectedStation] = useState(null);
  const [selectedTower, setSelectedTower] = useState(null);
  const [towers, setTowers] = useState([]);
  
  // State quản lý trạng thái xử lý
  const [isProcessing, setIsProcessing] = useState(false);
  
  // State cho data từ API
  const [stations, setStations] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [userContract, setUserContract] = useState(null);
  const [currentBatteryLevel, setCurrentBatteryLevel] = useState(15);
  const [swapResult, setSwapResult] = useState(null);
  
  // Loading và error states
  const [loading, setLoading] = useState(true);
  const [loadingTowers, setLoadingTowers] = useState(false);
  const [error, setError] = useState(null);

  // State quản lý QR popup
  const [showQRPopup, setShowQRPopup] = useState(false);

  // Fetch data từ API khi component mount
  useEffect(() => {
    fetchInitialData();
  }, [currentUser]);

  const fetchInitialData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('🔋 Fetching swap data for user:', currentUser);
      
      // Fetch danh sách trạm sạc
      const stationsResponse = await stationService.getAllStations();
      console.log('📍 Stations response:', stationsResponse);
      
      if (stationsResponse.success && stationsResponse.data) {
        const stationsList = Array.isArray(stationsResponse.data) 
          ? stationsResponse.data 
          : stationsResponse.stations || [];
        
        setStations(stationsList.map(station => {
          // Log để debug
          console.log('🔍 Station data:', station);
          
          return {
            id: station.station_id || station.stationId || station.id,
            name: station.name || station.station_name || 'Trạm sạc',
            location: station.location || station.address || 'Chưa có địa chỉ',
            // Chấp nhận cả 'active' và 'Active' (case-insensitive)
            status: (station.status || '').toLowerCase() === 'active' ? 'active' : 
                    (station.status || '').toLowerCase() === 'maintenance' ? 'maintenance' : 
                    'active', // Mặc định là active nếu không có status
            availableSlots: station.available_slots || station.availableSlots || 0
          };
        }));
      }
      
      // Fetch xe của user
      if (currentUser) {
        const userId = currentUser.id || currentUser.user_id || currentUser.userId;
        const vehiclesResponse = await userService.getUserById(userId);
        console.log('🚗 Vehicles response:', vehiclesResponse);
        
        if (vehiclesResponse.success) {
          const vehiclesList = vehiclesResponse.vehicles || vehiclesResponse.data?.vehicles || [];
          setVehicles(vehiclesList);
          
          // Auto select xe đầu tiên nếu có
          if (vehiclesList.length > 0) {
            const firstVehicle = vehiclesList[0];
            setSelectedVehicle(firstVehicle);
            
            // Lấy battery level từ vehicle data
            const batteryLevel = firstVehicle.battery_level || 
                                firstVehicle.batteryLevel || 
                                15;
            setCurrentBatteryLevel(batteryLevel);
          }
        }
        
        // Fetch contracts của user
        const contractsResponse = await contractService.getContracts(userId);
        console.log('📝 Contracts response:', contractsResponse);
        
        if (contractsResponse.success && contractsResponse.data) {
          const contractsList = Array.isArray(contractsResponse.data) 
            ? contractsResponse.data 
            : [contractsResponse.data];
          
          // Lấy contract đầu tiên (active)
          const activeContract = contractsList.find(c => c.status === 'active') || contractsList[0];
          if (activeContract) {
            setUserContract(activeContract);
            console.log('✅ User contract found:', activeContract);
      } else {
            console.warn('⚠️ No active contract found for user');
          }
        }
      }
      
    } catch (err) {
      console.error('❌ Error fetching data:', err);
      setError('Không thể tải dữ liệu. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  // Xử lý chọn trạm
  const handleSelectStation = async (station) => {
    if (station.status === 'active') {
      setSelectedStation(station);
      setSelectedTower(null); // Reset tower khi đổi trạm
      
      // Fetch danh sách trụ của trạm này
      await fetchTowersByStation(station.id);
      
      // Tự động chuyển sang bước 2 (Chọn trụ)
      setCurrentStep(2);
    }
  };
  
  // Fetch danh sách trụ theo station_id
  const fetchTowersByStation = async (stationId) => {
    try {
      setLoadingTowers(true);
      console.log('🔌 Fetching towers for station:', stationId);
      
      // Gọi API lấy towers theo station
      const response = await stationService.getTowersByStation(stationId);
      console.log('🔌 Towers response:', response);
      
      if (response.success && response.data) {
        const towersList = Array.isArray(response.data) ? response.data : [response.data];
        setTowers(towersList.map(tower => ({
          id: tower.tower_id || tower.towerId || tower.id,
          towerNumber: tower.tower_number || tower.towerNumber || 1,
          status: (tower.status || '').toLowerCase() === 'active' ? 'active' : 'maintenance',
          availableSlots: tower.available_slots || tower.availableSlots || 0
        })));
      } else {
        setTowers([]);
      }
    } catch (err) {
      console.error('❌ Error fetching towers:', err);
      setTowers([]);
    } finally {
      setLoadingTowers(false);
    }
  };
  
  // Xử lý chọn trụ
  const handleSelectTower = (tower) => {
    if (tower.status === 'active') {
      setSelectedTower(tower);
      // Tự động chuyển sang bước 3 (Xác nhận)
      setCurrentStep(3);
    }
  };

  // Xử lý nút Next
  const handleNext = async () => {
    if (currentStep === 1 && selectedStation) {
      setCurrentStep(2); // Chọn trạm → Chọn trụ
    } else if (currentStep === 2 && selectedTower) {
      setCurrentStep(3); // Chọn trụ → Xác nhận
    } else if (currentStep === 3) {
      // Bước 3 -> Bước 4: Gọi API để thực hiện đổi pin
      await performBatterySwap();
    }
  };

  // Thực hiện đổi pin qua API
  const performBatterySwap = async () => {
    try {
      setCurrentStep(4); // Chuyển sang bước 4: Đang xử lý
      setIsProcessing(true);
      setError(null);
      
      console.log('🔄 Initiating battery swap...');
      
      const userId = currentUser?.id || currentUser?.user_id;
      const vehicleId = selectedVehicle?.vehicle_id || selectedVehicle?.vehicleId || selectedVehicle?.id;
      const stationId = selectedStation?.id;
      const towerId = selectedTower?.id;
      const contractId = userContract?.contract_id || userContract?.contractId || userContract?.id;
      
      console.log('🔍 DEBUG - Current User:', currentUser);
      console.log('🔍 DEBUG - User Contract:', userContract);
      console.log('🔍 DEBUG - Selected Vehicle:', selectedVehicle);
      console.log('🔍 DEBUG - Selected Station:', selectedStation);
      console.log('🔍 DEBUG - Selected Tower:', selectedTower);
      console.log('🔍 Swap params:', { userId, vehicleId, stationId, towerId, contractId });
      
      // Kiểm tra contractId
      if (!contractId) {
        console.error('❌ CONTRACT NOT FOUND!');
        console.error('userContract value:', userContract);
        throw new Error('Không tìm thấy hợp đồng. Vui lòng đăng ký gói dịch vụ trước.');
      }
      
      // Gọi API initiate swap
      const swapResponse = await batteryService.initiateBatterySwap({
        userId: userId,
        vehicleId: vehicleId,
        stationId: stationId,
        towerId: towerId,
        contractId: contractId,
        contract_id: contractId, // Gửi cả snake_case
        currentBatteryLevel: currentBatteryLevel
      });
      
      console.log('📡 Swap response:', swapResponse);
      
      // Simulate processing time
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      if (swapResponse.success) {
        // Nếu có swap_id, confirm swap
        if (swapResponse.data?.swap_id || swapResponse.swap_id) {
          const swapId = swapResponse.data?.swap_id || swapResponse.swap_id;
          
          const confirmResponse = await batteryService.confirmBatterySwap(swapId);
          console.log('✅ Confirm response:', confirmResponse);
          
          setSwapResult({
            swapId: swapId,
            stationName: selectedStation?.name,
            time: new Date().toLocaleString('vi-VN'),
            oldBattery: currentBatteryLevel,
            newBattery: 100
          });
        } else {
          setSwapResult({
            stationName: selectedStation?.name,
            time: new Date().toLocaleString('vi-VN'),
            oldBattery: currentBatteryLevel,
            newBattery: 100
          });
        }
        
        setIsProcessing(false);
        setCurrentStep(5); // Bước 5: Thành công!
        
      } else {
        throw new Error(swapResponse.message || 'Không thể thực hiện đổi pin');
      }
      
    } catch (err) {
      console.error('❌ Error during swap:', err);
      setError(err.message || 'Lỗi khi đổi pin. Vui lòng thử lại.');
      setIsProcessing(false);
      setCurrentStep(2); // Quay lại bước 2
    }
  };

  // Xử lý nút Back
  const handleBack = () => {
    if (currentStep > 1 && !isProcessing) {
      if (currentStep === 3) {
        // Từ bước Xác nhận → quay lại Chọn trụ
        setCurrentStep(2);
      } else if (currentStep === 2) {
        // Từ bước Chọn trụ → quay lại Chọn trạm
        setSelectedTower(null);
        setTowers([]);
        setCurrentStep(1);
      }
    }
  };

  // Xử lý hoàn tất và đóng
  const handleFinish = () => {
    // Quay về dashboard
    navigate('/driver/dashboard');
  };

  // Render Step 1: Chọn trạm sạc
  const renderStepSelectStation = () => {
    if (loading) {
      return (
        <div style={{ textAlign: 'center', padding: '40px' }}>
          <div className="loading-spinner" style={{ margin: '0 auto' }}></div>
          <p style={{ marginTop: '16px', color: '#666' }}>Đang tải danh sách trạm...</p>
        </div>
      );
    }

    if (error) {
      return (
        <div style={{ textAlign: 'center', padding: '40px' }}>
          <p style={{ color: '#f44336', marginBottom: '16px' }}>⚠️ {error}</p>
          <button
            onClick={fetchInitialData}
            className="btn-swap btn-next"
            style={{ display: 'inline-block' }}
          >
            Thử lại
          </button>
        </div>
      );
    }

    if (stations.length === 0) {
      return (
        <div style={{ textAlign: 'center', padding: '40px' }}>
          <p style={{ color: '#666' }}>Không có trạm sạc nào khả dụng.</p>
        </div>
      );
    }

    return (
      <div>
        <h3 style={{ marginBottom: '24px', fontSize: '20px', fontWeight: '600', color: '#333' }}>
          📍 Chọn trạm sạc gần bạn
        </h3>
        
        {selectedVehicle && (
          <div style={{ marginBottom: '20px', padding: '12px', background: '#e3f2fd', borderRadius: '8px' }}>
            <p style={{ margin: 0, fontSize: '14px', color: '#1976d2' }}>
              🚗 Xe: {selectedVehicle.license_plate || selectedVehicle.licensePlate || 'N/A'} 
              {' '}| 🔋 Pin hiện tại: {currentBatteryLevel}%
            </p>
          </div>
        )}

        <div className="station-list">
          {stations.map((station) => (
            <div
              key={station.id}
              className={`station-card ${selectedStation?.id === station.id ? 'selected' : ''} ${station.status === 'maintenance' ? 'disabled' : ''}`}
              onClick={() => handleSelectStation(station)}
              style={{ opacity: station.status === 'maintenance' ? 0.5 : 1, cursor: station.status === 'active' ? 'pointer' : 'not-allowed' }}
            >
              <div className="station-name">{station.name}</div>
              <div className="station-location">
                📍 {station.location}
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '12px' }}>
                <span className={`station-status ${station.status}`}>
                  {station.status === 'active' ? '🟢 Hoạt động' : '🔧 Bảo trì'}
                </span>
                {station.status === 'active' && (
                  <span style={{ fontSize: '14px', color: '#666' }}>
                    {station.availableSlots} slot trống
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  // Render Step 2: Chọn trụ sạc
  const renderStepSelectTower = () => {
    if (loadingTowers) {
      return (
        <div style={{ textAlign: 'center', padding: '40px' }}>
          <div className="loading-spinner" style={{ margin: '0 auto' }}></div>
          <p style={{ marginTop: '16px', color: '#666' }}>Đang tải danh sách trụ...</p>
        </div>
      );
    }

    if (towers.length === 0) {
      return (
        <div style={{ textAlign: 'center', padding: '40px' }}>
          <p style={{ color: '#666' }}>Không có trụ sạc nào khả dụng tại trạm này.</p>
          <button onClick={() => setCurrentStep(1)} className="btn-swap">
            ← Chọn trạm khác
          </button>
        </div>
      );
    }

    return (
      <div>
        <h3 style={{ marginBottom: '24px', fontSize: '20px', fontWeight: '600', color: '#333' }}>
          🔌 Chọn trụ sạc
        </h3>
        
        <div style={{ marginBottom: '20px', padding: '12px', background: '#e3f2fd', borderRadius: '8px' }}>
          <p style={{ margin: 0, fontSize: '14px', color: '#1976d2' }}>
            📍 Trạm: {selectedStation?.name}
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '16px' }}>
          {towers.map((tower) => (
            <div
              key={tower.id}
              className={`tower-card ${selectedTower?.id === tower.id ? 'selected' : ''} ${tower.status === 'maintenance' ? 'disabled' : ''}`}
              onClick={() => handleSelectTower(tower)}
              style={{
                padding: '24px',
                border: selectedTower?.id === tower.id ? '2px solid #667eea' : '1px solid #e0e0e0',
                borderRadius: '12px',
                background: selectedTower?.id === tower.id ? '#f3f4ff' : '#fff',
                cursor: tower.status === 'active' ? 'pointer' : 'not-allowed',
                opacity: tower.status === 'maintenance' ? 0.5 : 1,
                transition: 'all 0.2s',
                textAlign: 'center'
              }}
            >
              <div style={{ fontSize: '48px', marginBottom: '16px' }}>
                {tower.status === 'active' ? '🔌' : '⚠️'}
              </div>
              <div style={{ fontSize: '18px', fontWeight: '600', color: '#333', marginBottom: '8px' }}>
                Trụ {tower.towerNumber}
              </div>
              <div style={{ 
                fontSize: '14px', 
                color: tower.status === 'active' ? '#19c37d' : '#ffa500',
                fontWeight: '500'
              }}>
                {tower.status === 'active' ? '✓ Sẵn sàng' : '⏳ Bảo trì'}
              </div>
              {tower.status === 'active' && (
                <div style={{ fontSize: '12px', color: '#666', marginTop: '8px' }}>
                  {tower.availableSlots} slot trống
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  };

  // Render Step 3: Xác nhận đổi pin
  const renderStepConfirmSwap = () => (
    <div>
      <h3 style={{ marginBottom: '32px', fontSize: '20px', fontWeight: '600', color: '#333', textAlign: 'center' }}>
        🔋 Xác nhận đổi pin
      </h3>
      
      <div style={{ marginBottom: '32px', padding: '16px', background: '#f8f9fa', borderRadius: '12px' }}>
        <p style={{ margin: 0, fontSize: '14px', color: '#666' }}>
          <strong>Trạm đã chọn:</strong> {selectedStation?.name}
        </p>
        <p style={{ margin: '8px 0 0 0', fontSize: '14px', color: '#666' }}>
          <strong>Địa chỉ:</strong> {selectedStation?.location}
        </p>
        <p style={{ margin: '8px 0 0 0', fontSize: '14px', color: '#666' }}>
          <strong>Trụ:</strong> Trụ {selectedTower?.towerNumber}
        </p>
        {selectedVehicle && (
          <p style={{ margin: '8px 0 0 0', fontSize: '14px', color: '#666' }}>
            <strong>Xe:</strong> {selectedVehicle.license_plate || selectedVehicle.licensePlate}
          </p>
        )}
      </div>

      {error && (
        <div style={{ marginBottom: '20px', padding: '12px', background: '#ffebee', borderRadius: '8px', border: '1px solid #f44336' }}>
          <p style={{ margin: 0, color: '#f44336', fontSize: '14px' }}>
            ⚠️ {error}
          </p>
        </div>
      )}

      <div className="battery-comparison">
        {/* Pin cũ */}
        <div className="battery-display">
          <div className="battery-icon-large battery-old">🔋</div>
          <div className="battery-label">Pin hiện tại</div>
          <div className="battery-percentage" style={{ color: '#f44336' }}>
            {currentBatteryLevel}%
          </div>
          <span style={{ fontSize: '14px', color: '#999' }}>⚠️ Pin yếu</span>
        </div>

        {/* Mũi tên */}
        <div className="arrow-icon">→</div>

        {/* Pin mới */}
        <div className="battery-display">
          <div className="battery-icon-large battery-new">🔋</div>
          <div className="battery-label">Pin mới</div>
          <div className="battery-percentage" style={{ color: '#4caf50' }}>
            100%
          </div>
          <span style={{ fontSize: '14px', color: '#4caf50' }}>✅ Pin đầy</span>
        </div>
      </div>

      <div style={{ marginTop: '32px', padding: '16px', background: '#fff3e0', borderRadius: '12px', border: '1px solid #ffe0b2' }}>
        <p style={{ margin: 0, fontSize: '14px', color: '#f57c00', textAlign: 'center' }}>
          ⚡ Thời gian ước tính: 2-3 phút
        </p>
      </div>

      {/* Nút hiển thị QR Code */}
      <div style={{ marginTop: '32px', textAlign: 'center' }}>
        <button 
          onClick={() => setShowQRPopup(true)}
          style={{
            padding: '14px 32px',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: '#fff',
            border: 'none',
            borderRadius: '12px',
            fontSize: '15px',
            fontWeight: '600',
            cursor: 'pointer',
            boxShadow: '0 4px 12px rgba(102, 126, 234, 0.3)',
            transition: 'all 0.3s ease',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            margin: '0 auto'
          }}
          onMouseOver={(e) => {
            e.target.style.transform = 'translateY(-2px)';
            e.target.style.boxShadow = '0 6px 16px rgba(102, 126, 234, 0.4)';
          }}
          onMouseOut={(e) => {
            e.target.style.transform = 'translateY(0)';
            e.target.style.boxShadow = '0 4px 12px rgba(102, 126, 234, 0.3)';
          }}
        >
          <span style={{ fontSize: '20px' }}>📱</span>
          <span>Hiển thị mã QR</span>
        </button>
        <p style={{ marginTop: '12px', fontSize: '13px', color: '#666' }}>
          Nhân viên sẽ quét mã để xác nhận xe của bạn
        </p>
      </div>
    </div>
  );

  // Render Step 4: Đang xử lý
  const renderStepProcessing = () => (
    <div className="processing-container">
      <div className="loading-spinner"></div>
      <div className="processing-text">🔄 Đang thực hiện đổi pin...</div>
      <div className="processing-subtext">
        Vui lòng đợi trong giây lát. Hệ thống đang xử lý yêu cầu của bạn.
      </div>
      
      {/* Nút hiển thị QR Code */}
      <div style={{ marginTop: '32px', textAlign: 'center' }}>
        <button 
          onClick={() => setShowQRPopup(true)}
          style={{
            padding: '14px 32px',
            background: 'linear-gradient(135deg, #4caf50 0%, #45a049 100%)',
            color: '#fff',
            border: 'none',
            borderRadius: '12px',
            fontSize: '15px',
            fontWeight: '600',
            cursor: 'pointer',
            boxShadow: '0 4px 12px rgba(76, 175, 80, 0.3)',
            transition: 'all 0.3s ease',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            margin: '0 auto'
          }}
          onMouseOver={(e) => {
            e.target.style.transform = 'translateY(-2px)';
            e.target.style.boxShadow = '0 6px 16px rgba(76, 175, 80, 0.4)';
          }}
          onMouseOut={(e) => {
            e.target.style.transform = 'translateY(0)';
            e.target.style.boxShadow = '0 4px 12px rgba(76, 175, 80, 0.3)';
          }}
        >
          <span style={{ fontSize: '20px' }}>📱</span>
          <span>Hiển thị mã QR cho nhân viên</span>
        </button>
        <p style={{ marginTop: '12px', fontSize: '13px', color: '#666' }}>
          Nhân viên quét mã để xác nhận đổi pin
        </p>
      </div>

      <div style={{ marginTop: '32px', display: 'flex', flexDirection: 'column', gap: '12px', width: '100%', maxWidth: '400px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', background: '#f8f9fa', borderRadius: '8px' }}>
          <span style={{ fontSize: '20px' }}>✓</span>
          <span style={{ fontSize: '14px', color: '#666' }}>Xác thực thông tin xe</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', background: '#f8f9fa', borderRadius: '8px' }}>
          <span style={{ fontSize: '20px' }}>✓</span>
          <span style={{ fontSize: '14px', color: '#666' }}>Kết nối với trạm sạc</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', background: '#fff3e0', borderRadius: '8px' }}>
          <div className="loading-spinner" style={{ width: '20px', height: '20px', borderWidth: '3px' }}></div>
          <span style={{ fontSize: '14px', color: '#f57c00', fontWeight: '600' }}>Đang thực hiện đổi pin...</span>
        </div>
      </div>
    </div>
  );

  // Render Step 4: Hoàn tất
  const renderStepSuccess = () => {
    return (
      <div className="success-container">
        <div className="success-icon">✅</div>
        <div className="success-title">Đổi pin thành công!</div>
        <div className="success-message">
          Pin của bạn đã được thay thế thành công. Xe của bạn đã sẵn sàng để tiếp tục hành trình!
        </div>

        <div className="success-details">
          {swapResult?.swapId && (
            <div className="detail-row">
              <span className="detail-label">Mã giao dịch:</span>
              <span className="detail-value">#{swapResult.swapId}</span>
            </div>
          )}
          <div className="detail-row">
            <span className="detail-label">Trạm sạc:</span>
            <span className="detail-value">{swapResult?.stationName || selectedStation?.name}</span>
          </div>
          <div className="detail-row">
            <span className="detail-label">Thời gian:</span>
            <span className="detail-value">{swapResult?.time || new Date().toLocaleString('vi-VN')}</span>
          </div>
          <div className="detail-row">
            <span className="detail-label">Pin cũ:</span>
            <span className="detail-value" style={{ color: '#f44336' }}>
              {swapResult?.oldBattery || currentBatteryLevel}%
            </span>
          </div>
          <div className="detail-row">
            <span className="detail-label">Pin mới:</span>
            <span className="detail-value" style={{ color: '#4caf50' }}>
              {swapResult?.newBattery || 100}%
            </span>
          </div>
          <div className="detail-row">
            <span className="detail-label">Trạng thái:</span>
            <span className="detail-value" style={{ color: '#4caf50' }}>✅ Hoàn tất</span>
          </div>
        </div>

        <div style={{ marginTop: '24px', padding: '16px', background: '#e8f5e9', borderRadius: '12px', width: '100%', maxWidth: '500px' }}>
          <p style={{ margin: 0, fontSize: '14px', color: '#4caf50', textAlign: 'center' }}>
            🎉 Chúc bạn có một chuyến đi an toàn!
          </p>
        </div>
      </div>
    );
  };

  // Render nội dung theo bước
  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return renderStepSelectStation();
      case 2:
        return renderStepSelectTower();
      case 3:
        return renderStepConfirmSwap();
      case 4:
        return renderStepProcessing();
      case 5:
        return renderStepSuccess();
      default:
        return null;
    }
  };

  // Debug log
  console.log('🔋 SwapBattery Render:', {
    currentStep,
    loading,
    error,
    stationsCount: stations.length,
    selectedStation,
    currentUser
  });

  return (
    <DashboardLayout role="driver">
      <div className="battery-swap-overlay" style={{ position: 'fixed', inset: 0, zIndex: 9999 }}>
        <div className="battery-swap-container">
          {/* Header */}
          <div className="battery-swap-header">
            <h2 className="battery-swap-title">
              <span>🔋</span>
              Quy trình đổi pin
            </h2>
            <button
              className="battery-swap-close-btn"
              onClick={handleFinish}
              disabled={isProcessing}
            >
              ×
            </button>
          </div>

          {/* Progress Bar - 5 Steps */}
          <div className="swap-progress-bar">
            <div className={`progress-step ${currentStep >= 1 ? 'completed' : ''} ${currentStep === 1 ? 'active' : ''}`}>
              <div className="step-circle">
                {currentStep > 1 ? '✓' : '1'}
              </div>
              <span className="step-label">Chọn trạm</span>
            </div>

            <div className={`progress-step ${currentStep >= 2 ? 'completed' : ''} ${currentStep === 2 ? 'active' : ''}`}>
              <div className="step-circle">
                {currentStep > 2 ? '✓' : '2'}
              </div>
              <span className="step-label">Chọn trụ</span>
            </div>

            <div className={`progress-step ${currentStep >= 3 ? 'completed' : ''} ${currentStep === 3 ? 'active' : ''}`}>
              <div className="step-circle">
                {currentStep > 3 ? '✓' : '3'}
              </div>
              <span className="step-label">Xác nhận</span>
            </div>

            <div className={`progress-step ${currentStep >= 4 ? 'completed' : ''} ${currentStep === 4 ? 'active' : ''}`}>
              <div className="step-circle">
                {currentStep > 4 ? '✓' : '4'}
              </div>
              <span className="step-label">Đang xử lý</span>
            </div>

            <div className={`progress-step ${currentStep === 5 ? 'completed active' : ''}`}>
              <div className="step-circle">
                {currentStep === 5 ? '✓' : '5'}
              </div>
              <span className="step-label">Hoàn tất</span>
            </div>
          </div>

          {/* Content */}
          <div className="swap-content">
            {renderStepContent()}
          </div>

          {/* Actions */}
          <div className="swap-actions">
            {currentStep === 1 && !loading && (
              <>
                <button className="btn-swap btn-back" onClick={handleFinish}>
                  Hủy
                </button>
                <button
                  className="btn-swap btn-next"
                  onClick={handleNext}
                  disabled={!selectedStation}
                >
                  Tiếp tục →
                </button>
              </>
            )}

            {/* Bước 2: Chọn trụ */}
            {currentStep === 2 && !loadingTowers && (
              <>
                <button 
                  className="btn-swap btn-back" 
                  onClick={handleBack}
                >
                  ← Quay lại
                </button>
                <button 
                  className="btn-swap btn-next" 
                  onClick={handleNext}
                  disabled={!selectedTower}
                >
                  Tiếp tục →
                </button>
              </>
            )}

            {/* Bước 3: Xác nhận */}
            {currentStep === 3 && (
              <>
                <button 
                  className="btn-swap btn-back" 
                  onClick={handleBack}
                  disabled={isProcessing}
                >
                  ← Quay lại
                </button>
                <button 
                  className="btn-swap btn-confirm" 
                  onClick={handleNext}
                  disabled={isProcessing}
                >
                  {isProcessing ? 'Đang xử lý...' : '✓ Xác nhận đổi pin'}
                </button>
              </>
            )}

            {/* Bước 4: Đang xử lý */}
            {currentStep === 4 && (
              <div style={{ width: '100%', textAlign: 'center', color: '#999', fontSize: '14px' }}>
                Đang xử lý... Vui lòng không đóng cửa sổ
              </div>
            )}

            {/* Bước 5: Hoàn tất */}
            {currentStep === 5 && (
              <button className="btn-swap btn-finish" onClick={handleFinish}>
                🏁 Hoàn tất
              </button>
            )}
          </div>
        </div>
      </div>

      {/* QR Code Popup */}
      {showQRPopup && (
        <div 
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0, 0, 0, 0.75)',
            backdropFilter: 'blur(8px)',
            zIndex: 99999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            animation: 'fadeIn 0.3s ease'
          }}
          onClick={() => setShowQRPopup(false)}
        >
          <div 
            style={{
              background: '#fff',
              borderRadius: '24px',
              padding: '40px',
              maxWidth: '450px',
              width: '90%',
              boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
              position: 'relative',
              animation: 'slideUp 0.3s ease'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button */}
            <button
              onClick={() => setShowQRPopup(false)}
              style={{
                position: 'absolute',
                top: '16px',
                right: '16px',
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                border: 'none',
                background: '#f5f5f5',
                color: '#666',
                fontSize: '24px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.2s ease'
              }}
              onMouseOver={(e) => {
                e.target.style.background = '#ff5252';
                e.target.style.color = '#fff';
              }}
              onMouseOut={(e) => {
                e.target.style.background = '#f5f5f5';
                e.target.style.color = '#666';
              }}
            >
              ×
            </button>

            {/* Header */}
            <div style={{ textAlign: 'center', marginBottom: '32px' }}>
              <div style={{ fontSize: '48px', marginBottom: '16px' }}>📱</div>
              <h3 style={{ 
                margin: '0 0 8px 0', 
                fontSize: '24px', 
                fontWeight: '700',
                background: currentStep === 4 
                  ? 'linear-gradient(135deg, #4caf50 0%, #45a049 100%)'
                  : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}>
                {currentStep === 4 ? 'Mã QR Đổi Pin' : 'Mã QR Nhận Diện'}
              </h3>
              <p style={{ margin: 0, fontSize: '14px', color: '#666' }}>
                {currentStep === 4 
                  ? 'Cho nhân viên quét mã này để xác nhận'
                  : 'Nhân viên sẽ quét mã để xác nhận xe của bạn'
                }
              </p>
            </div>

            {/* QR Code */}
            <div style={{ 
              display: 'flex', 
              justifyContent: 'center', 
              padding: '24px',
              background: currentStep === 4 ? '#f1f8f4' : '#f8f9fa',
              borderRadius: '16px',
              marginBottom: '24px'
            }}>
              <QRCodeSVG
                value={JSON.stringify(
                  currentStep === 4 
                    ? {
                        type: 'SWAP_IN_PROGRESS',
                        swapId: swapResult?.swapId || `TEMP_${Date.now()}`,
                        userId: currentUser?.id || currentUser?.user_id,
                        vehicleId: selectedVehicle?.vehicle_id || selectedVehicle?.vehicleId || selectedVehicle?.id,
                        vehiclePlate: selectedVehicle?.license_plate || selectedVehicle?.licensePlate,
                        stationId: selectedStation?.id,
                        stationName: selectedStation?.name,
                        towerId: selectedTower?.id,
                        towerNumber: selectedTower?.towerNumber,
                        status: 'IN_PROGRESS',
                        initiatedAt: new Date().toISOString()
                      }
                    : {
                        type: 'BATTERY_SWAP',
                        userId: currentUser?.id || currentUser?.user_id,
                        vehicleId: selectedVehicle?.vehicle_id || selectedVehicle?.vehicleId || selectedVehicle?.id,
                        vehiclePlate: selectedVehicle?.license_plate || selectedVehicle?.licensePlate,
                        stationId: selectedStation?.id,
                        stationName: selectedStation?.name,
                        towerId: selectedTower?.id,
                        towerNumber: selectedTower?.towerNumber,
                        contractId: userContract?.contract_id || userContract?.contractId || userContract?.id,
                        batteryLevel: currentBatteryLevel,
                        timestamp: new Date().toISOString()
                      }
                )}
                size={250}
                level="H"
                includeMargin={true}
                bgColor="#ffffff"
                fgColor={currentStep === 4 ? '#4caf50' : '#667eea'}
              />
            </div>

            {/* Info */}
            <div style={{ 
              textAlign: 'center',
              padding: '16px',
              background: '#fff3e0',
              borderRadius: '12px',
              marginBottom: '16px'
            }}>
              <p style={{ margin: '0 0 8px 0', fontSize: '13px', color: '#f57c00', fontWeight: '600' }}>
                ⏱️ Mã QR hợp lệ trong 5 phút
              </p>
              <p style={{ margin: 0, fontSize: '12px', color: '#666' }}>
                📍 {selectedStation?.name} - Trụ {selectedTower?.towerNumber}
              </p>
            </div>

            {/* Close button */}
            <button
              onClick={() => setShowQRPopup(false)}
              style={{
                width: '100%',
                padding: '14px',
                background: '#f5f5f5',
                border: 'none',
                borderRadius: '12px',
                fontSize: '15px',
                fontWeight: '600',
                color: '#666',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
              onMouseOver={(e) => {
                e.target.style.background = '#e0e0e0';
              }}
              onMouseOut={(e) => {
                e.target.style.background = '#f5f5f5';
              }}
            >
              Đóng
            </button>
          </div>
          </div>
        )}
    </DashboardLayout>
  );
};

export default DriverSwapBattery;
