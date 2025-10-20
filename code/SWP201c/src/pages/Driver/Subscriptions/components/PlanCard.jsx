// Driver/Subscriptions/components/PlanCard.jsx
// Individual subscription plan card

import PropTypes from 'prop-types';
import {
  formatCurrency,
  getPlanColor,
  getPlanIcon,
  getPlanDuration,
  getPlanFeatures,
  getPlanPrice,
  getPlanName,
  getPlanDescription
} from '../utils';

const PlanCard = ({ plan, index, isPopular, onSubscribe, loading }) => {
  const planColor = getPlanColor(getPlanName(plan));
  const planIcon = getPlanIcon(index, getPlanName(plan));
  const features = getPlanFeatures(plan);

  return (
    <div
      style={{
        background: 'rgba(26, 32, 44, 0.8)',
        borderRadius: '25px',
        padding: isPopular ? '40px 30px' : '35px 30px',
        border: isPopular ? `2px solid ${planColor}` : '1px solid rgba(255, 255, 255, 0.1)',
        backdropFilter: 'blur(10px)',
        position: 'relative',
        transform: isPopular ? 'scale(1.05)' : 'scale(1)',
        transition: 'all 0.3s ease',
        boxShadow: isPopular ? `0 20px 60px ${planColor}30` : 'none'
      }}
    >
      {/* Popular Badge */}
      {isPopular && (
        <div style={{
          position: 'absolute',
          top: '-15px',
          left: '50%',
          transform: 'translateX(-50%)',
          background: `linear-gradient(135deg, ${planColor}, ${planColor}dd)`,
          color: 'white',
          padding: '8px 20px',
          borderRadius: '20px',
          fontSize: '0.85rem',
          fontWeight: '600',
          boxShadow: `0 4px 15px ${planColor}40`
        }}>
          PHỔ BIẾN NHẤT
        </div>
      )}

      {/* Plan Header */}
      <div style={{ textAlign: 'center', marginBottom: '30px' }}>
        <div style={{ 
          fontSize: '3rem', 
          marginBottom: '15px',
          filter: `drop-shadow(0 4px 15px ${planColor}40)`
        }}>
          {planIcon}
        </div>
        <h3 style={{ 
          color: '#FFFFFF', 
          fontSize: '1.8rem', 
          margin: '0 0 10px 0',
          fontWeight: '700'
        }}>
          {getPlanName(plan)}
        </h3>
        <p style={{ 
          color: '#B0B0B0', 
          margin: '0 0 25px 0',
          fontSize: '0.95rem',
          minHeight: '40px'
        }}>
          {getPlanDescription(plan)}
        </p>
        <div style={{ 
          fontSize: '3rem', 
          fontWeight: '700', 
          color: planColor,
          marginBottom: '5px'
        }}>
          {formatCurrency(getPlanPrice(plan))}
        </div>
        <div style={{ color: '#B0B0B0', fontSize: '0.95rem' }}>
          {getPlanDuration(plan)}
        </div>
      </div>

      {/* Features List */}
      <div style={{ marginBottom: '30px' }}>
        {features.map((feature, idx) => (
          <div key={idx} style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            marginBottom: '12px',
            color: '#E0E0E0',
            fontSize: '0.95rem'
          }}>
            <div style={{
              width: '24px',
              height: '24px',
              borderRadius: '50%',
              background: `${planColor}20`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: planColor,
              fontSize: '0.9rem',
              fontWeight: '700'
            }}>
              ✓
            </div>
            <span>{feature}</span>
          </div>
        ))}
      </div>

      {/* Subscribe Button */}
      <button
        onClick={() => onSubscribe(plan)}
        disabled={loading}
        style={{
          width: '100%',
          padding: '16px',
          background: loading ? '#666' : `linear-gradient(135deg, ${planColor}, ${planColor}dd)`,
          color: 'white',
          border: 'none',
          borderRadius: '12px',
          cursor: loading ? 'not-allowed' : 'pointer',
          fontSize: '1.1rem',
          fontWeight: '700',
          transition: 'all 0.3s ease',
          boxShadow: loading ? 'none' : `0 8px 25px ${planColor}40`
        }}
        onMouseEnter={(e) => {
          if (!loading) {
            e.currentTarget.style.transform = 'translateY(-2px)';
            e.currentTarget.style.boxShadow = `0 12px 35px ${planColor}50`;
          }
        }}
        onMouseLeave={(e) => {
          if (!loading) {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = `0 8px 25px ${planColor}40`;
          }
        }}
      >
        {loading ? 'Đang xử lý...' : 'Đăng ký ngay'}
      </button>
    </div>
  );
};

PlanCard.propTypes = {
  plan: PropTypes.object.isRequired,
  index: PropTypes.number.isRequired,
  isPopular: PropTypes.bool.isRequired,
  onSubscribe: PropTypes.func.isRequired,
  loading: PropTypes.bool.isRequired
};

export default PlanCard;
