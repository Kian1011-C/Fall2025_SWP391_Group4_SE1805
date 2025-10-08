// Protected Route Component
// Ensures users can only access dashboards appropriate for their role

import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const { currentUser, currentView } = useAuth();

  // If user is not logged in, redirect to landing page
  if (!currentUser || currentView === 'landing') {
    return <Navigate to="/" replace />;
  }

  // If no specific roles are required, allow access for any authenticated user
  if (allowedRoles.length === 0) {
    return children;
  }

  // Check if user's role is in the allowed roles
  const hasPermission = allowedRoles.includes(currentUser.role);

  if (!hasPermission) {
    // Redirect to user's appropriate dashboard if they don't have permission
    const redirectPath = currentUser.role === 'admin' ? '/admin/dashboard' :
                        currentUser.role === 'staff' ? '/staff/dashboard' :
                        '/driver/dashboard';
    
    return <Navigate to={redirectPath} replace />;
  }

  return children;
};

// Role-specific protected route components
export const AdminRoute = ({ children }) => (
  <ProtectedRoute allowedRoles={['admin']}>
    {children}
  </ProtectedRoute>
);

export const StaffRoute = ({ children }) => (
  <ProtectedRoute allowedRoles={['staff']}>
    {children}
  </ProtectedRoute>
);

export const DriverRoute = ({ children }) => (
  <ProtectedRoute allowedRoles={['driver']}>
    {children}
  </ProtectedRoute>
);

export const StaffOrAdminRoute = ({ children }) => (
  <ProtectedRoute allowedRoles={['staff', 'admin']}>
    {children}
  </ProtectedRoute>
);

export default ProtectedRoute;