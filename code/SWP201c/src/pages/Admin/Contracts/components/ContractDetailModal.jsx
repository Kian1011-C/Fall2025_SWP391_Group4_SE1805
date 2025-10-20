// Admin/Contracts/components/ContractDetailModal.jsx
// Modal for displaying contract details

import React from 'react';
import {
  getStatusLabel,
  getStatusColor,
  getTypeLabel,
  getPaymentStatusColor,
  formatCurrency,
  getRemainingSwaps
} from '../utils';

export const ContractDetailModal = ({ isOpen, contract, onClose }) => {
  if (!isOpen || !contract) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0,0,0,0.8)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000
    }}>
      <div style={{
        background: 'rgba(26, 32, 44, 0.95)',
        borderRadius: '12px',
        padding: '30px',
        width: '600px',
        maxHeight: '80vh',
        overflowY: 'auto',
        border: '1px solid rgba(255, 255, 255, 0.2)'
      }}>
        {/* Header */}
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          marginBottom: '20px' 
        }}>
          <h3 style={{ color: '#FFFFFF', margin: 0 }}>
            Chi tiết hợp đồng {contract.id}
          </h3>
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              color: '#FFFFFF',
              fontSize: '24px',
              cursor: 'pointer'
            }}
          >
            ×
          </button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Customer Info */}
          <div style={{
            background: 'rgba(255, 255, 255, 0.05)',
            borderRadius: '8px',
            padding: '15px'
          }}>
            <h4 style={{ color: '#FFFFFF', marginBottom: '10px' }}>
              Thông tin khách hàng
            </h4>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              <div>
                <div style={{ color: '#B0B0B0', fontSize: '0.9rem' }}>
                  Tên khách hàng:
                </div>
                <div style={{ color: '#FFFFFF', fontWeight: '500' }}>
                  {contract.userName}
                </div>
              </div>
              <div>
                <div style={{ color: '#B0B0B0', fontSize: '0.9rem' }}>
                  Email:
                </div>
                <div style={{ color: '#FFFFFF', fontWeight: '500' }}>
                  {contract.userEmail}
                </div>
              </div>
            </div>
          </div>

          {/* Contract Info */}
          <div style={{
            background: 'rgba(255, 255, 255, 0.05)',
            borderRadius: '8px',
            padding: '15px'
          }}>
            <h4 style={{ color: '#FFFFFF', marginBottom: '10px' }}>
              Thông tin hợp đồng
            </h4>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              <div>
                <div style={{ color: '#B0B0B0', fontSize: '0.9rem' }}>
                  Loại hợp đồng:
                </div>
                <div style={{ color: '#FFFFFF', fontWeight: '500' }}>
                  {getTypeLabel(contract.type)}
                </div>
              </div>
              <div>
                <div style={{ color: '#B0B0B0', fontSize: '0.9rem' }}>
                  Trạng thái:
                </div>
                <span style={{
                  padding: '4px 12px',
                  borderRadius: '20px',
                  backgroundColor: getStatusColor(contract.status),
                  color: 'white',
                  fontSize: '0.8rem',
                  fontWeight: '500'
                }}>
                  {getStatusLabel(contract.status)}
                </span>
              </div>
              <div>
                <div style={{ color: '#B0B0B0', fontSize: '0.9rem' }}>
                  Số tiền:
                </div>
                <div style={{ color: '#27ae60', fontWeight: '600', fontSize: '1.1rem' }}>
                  {formatCurrency(contract.amount)}
                </div>
              </div>
              <div>
                <div style={{ color: '#B0B0B0', fontSize: '0.9rem' }}>
                  Thanh toán:
                </div>
                <div style={{ 
                  color: getPaymentStatusColor(contract.paymentStatus), 
                  fontWeight: '500' 
                }}>
                  {contract.paymentStatus === 'paid' ? 'Đã thanh toán' : 'Chờ thanh toán'}
                </div>
              </div>
              <div>
                <div style={{ color: '#B0B0B0', fontSize: '0.9rem' }}>
                  Ngày bắt đầu:
                </div>
                <div style={{ color: '#FFFFFF', fontWeight: '500' }}>
                  {contract.startDate}
                </div>
              </div>
              <div>
                <div style={{ color: '#B0B0B0', fontSize: '0.9rem' }}>
                  Ngày kết thúc:
                </div>
                <div style={{ color: '#FFFFFF', fontWeight: '500' }}>
                  {contract.endDate || 'Không giới hạn'}
                </div>
              </div>
            </div>
          </div>

          {/* Usage Info */}
          <div style={{
            background: 'rgba(255, 255, 255, 0.05)',
            borderRadius: '8px',
            padding: '15px'
          }}>
            <h4 style={{ color: '#FFFFFF', marginBottom: '10px' }}>
              Thông tin sử dụng
            </h4>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              <div>
                <div style={{ color: '#B0B0B0', fontSize: '0.9rem' }}>
                  Tổng lần đổi pin:
                </div>
                <div style={{ color: '#FFFFFF', fontWeight: '500' }}>
                  {contract.totalSwaps}
                </div>
              </div>
              <div>
                <div style={{ color: '#B0B0B0', fontSize: '0.9rem' }}>
                  Đã sử dụng:
                </div>
                <div style={{ color: '#FFFFFF', fontWeight: '500' }}>
                  {contract.usedSwaps}
                </div>
              </div>
              <div>
                <div style={{ color: '#B0B0B0', fontSize: '0.9rem' }}>
                  Còn lại:
                </div>
                <div style={{ color: '#27ae60', fontWeight: '600' }}>
                  {getRemainingSwaps(contract)}
                </div>
              </div>
              <div>
                <div style={{ color: '#B0B0B0', fontSize: '0.9rem' }}>
                  Lần đổi pin cuối:
                </div>
                <div style={{ color: '#FFFFFF', fontWeight: '500' }}>
                  {contract.lastSwap || 'Chưa sử dụng'}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Close Button */}
        <div style={{ marginTop: '25px', textAlign: 'right' }}>
          <button
            onClick={onClose}
            style={{
              padding: '12px 24px',
              background: '#3498db',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer'
            }}
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
};
