// API Test Component
// Test API integration with real endpoints

import React, { useState } from 'react';
import authService from '../assets/js/services/authService.js';
import stationService from '../assets/js/services/stationService.js';
import batteryService from '../assets/js/services/batteryService.js';
import contractService from '../assets/js/services/contractService.js';
import paymentService from '../assets/js/services/paymentService.js';

const APITestComponent = () => {
  const [testResults, setTestResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const addResult = (test, result) => {
    setTestResults(prev => [...prev, { test, result, timestamp: new Date().toLocaleTimeString() }]);
  };

  const testAPI = async (testName, apiCall) => {
    try {
      setIsLoading(true);
      console.log(`Testing: ${testName}`);
      const result = await apiCall();
      addResult(testName, { success: true, data: result });
    } catch (error) {
      console.error(`Error in ${testName}:`, error);
      addResult(testName, { success: false, error: error.message });
    } finally {
      setIsLoading(false);
    }
  };

  const runAllTests = async () => {
    setTestResults([]);
    
    // Test Station Service
    await testAPI('Get All Stations', () => stationService.getAllStations());
    await testAPI('Get Station by ID', () => stationService.getStationById(1));
    
    // Test Contract Service
    await testAPI('Get Contract Plans', () => contractService.getContractPlans());
    
    // Test Payment Service
    await testAPI('Get Payment Methods', () => paymentService.getPaymentMethods(1));
    
    // Test Battery Service
    await testAPI('Get All Batteries', () => batteryService.getAllBatteries());
    
    console.log('All API tests completed');
  };

  const testLogin = async () => {
    await testAPI('Login Test', () => authService.login({
      email: 'test@example.com',
      password: 'password123'
    }));
  };

  const clearResults = () => {
    setTestResults([]);
  };

  return (
    <div style={{
      padding: '20px',
      background: 'rgba(26, 32, 44, 0.8)',
      borderRadius: '15px',
      border: '1px solid rgba(255, 255, 255, 0.1)',
      margin: '20px'
    }}>
      <h2 style={{ color: '#FFFFFF', marginBottom: '20px' }}> API Integration Test</h2>
      
      <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
        <button
          onClick={runAllTests}
          disabled={isLoading}
          style={{
            padding: '10px 20px',
            background: 'linear-gradient(135deg, #19c37d, #4ecdc4)',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontWeight: '500'
          }}
        >
          {isLoading ? 'Testing...' : 'Run All Tests'}
        </button>
        
        <button
          onClick={testLogin}
          disabled={isLoading}
          style={{
            padding: '10px 20px',
            background: 'linear-gradient(135deg, #6ab7ff, #4a9eff)',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontWeight: '500'
          }}
        >
          Test Login
        </button>
        
        <button
          onClick={clearResults}
          style={{
            padding: '10px 20px',
            background: 'rgba(255, 107, 107, 0.2)',
            color: '#ff6b6b',
            border: '1px solid #ff6b6b40',
            borderRadius: '8px',
            cursor: 'pointer',
            fontWeight: '500'
          }}
        >
          Clear Results
        </button>
      </div>

      <div style={{
        maxHeight: '400px',
        overflowY: 'auto',
        background: 'rgba(0, 0, 0, 0.3)',
        borderRadius: '8px',
        padding: '15px'
      }}>
        {testResults.length === 0 ? (
          <p style={{ color: '#B0B0B0', textAlign: 'center' }}>
            Click "Run All Tests" to start API testing
          </p>
        ) : (
          testResults.map((result, index) => (
            <div key={index} style={{
              marginBottom: '10px',
              padding: '10px',
              background: result.result.success 
                ? 'rgba(25, 195, 125, 0.1)' 
                : 'rgba(255, 107, 107, 0.1)',
              border: `1px solid ${result.result.success ? '#19c37d40' : '#ff6b6b40'}`,
              borderRadius: '6px'
            }}>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '5px'
              }}>
                <strong style={{ 
                  color: result.result.success ? '#19c37d' : '#ff6b6b' 
                }}>
                  {result.result.success ? '' : ''} {result.test}
                </strong>
                <span style={{ color: '#B0B0B0', fontSize: '12px' }}>
                  {result.timestamp}
                </span>
              </div>
              
              <div style={{ 
                color: '#E0E0E0', 
                fontSize: '14px',
                background: 'rgba(0, 0, 0, 0.2)',
                padding: '8px',
                borderRadius: '4px',
                maxHeight: '100px',
                overflowY: 'auto'
              }}>
                <pre style={{ margin: 0, whiteSpace: 'pre-wrap' }}>
                  {JSON.stringify(result.result, null, 2)}
                </pre>
              </div>
            </div>
          ))
        )}
      </div>

      <div style={{
        marginTop: '20px',
        padding: '15px',
        background: 'rgba(106, 183, 255, 0.1)',
        border: '1px solid rgba(106, 183, 255, 0.2)',
        borderRadius: '8px'
      }}>
        <h4 style={{ color: '#6ab7ff', margin: '0 0 10px 0' }}> API Configuration</h4>
        <p style={{ color: '#E0E0E0', fontSize: '14px', margin: '5px 0' }}>
          <strong>Base URL:</strong> http://localhost:8080
        </p>
        <p style={{ color: '#E0E0E0', fontSize: '14px', margin: '5px 0' }}>
          <strong>Status:</strong> {isLoading ? 'Testing...' : 'Ready'}
        </p>
        <p style={{ color: '#B0B0B0', fontSize: '12px', margin: '10px 0 0 0' }}>
           Backend API server configured for localhost:8080. Mock data available as fallback.
        </p>
      </div>
    </div>
  );
};

export default APITestComponent;