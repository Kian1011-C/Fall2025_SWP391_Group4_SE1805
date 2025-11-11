// Driver/Support/components/SupportTabs.jsx
// Tab navigation for support sections

import PropTypes from 'prop-types';
import { getTabs } from '../utils';

const SupportTabs = ({ activeTab, onTabChange }) => {
  const tabs = getTabs();

  return (
    <div style={{ 
      display: 'flex', 
      gap: '10px', 
      marginBottom: '30px',
      borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
      paddingBottom: '10px'
    }}>
      {tabs.map(tab => (
        <button
          key={tab.id}
          onClick={() => onTabChange(tab.id)}
          style={{
            padding: '12px 24px',
            background: activeTab === tab.id 
              ? 'linear-gradient(135deg, #19c37d, #15a36a)' 
              : 'rgba(255, 255, 255, 0.05)',
            color: activeTab === tab.id ? 'white' : '#B0B0B0',
            border: activeTab === tab.id ? 'none' : '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '10px',
            cursor: 'pointer',
            fontSize: '1rem',
            fontWeight: '600',
            transition: 'all 0.3s ease'
          }}
          onMouseEnter={(e) => {
            if (activeTab !== tab.id) {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
            }
          }}
          onMouseLeave={(e) => {
            if (activeTab !== tab.id) {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
            }
          }}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
};

SupportTabs.propTypes = {
  activeTab: PropTypes.string.isRequired,
  onTabChange: PropTypes.func.isRequired
};

export default SupportTabs;
