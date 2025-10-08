// Driver Routes Configuration
// Define all routes for driver section

import React from 'react';
import { Routes, Route } from 'react-router-dom';

// Driver Components
import DriverDashboard from '../pages/Driver/Dashboard';
import DriverProfile from '../pages/Driver/Profile';
import DriverVehicles from '../pages/Driver/Vehicles';
import DriverSubscriptions from '../pages/Driver/Subscriptions';
import DriverContracts from '../pages/Driver/Contracts';
import DriverStationsMap from '../pages/Driver/StationsMap';
import DriverSwapBattery from '../pages/Driver/SwapBattery';
import DriverPayments from '../pages/Driver/Payments';
import DriverSupport from '../pages/Driver/Support';

const DriverRoutes = () => {
  return (
    <Routes>
      <Route path="/dashboard" element={<DriverDashboard />} />
      <Route path="/profile" element={<DriverProfile />} />
      <Route path="/vehicles" element={<DriverVehicles />} />
      <Route path="/subscriptions" element={<DriverSubscriptions />} />
      <Route path="/contracts" element={<DriverContracts />} />
      <Route path="/stations-map" element={<DriverStationsMap />} />
      <Route path="/swap-battery" element={<DriverSwapBattery />} />
      <Route path="/payments" element={<DriverPayments />} />
      <Route path="/support" element={<DriverSupport />} />
      <Route path="/" element={<DriverDashboard />} />
    </Routes>
  );
};

export default DriverRoutes;