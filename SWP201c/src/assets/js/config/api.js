// API Configuration for EV Battery Swap Management System

import axios from 'axios';

// API Base Configuration
export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080', // Direct backend URL
  TIMEOUT: parseInt(import.meta.env.VITE_API_TIMEOUT) || 30000, // Increase timeout for backend calls
  USE_DEMO_FALLBACK: (import.meta.env.VITE_USE_DEMO_FALLBACK || 'false') === 'true', // Disable demo fallback by default
  ENDPOINTS: {
    // Authentication
    AUTH: {
      LOGIN: '/api/auth/login',
      LOGOUT: '/api/auth/logout',
      ME: '/api/auth/me',
      REFRESH: '/api/auth/refresh'
    },

    DRIVER: {
      GET_TOWERS_BY_STATION: '/api/driver/towers',   // GET /api/driver/towers?stationId=...
      GET_SLOTS_BY_TOWER: '/api/driver/slots',       // GET /api/driver/slots?towerId=...
      GET_EMPTY_SLOT: '/api/driver/slot/empty'       // GET /api/driver/slot/empty?towerId=...
    },
    
    // Battery Management
    BATTERIES: {
      BASE: '/api/batteries',
      HEALTH: (id) => `/api/batteries/${id}/health`,
      HISTORY: (id) => `/api/batteries/${id}/history`,
      STATUS: (id) => `/api/batteries/${id}/status`,
      BY_STATION: (stationId) => `/api/batteries/station/${stationId}`,
      BY_VEHICLE: (vehicleId) => `/api/batteries/vehicle/${vehicleId}`,
      SWAP_INITIATE: '/api/batteries/swap/initiate',
      SWAP_CONFIRM: (swapId) => `/api/batteries/swap/${swapId}/confirm`,
      SWAP_ACTIVE: '/api/batteries/swap/active',
      MAINTENANCE: (id) => `/api/batteries/${id}/maintenance`
    },
    
    // Vehicle Management
    VEHICLES: {
      BASE: '/api/vehicles',
      BY_ID: (id) => `/api/vehicles/${id}`,
      BY_USER: (userId) => `/api/users/${userId}/vehicles`,
      SERVICE_HISTORY: (id) => `/api/vehicles/${id}/service-history`,
      REGISTER_SERVICE: (id) => `/api/vehicles/${id}/register-service`
    },
    
    // Contract Management
    CONTRACTS: {
      BASE: '/api/contracts',
      PLANS: '/api/contracts/plans',
      BY_USER: (userId) => `/api/contracts/user/${userId}`,
      BILLING: (contractId) => `/api/contracts/${contractId}/billing`,
      TERMINATE: (contractId) => `/api/contracts/${contractId}/terminate`
    },
    
    // Payment Management
    PAYMENTS: {
      BASE: '/api/payments',
      PROCESS: '/api/payments/process',
      CREATE: '/payment/create',  // VNPay create payment URL
      PAY_MONTHLY: '/payment/pay-monthly',  // VNPay pay monthly bill
      VNPAY_RETURN: '/payment/vnpay-return',  // VNPay return URL (HTML page)
      VNPAY_RETURN_JSON: '/payment/vnpay-return-json',  // VNPay return JSON API
      QUERYDR: '/payment/querydr',  // VNPay query transaction
      CALCULATE_MONTHLY: (contractId) => `/api/payments/calculate-monthly-bill/${contractId}`,
      CURRENT_BILL: (userId) => `/api/payments/current-bill-status/user/${userId}`,
      MONTHLY_SUMMARY: (contractId) => `/api/payments/monthly-usage-summary/${contractId}`,
      PROCESS_MONTHLY: (contractId) => `/api/payments/process-monthly-payment/${contractId}`,
      HISTORY: (userId) => `/api/payments/user/${userId}/history`,
      METHODS: (userId) => `/api/payments/methods/${userId}`,
      REFUND: (paymentId) => `/api/payments/${paymentId}/refund`,
      AUTO_PAYMENT: '/api/payments/auto-payment'
    },
    
    
    // Station Management
    STATIONS: {
      BASE: '/api/stations',
      BY_ID: (id) => `/api/stations/${id}`,
      NEARBY: '/api/stations/nearby',
      STATS: () => `/api/stations/stats`,
      BOOK: (id) => `/api/stations/${id}/book`,
      AVAILABLE_SLOTS: (id) => `/api/stations/${id}/available-slots`,
      ESTIMATED_TIME: (id) => `/api/stations/${id}/estimated-time`
    },
    
    // Swap Management
    SWAPS: {
      BASE: '/api/swaps',
      BY_ID: (id) => `/api/swaps/${id}`,
      BY_USER: (userId) => `/api/users/${userId}/swaps`,
      CANCEL: (id) => `/api/swaps/${id}/cancel`,
      RATE: (id) => `/api/swaps/${id}/rate`,
      BOOK_SLOT: '/api/swaps/book-slot',
      STATISTICS: (userId) => `/api/users/${userId}/swap-statistics`,
      COMPLETE: '/api/swaps/complete'
    },
    
    // Notification Management
    NOTIFICATIONS: {
      BASE: '/api/notifications',
      BY_ID: (id) => `/api/notifications/${id}`,
      BY_USER: (userId) => `/api/users/${userId}/notifications`,
      MARK_READ: (id) => `/api/notifications/${id}/read`,
      MARK_ALL_READ: (userId) => `/api/users/${userId}/notifications/read-all`
    },
    
    // User Management
    USERS: {
      BASE: '/api/users',
      BY_ID: (id) => `/api/users/${id}`,
      PROFILE: (id) => `/api/users/${id}/profile`,
      NOTIFICATIONS: (id) => `/api/users/${id}/notifications`,
      STATISTICS: (id) => `/api/users/${id}/statistics`,
      SUBSCRIPTION: (id) => `/api/users/${id}/subscription`,
      TOGGLE_STATUS: (id) => `/api/users/${id}/toggle-status`
    },
    
    // Report Management
    REPORTS: {
      BASE: '/api/reports',
      OVERVIEW: '/api/reports/overview',
      REVENUE: '/api/reports/revenue',
      USAGE: '/api/reports/usage',
      CUSTOMERS: '/api/reports/customers',
      EXPORT: '/api/reports/export'
    }
  }
};

