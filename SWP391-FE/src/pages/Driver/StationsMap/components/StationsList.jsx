// Driver/StationsMap/components/StationsList.jsx
// Grid of station cards

import PropTypes from 'prop-types';
import StationCard from './StationCard';

const StationsList = ({ stations, onSelect }) => {
  if (stations.length === 0) {
    return (
      <div style={{
        background: 'rgba(26, 32, 44, 0.8)',
        borderRadius: '12px',
        padding: '40px',
        textAlign: 'center',
        border: '1px solid rgba(255, 255, 255, 0.1)'
      }}>
        <div style={{ fontSize: '3rem', marginBottom: '15px' }}></div>
        <h3 style={{ color: '#FFFFFF', marginBottom: '10px' }}>
          Không tìm thấy trạm
        </h3>
        <p style={{ color: '#B0B0B0', margin: 0 }}>
          Hiện tại chưa có trạm nào trong khu vực
        </p>
      </div>
    );
  }

  return (
    <div style={{ 
      display: 'grid', 
      gap: '20px',
      gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))'
    }}>
      {stations.map(station => (
        <StationCard
          key={station.id}
          station={station}
          onSelect={onSelect}
        />
      ))}
    </div>
  );
};

StationsList.propTypes = {
  stations: PropTypes.arrayOf(PropTypes.object).isRequired,
  onSelect: PropTypes.func
};

export default StationsList;
