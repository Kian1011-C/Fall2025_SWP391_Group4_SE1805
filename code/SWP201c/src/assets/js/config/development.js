// Development Configuration for EV Battery Swap Management System

export const DEV_CONFIG = {
  // Development mode settings
  IS_DEVELOPMENT: import.meta.env.DEV,
  
  // Backend availability check
  BACKEND_CHECK: {
    ENABLED: true, // Enable health check for real API
    TIMEOUT: 5000,
    ENDPOINTS: ['/api/stations', '/api/vehicles'] // Use existing endpoints
  },
  
  // Demo mode settings
  DEMO_MODE: {
    ENABLED: false, // Tắt demo mode để chạy thật
    AUTO_FALLBACK: false, // Không tự động fallback
    SHOW_NOTIFICATIONS: true, // Hiển thị thông báo lỗi thật
    LOG_LEVEL: 'info' // 'debug', 'info', 'warn', 'error'
  },
  
  // CORS handling
  CORS: {
    ENABLED: true,
    ALLOW_ORIGINS: ['http://localhost:3000', 'http://localhost:5173'],
    ALLOW_METHODS: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    ALLOW_HEADERS: ['Content-Type', 'Authorization', 'X-Requested-With']
  },
  
  // API fallback settings
  API_FALLBACK: {
    ENABLED: true,
    MAX_RETRIES: 3,
    RETRY_DELAY: 1000,
    TIMEOUT: 10000
  }
};

// Helper function to check if we should use demo mode
export const shouldUseDemoMode = () => {
  return DEV_CONFIG.IS_DEVELOPMENT && DEV_CONFIG.DEMO_MODE.ENABLED;
};

// Helper function to log development messages
export const devLog = (level, message, data = null) => {
  if (!DEV_CONFIG.IS_DEVELOPMENT) return;
  
  const logLevel = DEV_CONFIG.DEMO_MODE.LOG_LEVEL;
  const levels = ['debug', 'info', 'warn', 'error'];
  
  if (levels.indexOf(level) >= levels.indexOf(logLevel)) {
    const prefix = `[DEV ${level.toUpperCase()}]`;
    if (data) {
      console[level](prefix, message, data);
    } else {
      console[level](prefix, message);
    }
  }
};

// Helper function to handle API errors gracefully
export const handleApiError = (error, context = 'API call') => {
  devLog('error', `${context} failed:`, error);
  
  // Return specific error messages instead of demo mode
  if (error.code === 'ERR_NETWORK' || error.message.includes('CORS')) {
    devLog('warn', 'Network/CORS error detected');
    return { 
      isDemo: false, 
      message: 'Không thể kết nối đến server. Vui lòng kiểm tra kết nối mạng.',
      errorType: 'CORS'
    };
  }
  
  if (error.response?.status === 404) {
    devLog('warn', '404 Not Found, endpoint may not exist');
    return { 
      isDemo: false, 
      message: 'API endpoint không tồn tại. Vui lòng liên hệ quản trị viên.',
      errorType: '404'
    };
  }
  
  if (error.response?.status === 405) {
    devLog('warn', '405 Method Not Allowed, endpoint may not support this method');
    return { 
      isDemo: false, 
      message: 'Phương thức API không được hỗ trợ. Vui lòng liên hệ quản trị viên.',
      errorType: '405'
    };
  }
  
  return { 
    isDemo: false, 
    message: 'Lỗi hệ thống. Vui lòng thử lại sau.',
    errorType: 'UNKNOWN'
  };
};

export default DEV_CONFIG;
