// Driver/Subscriptions/index.jsx
// Container component for Subscriptions page - orchestrates data and UI

import { FiClock, FiAlertCircle, FiRefreshCw } from 'react-icons/fi';
import { useAuth } from '../../../context/AuthContext';
import DashboardLayout from '../../../layouts/DashboardLayout';
import { useSubscriptionsData, useSubscribe } from './hooks';
import {
  SubscriptionsHeader,
  PlansGrid,
  EmptyPlans,
  FAQSection
} from './components';
import SubscribeModal from './components/SubscribeModal';

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
  const { 
    subscribe, 
    subscribing, 
    showModal, 
    selectedPlan, 
    handleConfirm, 
    handleCloseModal 
  } = useSubscribe(currentUser, refetch);

  // Loading state
  if (loading) {
    return (
      <DashboardLayout role="driver">
        <div style={{ padding: '20px', textAlign: 'center' }}>
          <div style={{ color: '#19c37d', fontSize: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
            <FiClock size={24} /> Đang tải...
          </div>
        </div>
      </DashboardLayout>
    );
  }

  // Error state
  if (error) {
    return (
      <DashboardLayout role="driver">
        <div style={{ padding: '20px', textAlign: 'center' }}>
          <div style={{ color: '#ff6b6b', fontSize: '1.2rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
            <FiAlertCircle size={24} /> {error}
          </div>
          <button 
            onClick={refetch}
            style={{
              marginTop: '20px',
              padding: '10px 20px',
              background: '#19c37d',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              margin: '20px auto 0',
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
            <FiRefreshCw size={18} /> Thử lại
          </button>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout role="driver">
      <div style={{ padding: '20px', maxWidth: '1400px', margin: '0 auto' }}>
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

      {/* Subscribe Modal */}
      <SubscribeModal
        show={showModal}
        plan={selectedPlan}
        currentUser={currentUser}
        onClose={handleCloseModal}
        onConfirm={handleConfirm}
      />
    </DashboardLayout>
  );
};

export default Subscriptions;
