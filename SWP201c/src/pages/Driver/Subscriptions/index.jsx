// Driver/Subscriptions/index.jsx
// Container component for Subscriptions page - orchestrates data and UI

import { useAuth } from '../../../context/AuthContext';
import DashboardLayout from '../../../layouts/DashboardLayout';
import { useSubscriptionsData, useSubscribe } from './hooks';
import {
  SubscriptionsHeader,
  PlansGrid,
  EmptyPlans,
  FAQSection,
  DebugInfo
} from './components';

const Subscriptions = () => {
  const { currentUser } = useAuth();

  // Data fetching
  const {
    plans,
    currentSubscription,
    userContracts,
    loading,
    error,
    refetch
  } = useSubscriptionsData(currentUser);

  // Subscription actions
  const { subscribe, subscribing } = useSubscribe(currentUser, refetch);

  // Loading state
  if (loading) {
    return (
      <DashboardLayout role="driver">
        <div style={{ padding: '20px', textAlign: 'center' }}>
          <div style={{ color: '#19c37d', fontSize: '1.5rem' }}>⏳ Đang tải...</div>
        </div>
      </DashboardLayout>
    );
  }

  // Error state
  if (error) {
    return (
      <DashboardLayout role="driver">
        <div style={{ padding: '20px', textAlign: 'center' }}>
          <div style={{ color: '#ff6b6b', fontSize: '1.2rem' }}>⚠️ {error}</div>
          <button 
            onClick={refetch}
            style={{
              marginTop: '20px',
              padding: '10px 20px',
              background: '#19c37d',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = '#17b370';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = '#19c37d';
            }}
          >
            Thử lại
          </button>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout role="driver">
      <div style={{ padding: '20px', maxWidth: '1400px', margin: '0 auto' }}>
        {/* Debug Info */}
        <DebugInfo
          currentUser={currentUser}
          plans={plans}
          userContracts={userContracts}
          currentSubscription={currentSubscription}
          error={error}
        />

        {/* Header */}
        <SubscriptionsHeader />

        {/* Plans Grid */}
        {plans.length > 0 ? (
          <PlansGrid
            plans={plans}
            onSubscribe={subscribe}
            loading={subscribing}
          />
        ) : (
          <EmptyPlans onRetry={refetch} />
        )}

        {/* FAQ Section */}
        <FAQSection />
      </div>
    </DashboardLayout>
  );
};

export default Subscriptions;
