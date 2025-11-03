import React, { Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import './App.css';

// --- Context Providers & Hooks ---
import { AuthProvider, useAuth } from './context/AuthContext';
import { SwapProvider } from './context/SwapContext';
import { AppProvider } from './context/AppContext';

// --- Common Components & Protected Routes ---
import LandingPage from './components/common/LandingPage';
import LoginModal from './components/modals/LoginModal';
import RegisterModal from './components/modals/RegisterModal';
import LoadingFallback from './components/common/LoadingFallback';
import { DriverRoute, StaffRoute, AdminRoute } from './components/ProtectedRoute';

// --- Register & Verify Pages ---
import RegisterPage from './components/auth/Register';
import VerifyOTPPage from './components/auth/VerifyOTP';
import ResetPasswordPage from './components/auth/ResetPassword';

// --- Layouts & Screens ---
import DriverLayout from './layouts/DriverLayout';
import StaffLayout from './layouts/StaffLayout';
import SelectVehiclePage from './pages/Driver/SelectVehicle';
import AdminLayout from './layouts/AdminLayout';

// --- Driver Pages ---
import DriverDashboard from './pages/Driver/Dashboard';
import DriverSwapBattery from './pages/Driver/SwapBattery';
import DriverContracts from './pages/Driver/Contracts';
import DriverPayments from './pages/Driver/Payments';
import DriverSupport from './pages/Driver/Support';
import DriverProfile from './pages/Driver/Profile';
import DriverStationsMap from './pages/Driver/StationsMap';
import DriverSubscriptions from './pages/Driver/Subscriptions';
import DriverVehicles from './pages/Driver/Vehicles';
import MonthlyBilling from './pages/Driver/Payments/MonthlyBilling';
import PaymentResult from './pages/Driver/Payments/components/PaymentResult';

// --- Staff Pages ---
import StaffDashboard from './pages/Staff/Dashboard';
import StaffBatteryManagement from './pages/Staff/BatteryManagements';
import StaffStationManagement from './pages/Staff/StationManagement';
import StaffIssues from './pages/Staff/Issues';
import StaffReports from './pages/Staff/Reports';
import StaffTransactionManagement from './pages/Staff/TransactionManagement';
import StaffSwapBattery from './pages/Staff/SwapBattery';


// --- Admin Pages ---
import AdminDashboard from './pages/Admin/Dashboard';
import AdminUsers from './pages/Admin/Users';
import AdminStations from './pages/Admin/Stations';
import AdminBatteries from './pages/Admin/Batteries';
import AdminSubscriptions from './pages/Admin/Subscriptions';
import AdminContracts from './pages/Admin/Contracts';
import AdminReports from './pages/Admin/Reports';
import AdminTransactions from './pages/Admin/Transactions';

// Fix default markers for React Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Driver Layout Component
function ProtectedDriverLayout() {
  // Hiển thị chọn xe bằng modal trong Dashboard; không chặn bằng redirect
  return <DriverLayout />;
}

// Main App Content with all routes
function AppContent() {
  const { currentUser } = useAuth();

  return (
    <div className="App">
      <Suspense fallback={<LoadingFallback />}>
        <Routes>
          {/* === DRIVER ROUTES === */}
          <Route path="/driver/select-vehicle" element={<DriverRoute><SelectVehiclePage /></DriverRoute>} />
          <Route path="/driver" element={<DriverRoute><ProtectedDriverLayout /></DriverRoute>}>
            <Route index element={<Navigate to="dashboard" replace />} /> 
            <Route path="dashboard" element={<DriverDashboard />} />
            <Route path="swap-battery" element={<DriverSwapBattery />} />
            <Route path="vehicles" element={<DriverVehicles />} />
            <Route path="stations-map" element={<DriverStationsMap />} />
            <Route path="subscriptions" element={<DriverSubscriptions />} />
            <Route path="contracts" element={<DriverContracts />} />
            <Route path="payments" element={<DriverPayments />} />
            <Route path="payments/monthly-billing" element={<MonthlyBilling />} />
            <Route path="payments/result" element={<PaymentResult />} />
            <Route path="support" element={<DriverSupport />} />
            <Route path="profile" element={<DriverProfile />} />
          </Route>
          
          {/* === STAFF ROUTES (ĐÃ CẬP NHẬT HOÀN CHỈNH) === */}
          <Route 
            path="/staff" 
            element={<StaffRoute><StaffLayout /></StaffRoute>}
          >
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<StaffDashboard />} />
            <Route path="battery-management" element={<StaffBatteryManagement />} />
            <Route path="station-management" element={<StaffStationManagement />} />
            <Route path="transaction-management" element={<StaffTransactionManagement />} />
            <Route path="issues" element={<StaffIssues />} />
            <Route path="reports" element={<StaffReports />} />
            <Route path="swap-battery" element={<StaffSwapBattery />} />
            
          </Route>
          
          {/* === ADMIN ROUTES === */}
          <Route path="/admin" element={<AdminRoute><AdminLayout /></AdminRoute>}>
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="users" element={<AdminUsers />} />
            <Route path="stations" element={<AdminStations />} />
            <Route path="batteries" element={<AdminBatteries />} />
            <Route path="contracts" element={<AdminContracts />} />
            <Route path="subscriptions" element={<AdminSubscriptions />} />
            <Route path="reports" element={<AdminReports />} />
            <Route path="transactions" element={<AdminTransactions />} />
          </Route>
          
          {/* === PUBLIC & REDIRECT ROUTES === */}
          <Route path="/register" element={
            <React.Suspense fallback={<div>Loading Register...</div>}>
              <RegisterPage />
            </React.Suspense>
          } />
          <Route path="/verify-otp" element={
            <React.Suspense fallback={<div>Loading Verify OTP...</div>}>
              <VerifyOTPPage />
            </React.Suspense>
          } />
          <Route path="/reset" element={<ResetPasswordPage />} />
          <Route path="/" element={
            currentUser ? (
              <Navigate to={
                currentUser.role === 'driver' ? '/driver/dashboard' :
                currentUser.role === 'staff' ? '/staff/dashboard' :
                currentUser.role === 'admin' ? '/admin/dashboard' :
                '/'
              } replace />
            ) : (
              <LandingPage />
            )
          } />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        
        <Suspense>
            <LoginModal />
            <RegisterModal />
        </Suspense>
      </Suspense>
    </div>
  );
}

// Main App Component that wraps everything
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