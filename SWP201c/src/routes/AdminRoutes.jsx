// Admin Routes Configuration
// Define all routes for admin section

import React from 'react';
import { Routes, Route } from 'react-router-dom';

// Admin Components
import AdminDashboard from '../pages/Admin/Dashboard';
import AdminUsers from '../pages/Admin/Users';
import AdminStations from '../pages/Admin/Stations';
import AdminBatteries from '../pages/Admin/Batteries';
import AdminSubscriptions from '../pages/Admin/Subscriptions';
import AdminContracts from '../pages/Admin/Contracts';
import AdminReports from '../pages/Admin/Reports';

const AdminRoutes = () => {
  return (
    <Routes>
      {/* index => /admin */}
      <Route index element={<AdminDashboard />} />

      {/* child routes (relative) => /admin/dashboard, /admin/users, ... */}
      <Route path="dashboard" element={<AdminDashboard />} />
      <Route path="users" element={<AdminUsers />} />
      <Route path="stations" element={<AdminStations />} />
      <Route path="batteries" element={<AdminBatteries />} />
      <Route path="subscriptions" element={<AdminSubscriptions />} />
      <Route path="contracts" element={<AdminContracts />} />
      <Route path="reports" element={<AdminReports />} />

      {/* fallback */}
      <Route path="*" element={<AdminDashboard />} />
    </Routes>
  );
};

export default AdminRoutes;