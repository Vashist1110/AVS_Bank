import React from 'react';
import { Navigate } from 'react-router-dom';
import { authHelpers } from '../services/api';

// Protect routes that require authentication (User routes)
export const PrivateRoute = ({ children }) => {
  const isAuthenticated = authHelpers.isAuthenticated();
  const isAdmin = authHelpers.isAdmin();
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  // If admin tries to access user routes, redirect to admin dashboard
  if (isAdmin) {
    return <Navigate to="/admin-dashboard" replace />;
  }
  
  return children;
};

// Protect routes that should not be accessed when already logged in (Login/Register pages)
export const PublicRoute = ({ children }) => {
  const isAuthenticated = authHelpers.isAuthenticated();
  const isAdmin = authHelpers.isAdmin();
  
  if (isAuthenticated) {
    if (isAdmin) {
      return <Navigate to="/admin-dashboard" replace />;
    }
    return <Navigate to="/user-dashboard" replace />;
  }
  
  return children;
};

// Protect admin routes
export const AdminRoute = ({ children }) => {
  const isAuthenticated = authHelpers.isAuthenticated();
  const isAdmin = authHelpers.isAdmin();
  
  if (!isAuthenticated) {
    return <Navigate to="/admin-login" replace />;
  }
  
  // If user tries to access admin routes, redirect to user dashboard
  if (!isAdmin) {
    return <Navigate to="/user-dashboard" replace />;
  }
  
  return children;
};

// Protect admin login route (don't show if already logged in)
export const AdminPublicRoute = ({ children }) => {
  const isAuthenticated = authHelpers.isAuthenticated();
  const isAdmin = authHelpers.isAdmin();
  
  if (isAuthenticated) {
    if (isAdmin) {
      return <Navigate to="/admin-dashboard" replace />;
    }
    // If user tries to access admin login, redirect to user dashboard
    return <Navigate to="/user-dashboard" replace />;
  }
  
  return children;
};
