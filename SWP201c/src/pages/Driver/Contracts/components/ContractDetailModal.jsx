// Driver/Contracts/components/ContractDetailModal.jsx
// Modal for displaying contract details

import PropTypes from 'prop-types';
import {
  formatCurrency,
  formatDate,
  getStatusColor,
  getStatusLabel,
  getPaymentStatusLabel,
  getRemainingSwaps,
  getRemainingDays
} from '../utils';

const ContractDetailModal = ({ contract, isOpen, onClose }) => {
  if (!isOpen || !contract) return null;

  const remainingSwaps = getRemainingSwaps(contract);
  const remainingDays = getRemainingDays(contract.endDate);

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0,0,0,0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
        padding: '1rem'
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          backgroundColor: '#fff',
          borderRadius: '16px',
          padding: '2rem',
          maxWidth: '600px',
          width: '100%',
          maxHeight: '90vh',
          overflowY: 'auto',
          boxShadow: '0 10px 40px rgba(0,0,0,0.2)'
        }}
      >
        {/* Header */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          marginBottom: '2rem'
        }}>
          <div>
            <h2 style={{
              fontSize: '1.75rem',
              fontWeight: '700',
              color: '#1a1a1a',
              marginBottom: '0.5rem'
            }}>
              Chi Tiết Hợp Đồng
            </h2>
            <span
              style={{
                display: 'inline-block',
                padding: '0.375rem 1rem',
                borderRadius: '12px',
                fontSize: '0.875rem',
                fontWeight: '600',
                backgroundColor: getStatusColor(contract.status) + '20',
                color: getStatusColor(contract.status)
              }}
            >
              {getStatusLabel(contract.status)}
            </span>
          </div>
          <button
            onClick={onClose}
            style={{
              padding: '0.5rem',
              fontSize: '1.5rem',
              backgroundColor: 'transparent',
              border: 'none',
              cursor: 'pointer',
              color: '#666',
              lineHeight: 1
            }}
          >
            ×
          </button>
        </div>

        {/* Contract Info */}
        <div style={{ marginBottom: '2rem' }}>
          <div style={{
            display: 'grid',
            gap: '1.5rem'
          }}>
            <div>
              <p style={{
                fontSize: '0.875rem',
                color: '#666',
                marginBottom: '0.5rem'
              }}>
                Tên gói
              </p>
              <p style={{
                fontSize: '1.25rem',
                fontWeight: '700',
                color: '#1a1a1a'
              }}>
                {contract.planName}
              </p>
            </div>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              gap: '1.5rem'
            }}>
              <div>
                <p style={{
                  fontSize: '0.875rem',
                  color: '#666',
                  marginBottom: '0.5rem'
                }}>
                  Mã hợp đồng
                </p>
                <p style={{
                  fontSize: '1rem',
                  fontWeight: '600',
                  color: '#1a1a1a'
                }}>
                  {contract.id}
                </p>
              </div>

              <div>
                <p style={{
                  fontSize: '0.875rem',
                  color: '#666',
                  marginBottom: '0.5rem'
                }}>
                  Giá trị
                </p>
                <p style={{
                  fontSize: '1.25rem',
                  fontWeight: '700',
                  color: '#9c88ff'
                }}>
                  {formatCurrency(contract.amount)}
                </p>
              </div>
            </div>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              gap: '1.5rem'
            }}>
              <div>
                <p style={{
                  fontSize: '0.875rem',
                  color: '#666',
                  marginBottom: '0.5rem'
                }}>
                  Ngày bắt đầu
                </p>
                <p style={{
                  fontSize: '1rem',
                  fontWeight: '600',
                  color: '#1a1a1a'
                }}>
                  {formatDate(contract.startDate)}
                </p>
              </div>

              <div>
                <p style={{
                  fontSize: '0.875rem',
                  color: '#666',
                  marginBottom: '0.5rem'
                }}>
                  Ngày kết thúc
                </p>
                <p style={{
                  fontSize: '1rem',
                  fontWeight: '600',
                  color: '#1a1a1a'
                }}>
                  {formatDate(contract.endDate)}
                </p>
              </div>
            </div>

            {remainingDays !== null && (
              <div>
                <p style={{
                  fontSize: '0.875rem',
                  color: '#666',
                  marginBottom: '0.5rem'
                }}>
                  Thời gian còn lại
                </p>
                <p style={{
                  fontSize: '1rem',
                  fontWeight: '600',
                  color: remainingDays > 7 ? '#19c37d' : '#ffa500'
                }}>
                  {remainingDays} ngày
                </p>
              </div>
            )}

            <div style={{
              padding: '1.5rem',
              backgroundColor: '#f8f9fa',
              borderRadius: '12px'
            }}>
              <p style={{
                fontSize: '0.875rem',
                color: '#666',
                marginBottom: '1rem'
              }}>
                Sử dụng dịch vụ
              </p>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: '1rem',
                textAlign: 'center'
              }}>
                <div>
                  <p style={{
                    fontSize: '1.5rem',
                    fontWeight: '700',
                    color: '#19c37d',
                    marginBottom: '0.25rem'
                  }}>
                    {contract.usedSwaps || 0}
                  </p>
                  <p style={{
                    fontSize: '0.75rem',
                    color: '#666'
                  }}>
                    Đã dùng
                  </p>
                </div>
                <div>
                  <p style={{
                    fontSize: '1.5rem',
                    fontWeight: '700',
                    color: '#6ab7ff',
                    marginBottom: '0.25rem'
                  }}>
                    {remainingSwaps}
                  </p>
                  <p style={{
                    fontSize: '0.75rem',
                    color: '#666'
                  }}>
                    Còn lại
                  </p>
                </div>
                <div>
                  <p style={{
                    fontSize: '1.5rem',
                    fontWeight: '700',
                    color: '#9c88ff',
                    marginBottom: '0.25rem'
                  }}>
                    {contract.swapLimit || 0}
                  </p>
                  <p style={{
                    fontSize: '0.75rem',
                    color: '#666'
                  }}>
                    Tổng số
                  </p>
                </div>
              </div>
            </div>

            <div>
              <p style={{
                fontSize: '0.875rem',
                color: '#666',
                marginBottom: '0.5rem'
              }}>
                Trạng thái thanh toán
              </p>
              <p style={{
                fontSize: '1rem',
                fontWeight: '600',
                color: '#1a1a1a'
              }}>
                {getPaymentStatusLabel(contract.paymentStatus)}
              </p>
            </div>
          </div>
        </div>

        {/* Close Button */}
        <button
          onClick={onClose}
          style={{
            width: '100%',
            padding: '0.875rem',
            fontSize: '1rem',
            fontWeight: '600',
            color: '#fff',
            backgroundColor: '#9c88ff',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            transition: 'all 0.3s ease'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = '#8c78ef';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = '#9c88ff';
          }}
        >
          Đóng
        </button>
      </div>
    </div>
  );
};

ContractDetailModal.propTypes = {
  contract: PropTypes.object,
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired
};

export default ContractDetailModal;
