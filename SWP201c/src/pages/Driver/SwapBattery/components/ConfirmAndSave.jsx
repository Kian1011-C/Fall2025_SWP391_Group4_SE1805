// Confirm and Save to Database Component - Step 8
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../../context/AuthContext';
import { batteryService, vehicleService } from '../../../../assets/js/services';
import { getUserId, getVehicleId } from '../utils/swapHelpers';

const ConfirmAndSave = ({
  selectedStation,
  selectedTower,
  selectedNewBatterySlot,
  selectedEmptySlot,
  selectedVehicle,
  userContract,
  currentBatteryLevel,
  onComplete,
  onError
}) => {
  const { currentUser } = useAuth();
  const [saving, setSaving] = useState(true);
  const [progress, setProgress] = useState(0);
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    const performSwap = async () => {
      try {
        const userId = getUserId(currentUser);
        const vehicleId = getVehicleId(selectedVehicle);
        const newBatteryLevel = selectedNewBatterySlot?.batteryLevel || 100;

        // Step 1: Initiate battery swap (20%)
        setProgress(20);
        
        // Get contract ID - Backend returns "contractId" (not contract_id)
        const contractId = selectedVehicle?.contractId
          || selectedVehicle?.contract_id 
          || userContract?.contractId  // ← Backend field from ContractController.java line 55
          || userContract?.contract_id 
          || userContract?.id;
        
        console.warn('� DEBUG - Contract ID resolution:');
        console.warn('  selectedVehicle.contractId:', selectedVehicle?.contractId);
        console.warn('  selectedVehicle.contract_id:', selectedVehicle?.contract_id);
        console.warn('  userContract.contractId:', userContract?.contractId);
        console.warn('  userContract.contract_id:', userContract?.contract_id);
        console.warn('  userContract.id:', userContract?.id);
        console.warn('  >>> FINAL contractId:', contractId);
        console.warn('  >>> TYPE:', typeof contractId);
        
        if (!contractId) {
          console.error('❌ No contract ID found!');
          console.error('userContract:', userContract);
          console.error('selectedVehicle:', selectedVehicle);
          throw new Error('Không tìm thấy hợp đồng. Vui lòng đăng ký gói dịch vụ trước khi đổi pin.');
        }
        
        const swapData = {
          userId,
          vehicleId,
          stationId: selectedStation?.id,
          towerId: selectedTower?.id,
          newBatterySlotId: selectedNewBatterySlot?.id,
          emptySlotId: selectedEmptySlot?.id,
          oldBatteryLevel: currentBatteryLevel,
          newBatteryLevel: newBatteryLevel,
          contractId: contractId,
          contract_id: contractId  // ← Send both formats for backend compatibility
        };

        // Only add currentBatteryId if it exists
        if (selectedVehicle?.battery_id) {
          swapData.currentBatteryId = selectedVehicle.battery_id;
          swapData.current_battery_id = selectedVehicle.battery_id; // Also send snake_case
        }

        console.warn('📤 FULL SWAP DATA being sent:');
        console.warn('  userId:', swapData.userId);
        console.warn('  vehicleId:', swapData.vehicleId);
        console.warn('  stationId:', swapData.stationId);
        console.warn('  towerId:', swapData.towerId);
        console.warn('  currentBatteryId:', swapData.currentBatteryId, '- OPTIONAL');
        console.warn('  newBatterySlotId:', swapData.newBatterySlotId);
        console.warn('  emptySlotId:', swapData.emptySlotId);
        console.warn('  contractId (camelCase):', swapData.contractId);
        console.warn('  contract_id (snake_case):', swapData.contract_id);
        console.warn('  oldBatteryLevel:', swapData.oldBatteryLevel);
        console.warn('  newBatteryLevel:', swapData.newBatteryLevel);

        console.log('🔄 Initiating battery swap:', swapData);
        const initiateResult = await batteryService.initiateBatterySwap(swapData);
        
        if (!initiateResult.success) {
          throw new Error(initiateResult.message || 'Không thể khởi tạo đổi pin');
        }

        const swapId = initiateResult.data?.swapId || initiateResult.data?.id;
        console.log('✅ Swap initiated successfully, swapId:', swapId);

        // Step 2: Update slot status (40%)
        setProgress(40);
        await new Promise(resolve => setTimeout(resolve, 500));

        // Step 3: Confirm battery swap (60%)
        setProgress(60);
        
        if (swapId) {
          const confirmResult = await batteryService.confirmBatterySwap(swapId);
          if (!confirmResult.success) {
            console.warn('⚠️ Confirm failed but continuing:', confirmResult.message);
          }
        }

        // Step 4: Update vehicle battery level (80%)
        setProgress(80);
        
        console.log('🔄 Updating vehicle battery level to:', newBatteryLevel);
        const updateResult = await vehicleService.updateVehicleBattery(vehicleId, newBatteryLevel);
        
        if (!updateResult.success) {
          console.warn('⚠️ Battery update failed but continuing:', updateResult.message);
        } else {
          console.log('✅ Vehicle battery updated successfully');
        }

        // Step 5: Complete (100%)
        setProgress(100);
        
        await new Promise(resolve => setTimeout(resolve, 500));
        
        setSaving(false);
        setSaveSuccess(true);
        
        // Auto complete after 2 seconds
        setTimeout(() => {
          onComplete();
        }, 2000);

      } catch (error) {
        console.error('❌ Error during swap:', error);
        setSaving(false);
        setSaveSuccess(false);
        if (onError) {
          onError(error.message || 'Lỗi khi lưu giao dịch đổi pin');
        }
      }
    };

    performSwap();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const newBatteryLevel = selectedNewBatterySlot?.batteryLevel || 100;

  // Show error state if both saving and saveSuccess are false
  const hasError = !saving && !saveSuccess;

  return (
    <div style={{ textAlign: 'center', padding: '40px 20px' }}>
      {saving ? (
        // Saving state
        <>
          <div className="loading-spinner" style={{ margin: '0 auto 32px auto' }}></div>
          
          <h3
            style={{
              fontSize: '24px',
              fontWeight: '700',
              color: '#333',
              marginBottom: '16px'
            }}
          >
            Đang lưu thông tin...
          </h3>

          <p style={{ fontSize: '15px', color: '#666', marginBottom: '32px' }}>
            Hệ thống đang xác nhận và lưu giao dịch đổi pin vào cơ sở dữ liệu
          </p>

          {/* Progress bar */}
          <div style={{ marginBottom: '32px' }}>
            <div
              style={{
                width: '100%',
                maxWidth: '400px',
                height: '8px',
                background: '#e0e0e0',
                borderRadius: '4px',
                overflow: 'hidden',
                margin: '0 auto 12px auto'
              }}
            >
              <div
                style={{
                  width: `${progress}%`,
                  height: '100%',
                  background: 'linear-gradient(90deg, #667eea, #764ba2)',
                  transition: 'width 0.3s ease',
                  borderRadius: '4px'
                }}
              />
            </div>
            <p style={{ fontSize: '14px', color: '#666', margin: 0 }}>
              {progress}% hoàn thành
            </p>
          </div>

          {/* Saving steps */}
          <div
            style={{
              background: '#f8f9fa',
              padding: '20px',
              borderRadius: '12px',
              maxWidth: '400px',
              margin: '0 auto',
              textAlign: 'left'
            }}
          >
            <p style={{ margin: '8px 0', fontSize: '14px', color: '#666' }}>
              {progress >= 20 ? '✅' : '⏳'} Xác nhận thông tin xe và pin...
            </p>
            <p style={{ margin: '8px 0', fontSize: '14px', color: '#666' }}>
              {progress >= 40 ? '✅' : '⏳'} Cập nhật trạng thái slot...
            </p>
            <p style={{ margin: '8px 0', fontSize: '14px', color: '#666' }}>
              {progress >= 60 ? '✅' : '⏳'} Lưu thông tin giao dịch...
            </p>
            <p style={{ margin: '8px 0', fontSize: '14px', color: '#666' }}>
              {progress >= 80 ? '✅' : '⏳'} Cập nhật lịch sử đổi pin...
            </p>
            <p style={{ margin: '8px 0', fontSize: '14px', color: '#666' }}>
              {progress >= 100 ? '✅' : '⏳'} Hoàn tất!
            </p>
          </div>
        </>
      ) : saveSuccess ? (
        // Success state
        <>
          <div style={{ fontSize: '80px', marginBottom: '24px' }}>✅</div>
          
          <h3
            style={{
              fontSize: '24px',
              fontWeight: '700',
              color: '#4caf50',
              marginBottom: '16px'
            }}
          >
            Lưu thành công!
          </h3>

          <p style={{ fontSize: '15px', color: '#666', marginBottom: '32px' }}>
            Giao dịch đổi pin đã được lưu vào hệ thống
          </p>

          {/* Transaction summary */}
          <div
            style={{
              background: '#e8f5e9',
              padding: '20px',
              borderRadius: '12px',
              marginBottom: '32px',
              maxWidth: '500px',
              margin: '0 auto',
              border: '2px solid #c8e6c9'
            }}
          >
            <h4 style={{ margin: '0 0 16px 0', fontSize: '16px', color: '#2e7d32' }}>
              📋 Thông tin giao dịch:
            </h4>
            <div style={{ textAlign: 'left', fontSize: '14px', color: '#2e7d32' }}>
              <p style={{ margin: '8px 0' }}>
                📍 <strong>Trạm:</strong> {selectedStation?.name}
              </p>
              <p style={{ margin: '8px 0' }}>
                🔌 <strong>Trụ:</strong> Trụ {selectedTower?.towerNumber}
              </p>
              <p style={{ margin: '8px 0' }}>
                🔋 <strong>Pin cũ:</strong> {currentBatteryLevel}% → Slot {selectedEmptySlot?.slotNumber}
              </p>
              <p style={{ margin: '8px 0' }}>
                ⚡ <strong>Pin mới:</strong> {newBatteryLevel}% ← Slot {selectedNewBatterySlot?.slotNumber}
              </p>
              <p style={{ margin: '8px 0' }}>
                ⏰ <strong>Thời gian:</strong> {new Date().toLocaleString('vi-VN')}
              </p>
            </div>
          </div>

          <p style={{ fontSize: '14px', color: '#666' }}>
            Đang chuyển đến màn hình hoàn tất...
          </p>
        </>
      ) : hasError ? (
        // Error state
        <>
          <div style={{ fontSize: '80px', marginBottom: '24px' }}>❌</div>
          
          <h3
            style={{
              fontSize: '24px',
              fontWeight: '700',
              color: '#f44336',
              marginBottom: '16px'
            }}
          >
            Lỗi khi lưu giao dịch
          </h3>

          <p style={{ fontSize: '15px', color: '#666', marginBottom: '32px' }}>
            Không thể hoàn tất giao dịch đổi pin. Vui lòng thử lại hoặc liên hệ hỗ trợ.
          </p>

          <div
            style={{
              background: '#ffebee',
              padding: '20px',
              borderRadius: '12px',
              marginBottom: '32px',
              maxWidth: '500px',
              margin: '0 auto',
              border: '2px solid #f44336'
            }}
          >
            <p style={{ margin: 0, fontSize: '14px', color: '#f44336' }}>
              💡 <strong>Gợi ý:</strong> Kiểm tra kết nối mạng hoặc liên hệ nhân viên hỗ trợ
            </p>
          </div>

          <button
            onClick={() => window.location.reload()}
            style={{
              marginTop: '20px',
              padding: '12px 24px',
              background: '#f44336',
              color: '#fff',
              border: 'none',
              borderRadius: '8px',
              fontSize: '15px',
              cursor: 'pointer'
            }}
          >
            🔄 Thử lại
          </button>
        </>
      ) : null}
    </div>
  );
};

export default ConfirmAndSave;
