// Store Index
// Central export for all Zustand stores

import useAuthStore from './authSlice.js';
import useBatteryStore from './batterySlice.js';
import useContractStore from './contractSlice.js';
import usePaymentStore from './paymentSlice.js';
import useStationStore from './stationSlice.js';
import useVehicleStore from './vehicleSlice.js';
import useUserStore from './userSlice.js';
import useReportStore from './reportSlice.js';
import useNotificationStore from './notificationSlice.js';

// Export all stores
export {
  useAuthStore,
  useBatteryStore,
  useContractStore,
  usePaymentStore,
  useStationStore,
  useVehicleStore,
  useUserStore,
  useReportStore,
  useNotificationStore
};

// Default export as object for convenience
export default {
  auth: useAuthStore,
  battery: useBatteryStore,
  contract: useContractStore,
  payment: usePaymentStore,
  station: useStationStore,
  vehicle: useVehicleStore,
  user: useUserStore,
  report: useReportStore,
  notification: useNotificationStore
};

