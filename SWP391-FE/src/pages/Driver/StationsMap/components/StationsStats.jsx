// Driver/StationsMap/components/StationsStats.jsx
// Statistics cards for stations overview

import PropTypes from 'prop-types';

const StationsStats = ({ stats }) => {
  const statsCards = [
    {
      icon: '🏪',
      label: 'Tổng số trạm',
      value: stats.total,
      color: '#9c88ff'
    },
    {
      icon: '✅',
      label: 'Đang hoạt động',
      value: stats.active,
      color: '#19c37d'
    },
    {
      icon: '🔌',
      label: 'Slot khả dụng',
      value: stats.availableSlots,
      color: '#6ab7ff'
    },
    {
      icon: '📊',
      label: 'Tỷ lệ sử dụng',
      value: `${stats.occupancyRate}%`,
      color: '#ffa500'
    }
  ];

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
      gap: '15px',
      marginBottom: '30px'
    }}>
      {statsCards.map((stat, index) => (
        <div
          key={index}
          style={{
            background: 'rgba(26, 32, 44, 0.8)',
            borderRadius: '12px',
            padding: '20px',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            textAlign: 'center'
          }}
        >
          <div style={{ fontSize: '2rem', marginBottom: '10px' }}>
            {stat.icon}
          </div>
          <div style={{
            fontSize: '1.75rem',
            fontWeight: '700',
            color: stat.color,
            marginBottom: '5px'
          }}>
            {stat.value}
          </div>
          <div style={{
            fontSize: '0.875rem',
            color: '#B0B0B0'
          }}>
            {stat.label}
          </div>
        </div>
      ))}
    </div>
  );
};

StationsStats.propTypes = {
  stats: PropTypes.shape({
    total: PropTypes.number.isRequired,
    active: PropTypes.number.isRequired,
    totalSlots: PropTypes.number.isRequired,
    availableSlots: PropTypes.number.isRequired,
    occupancyRate: PropTypes.number.isRequired
  }).isRequired
};

export default StationsStats;
