// Driver/Support/components/IssueReportGrid.jsx
// Grid of issue type buttons for reporting

import PropTypes from 'prop-types';
import { getIssueTypes } from '../utils';

const IssueReportGrid = ({ onIssueClick }) => {
  const issueTypes = getIssueTypes();

  return (
    <div style={{
      background: 'rgba(26, 32, 44, 0.8)',
      borderRadius: '20px',
      padding: '30px',
      border: '1px solid rgba(255, 255, 255, 0.1)'
    }}>
      <h3 style={{ color: '#FFFFFF', marginBottom: '25px', fontSize: '1.3rem' }}>
         Báo cáo vấn đề
      </h3>
      <div style={{ display: 'grid', gap: '15px' }}>
        {issueTypes.map((issue, index) => (
          <button
            key={index}
            onClick={() => onIssueClick(issue)}
            style={{
              background: `${issue.color}15`,
              border: `1px solid ${issue.color}30`,
              borderRadius: '12px',
              padding: '20px',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              textAlign: 'left',
              display: 'flex',
              alignItems: 'center',
              gap: '20px'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = `${issue.color}25`;
              e.currentTarget.style.borderColor = `${issue.color}50`;
              e.currentTarget.style.transform = 'translateX(5px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = `${issue.color}15`;
              e.currentTarget.style.borderColor = `${issue.color}30`;
              e.currentTarget.style.transform = 'translateX(0)';
            }}
          >
            <div style={{ 
              fontSize: '2.5rem',
              padding: '15px',
              background: `${issue.color}20`,
              borderRadius: '12px'
            }}>
              {issue.icon}
            </div>
            <div>
              <div style={{ 
                color: '#FFFFFF', 
                fontSize: '1.1rem', 
                fontWeight: '600', 
                marginBottom: '5px' 
              }}>
                {issue.title}
              </div>
              <div style={{ color: '#B0B0B0', fontSize: '0.9rem' }}>
                {issue.desc}
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

IssueReportGrid.propTypes = {
  onIssueClick: PropTypes.func.isRequired
};

export default IssueReportGrid;
