import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Loader } from 'lucide-react';

const ProtectedRoute = () => {
  const { user, loading } = useAuth();
  
  // Show loading state while authentication is being checked
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader className="h-10 w-10 animate-spin text-indigo-600 mx-auto" />
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // No user? Redirect to login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // User with unverified email? Redirect to verification page
  if (!user.emailVerified) {
    return <Navigate to="/verify-email" replace />;
  }

  // User is authenticated and email is verified, render the protected content
  return <Outlet />;
};

export default ProtectedRoute;