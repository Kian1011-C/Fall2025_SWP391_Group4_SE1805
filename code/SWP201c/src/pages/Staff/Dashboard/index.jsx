// Staff/Dashboard/index.jsx
// Staff Dashboard page (container inlined)
import React from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../../../layouts/DashboardLayout';
import { useDashboardStats } from './hooks';
import { getStaffFeatures, getRecentActivities, getStatCards } from './utils';
import {
  DashboardHeader,
  StatsGrid,
  FeaturesGrid,
  RecentActivity
} from './components';

/**
 * Staff Dashboard Container Component
 * Main dashboard for staff members with management features
 */
const DashboardContainer = () => {
  const navigate = useNavigate();

  // Fetch dashboard statistics
  const { stats, loading } = useDashboardStats();

  // Get configuration data
  const staffFeatures = getStaffFeatures();
  const recentActivities = getRecentActivities();
  const statCards = getStatCards(stats);

  // Handle feature navigation
  const handleFeatureClick = (route) => {
    navigate(route);
  };

  return (
    <DashboardLayout role="staff">
      <div className="staff-dashboard" style={{ padding: '20px' }}>
        {/* Header */}
        <DashboardHeader />

        {/* Quick Stats */}
        <StatsGrid statCards={statCards} loading={loading} />

        {/* Features Grid */}
        <FeaturesGrid 
          features={staffFeatures} 
          onFeatureClick={handleFeatureClick} 
        />

        {/* Recent Activity */}
        <RecentActivity activities={recentActivities} />
      </div>
    </DashboardLayout>
  );
};

export default DashboardContainer;
