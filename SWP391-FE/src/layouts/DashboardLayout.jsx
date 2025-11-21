// Dashboard Layout với Sidebar và Header
import React from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';

function DashboardLayout({ children, role = 'driver', title = null }) {
  return (
    <div style={{
      display: 'flex',
      height: '100vh',
      background: 'linear-gradient(180deg, #0b1020 0%, #0e1430 100%)',
      color: '#FFFFFF',
      willChange: 'contents',
      overflow: 'hidden'
    }}>
      <Sidebar role={role} />

      {/* Main Content */}
      <div style={{
        flex: 1,
        marginLeft: '0',
        display: 'flex',
        flexDirection: 'column',
        height: '100vh',
        overflow: 'hidden',
        willChange: 'contents'
      }}>
        {title ? <Header title={title} /> : null}

        {/* Content Area */}
        <div style={{
          flex: 1,
          overflowY: 'auto',
          padding: '0',
          willChange: 'scroll-position'
        }}>
          {children}
        </div>
      </div>
    </div>
  );
}

export default React.memo(DashboardLayout);
