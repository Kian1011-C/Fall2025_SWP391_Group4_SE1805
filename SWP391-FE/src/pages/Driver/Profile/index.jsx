// Driver/Profile/index.jsx
// Container for Driver Profile page - orchestrates all components and hooks

import React from 'react';
import { FiAlertCircle, FiRefreshCw } from 'react-icons/fi';
import DashboardLayout from '../../../layouts/DashboardLayout';
import { useProfileData, useProfileForm, useProfileUpdate } from './hooks';
import {
  ProfileHeader,
  ProfileAvatar,
  ProfileDisplay,
  ProfileFormFields,
  ProfileFormActions,
  ProfileStats
} from './components';

const DriverProfile = () => {
  // Custom hooks for data, form, and update
  const { user, loading, error, refetch } = useProfileData();
  const {
    isEditing,
    formData,
    formErrors,
    startEditing,
    cancelEditing,
    updateField,
    validateForm,
    setFormData
  } = useProfileForm(user);
  const { updating, updateProfile } = useProfileUpdate((updatedData) => {
    // On successful update, update local user state
    setFormData(updatedData);
    cancelEditing();
    refetch(); // Refetch to get latest data
  });

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form
    if (!validateForm()) {
      return;
    }

    // Update profile
    const result = await updateProfile(user?.id, formData);
    
    if (!result.success && result.error) {
      alert(result.error);
    }
  };

  // Loading state
  if (loading && !user) {
    return (
      <DashboardLayout role="driver">
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '60vh'
        }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{
              width: '60px',
              height: '60px',
              border: '4px solid rgba(25, 195, 125, 0.2)',
              borderTop: '4px solid #19c37d',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite',
              margin: '0 auto 20px'
            }} />
            <p style={{ color: '#B0B0B0', fontSize: '1.1rem' }}>
              Đang tải hồ sơ...
            </p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  // Error state
  if (error) {
    return (
      <DashboardLayout role="driver">
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '60vh'
        }}>
          <div style={{
            background: 'rgba(239, 68, 68, 0.1)',
            borderRadius: '12px',
            padding: '30px',
            border: '1px solid rgba(239, 68, 68, 0.3)',
            textAlign: 'center',
            maxWidth: '500px'
          }}>
            <div style={{ fontSize: '3rem', marginBottom: '15px' }}>
              <FiAlertCircle size={48} color="#EF4444" />
            </div>
            <h3 style={{ color: '#EF4444', marginBottom: '10px' }}>
              Lỗi tải dữ liệu
            </h3>
            <p style={{ color: '#B0B0B0', marginBottom: '20px' }}>{error}</p>
            <button
              onClick={refetch}
              style={{
                padding: '10px 20px',
                background: 'linear-gradient(135deg, #19c37d, #15a36a)',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontWeight: '600',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                margin: '0 auto'
              }}
            >
              <FiRefreshCw size={18} /> Thử lại
            </button>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout role="driver">
      <style>
        {`
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
        `}
      </style>

      <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
        <ProfileHeader />

        {/* Main Profile Card */}
        <div style={{
          background: 'rgba(26, 32, 44, 0.8)',
          borderRadius: '20px',
          padding: '40px',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          marginBottom: '25px'
        }}>
          <ProfileAvatar 
            user={user} 
            onEdit={startEditing}
            isEditing={isEditing}
          />

          {/* Profile Content - Display or Edit Mode */}
          {isEditing ? (
            <form onSubmit={handleSubmit}>
              <ProfileFormFields
                formData={formData}
                formErrors={formErrors}
                onFieldChange={updateField}
              />
              <ProfileFormActions
                onSave={handleSubmit}
                onCancel={cancelEditing}
                isSaving={updating}
              />
            </form>
          ) : (
            <ProfileDisplay user={user} />
          )}
        </div>

        {/* Profile Statistics removed per request */}
      </div>
    </DashboardLayout>
  );
};

export default DriverProfile;
