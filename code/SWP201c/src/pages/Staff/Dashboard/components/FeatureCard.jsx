// Staff/Dashboard/components/FeatureCard.jsx
import React from 'react';

const FeatureCard = ({ feature, onClick }) => {
  return (
    <div 
      onClick={() => onClick(feature.route)}
      style={{
        background: 'rgba(26, 32, 44, 0.8)',
        borderRadius: '12px',
        padding: '25px',
        boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        backdropFilter: 'blur(10px)'
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-5px)';
        e.currentTarget.style.boxShadow = '0 12px 40px rgba(0,0,0,0.4)';
        e.currentTarget.style.borderColor = feature.color;
        e.currentTarget.style.background = 'rgba(26, 32, 44, 0.9)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = '0 8px 32px rgba(0,0,0,0.3)';
        e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)';
        e.currentTarget.style.background = 'rgba(26, 32, 44, 0.8)';
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '15px' }}>
        <div style={{ 
          fontSize: '32px', 
          marginRight: '15px',
          background: `${feature.color}20`,
          padding: '10px',
          borderRadius: '10px',
          border: `1px solid ${feature.color}40`
        }}>
          {feature.icon}
        </div>
        <div>
          <h3 style={{ 
            margin: 0, 
            color: '#FFFFFF', 
            fontSize: '18px',
            fontWeight: 'bold'
          }}>
            {feature.title}
          </h3>
        </div>
      </div>
      <p style={{ 
        margin: 0, 
        color: '#E0E0E0', 
        fontSize: '14px',
        lineHeight: '1.5'
      }}>
        {feature.description}
      </p>
      <div style={{ 
        marginTop: '15px', 
        textAlign: 'right',
        color: feature.color,
        fontWeight: 'bold',
        fontSize: '14px'
      }}>
        Truy cập →
      </div>
    </div>
  );
};

export default FeatureCard;
