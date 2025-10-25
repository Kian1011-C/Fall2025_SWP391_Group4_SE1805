import React from 'react';

function Header({ title = 'Dashboard' }) {
  return (
    <div style={{
      height: '70px',
      background: 'rgba(18, 24, 49, 0.6)',
      backdropFilter: 'blur(10px)',
      borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
      display: 'flex',
      alignItems: 'center',
      padding: '0 30px',
      position: 'sticky',
      top: 0,
      zIndex: 10
    }}>
      <h2 style={{ margin: 0, fontSize: '20px', fontWeight: '600' }}>
        {title}
      </h2>
    </div>
  );
}

export default React.memo(Header);

