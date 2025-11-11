// Driver/Contracts/components/ContractDetailModal.jsx
// Modal for displaying contract details

import PropTypes from 'prop-types';
import {
  formatCurrency,
  formatDate,
  getStatusColor,
  getStatusLabel,
} from '../utils';

const ContractDetailModal = ({ contract, isOpen, onClose }) => {
  if (!isOpen || !contract) return null;



  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0,0,0,0.6)',
        backdropFilter: 'blur(4px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
        padding: '1rem',
        animation: 'fadeIn 0.2s ease-out'
      }}
    >
      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        @keyframes slideUp {
          from {
            transform: translateY(20px);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }
      `}</style>
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          backgroundColor: '#fff',
          borderRadius: '20px',
          padding: '2.5rem',
          maxWidth: '650px',
          width: '100%',
          maxHeight: '90vh',
          overflowY: 'auto',
          boxShadow: '0 20px 60px rgba(0,0,0,0.3), 0 0 0 1px rgba(255,255,255,0.1)',
          animation: 'slideUp 0.3s ease-out',
          position: 'relative'
        }}
      >
        {/* Header */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          marginBottom: '2.5rem',
          paddingBottom: '1.5rem',
          borderBottom: '2px solid #f0f0f0'
        }}>
          <div>
            <h2 style={{
              fontSize: '2rem',
              fontWeight: '800',
              color: '#1a1a1a',
              marginBottom: '0.75rem',
              letterSpacing: '-0.02em'
            }}>
              Chi Tiết Hợp Đồng
            </h2>
            <span
              style={{
                display: 'inline-block',
                padding: '0.5rem 1.25rem',
                borderRadius: '20px',
                fontSize: '0.875rem',
                fontWeight: '700',
                backgroundColor: getStatusColor(contract.status) + '20',
                color: getStatusColor(contract.status),
                border: `1px solid ${getStatusColor(contract.status)}40`,
                boxShadow: `0 2px 8px ${getStatusColor(contract.status)}20`
              }}
            >
              {getStatusLabel(contract.status)}
            </span>
          </div>
          <button
            onClick={onClose}
            style={{
              width: '40px',
              height: '40px',
              padding: '0',
              fontSize: '1.75rem',
              backgroundColor: '#f5f5f5',
              border: 'none',
              borderRadius: '50%',
              cursor: 'pointer',
              color: '#666',
              lineHeight: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.2s ease',
              fontWeight: '300'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#e0e0e0';
              e.currentTarget.style.transform = 'rotate(90deg)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#f5f5f5';
              e.currentTarget.style.transform = 'rotate(0deg)';
            }}
          >
            ×
          </button>
        </div>

        {/* Contract Info */}
        <div style={{ marginBottom: '2rem' }}>
          <div style={{
            display: 'grid',
            gap: '2rem'
          }}>
            <div style={{
              padding: '1.5rem',
              backgroundColor: 'linear-gradient(135deg, #f8f9ff 0%, #f0f4ff 100%)',
              background: 'linear-gradient(135deg, #f8f9ff 0%, #f0f4ff 100%)',
              borderRadius: '16px',
              border: '1px solid #e8edff'
            }}>
              <p style={{
                fontSize: '0.75rem',
                color: '#888',
                marginBottom: '0.5rem',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                fontWeight: '600'
              }}>
                Tên gói
              </p>
              <p style={{
                fontSize: '1.5rem',
                fontWeight: '800',
                color: '#1a1a1a',
                letterSpacing: '-0.01em',
                marginBottom: '0.5rem'
              }}>
                {contract.planName}
              </p>
              {contract.description && (
                <p style={{
                  fontSize: '0.875rem',
                  color: '#666',
                  margin: 0,
                  fontStyle: 'italic'
                }}>
                  {contract.description}
                </p>
              )}
            </div>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              gap: '1.5rem'
            }}>
              <div style={{
                padding: '1.25rem',
                backgroundColor: '#fafafa',
                borderRadius: '12px',
                border: '1px solid #f0f0f0'
              }}>
                <p style={{
                  fontSize: '0.75rem',
                  color: '#888',
                  marginBottom: '0.5rem',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                  fontWeight: '600'
                }}>
                  Mã hợp đồng
                </p>
                <p style={{
                  fontSize: '1.125rem',
                  fontWeight: '700',
                  color: '#1a1a1a',
                  fontFamily: 'monospace'
                }}>
                  {contract.contractNumber || `#${contract.contractId || contract.id}`}
                </p>
              </div>

              <div style={{
                padding: '1.25rem',
                backgroundColor: 'linear-gradient(135deg, #f8f4ff 0%, #f0e8ff 100%)',
                background: 'linear-gradient(135deg, #f8f4ff 0%, #f0e8ff 100%)',
                borderRadius: '12px',
                border: '1px solid #e8dfff'
              }}>
                <p style={{
                  fontSize: '0.75rem',
                  color: '#888',
                  marginBottom: '0.5rem',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                  fontWeight: '600'
                }}>
                  Tổng phí tháng
                </p>
                <p style={{
                  fontSize: '1.5rem',
                  fontWeight: '800',
                  color: '#9c88ff',
                  letterSpacing: '-0.01em'
                }}>
                  {formatCurrency(contract.monthlyTotalFee || contract.amount)}
                </p>
              </div>
            </div>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              gap: '1.5rem'
            }}>
              <div style={{
                padding: '1.25rem',
                backgroundColor: '#fafafa',
                borderRadius: '12px',
                border: '1px solid #f0f0f0'
              }}>
                <p style={{
                  fontSize: '0.75rem',
                  color: '#888',
                  marginBottom: '0.5rem',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                  fontWeight: '600'
                }}>
                  Ngày bắt đầu
                </p>
                <p style={{
                  fontSize: '1rem',
                  fontWeight: '700',
                  color: '#1a1a1a'
                }}>
                  {formatDate(contract.startDate)}
                </p>
              </div>

              <div style={{
                padding: '1.25rem',
                backgroundColor: '#fafafa',
                borderRadius: '12px',
                border: '1px solid #f0f0f0'
              }}>
                <p style={{
                  fontSize: '0.75rem',
                  color: '#888',
                  marginBottom: '0.5rem',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                  fontWeight: '600'
                }}>
                  Ngày kết thúc
                </p>
                <p style={{
                  fontSize: '1rem',
                  fontWeight: '700',
                  color: '#1a1a1a'
                }}>
                  {formatDate(contract.endDate)}
                </p>
              </div>
            </div>

            {/* Service Usage Section */}
            <div style={{
              padding: '2rem',
              background: 'linear-gradient(135deg, #9c88ff 0%, #8c78ef 100%)',
              borderRadius: '16px',
              boxShadow: '0 8px 24px rgba(156, 136, 255, 0.3)',
              position: 'relative',
              overflow: 'hidden'
            }}>
              <div style={{
                position: 'absolute',
                top: '-50%',
                right: '-50%',
                width: '200%',
                height: '200%',
                background: 'radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%)',
                pointerEvents: 'none'
              }}></div>
              <p style={{
                fontSize: '0.75rem',
                color: 'rgba(255,255,255,0.9)',
                marginBottom: '1.5rem',
                textTransform: 'uppercase',
                letterSpacing: '0.1em',
                fontWeight: '700'
              }}>
                Sử dụng dịch vụ
              </p>
              {contract.isUnlimited || contract.baseDistance === -1 || contract.baseDistance < 0 ? (
                // Gói không giới hạn
                <div style={{
                  textAlign: 'center'
                }}>
                  <p style={{
                    fontSize: '2.5rem',
                    fontWeight: '900',
                    color: '#fff',
                    margin: 0,
                    letterSpacing: '-0.02em',
                    textShadow: '0 2px 10px rgba(0,0,0,0.2)'
                  }}>
                    Không giới hạn
                  </p>
                </div>
              ) : (
                // Gói có giới hạn
                <>
                  <div style={{
                    display: 'flex',
                    alignItems: 'baseline',
                    justifyContent: 'center',
                    gap: '0.5rem',
                    marginBottom: '1rem'
                  }}>
                    <p style={{
                      fontSize: '3rem',
                      fontWeight: '900',
                      color: '#fff',
                      margin: 0,
                      letterSpacing: '-0.02em',
                      textShadow: '0 2px 10px rgba(0,0,0,0.2)'
                    }}>
                      {contract.usedDistance || 0}
                    </p>
                    <p style={{
                      fontSize: '1.25rem',
                      color: 'rgba(255,255,255,0.9)',
                      fontWeight: '600',
                      margin: 0
                    }}>
                      / {contract.baseDistance || contract.swapLimit || 0} Km
                    </p>
                  </div>
                  {contract.usedDistance !== undefined && contract.baseDistance !== undefined && (
                    <div style={{
                      textAlign: 'center',
                      color: 'rgba(255,255,255,0.9)',
                      fontSize: '0.875rem'
                    }}>
                      {contract.usedDistance > contract.baseDistance ? (
                        <span style={{ fontWeight: '600' }}>
                          Vượt quá: {(contract.usedDistance - contract.baseDistance).toFixed(2)} Km
                        </span>
                      ) : (
                        <span>
                          Còn lại: {(contract.baseDistance - contract.usedDistance).toFixed(2)} Km
                        </span>
                      )}
                    </div>
                  )}
                </>
              )}
            </div>

            {/* Fee Details */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              gap: '1rem'
            }}>
              {contract.monthlyBaseFee !== undefined && (
                <div style={{
                  padding: '1rem',
                  backgroundColor: '#fafafa',
                  borderRadius: '12px',
                  border: '1px solid #f0f0f0'
                }}>
                  <p style={{
                    fontSize: '0.7rem',
                    color: '#888',
                    marginBottom: '0.25rem',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                    fontWeight: '600'
                  }}>
                    Phí cơ bản
                  </p>
                  <p style={{
                    fontSize: '1rem',
                    fontWeight: '700',
                    color: '#1a1a1a'
                  }}>
                    {formatCurrency(contract.monthlyBaseFee)}
                  </p>
                </div>
              )}
              
              {contract.monthlyOverageFee !== undefined && contract.monthlyOverageFee > 0 && (
                <div style={{
                  padding: '1rem',
                  backgroundColor: '#fff5f5',
                  borderRadius: '12px',
                  border: '1px solid #ffe0e0'
                }}>
                  <p style={{
                    fontSize: '0.7rem',
                    color: '#888',
                    marginBottom: '0.25rem',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                    fontWeight: '600'
                  }}>
                    Phí vượt quá
                  </p>
                  <p style={{
                    fontSize: '1rem',
                    fontWeight: '700',
                    color: '#e53e3e'
                  }}>
                    {formatCurrency(contract.monthlyOverageFee)}
                  </p>
                </div>
              )}
            </div>

            {contract.depositFee !== undefined && contract.depositFee > 0 && (
              <div style={{
                padding: '1.25rem',
                backgroundColor: '#fafafa',
                borderRadius: '12px',
                border: '1px solid #f0f0f0'
              }}>
                <p style={{
                  fontSize: '0.75rem',
                  color: '#888',
                  marginBottom: '0.5rem',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                  fontWeight: '600'
                }}>
                  Phí đặt cọc
                </p>
                <p style={{
                  fontSize: '1.125rem',
                  fontWeight: '700',
                  color: '#1a1a1a'
                }}>
                  {formatCurrency(contract.depositFee)}
                </p>
              </div>
            )}

            <div style={{
              padding: '1.25rem',
              backgroundColor: '#fafafa',
              borderRadius: '12px',
              border: '1px solid #f0f0f0'
            }}>
              <p style={{
                fontSize: '0.75rem',
                color: '#888',
                marginBottom: '0.5rem',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                fontWeight: '600'
              }}>
                Trạng thái hoạt động
              </p>
              <p style={{
                fontSize: '1.125rem',
                fontWeight: '700',
                color: getStatusColor(contract.status)
              }}>
                {getStatusLabel(contract.status) || 'Chưa xác định'}
              </p>
            </div>
          </div>
        </div>

        {/* Close Button */}
        <button
          onClick={onClose}
          style={{
            width: '100%',
            padding: '1rem',
            fontSize: '1.125rem',
            fontWeight: '700',
            color: '#fff',
            background: 'linear-gradient(135deg, #9c88ff 0%, #8c78ef 100%)',
            border: 'none',
            borderRadius: '12px',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            boxShadow: '0 4px 16px rgba(156, 136, 255, 0.4)',
            letterSpacing: '0.02em'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-2px)';
            e.currentTarget.style.boxShadow = '0 6px 20px rgba(156, 136, 255, 0.5)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 4px 16px rgba(156, 136, 255, 0.4)';
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
