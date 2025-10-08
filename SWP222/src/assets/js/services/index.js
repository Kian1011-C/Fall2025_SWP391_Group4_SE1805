// Services Index
// Central export for all services

import authService from './authService.js';
import batteryService from './batteryService.js';
import contractService from './contractService.js';
import paymentService from './paymentService.js';
import reportService from './reportService.js';
import stationService from './stationService.js';
import userService from './userService.js';
import vehicleService from './vehicleService.js';
import notificationService from './notificationService.js';
import swapService from './swapService.js';

// Export all services
export {
  authService,
  batteryService,
  contractService,
  paymentService,
  reportService,
  stationService,
  userService,
  vehicleService,
  notificationService,
  swapService
};

// Default export as object for convenience
export default {
  auth: authService,
  battery: batteryService,
  contract: contractService,
  payment: paymentService,
  report: reportService,
  station: stationService,
  user: userService,
  vehicle: vehicleService,
  notification: notificationService,
  swap: swapService
};