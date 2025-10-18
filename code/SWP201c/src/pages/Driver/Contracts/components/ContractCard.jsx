// Driver/Contracts/components/ContractCard.jsx
// Individual contract card component

import PropTypes from 'prop-types';
import {
  formatCurrency,
  formatShortDate,
  getStatusColor,
  getStatusLabel,
  calculateUsagePercentage,
  getUsageColor
} from '../utils';

const ContractCard = ({ contract, onClick }) => {
  // Calculate usage percentage based on distance
  const usagePercentage = calculateUsagePercentage(contract.usedDistance, contract.baseDistance);
  const usageColor = getUsageColor(usagePercentage);
  
  // Calculate overage fee if applicable
  const overageDistance = Math.max(0, contract.usedDistance - contract.baseDistance);
  const hasOverage = overageDistance > 0;

  return (
    <div
      onClick={() => onClick(contract)}
      style={{
        backgroundColor: '#fff',
        borderRadius: '12px',
        padding: '1.5rem',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        border: '1px solid #e0e0e0'
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-2px)';
        e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)';
      }}
    >
      {/* Header */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'flex-start',
        marginBottom: '1rem'
      }}>
        <div>
          <span
            style={{
              display: 'inline-block',
              padding: '0.25rem 0.75rem',
              borderRadius: '12px',
              fontSize: '0.75rem',
              fontWeight: '600',
              backgroundColor: getStatusColor(contract.status) + '20',
              color: getStatusColor(contract.status),
              marginBottom: '0.5rem'
            }}
          >
            {getStatusLabel(contract.status)}
          </span>
          <h3 style={{
            fontSize: '1.25rem',
            fontWeight: '700',
            color: '#1a1a1a',
            marginBottom: '0.25rem'
          }}>
            {contract.planName}
          </h3>
          <p style={{
            fontSize: '0.875rem',
            color: '#666'
          }}>
            Mã: {contract.contractNumber}
          </p>
        </div>
        <div style={{ textAlign: 'right' }}>
          <p style={{
            fontSize: '1.5rem',
            fontWeight: '700',
            color: '#9c88ff',
            marginBottom: '0.25rem'
          }}>
            {formatCurrency(contract.monthlyTotalFee)}
          </p>
          <p style={{
            fontSize: '0.875rem',
            color: '#666'
          }}>
            {contract.baseDistance} km/tháng
          </p>
        </div>
      </div>

      {/* Contract Details Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(2, 1fr)',
        gap: '1rem',
        padding: '1rem',
        backgroundColor: '#f8f9fa',
        borderRadius: '8px'
      }}>
        <div>
          <p style={{
            fontSize: '0.75rem',
            color: '#666',
            marginBottom: '0.25rem'
          }}>
            Ngày bắt đầu
          </p>
          <p style={{
            fontSize: '0.875rem',
            fontWeight: '600',
            color: '#1a1a1a'
          }}>
            {formatShortDate(contract.startDate)}
          </p>
        </div>
        
        <div>
          <p style={{
            fontSize: '0.75rem',
            color: '#666',
            marginBottom: '0.25rem'
          }}>
            Ngày kết thúc
          </p>
          <p style={{
            fontSize: '0.875rem',
            fontWeight: '600',
            color: '#1a1a1a'
          }}>
            {formatShortDate(contract.endDate)}
          </p>
        </div>
        
        <div>
          <p style={{
            fontSize: '0.75rem',
            color: '#666',
            marginBottom: '0.25rem'
          }}>
            Đã sử dụng
          </p>
          <p style={{
            fontSize: '0.875rem',
            fontWeight: '600',
            color: usageColor
          }}>
            {contract.usedDistance}/{contract.baseDistance} km ({usagePercentage}%)
          </p>
        </div>
        
        <div>
          <p style={{
            fontSize: '0.75rem',
            color: '#666',
            marginBottom: '0.25rem'
          }}>
            Phí cơ bản
          </p>
          <p style={{
            fontSize: '0.875rem',
            fontWeight: '600',
            color: '#1a1a1a'
          }}>
            {formatCurrency(contract.monthlyBaseFee)}
          </p>
        </div>
        
        {hasOverage && (
          <div style={{ gridColumn: '1 / -1' }}>
            <p style={{
              fontSize: '0.75rem',
              color: '#666',
              marginBottom: '0.25rem'
            }}>
              Phí vượt quá ({overageDistance} km)
            </p>
            <p style={{
              fontSize: '0.875rem',
              fontWeight: '600',
              color: '#ff6b6b'
            }}>
              +{formatCurrency(contract.monthlyOverageFee)}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

ContractCard.propTypes = {
  contract: PropTypes.shape({
    contractId: PropTypes.number.isRequired,
    vehicleId: PropTypes.number.isRequired,
    contractNumber: PropTypes.string.isRequired,
    status: PropTypes.string.isRequired,
    startDate: PropTypes.string.isRequired,
    endDate: PropTypes.string.isRequired,
    planId: PropTypes.number.isRequired,
    planType: PropTypes.string.isRequired,
    planName: PropTypes.string.isRequired,
    monthlyFee: PropTypes.number.isRequired,
    baseDistance: PropTypes.number.isRequired,
    depositFee: PropTypes.number.isRequired,
    usedDistance: PropTypes.number.isRequired,
    monthlyBaseFee: PropTypes.number.isRequired,
    monthlyOverageFee: PropTypes.number.isRequired,
    monthlyTotalFee: PropTypes.number.isRequired
  }).isRequired,
  onClick: PropTypes.func.isRequired
};

export default ContractCard;
