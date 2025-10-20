// Dashboard Layout với Sidebar và Header
import React from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';

const DashboardLayout = ({ children, role = 'driver' }) => {
  console.log('🔍 DashboardLayout: role =', role);

  return (
    <div style={{
      display: 'flex',
      minHeight: '100vh',
      background: 'linear-gradient(180deg, #0b1020 0%, #0e1430 100%)',
      color: '#FFFFFF'
    }}>
      <Sidebar role={role} />

      {/* Main Content */}
      <div style={{
        flex: 1,
        marginLeft: '280px',
        display: 'flex',
        flexDirection: 'column'
      }}>
        <Header title="Dashboard" />

        {/* Content Area */}
        <div style={{
          flex: 1,
          overflowY: 'auto',
          padding: '0'
        }}>
          {children}
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;

