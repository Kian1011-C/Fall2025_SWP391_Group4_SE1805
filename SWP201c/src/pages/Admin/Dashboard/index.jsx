// Admin/Dashboard/index.jsx
// Main container for Admin Dashboard (Refactored with SoC)

import React from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../../../layouts/DashboardLayout';

// Custom hooks
import { useDashboardData, useCurrentTime } from './hooks';

// Utils
import { getAdminFeatures, getRecentActivities } from './utils';

// Components
import {
  HeroSection,
  StatsCards,
  FeaturesGrid,
  ActivityTimeline
} from './components';

const AdminDashboard = () => {
  const navigate = useNavigate();

  // Custom hooks
  const { stats, loading, error, refetch } = useDashboardData();
  const currentTime = useCurrentTime();

  // Get static data
  const adminFeatures = getAdminFeatures();
  const recentActivities = getRecentActivities();

  // Event handlers
  const handleFeatureClick = (route) => {
    navigate(route);
  };

  // Loading state
  if (loading) {
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
      <div style={{ padding: '20px', minHeight: '100vh' }}>
        {/* Hero Section with Welcome & Clock */}
        <HeroSection currentTime={currentTime} stats={stats} />

        {/* Main Statistics Cards */}
        <StatsCards stats={stats} />

        {/* Admin Features Grid */}
        <FeaturesGrid 
          features={adminFeatures} 
          onFeatureClick={handleFeatureClick} 
        />

        {/* Activity Timeline */}
        <ActivityTimeline activities={recentActivities} />
      </div>
    </DashboardLayout>
  );
};

export default AdminDashboard;
