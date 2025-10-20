// Staff Layout Component
// Layout wrapper for staff pages

import React from 'react';

const StaffLayout = ({ children }) => {
  return (
    <div className="staff-layout">
      <header className="staff-header">
        <nav className="staff-nav">
          <div className="brand">SWP201 - Staff</div>
          <div className="nav-items">
            {/* TODO: Add navigation items */}
          </div>
        </nav>
      </header>
      
      <main className="staff-main">
        {children}
      </main>
      
      <footer className="staff-footer">
        {/* TODO: Add footer content */}
      </footer>
    </div>
  );
};

export default StaffLayout;