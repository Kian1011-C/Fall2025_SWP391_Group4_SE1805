// Admin/Reports/components/ReportsTabs.jsx
// Tab navigation for reports

import React from 'react';
import { getTabsConfig } from '../utils';

export const ReportsTabs = ({ activeTab, onTabChange }) => {
  const tabs = getTabsConfig();

  return (
    <div style={{
      display: 'flex',
      gap: '5px',
      marginBottom: '25px',
      background: 'rgba(26, 32, 44, 0.8)',
      borderRadius: '12px',
      padding: '8px',
      border: '1px solid rgba(255, 255, 255, 0.1)'
    }}>
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onTabChange(tab.id)}
          style={{
            flex: 1,
            padding: '12px 16px',
            background: activeTab === tab.id 
              ? 'linear-gradient(135deg, #6ab7ff, #4a9eff)' 
              : 'transparent',
            color: activeTab === tab.id ? '#FFFFFF' : '#B0B0B0',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontWeight: activeTab === tab.id ? '600' : '400',
            fontSize: '14px',
            transition: 'all 0.3s ease'
          }}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
};
