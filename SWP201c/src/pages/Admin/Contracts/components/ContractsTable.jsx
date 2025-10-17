// Admin/Contracts/components/ContractsTable.jsx
// Table component for displaying contracts

import React from 'react';
import {
  getStatusLabel,
  getStatusColor,
  getTypeLabel,
  getPaymentStatusColor,
  formatCurrency,
  calculateUsagePercentage
} from '../utils';

export const ContractsTable = ({ contracts, onViewDetails, onApprove }) => {
  if (!contracts || contracts.length === 0) {
    return (
      <div style={{
        textAlign: 'center',
        padding: '40px',
        color: '#B0B0B0',
        fontSize: '1.1rem',
        background: 'rgba(26, 32, 44, 0.8)',
        borderRadius: '12px',
        border: '1px solid rgba(255, 255, 255, 0.1)'
      }}>
        Không tìm thấy hợp đồng nào
      </div>
    );
  }

  return (
    <div style={{
      background: 'rgba(26, 32, 44, 0.8)',
      borderRadius: '12px',
      border: '1px solid rgba(255, 255, 255, 0.1)',
      overflow: 'hidden'
    }}>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ background: 'rgba(255, 255, 255, 0.05)' }}>
            <th style={{ 
              padding: '15px', 
              textAlign: 'left', 
              color: '#FFFFFF', 
              borderBottom: '1px solid rgba(255, 255, 255, 0.1)' 
            }}>
              Mã hợp đồng
            </th>
            <th style={{ 
              padding: '15px', 
              textAlign: 'left', 
              color: '#FFFFFF', 
              borderBottom: '1px solid rgba(255, 255, 255, 0.1)' 
            }}>
              Khách hàng
            </th>
            <th style={{ 
              padding: '15px', 
              textAlign: 'left', 
              color: '#FFFFFF', 
              borderBottom: '1px solid rgba(255, 255, 255, 0.1)' 
            }}>
              Loại
            </th>
            <th style={{ 
              padding: '15px', 
              textAlign: 'left', 
              color: '#FFFFFF', 
              borderBottom: '1px solid rgba(255, 255, 255, 0.1)' 
            }}>
              Trạng thái
            </th>
            <th style={{ 
              padding: '15px', 
              textAlign: 'left', 
              color: '#FFFFFF', 
              borderBottom: '1px solid rgba(255, 255, 255, 0.1)' 
            }}>
              Số tiền
            </th>
            <th style={{ 
              padding: '15px', 
              textAlign: 'left', 
              color: '#FFFFFF', 
              borderBottom: '1px solid rgba(255, 255, 255, 0.1)' 
            }}>
              Sử dụng
            </th>
            <th style={{ 
              padding: '15px', 
              textAlign: 'left', 
              color: '#FFFFFF', 
              borderBottom: '1px solid rgba(255, 255, 255, 0.1)' 
            }}>
              Thao tác
            </th>
          </tr>
        </thead>
        <tbody>
          {contracts.map(contract => (
            <tr key={contract.id} style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.05)' }}>
              {/* Contract ID */}
              <td style={{ padding: '15px', color: '#FFFFFF', fontWeight: '600' }}>
                {contract.id}
              </td>

              {/* Customer Info */}
              <td style={{ padding: '15px' }}>
                <div style={{ color: '#FFFFFF', fontWeight: '500' }}>
                  {contract.userName}
                </div>
                <div style={{ color: '#B0B0B0', fontSize: '0.9rem' }}>
                  {contract.userEmail}
                </div>
              </td>

              {/* Contract Type */}
              <td style={{ padding: '15px' }}>
                <span style={{
                  padding: '4px 12px',
                  borderRadius: '20px',
                  backgroundColor: '#3498db',
                  color: 'white',
                  fontSize: '0.8rem',
                  fontWeight: '500'
                }}>
                  {getTypeLabel(contract.type)}
                </span>
              </td>

              {/* Status */}
              <td style={{ padding: '15px' }}>
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
              </td>

              {/* Amount */}
              <td style={{ padding: '15px' }}>
                <div style={{ color: '#27ae60', fontWeight: '600' }}>
                  {formatCurrency(contract.amount)}
                </div>
                <div style={{ 
                  color: getPaymentStatusColor(contract.paymentStatus), 
                  fontSize: '0.8rem',
                  fontWeight: '500'
                }}>
                  {contract.paymentStatus === 'paid' ? 'Đã thanh toán' : 'Chờ thanh toán'}
                </div>
              </td>

              {/* Usage */}
              <td style={{ padding: '15px' }}>
                <div style={{ color: '#FFFFFF', marginBottom: '5px' }}>
                  {contract.usedSwaps}/{contract.totalSwaps}
                </div>
                <div style={{ 
                  width: '80px', 
                  height: '6px', 
                  background: 'rgba(255, 255, 255, 0.2)', 
                  borderRadius: '3px', 
                  overflow: 'hidden'
                }}>
                  <div style={{
                    width: `${calculateUsagePercentage(contract.usedSwaps, contract.totalSwaps)}%`,
                    height: '100%',
                    backgroundColor: '#27ae60'
                  }}></div>
                </div>
              </td>

              {/* Actions */}
              <td style={{ padding: '15px' }}>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button
                    onClick={() => onViewDetails(contract)}
                    style={{
                      padding: '6px 12px',
                      background: '#3498db',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      fontSize: '0.8rem'
                    }}
                  >
                    👁️
                  </button>
                  <button
                    onClick={() => onApprove(contract.id)}
                    style={{
                      padding: '6px 12px',
                      background: '#27ae60',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      fontSize: '0.8rem'
                    }}
                  >
                    ✅
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
