// Main App Routes
// combine tất cả routes

import React from 'react';
import { Routes, Route } from 'react-router-dom';
import DriverRoutes from './DriverRoutes';
import StaffRoutes from './StaffRoutes';
import AdminRoutes from './AdminRoutes';
import RegisterPage from '../pages/Register';
import VerifyOTPPage from '../pages/VerifyOTP';
import LandingPage from '../components/common/LandingPage';

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/driver/*" element={<DriverRoutes />} />
      <Route path="/staff/*" element={<StaffRoutes />} />
      <Route path="/admin/*" element={<AdminRoutes />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/verify-otp" element={<VerifyOTPPage />} />
      <Route path="/" element={<LandingPage />} />
    </Routes>
  );
};


export default AppRoutes;