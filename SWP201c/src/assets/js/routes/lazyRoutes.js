// Lazy Loading Routes Configuration
import { lazy } from 'react';

// Lazy load Admin pages
export const AdminUsers = lazy(() => import('../pages/Admin/Users'));
export const AdminBatteries = lazy(() => import('../pages/Admin/Batteries'));
export const AdminContracts = lazy(() => import('../pages/Admin/Contracts'));
export const AdminStations = lazy(() => import('../pages/Admin/Stations'));
export const AdminReports = lazy(() => import('../pages/Admin/Reports'));
export const AdminSubscriptions = lazy(() => import('../pages/Admin/Subscriptions'));
export const AdminDashboard = lazy(() => import('../pages/Admin/Dashboard'));

// Lazy load Driver pages
export const DriverDashboard = lazy(() => import('../pages/Driver/Dashboard'));
export const DriverVehicles = lazy(() => import('../pages/Driver/Vehicles'));
export const DriverSubscriptions = lazy(() => import('../pages/Driver/Subscriptions'));
export const DriverContracts = lazy(() => import('../pages/Driver/Contracts'));
export const DriverPayments = lazy(() => import('../pages/Driver/Payments'));
export const DriverProfile = lazy(() => import('../pages/Driver/Profile'));
export const DriverStationsMap = lazy(() => import('../pages/Driver/StationsMap'));
export const DriverSupport = lazy(() => import('../pages/Driver/Support'));
export const DriverSwapBattery = lazy(() => import('../pages/Driver/SwapBattery'));

// Lazy load Staff pages  
export const StaffDashboard = lazy(() => import('../pages/Staff/Dashboard'));
export const StaffSwapConfirm = lazy(() => import('../pages/Staff/SwapConfirm'));
export const StaffIssues = lazy(() => import('../pages/Staff/Issues'));
export const StaffReports = lazy(() => import('../pages/Staff/Reports'));
export const StaffBatteryInventory = lazy(() => import('../pages/Staff/BatteryInventory'));
export const StaffBatteryStock = lazy(() => import('../pages/Staff/BatteryStock'));
export const StaffStationManagement = lazy(() => import('../pages/Staff/StationManagement'));
export const StaffTransactionManagement = lazy(() => import('../pages/Staff/TransactionManagement'));

