// Driver/Subscriptions/components/DebugInfo.jsx
// Debug information display (development only)

import PropTypes from 'prop-types';
import { getUserId } from '../utils';

const DebugInfo = ({ currentUser, plans, userContracts, currentSubscription, error }) => {
  // Only show in development
  if (import.meta.env.VITE_ENABLE_DEBUG !== 'true') {
    return null;
  }

  return (
    <div style={{
      background: 'rgba(255, 165, 0, 0.1)',
      border: '1px solid rgba(255, 165, 0, 0.3)',
      borderRadius: '10px',
      padding: '15px',
      marginBottom: '20px',
      fontSize: '0.9rem',
      color: '#ffa500'
    }}>
      <strong> Subscriptions Debug Info:</strong><br/>
      User ID: {getUserId(currentUser) || 'N/A'}<br/>
      Available Plans: {plans.length}<br/>
      User Contracts: {userContracts.length}<br/>
      Current Subscription: {currentSubscription ? 'Yes' : 'No'}<br/>
      Plans Data: {plans.length > 0 ? 'Loaded' : 'Empty'}<br/>
      Error: {error || 'None'}<br/>
    </div>
  );
};

DebugInfo.propTypes = {
  currentUser: PropTypes.object,
  plans: PropTypes.array.isRequired,
  userContracts: PropTypes.array.isRequired,
  currentSubscription: PropTypes.object,
  error: PropTypes.string
};

export default DebugInfo;
