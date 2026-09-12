import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { UserRole } from '../types';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: UserRole[];
  requiredPermission?: string;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  allowedRoles,
  requiredPermission,
}) => {
  const { user, loading, hasPermission } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f8fafc] dark:bg-[#070f26] flex flex-col items-center justify-center text-slate-600 dark:text-slate-400 transition-colors">
        <div className="w-10 h-10 border-4 border-blue-500/20 border-t-blue-600 dark:border-t-blue-400 rounded-full animate-spin mb-4" />
        <span className="text-sm font-medium tracking-wide">Validating session credentials...</span>
      </div>
    );
  }

  if (!user) {
    const targetLogin = location.pathname.startsWith('/admin') ? '/admin/login' : '/login';
    return <Navigate to={targetLogin} state={{ from: location }} replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/dashboard" replace />;
  }

  if (requiredPermission && !hasPermission(requiredPermission)) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
};
