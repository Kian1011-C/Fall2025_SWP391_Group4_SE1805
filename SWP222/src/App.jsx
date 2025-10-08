import React, { Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import './App.css';

// Context Providers
import { AuthProvider, useAuth } from './context/AuthContext';
import { SwapProvider, useSwap } from './context/SwapContext';
import { AppProvider, useApp } from './context/AppContext';

// Components
import LandingPage from './components/common/LandingPage';
import LoginModal from './components/modals/LoginModal';
import RegisterModal from './components/modals/RegisterModal';
import LoadingFallback from './components/common/LoadingFallback';
import { DriverRoute, StaffRoute, AdminRoute } from './components/ProtectedRoute';

// Driver Pages
import DriverDashboard from './pages/Driver/Dashboard';
import DriverSwapBattery from './pages/Driver/SwapBattery';
import DriverVehicles from './pages/Driver/Vehicles';
import DriverStationsMap from './pages/Driver/StationsMap';
import DriverSubscriptions from './pages/Driver/Subscriptions';
import DriverContracts from './pages/Driver/Contracts';
import DriverPayments from './pages/Driver/Payments';
import DriverSupport from './pages/Driver/Support';
import DriverProfile from './pages/Driver/Profile';

// Staff & Admin Dashboards
import StaffDashboard from './pages/Staff/Dashboard';
import AdminDashboard from './pages/Admin/Dashboard';

// Fix default markers for React Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Main App Content (uses context)
function AppContent() {
  const { currentView, currentUser } = useAuth();

  return (
    <div className="App">
      <Suspense fallback={<LoadingFallback />}>
        {currentView === 'landing' ? (
          <LandingPage />
        ) : (
          // Dashboard with routing and role protection
          <Routes>
            {/* Driver Routes - Only accessible by drivers */}
            <Route path="/driver/dashboard" element={
              <DriverRoute><DriverDashboard /></DriverRoute>
            } />
            <Route path="/driver/swap-battery" element={
              <DriverRoute><DriverSwapBattery /></DriverRoute>
            } />
            <Route path="/driver/vehicles" element={
              <DriverRoute><DriverVehicles /></DriverRoute>
            } />
            <Route path="/driver/stations-map" element={
              <DriverRoute><DriverStationsMap /></DriverRoute>
            } />
            <Route path="/driver/subscriptions" element={
              <DriverRoute><DriverSubscriptions /></DriverRoute>
            } />
            <Route path="/driver/contracts" element={
              <DriverRoute><DriverContracts /></DriverRoute>
            } />
            <Route path="/driver/payments" element={
              <DriverRoute><DriverPayments /></DriverRoute>
            } />
            <Route path="/driver/support" element={
              <DriverRoute><DriverSupport /></DriverRoute>
            } />
            <Route path="/driver/profile" element={
              <DriverRoute><DriverProfile /></DriverRoute>
            } />
            
            {/* Staff Routes - Only accessible by staff */}
            <Route path="/staff/dashboard" element={
              <StaffRoute><StaffDashboard /></StaffRoute>
            } />
            <Route path="/staff/*" element={
              <StaffRoute><StaffDashboard /></StaffRoute>
            } />
            
            {/* Admin Routes - Only accessible by admin */}
            <Route path="/admin/dashboard" element={
              <AdminRoute><AdminDashboard /></AdminRoute>
            } />
            <Route path="/admin/*" element={
              <AdminRoute><AdminDashboard /></AdminRoute>
            } />
            
            {/* Default redirect based on user role */}
            <Route path="/" element={
              currentUser ? (
                currentUser.role === 'driver' ? <Navigate to="/driver/dashboard" replace /> :
                currentUser.role === 'staff' ? <Navigate to="/staff/dashboard" replace /> :
                currentUser.role === 'admin' ? <Navigate to="/admin/dashboard" replace /> :
                <Navigate to="/driver/dashboard" replace />
              ) : <LandingPage />
            } />
            
            {/* Fallback for any unmatched routes */}
            <Route path="*" element={
              currentUser ? (
                currentUser.role === 'driver' ? <Navigate to="/driver/dashboard" replace /> :
                currentUser.role === 'staff' ? <Navigate to="/staff/dashboard" replace /> :
                currentUser.role === 'admin' ? <Navigate to="/admin/dashboard" replace /> :
                <Navigate to="/driver/dashboard" replace />
              ) : <Navigate to="/" replace />
            } />
          </Routes>
        )}
        
        {/* Modals */}
        <LoginModal />
        <RegisterModal />
      </Suspense>
    </div>
  );
}

// Main App Component (wraps with providers)
function App() {
  return (
    <AuthProvider>
      <SwapProvider>
        <AppProvider>
          <AppContent />
        </AppProvider>
      </SwapProvider>
    </AuthProvider>
  );
}

export default App;
