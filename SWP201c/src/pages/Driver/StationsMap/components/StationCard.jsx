// Driver/StationsMap/components/StationCard.jsx
// Individual station card with booking button

import PropTypes from 'prop-types';
import { getAvailabilityStatus, getOperatingStatus } from '../utils';

const StationCard = ({ station, onBook, booking, onSelect }) => {
  const availability = getAvailabilityStatus(
    station.availableSlots || 0,
    station.totalSlots || 10
  );
  const operatingStatus = getOperatingStatus(station);

  const handleClick = () => {
    if (onSelect) {
      onSelect(station);
    }
  };

  const handleBookClick = (e) => {
    e.stopPropagation();
    onBook(station.id);
  };

  return (
    <div 
      onClick={handleClick}
      style={{
        background: 'rgba(26, 32, 44, 0.8)',
        padding: '20px',
        borderRadius: '12px',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        cursor: onSelect ? 'pointer' : 'default',
        transition: 'all 0.3s ease'
      }}
      onMouseEnter={(e) => {
        if (onSelect) {
          e.currentTarget.style.borderColor = 'rgba(25, 195, 125, 0.3)';
          e.currentTarget.style.transform = 'translateY(-2px)';
          e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.2)';
        }
      }}
      onMouseLeave={(e) => {
        if (onSelect) {
          e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)';
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.boxShadow = 'none';
        }
      }}
    >
      {/* Station Header */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'flex-start',
        marginBottom: '12px'
      }}>
        <h3 style={{ 
          color: '#FFFFFF', 
          margin: 0,
          fontSize: '1.25rem',
          fontWeight: '700'
        }}>
          {station.name}
        </h3>
        <span style={{
          padding: '4px 12px',
          borderRadius: '12px',
          fontSize: '0.75rem',
          fontWeight: '600',
          backgroundColor: `${operatingStatus.color}20`,
          color: operatingStatus.color
        }}>
          {operatingStatus.label}
        </span>
      </div>

      {/* Address */}
      <p style={{ 
        color: '#B0B0B0', 
        margin: '0 0 12px 0',
        fontSize: '0.95rem'
      }}>
        📍 {station.address || 'Địa chỉ không rõ'}
      </p>

      {/* Availability */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        marginBottom: '15px'
      }}>
        <div style={{
          width: '8px',
          height: '8px',
          borderRadius: '50%',
          backgroundColor: availability.color
        }}></div>
        <span style={{ 
          color: availability.color,
          fontSize: '0.95rem',
          fontWeight: '600'
        }}>
          {station.availableSlots || 0} slot trống
        </span>
        <span style={{ color: '#666', fontSize: '0.875rem' }}>
          ({availability.label})
        </span>
      </div>

      {/* Book Button */}
      {operatingStatus.status === 'active' && (station.availableSlots || 0) > 0 && (
        <button
          onClick={handleBookClick}
          disabled={booking}
          style={{
            padding: '10px 20px',
            background: booking ? '#666' : '#19c37d',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: booking ? 'not-allowed' : 'pointer',
            fontSize: '0.95rem',
            fontWeight: '600',
            width: '100%',
            transition: 'all 0.3s ease'
          }}
          onMouseEnter={(e) => {
            if (!booking) {
              e.currentTarget.style.background = '#17b370';
              e.currentTarget.style.transform = 'translateY(-1px)';
            }
          }}
          onMouseLeave={(e) => {
            if (!booking) {
              e.currentTarget.style.background = '#19c37d';
              e.currentTarget.style.transform = 'translateY(0)';
            }
          }}
        >
          {booking ? 'Đang đặt...' : '📅 Đặt chỗ'}
        </button>
      )}

      {operatingStatus.status !== 'active' && (
        <div style={{
          padding: '10px',
          background: 'rgba(255, 165, 0, 0.1)',
          border: '1px solid rgba(255, 165, 0, 0.3)',
          borderRadius: '8px',
          textAlign: 'center',
          color: '#ffa500',
          fontSize: '0.875rem'
        }}>
          Trạm đang bảo trì
        </div>
      )}

      {operatingStatus.status === 'active' && (station.availableSlots || 0) === 0 && (
        <div style={{
          padding: '10px',
          background: 'rgba(255, 107, 107, 0.1)',
          border: '1px solid rgba(255, 107, 107, 0.3)',
          borderRadius: '8px',
          textAlign: 'center',
          color: '#ff6b6b',
          fontSize: '0.875rem'
        }}>
          Hết chỗ
        </div>
      )}
    </div>
  );
};

StationCard.propTypes = {
  station: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    name: PropTypes.string.isRequired,
    address: PropTypes.string,
    availableSlots: PropTypes.number,
    totalSlots: PropTypes.number,
    status: PropTypes.string
  }).isRequired,
  onBook: PropTypes.func.isRequired,
  booking: PropTypes.bool.isRequired,
  onSelect: PropTypes.func
};

export default StationCard;
