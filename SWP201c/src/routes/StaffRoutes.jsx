// Staff Routes Configuration
// Define all routes for staff section

import React from 'react';
import { Routes, Route } from 'react-router-dom';

// Staff Components
import StaffDashboard from '../pages/Staff/Dashboard';
import StaffBatteryInventory from '../pages/Staff/BatteryInventory';
import StaffTransactionManagement from '../pages/Staff/TransactionManagement';
import StaffStationManagement from '../pages/Staff/StationManagement';
import StaffBatteryStock from '../pages/Staff/BatteryStock';
import StaffSwapConfirm from '../pages/Staff/SwapConfirm';
import StaffIssues from '../pages/Staff/Issues';
import StaffPayments from '../pages/Staff/Payments';

const StaffRoutes = () => {
  return (
    <Routes>
      <Route path="/dashboard" element={<StaffDashboard />} />
      <Route path="/battery-inventory" element={<StaffBatteryInventory />} />
      <Route path="/transaction-management" element={<StaffTransactionManagement />} />
      <Route path="/station-management" element={<StaffStationManagement />} />
      <Route path="/battery-stock" element={<StaffBatteryStock />} />
      <Route path="/swap-confirm" element={<StaffSwapConfirm />} />
      <Route path="/issues" element={<StaffIssues />} />
      <Route path="/payments" element={<StaffPayments />} />
      <Route path="/" element={<StaffDashboard />} />
      <Route path="/swap-battery" element={<StaffSwapBattery />} />
    </Routes>
  );
};

export default StaffRoutes;