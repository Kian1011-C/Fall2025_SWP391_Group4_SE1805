// Driver/Subscriptions/components/EmptyPlans.jsx
// Empty state when no plans are available

import PropTypes from 'prop-types';

const EmptyPlans = ({ onRetry }) => {
  return (
    <div style={{
      background: 'rgba(26, 32, 44, 0.8)',
      borderRadius: '20px',
      textAlign: 'center',
      padding: '60px 20px',
      color: '#B0B0B0',
      border: '1px solid rgba(255, 255, 255, 0.1)',
      marginBottom: '30px'
    }}>
      <div style={{ fontSize: '4rem', marginBottom: '20px' }}>📦</div>
      <div style={{ fontSize: '1.3rem', marginBottom: '10px', color: '#FFFFFF' }}>
        Hiện chưa có gói dịch vụ nào
      </div>
      <div style={{ fontSize: '1rem', marginBottom: '20px' }}>
        Vui lòng liên hệ admin để được hỗ trợ
      </div>
      <button
        onClick={onRetry}
        style={{
          padding: '12px 24px',
          background: '#19c37d',
          color: 'white',
          border: 'none',
          borderRadius: '10px',
          cursor: 'pointer',
          fontSize: '1rem',
          transition: 'all 0.3s ease'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = '#17b370';
          e.currentTarget.style.transform = 'translateY(-2px)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = '#19c37d';
          e.currentTarget.style.transform = 'translateY(0)';
        }}
      >
        🔄 Tải lại
      </button>
    </div>
  );
};

EmptyPlans.propTypes = {
  onRetry: PropTypes.func.isRequired
};

export default EmptyPlans;
