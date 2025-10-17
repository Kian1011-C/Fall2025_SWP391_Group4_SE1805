// Admin Layout Component
// Layout wrapper for admin pages

import React from 'react';

const AdminLayout = ({ children }) => {
  return (
    <div className="admin-layout">
      <header className="admin-header">
        <nav className="admin-nav">
          <div className="brand">SWP201 - Admin</div>
          <div className="nav-items">
            {/* TODO: Add navigation items */}
          </div>
        </nav>
      </header>
      
      <main className="admin-main">
        {children}
      </main>
      
      <footer className="admin-footer">
        {/* TODO: Add footer content */}
      </footer>
    </div>
  );
};

export default AdminLayout;