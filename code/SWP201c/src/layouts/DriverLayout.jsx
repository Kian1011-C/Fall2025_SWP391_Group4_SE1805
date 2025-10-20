// Driver Layout Component
// Layout wrapper for driver pages

import React from 'react';

const DriverLayout = ({ children }) => {
  return (
    <div className="driver-layout">
      <header className="driver-header">
        <nav className="driver-nav">
          <div className="brand">SWP201 - Driver</div>
          <div className="nav-items">
            {/* TODO: Add navigation items */}
          </div>
        </nav>
      </header>
      
      <main className="driver-main">
        {children}
      </main>
      
      <footer className="driver-footer">
        {/* TODO: Add footer content */}
      </footer>
    </div>
  );
};

export default DriverLayout;