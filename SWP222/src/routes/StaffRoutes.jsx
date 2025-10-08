// Staff Routes Configuration
// Define all routes for staff section

import React from 'react';
import { Routes, Route } from 'react-router-dom';

// Staff Components
import StaffDashboard from '../pages/Staff/Dashboard';
import StaffStationManagement from '../pages/Staff/StationManagement';
import StaffBatteryStock from '../pages/Staff/BatteryStock';
import StaffSwapConfirm from '../pages/Staff/SwapConfirm';
import StaffIssues from '../pages/Staff/Issues';
import StaffReports from '../pages/Staff/Reports';

const StaffRoutes = () => {
  return (
    <Routes>
      <Route path="/dashboard" element={<StaffDashboard />} />
      <Route path="/station-management" element={<StaffStationManagement />} />
      <Route path="/battery-stock" element={<StaffBatteryStock />} />
      <Route path="/swap-confirm" element={<StaffSwapConfirm />} />
      <Route path="/issues" element={<StaffIssues />} />
      <Route path="/reports" element={<StaffReports />} />
      <Route path="/" element={<StaffDashboard />} />
    </Routes>
  );
};

export default StaffRoutes;