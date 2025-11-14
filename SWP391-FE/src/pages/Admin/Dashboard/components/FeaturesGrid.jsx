// Admin/Dashboard/components/FeaturesGrid.jsx
// Grid of admin features/modules

import React from 'react';

export const FeaturesGrid = ({ features, onFeatureClick }) => {
  return (
    <div style={{
      background: 'rgba(26, 32, 44, 0.8)',
      borderRadius: '20px',
      padding: '30px',
      border: '1px solid rgba(255, 255, 255, 0.1)',
      backdropFilter: 'blur(10px)',
      marginBottom: '30px'
    }}>
      <h3 style={{ 
        color: '#FFFFFF', 
        marginBottom: '25px', 
        display: 'flex', 
        alignItems: 'center', 
        gap: '10px',
        fontSize: '1.3rem'
      }}>
         Chức năng quản trị
      </h3>
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '20px' 
      }}>
        {features.map((feature) => (
          <div
            key={feature.id}
            onClick={() => onFeatureClick(feature.route)}
            style={{
              background: 'rgba(26, 32, 44, 0.8)',
              borderRadius: '12px',
              padding: '25px',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              backdropFilter: 'blur(10px)',
              boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-5px)';
              e.currentTarget.style.boxShadow = '0 16px 48px rgba(0,0,0,0.4)';
              e.currentTarget.style.borderColor = feature.color;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 8px 32px rgba(0,0,0,0.3)';
              e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)';
            }}
          >
            <div style={{
              display: 'flex',
              alignItems: 'center',
              marginBottom: '15px',
              gap: '15px'
            }}>
              <div style={{
                fontSize: '2.5rem',
                padding: '15px',
                borderRadius: '12px',
                background: `linear-gradient(135deg, ${feature.color}, ${feature.color}dd)`,
                boxShadow: `0 8px 24px ${feature.color}40`
              }}>
                {feature.icon}
              </div>
              <div>
                <h3 style={{
                  margin: '0 0 8px 0',
                  color: '#FFFFFF',
                  fontSize: '1.2rem',
                  fontWeight: '600'
                }}>
                  {feature.title}
                </h3>
                <p style={{
                  margin: 0,
                  color: '#B0B0B0',
                  fontSize: '0.9rem',
                  lineHeight: '1.4'
                }}>
                  {feature.description}
                </p>
              </div>
            </div>
            <div style={{
              padding: '12px 0',
              borderTop: '1px solid rgba(255, 255, 255, 0.1)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <span style={{ color: feature.color, fontSize: '0.9rem', fontWeight: '500' }}>
                Nhấn để truy cập
              </span>
              <span style={{ color: feature.color, fontSize: '1.2rem' }}>→</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
