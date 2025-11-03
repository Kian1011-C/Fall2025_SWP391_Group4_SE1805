// Driver/Contracts/components/ContractCard.jsx
// Individual contract card component

import PropTypes from 'prop-types';
import {
  formatCurrency,
  formatShortDate,
  getStatusColor,
  getStatusLabel,
  getPaymentStatusColor,
  getPaymentStatusLabel,
  calculateUsagePercentage,
  getUsageColor
} from '../utils';

const ContractCard = ({ contract, onClick }) => {
  const usagePercentage = calculateUsagePercentage(contract.usedSwaps, contract.swapLimit);
  const usageColor = getUsageColor(usagePercentage);

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
            Mã: {contract.id}
          </p>
        </div>
        <div style={{ textAlign: 'right' }}>
          <p style={{
            fontSize: '1.5rem',
            fontWeight: '700',
            color: '#9c88ff',
            marginBottom: '0.25rem'
          }}>
            {formatCurrency(contract.amount)}
          </p>
          <p style={{
            fontSize: '0.875rem',
            color: '#666'
          }}>
            {contract.swapLimit} KM
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
            {contract.usedSwaps}/{contract.swapLimit} KM
          </p>
        </div>
        
        <div>
          <p style={{
            fontSize: '0.75rem',
            color: '#666',
            marginBottom: '0.25rem'
          }}>
            Thanh toán
          </p>
          <span style={{
            display: 'inline-block',
            padding: '0.25rem 0.5rem',
            borderRadius: '6px',
            fontSize: '0.75rem',
            fontWeight: '600',
            backgroundColor: getPaymentStatusColor(contract.paymentStatus) + '20',
            color: getPaymentStatusColor(contract.paymentStatus)
          }}>
            {getPaymentStatusLabel(contract.paymentStatus)}
          </span>
        </div>
      </div>
    </div>
  );
};

ContractCard.propTypes = {
  contract: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    planName: PropTypes.string.isRequired,
    status: PropTypes.string.isRequired,
    amount: PropTypes.number.isRequired,
    swapLimit: PropTypes.number.isRequired,
    startDate: PropTypes.string.isRequired,
    endDate: PropTypes.string.isRequired,
    usedSwaps: PropTypes.number,
    paymentStatus: PropTypes.string
  }).isRequired,
  onClick: PropTypes.func.isRequired
};

export default ContractCard;
