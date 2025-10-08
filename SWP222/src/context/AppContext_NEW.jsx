// App Context - Wrapper cho tất cả contexts
// Đơn giản hóa việc import - chỉ cần import useApp() là có tất cả

import React from 'react';
import { useAuth } from './AuthContext';
import { useSwap } from './SwapContext';

// Hook tổng hợp tất cả contexts
export const useApp = () => {
  const auth = useAuth();
  const swap = useSwap();

  return {
    // Auth (from AuthContext)
    ...auth,
    
    // Swap (from SwapContext)  
    ...swap,
  };
};

// Provider tổng hợp
export const AppProvider = ({ children }) => {
  const { AuthProvider } = require('./AuthContext');
  const { SwapProvider } = require('./SwapContext');
  
  return (
    <AuthProvider>
      <SwapProvider>
        {children}
      </SwapProvider>
    </AuthProvider>
  );
};