// Axios instance with default configuration
export const apiClient = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  timeout: API_CONFIG.TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

// Request interceptor to add auth token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Handle CORS errors
    if (error.code === 'ERR_NETWORK' || error.message?.includes('CORS')) {
      console.warn('CORS error detected, using demo fallback if available');
      // Don't reject immediately, let the service handle fallback
    }
    
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('authToken');
      localStorage.removeItem('currentUser');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Helper functions for API calls
export const apiUtils = {
  // GET request
  get: async (url, params = {}) => {
    const response = await apiClient.get(url, { params });
    return response.data;
  },

  // POST request
  post: async (url, data = {}) => {
    try {
      console.log('API POST Request:', { url, data });
      const response = await apiClient.post(url, data);
      console.log('API POST Response:', response.data);
      return response.data;
    } catch (error) {
      console.error('API POST Error:', error);
      // Return a structured error response instead of throwing
      return {
        success: false,
        message: error.response?.data?.message || error.message || 'Network error',
        error: error.response?.data || error.message
      };
    }
  },

  // POST request with FormData (for Spring Boot)
  postFormData: async (url, formData) => {
    try {
      console.log('API POST FormData Request:', { url, formData: Object.fromEntries(formData) });
      const response = await apiClient.post(url, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      console.log('API POST FormData Response:', response.data);
      return response.data;
    } catch (error) {
      console.error('API POST FormData Error:', error);
      // Return a structured error response instead of throwing
      return {
        success: false,
        message: error.response?.data?.message || error.message || 'Network error',
        error: error.response?.data || error.message
      };
    }
  },

  // PUT request
  put: async (url, data = {}) => {
    const response = await apiClient.put(url, data);
    return response.data;
  },

  // DELETE request
  delete: async (url) => {
    const response = await apiClient.delete(url);
    return response.data;
  },

  // Handle API errors
  handleError: (error) => {
    if (error.response) {
      // Server responded with error status
      const { status, data } = error.response;
      return {
        message: data.message || `Server error: ${status}`,
        status,
        details: data
      };
    } else if (error.request) {
      // Request was made but no response received
      return {
        message: 'Network error: No response from server',
        status: 0,
        details: error.request
      };
    } else {
      // Something else happened
      return {
        message: error.message || 'Unknown error occurred',
        status: -1,
        details: error
      };
    }
  }
};

// Provide a backward-compatible default export so older service files that
// import `api` and call `api.get(...)` continue to work.
const defaultApi = {
  // configuration and low-level client
  API_CONFIG,
  apiClient,
  // convenience helpers (get/post/put/delete) exposed at top-level
  get: apiUtils.get,
  post: apiUtils.post,
  put: apiUtils.put,
  delete: apiUtils.delete,
  // keep the utilities object available too
  apiUtils
};

export default defaultApi;