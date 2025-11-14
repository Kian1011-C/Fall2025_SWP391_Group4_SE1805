// Welcome Header Component
import React from 'react';

const WelcomeHeader = ({ currentUser, activeVehicles }) => {
  const getUserName = () => {
    if (currentUser?.name) return currentUser.name;
    if (currentUser?.firstName && currentUser?.lastName) {
      return `${currentUser.firstName} ${currentUser.lastName}`;
    }
    return currentUser?.email || 'Driver';
  };

  return (
    <div style={{
      background: 'linear-gradient(135deg, rgba(25, 195, 125, 0.1), rgba(106, 183, 255, 0.1))',
      borderRadius: '20px',
      padding: '30px',
      marginBottom: '30px',
      border: '1px solid rgba(255, 255, 255, 0.1)'
    }}>
      <h1 style={{ 
        color: '#FFFFFF', 
        margin: '0 0 10px 0',
        fontSize: '2rem'
      }}>
         Chào mừng {getUserName()}!
      </h1>
      <p style={{ color: '#B0B0B0', margin: 0, fontSize: '1.1rem' }}>
        {activeVehicles > 0 
          ? `Bạn có ${activeVehicles} xe đang hoạt động` 
          : 'Sẵn sàng cho chuyến đi của bạn'}
      </p>
    </div>
  );
};

export default WelcomeHeader;
