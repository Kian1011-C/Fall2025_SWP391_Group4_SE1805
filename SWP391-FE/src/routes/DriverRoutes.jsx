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
import DriverSettings from '../pages/Driver/Settings';
import MonthlyBilling from '../pages/Driver/Payments/MonthlyBilling';
import PaymentReturn from '../pages/Driver/Payments/PaymentReturn';
import PaymentResult from '../pages/Driver/Payments/components/PaymentResult';

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
      <Route path="/payments/monthly-billing" element={<MonthlyBilling />} />
      <Route path="/payments/return" element={<PaymentReturn />} /> {/* VNPay return URL */}
      <Route path="/payments/result" element={<PaymentResult />} />
      <Route path="/support" element={<DriverSupport />} />
      <Route path="/settings" element={<DriverSettings />} />
      <Route path="/" element={<DriverDashboard />} />
    </Routes>
  );
};

export default DriverRoutes;