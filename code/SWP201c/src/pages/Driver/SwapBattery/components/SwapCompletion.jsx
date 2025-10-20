// Swap Completion Component - Step 6
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { swapService } from '../../../../assets/js/services/index.js';

const SwapCompletion = ({
  selectedStation,
  selectedTower,
  selectedVehicle,
  swapId,
  onError
}) => {
  const navigate = useNavigate();
  const [isConfirming, setIsConfirming] = useState(false);
  const [swapResult, setSwapResult] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (swapId && !swapResult && !isConfirming) {
      handleConfirmSwap();
    }
  }, [swapId]);

  // Debug log
  console.log('🔍 SwapCompletion props:', { swapId, selectedStation, selectedTower, selectedVehicle });

  // Show contract and swap details if no swapId (fallback display)
  if (!swapId) {
    return (
      <div style={{ textAlign: 'center', padding: '40px 20px' }}>
        <div style={{ fontSize: '80px', marginBottom: '24px', animation: 'bounce 2s infinite' }}>
          ✅
        </div>
        <h3 style={{ fontSize: '28px', fontWeight: '700', color: '#28a745', marginBottom: '16px' }}>
          Đổi pin thành công!
        </h3>
        <p style={{ fontSize: '16px', color: '#555', marginBottom: '32px', lineHeight: '1.6' }}>
          Pin của bạn đã được thay thế thành công. Xe của bạn đã sẵn sàng để tiếp tục hành trình!
        </p>

        {/* Contract Information */}
        <div style={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: '#fff',
          padding: '25px',
          borderRadius: '15px',
          marginBottom: '20px',
          textAlign: 'center',
          maxWidth: '500px',
          margin: '0 auto 20px auto'
        }}>
          <h4 style={{ fontSize: '20px', fontWeight: '700', marginBottom: '15px', color: '#fff' }}>
            📋 Hợp đồng đổi pin
          </h4>
          <div style={{ display: 'grid', gridTemplateColumns: 'auto 1fr', gap: '10px 15px', fontSize: '14px', textAlign: 'left' }}>
            <strong style={{ color: '#f0f0f0' }}>Mã hợp đồng:</strong>
            <span style={{ color: '#fff', fontWeight: '600' }}>HD-{Date.now().toString().slice(-6)}</span>
            
            <strong style={{ color: '#f0f0f0' }}>Loại dịch vụ:</strong>
            <span style={{ color: '#fff' }}>Đổi pin xe điện</span>
            
            <strong style={{ color: '#f0f0f0' }}>Trạng thái:</strong>
            <span style={{ color: '#4ade80', fontWeight: '600' }}>✅ Hoàn thành</span>
          </div>
        </div>

        {/* Transaction Details */}
        <div style={{
          background: '#f8f9fa',
          padding: '25px',
          borderRadius: '15px',
          marginBottom: '40px',
          border: '1px solid #e0e0e0',
          textAlign: 'left',
          maxWidth: '500px',
          margin: '0 auto'
        }}>
          <h4 style={{ fontSize: '18px', fontWeight: '600', color: '#333', marginBottom: '20px', textAlign: 'center' }}>
            💳 Chi tiết giao dịch
          </h4>
          <div style={{ display: 'grid', gridTemplateColumns: 'auto 1fr', gap: '15px 10px', fontSize: '15px' }}>
            <strong style={{ color: '#555' }}>Trạm sạc:</strong>
            <span style={{ color: '#333' }}>{selectedStation?.name || 'N/A'}</span>

            <strong style={{ color: '#555' }}>Trụ sạc:</strong>
            <span style={{ color: '#333' }}>Trụ {selectedTower?.towerNumber || 'N/A'}</span>

            <strong style={{ color: '#555' }}>Thời gian:</strong>
            <span style={{ color: '#333' }}>{new Date().toLocaleString('vi-VN')}</span>

            <strong style={{ color: '#555' }}>Xe:</strong>
            <span style={{ color: '#333' }}>{selectedVehicle?.plateNumber || selectedVehicle?.vehicleId || 'N/A'}</span>

            <strong style={{ color: '#555' }}>Pin mới:</strong>
            <span style={{ color: '#28a745', fontWeight: '600' }}>100%</span>

            <strong style={{ color: '#555' }}>Chi phí:</strong>
            <span style={{ color: '#dc3545', fontWeight: '600' }}>25,000 VNĐ</span>
          </div>
        </div>

        {/* Top finish button removed - only keep bottom action button */}
      </div>
    );
  }

  const handleConfirmSwap = async () => {
    try {
      setIsConfirming(true);
      setError(null);

      console.log('🚀 Confirming swap completion...', swapId);

      // Call confirm API
      const response = await swapService.confirmSwap(swapId);

      if (response.success) {
        console.log('✅ Swap confirmed successfully:', response.data);
        setSwapResult(response.data);
      } else {
        throw new Error(response.message || 'Không thể xác nhận hoàn tất đổi pin');
      }
  } catch (error) {
      console.error('❌ Error confirming swap:', error);
      setError(error.message || 'Lỗi khi xác nhận hoàn tất đổi pin');
      if (onError) {
        onError(error);
      }
    } finally {
      setIsConfirming(false);
    }
  };

  const handleGoHome = async () => {
    // Ensure confirmation API is called before leaving (saves history and increments dashboard count)
    try {
      if (swapId && !swapResult && !isConfirming) {
        await handleConfirmSwap();
      }
    } catch {
      // ignore navigation confirmation errors
    }

    // Keep the updated vehicle preselected on Dashboard
    let updatedVehicle = selectedVehicle;
    try {
      const fromSession = sessionStorage.getItem('selectedVehicle');
      if (fromSession) {
        updatedVehicle = JSON.parse(fromSession);
      }
    } catch {
      // ignore session parsing errors
    }

    try { sessionStorage.setItem('selectedVehicle', JSON.stringify(updatedVehicle)); } catch { /* ignore */ }
    navigate('/driver/dashboard', { state: { updatedVehicle }, replace: true });
  };

  if (isConfirming) {
    return (
      <div style={{ textAlign: 'center', padding: '40px 20px' }}>
        <div style={{ fontSize: '48px', marginBottom: '24px', animation: 'spin 1s linear infinite' }}>
          ⏳
        </div>
        <h3 style={{ marginBottom: '16px', fontSize: '20px', fontWeight: '600', color: '#333' }}>
          Đang xác nhận hoàn tất...
        </h3>
        <p style={{ color: '#666', fontSize: '14px' }}>
          Vui lòng chờ trong giây lát
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ textAlign: 'center', padding: '40px 20px' }}>
        <div style={{ fontSize: '48px', marginBottom: '24px' }}>❌</div>
        <h3 style={{ marginBottom: '16px', fontSize: '20px', fontWeight: '600', color: '#e74c3c' }}>
          Lỗi xác nhận
        </h3>
        <p style={{ color: '#666', fontSize: '14px', marginBottom: '24px' }}>
          {error}
        </p>
        <button
          onClick={handleConfirmSwap}
          style={{
            padding: '12px 24px',
            background: '#19c37d',
            color: '#fff',
            border: 'none',
            borderRadius: '8px',
            fontSize: '14px',
            fontWeight: '600',
            cursor: 'pointer'
          }}
        >
          Thử lại
        </button>
      </div>
    );
  }

  if (!swapResult) {
    return null;
  }

  return (
    <div style={{ textAlign: 'center', padding: '40px 20px' }}>
      {/* Success Icon */}
      <div style={{ fontSize: '80px', marginBottom: '24px', animation: 'bounce 2s infinite' }}>
        ✅
      </div>

      {/* Success Message */}
      <h2 style={{ 
        marginBottom: '16px', 
        fontSize: '24px', 
        fontWeight: '700', 
        color: '#19c37d' 
      }}>
        Đổi pin thành công!
      </h2>

      {/* Contract Information */}
      <div style={{
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: '#fff',
        padding: '25px',
        borderRadius: '15px',
        marginBottom: '20px',
        textAlign: 'center',
        maxWidth: '500px',
        margin: '0 auto 20px auto'
      }}>
        <h4 style={{ fontSize: '20px', fontWeight: '700', marginBottom: '15px', color: '#fff' }}>
          📋 Hợp đồng đổi pin
        </h4>
        <div style={{ display: 'grid', gridTemplateColumns: 'auto 1fr', gap: '10px 15px', fontSize: '14px', textAlign: 'left' }}>
          <strong style={{ color: '#f0f0f0' }}>Mã hợp đồng:</strong>
          <span style={{ color: '#fff', fontWeight: '600' }}>HD-{Date.now().toString().slice(-6)}</span>
          
          <strong style={{ color: '#f0f0f0' }}>Loại dịch vụ:</strong>
          <span style={{ color: '#fff' }}>Đổi pin xe điện</span>
          
          <strong style={{ color: '#f0f0f0' }}>Trạng thái:</strong>
          <span style={{ color: '#4ade80', fontWeight: '600' }}>✅ Hoàn thành</span>
        </div>
      </div>

      <p style={{ 
        marginBottom: '32px', 
        fontSize: '16px', 
        color: '#666',
        lineHeight: '1.5'
      }}>
        Pin của bạn đã được thay thế thành công. Xe của bạn đã sẵn sàng để tiếp tục hành trình!
      </p>

      {/* Swap Details */}
      <div style={{ 
        marginBottom: '32px', 
        padding: '24px', 
        background: '#f8f9fa', 
        borderRadius: '12px',
        textAlign: 'left'
      }}>
        <h4 style={{ 
          margin: '0 0 16px 0', 
          fontSize: '18px', 
          fontWeight: '600', 
          color: '#333',
          textAlign: 'center'
        }}>
          📋 Chi tiết giao dịch
        </h4>

        <div style={{ display: 'grid', gap: '12px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ color: '#666', fontSize: '14px' }}>Trạm sạc:</span>
            <span style={{ fontWeight: '600', color: '#333' }}>{selectedStation?.name}</span>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ color: '#666', fontSize: '14px' }}>Thời gian:</span>
            <span style={{ fontWeight: '600', color: '#333' }}>
              {new Date().toLocaleTimeString('vi-VN')} {new Date().toLocaleDateString('vi-VN')}
            </span>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ color: '#666', fontSize: '14px' }}>Xe:</span>
            <span style={{ fontWeight: '600', color: '#333' }}>
              {selectedVehicle?.plateNumber || selectedVehicle?.licensePlate || 'N/A'}
            </span>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ color: '#666', fontSize: '14px' }}>Pin mới:</span>
            <span style={{ fontWeight: '600', color: '#19c37d' }}>
              {swapResult.newBatteryLevel || '100%'}
            </span>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ color: '#666', fontSize: '14px' }}>Chi phí:</span>
            <span style={{ fontWeight: '600', color: '#e74c3c', fontSize: '16px' }}>
              {swapResult.cost ? `${swapResult.cost.toLocaleString('vi-VN')} VNĐ` : 'Miễn phí'}
            </span>
          </div>
        </div>
      </div>

      {/* Action Button */}
      <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
        <button
          onClick={handleGoHome}
          style={{
            padding: '16px 32px',
            background: 'linear-gradient(135deg, #19c37d 0%, #4ecdc4 100%)',
            color: '#fff',
            border: 'none',
            borderRadius: '12px',
            fontSize: '16px',
            fontWeight: '600',
            cursor: 'pointer',
            boxShadow: '0 4px 12px rgba(25, 195, 125, 0.3)',
            transition: 'all 0.3s ease'
          }}
          onMouseOver={(e) => {
            e.target.style.transform = 'translateY(-2px)';
            e.target.style.boxShadow = '0 6px 16px rgba(25, 195, 125, 0.4)';
          }}
          onMouseOut={(e) => {
            e.target.style.transform = 'translateY(0)';
            e.target.style.boxShadow = '0 4px 12px rgba(25, 195, 125, 0.3)';
          }}
        >
          🏁 Hoàn tất đổi pin
        </button>
      </div>
    </div>
  );
};

export default SwapCompletion;
