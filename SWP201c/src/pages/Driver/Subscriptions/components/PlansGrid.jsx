// Driver/Subscriptions/components/PlansGrid.jsx
// Grid of subscription plan cards

import PropTypes from 'prop-types';
import PlanCard from './PlanCard';
import { isPlanPopular } from '../utils';

const PlansGrid = ({ plans, onSubscribe, loading }) => {
  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
      gap: '30px',
      marginBottom: '40px'
    }}>
      {plans.map((plan, index) => (
        <PlanCard
          key={plan.id || index}
          plan={plan}
          index={index}
          totalPlans={plans.length}
          isPopular={isPlanPopular(index, plans.length)}
          onSubscribe={onSubscribe}
          loading={loading}
        />
      ))}
    </div>
  );
};

PlansGrid.propTypes = {
  plans: PropTypes.arrayOf(PropTypes.object).isRequired,
  onSubscribe: PropTypes.func.isRequired,
  loading: PropTypes.bool.isRequired
};

export default PlansGrid;
