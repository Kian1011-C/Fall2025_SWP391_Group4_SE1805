// Admin/Subscriptions/index.jsx
// Main container for Admin Subscriptions Management (Refactored with SoC)

import React from 'react';
import DashboardLayout from '../../../layouts/DashboardLayout';

// Custom hooks
import {
  useSubscriptionsData,
  useSubscriptionsActions,
  useSubscriptionForm
} from './hooks';

// Components
import {
  SubscriptionsHeader,
  PlansGrid,
  PlanFormModal
} from './components';

const AdminSubscriptions = () => {
  // Custom hooks
  const { plans, loading, error, refetch } = useSubscriptionsData();
  
  const {
    handleCreatePlan,
    handleUpdatePlan,
    handleDeletePlan,
    actionLoading
  } = useSubscriptionsActions(refetch);

  const {
    showAddModal,
    editingPlan,
    formData,
    handleOpenCreate,
    handleOpenEdit,
    handleClose,
    handleFieldChange
  } = useSubscriptionForm();

  // Event handlers
  const handleSubmit = async () => {
    let result;
    
    if (editingPlan) {
      result = await handleUpdatePlan(editingPlan.id, formData);
    } else {
      result = await handleCreatePlan(formData);
    }

    if (result.success) {
      handleClose();
    }
  };

  const handleDelete = async (planId) => {
    await handleDeletePlan(planId);
  };

  // Loading state (initial load)
  if (loading && plans.length === 0) {
    return (
      <DashboardLayout role="admin">
        <div style={{ padding: '20px', textAlign: 'center' }}>
          <div style={{ color: '#19c37d', fontSize: '1.5rem' }}>
            ⏳ Đang tải...
          </div>
        </div>
      </DashboardLayout>
    );
  }

  // Error state
  if (error) {
    return (
      <DashboardLayout role="admin">
        <div style={{ padding: '20px', textAlign: 'center' }}>
          <div style={{ color: '#ff6b6b', fontSize: '1.2rem' }}>
            ⚠️ {error}
          </div>
          <button 
            onClick={refetch}
            style={{
              marginTop: '20px',
              padding: '10px 20px',
              background: '#19c37d',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer'
            }}
          >
            Thử lại
          </button>
        </div>
      </DashboardLayout>
    );
  }

  // Main render
  return (
    <DashboardLayout role="admin">
      <div style={{ padding: '20px' }}>
        {/* Header */}
        <SubscriptionsHeader onAddClick={handleOpenCreate} />

        {/* Plans Grid */}
        <PlansGrid
          plans={plans}
          onEditPlan={handleOpenEdit}
          onDeletePlan={handleDelete}
        />

        {/* Add/Edit Modal */}
        <PlanFormModal
          isOpen={showAddModal}
          editingPlan={editingPlan}
          formData={formData}
          loading={actionLoading}
          onFieldChange={handleFieldChange}
          onSubmit={handleSubmit}
          onClose={handleClose}
        />
      </div>
    </DashboardLayout>
  );
};

export default AdminSubscriptions;
