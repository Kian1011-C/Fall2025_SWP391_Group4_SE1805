// Staff/Dashboard/components/FeaturesGrid.jsx
import React from 'react';
import FeatureCard from './FeatureCard';

const FeaturesGrid = ({ features, onFeatureClick }) => {
  return (
    <div className="features-grid" style={{ 
      display: 'grid', 
      gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
      gap: '20px' 
    }}>
      {features.map(feature => (
        <FeatureCard
          key={feature.id}
          feature={feature}
          onClick={onFeatureClick}
        />
      ))}
    </div>
  );
};

export default FeaturesGrid;
