// Staff Swap Confirmation - Refactored Version
import React from 'react';
import { useSwapConfirm } from './hooks/useSwapConfirm';

const SwapConfirmRefactored = () => {
  const {
    swapRequests,
    availableBatteries,
    showConfirmModal,
    selectedRequest,
    selectedNewBattery,
    showPaymentModal,
    paymentAmount,
    paymentMethod,
    showBatteryCheckModal,
    batteryCheckData,
    showCompletedDetailModal,
    completedSwapDetail,
    notification,
    setSelectedNewBattery,
    setPaymentMethod,
    setBatteryCheckData,
    handleConfirmSwap,
    handleSelectBattery,
    handleConfirmPayment,
    handleCompleteBatteryCheck,
    closeAllModals
  } = useSwapConfirm();

  return (
    <div style={{ padding: '30px', background: '#0f172a', minHeight: '100vh', color: '#FFFFFF' }}>
      {/* Notification */}
      {notification.show && (
        <div style={{
          position: 'fixed',
          top: '20px',
          right: '20px',
          padding: '15px 25px',
          borderRadius: '8px',
          background: notification.type === 'success' ? '#19c37d' : 
                      notification.type === 'error' ? '#ff4757' : '#ffa500',
          color: '#fff',
          zIndex: 2000,
          boxShadow: '0 4px 12px rgba(0,0,0,0.3)'
        }}>
          {notification.message}
        </div>
      )}

      <h2 style={{ marginBottom: '30px', fontSize: '28px' }}>
        🔄 Xác nhận đổi pin
      </h2>

      {/* Swap Requests List */}
      {swapRequests.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px', color: '#999' }}>
          ✅ Không có yêu cầu đổi pin nào đang chờ xử lý
        </div>
      ) : (
        <div style={{ overflow: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: 'rgba(255,255,255,0.1)' }}>
                <th style={{ padding: '15px', textAlign: 'left' }}>Mã yêu cầu</th>
                <th style={{ padding: '15px', textAlign: 'left' }}>Tài xế</th>
                <th style={{ padding: '15px', textAlign: 'left' }}>Xe</th>
                <th style={{ padding: '15px', textAlign: 'left' }}>Pin cũ</th>
                <th style={{ padding: '15px', textAlign: 'left' }}>SOC</th>
                <th style={{ padding: '15px', textAlign: 'left' }}>Gói</th>
                <th style={{ padding: '15px', textAlign: 'left' }}>Km/Tháng</th>
                <th style={{ padding: '15px', textAlign: 'center' }}>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {swapRequests.map((request) => (
                <tr key={request.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                  <td style={{ padding: '15px' }}>{request.id}</td>
                  <td style={{ padding: '15px' }}>
                    <div>{request.driverName}</div>
                    <div style={{ fontSize: '12px', color: '#999' }}>{request.driverPhone}</div>
                  </td>
                  <td style={{ padding: '15px' }}>{request.vehicleNumber}</td>
                  <td style={{ padding: '15px' }}>{request.oldBatteryId}</td>
                  <td style={{ padding: '15px' }}>
                    <span style={{ 
                      color: request.oldBatterySOC < 10 ? '#ff4757' : request.oldBatterySOC < 20 ? '#ffa500' : '#19c37d' 
                    }}>
                      {request.oldBatterySOC}%
                    </span>
                  </td>
                  <td style={{ padding: '15px' }}>
                    <span style={{
                      padding: '4px 8px',
                      borderRadius: '4px',
                      background: request.subscriptionType === 'Premium' ? 'rgba(234,179,8,0.2)' : 'rgba(59,130,246,0.2)',
                      fontSize: '12px'
                    }}>
                      {request.subscriptionType}
                    </span>
                  </td>
                  <td style={{ padding: '15px' }}>
                    {request.kmThisMonth} km
                    {request.kmLimit && request.kmThisMonth > request.kmLimit && (
                      <div style={{ fontSize: '11px', color: '#ff4757' }}>
                        Vượt {request.kmThisMonth - request.kmLimit} km
                      </div>
                    )}
                  </td>
                  <td style={{ padding: '15px', textAlign: 'center' }}>
                    <button
                      onClick={() => handleConfirmSwap(request)}
                      style={{
                        padding: '8px 16px',
                        background: '#4F8CFF',
                        color: '#fff',
                        border: 'none',
                        borderRadius: '6px',
                        cursor: 'pointer'
                      }}
                    >
                      Xác nhận
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal 1: Select Battery - Simplified */}
      {showConfirmModal && selectedRequest && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0,0,0,0.7)', display: 'flex',
          alignItems: 'center', justifyContent: 'center', zIndex: 1000
        }}>
          <div style={{
            background: 'rgba(26, 32, 44, 0.95)', borderRadius: '12px',
            padding: '30px', width: '700px', maxWidth: '90vw', maxHeight: '90vh',
            overflow: 'auto', border: '1px solid rgba(255, 255, 255, 0.1)'
          }}>
            <h3 style={{ margin: '0 0 20px 0', fontSize: '22px' }}>
              🔋 Chọn pin mới cho: {selectedRequest.driverName}
            </h3>

            <div style={{ marginBottom: '20px' }}>
              {availableBatteries.map(battery => (
                <div
                  key={battery.id}
                  onClick={() => setSelectedNewBattery(battery)}
                  style={{
                    padding: '15px',
                    background: selectedNewBattery?.id === battery.id ? 'rgba(79, 140, 255, 0.3)' : 'rgba(255,255,255,0.05)',
                    border: selectedNewBattery?.id === battery.id ? '2px solid #4F8CFF' : '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '8px',
                    marginBottom: '10px',
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <div>
                      <div style={{ fontWeight: 'bold' }}>{battery.id}</div>
                      <div style={{ fontSize: '13px', color: '#999' }}>
                        SOC: {battery.soc}% | SOH: {battery.soh}%
                      </div>
                    </div>
                    {selectedNewBattery?.id === battery.id && <span>✅</span>}
                  </div>
                </div>
              ))}
            </div>

            <div style={{ display: 'flex', gap: '10px' }}>
              <button onClick={closeAllModals} style={{
                flex: 1, padding: '12px', background: 'rgba(255,255,255,0.1)',
                border: 'none', borderRadius: '8px', color: '#fff', cursor: 'pointer'
              }}>
                Hủy
              </button>
              <button onClick={handleSelectBattery} style={{
                flex: 1, padding: '12px', background: '#4F8CFF',
                border: 'none', borderRadius: '8px', color: '#fff', cursor: 'pointer'
              }}>
                Tiếp tục
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal 2: Payment - Simplified */}
      {showPaymentModal && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0,0,0,0.7)', display: 'flex',
          alignItems: 'center', justifyContent: 'center', zIndex: 1000
        }}>
          <div style={{
            background: 'rgba(26, 32, 44, 0.95)', borderRadius: '12px',
            padding: '30px', width: '500px', maxWidth: '90vw'
          }}>
            <h3 style={{ margin: '0 0 20px 0' }}>💳 Thanh toán</h3>
            <div style={{ marginBottom: '20px', fontSize: '24px', color: '#ffa500' }}>
              Số tiền: {paymentAmount.toLocaleString('vi-VN')} VNĐ
            </div>
            <select
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
              style={{
                width: '100%', padding: '10px', marginBottom: '20px',
                background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)',
                borderRadius: '8px', color: '#fff'
              }}
            >
              <option value="Cash">Tiền mặt</option>
              <option value="Card">Thẻ</option>
              <option value="MoMo">MoMo</option>
              <option value="ZaloPay">ZaloPay</option>
            </select>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button onClick={closeAllModals} style={{
                flex: 1, padding: '12px', background: 'rgba(255,255,255,0.1)',
                border: 'none', borderRadius: '8px', color: '#fff', cursor: 'pointer'
              }}>
                Hủy
              </button>
              <button onClick={handleConfirmPayment} style={{
                flex: 1, padding: '12px', background: '#19c37d',
                border: 'none', borderRadius: '8px', color: '#fff', cursor: 'pointer'
              }}>
                Xác nhận
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal 3: Battery Check - Simplified */}
      {showBatteryCheckModal && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0,0,0,0.7)', display: 'flex',
          alignItems: 'center', justifyContent: 'center', zIndex: 1000
        }}>
          <div style={{
            background: 'rgba(26, 32, 44, 0.95)', borderRadius: '12px',
            padding: '30px', width: '600px', maxWidth: '90vw'
          }}>
            <h3 style={{ margin: '0 0 20px 0' }}>🔍 Kiểm tra pin cũ</h3>
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '5px' }}>SOH (%) *</label>
              <input
                type="number"
                min="0"
                max="100"
                value={batteryCheckData.soh}
                onChange={(e) => setBatteryCheckData({...batteryCheckData, soh: parseInt(e.target.value) || 0})}
                style={{
                  width: '100%', padding: '10px', background: 'rgba(255,255,255,0.1)',
                  border: '1px solid rgba(255,255,255,0.2)', borderRadius: '8px', color: '#fff'
                }}
              />
            </div>
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '5px' }}>Ghi chú</label>
              <textarea
                value={batteryCheckData.notes}
                onChange={(e) => setBatteryCheckData({...batteryCheckData, notes: e.target.value})}
                style={{
                  width: '100%', padding: '10px', background: 'rgba(255,255,255,0.1)',
                  border: '1px solid rgba(255,255,255,0.2)', borderRadius: '8px',
                  color: '#fff', minHeight: '80px'
                }}
              />
            </div>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button onClick={closeAllModals} style={{
                flex: 1, padding: '12px', background: 'rgba(255,255,255,0.1)',
                border: 'none', borderRadius: '8px', color: '#fff', cursor: 'pointer'
              }}>
                Hủy
              </button>
              <button onClick={handleCompleteBatteryCheck} style={{
                flex: 1, padding: '12px', background: '#19c37d',
                border: 'none', borderRadius: '8px', color: '#fff', cursor: 'pointer'
              }}>
                Hoàn thành
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal 4: Completed Detail - Simplified */}
      {showCompletedDetailModal && completedSwapDetail && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0,0,0,0.7)', display: 'flex',
          alignItems: 'center', justifyContent: 'center', zIndex: 1000
        }}>
          <div style={{
            background: 'rgba(26, 32, 44, 0.95)', borderRadius: '12px',
            padding: '30px', width: '600px', maxWidth: '90vw'
          }}>
            <div style={{ textAlign: 'center', marginBottom: '30px' }}>
              <div style={{ fontSize: '64px' }}>✅</div>
              <h2 style={{ color: '#19c37d', margin: '10px 0' }}>Đổi pin thành công!</h2>
            </div>
            <div style={{
              background: 'rgba(25,195,125,0.1)', padding: '20px',
              borderRadius: '8px', marginBottom: '20px'
            }}>
              <div style={{ marginBottom: '10px' }}>
                <strong>Tài xế:</strong> {completedSwapDetail.driverName}
              </div>
              <div style={{ marginBottom: '10px' }}>
                <strong>Pin cũ:</strong> {completedSwapDetail.oldBatteryId} → 
                <strong> Pin mới:</strong> {completedSwapDetail.newBatteryId}
              </div>
              <div style={{ marginBottom: '10px' }}>
                <strong>Thời gian:</strong> {completedSwapDetail.completedTime}
              </div>
              {completedSwapDetail.paymentAmount > 0 && (
                <div style={{ marginBottom: '10px', color: '#ffa500' }}>
                  <strong>Thanh toán:</strong> {completedSwapDetail.paymentAmount.toLocaleString('vi-VN')} VNĐ
                </div>
              )}
            </div>
            <button onClick={closeAllModals} style={{
              width: '100%', padding: '12px', background: '#4F8CFF',
              border: 'none', borderRadius: '8px', color: '#fff',
              cursor: 'pointer', fontSize: '16px'
            }}>
              Đóng
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SwapConfirmRefactored;

