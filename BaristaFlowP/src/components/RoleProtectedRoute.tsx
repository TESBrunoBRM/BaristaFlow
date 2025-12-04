// src/components/RoleProtectedRoute.tsx
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FaSpinner } from 'react-icons/fa';

interface RoleProtectedRouteProps {
  element: React.ReactElement;
  allowedRole: string;
}

const RoleProtectedRoute: React.FC<RoleProtectedRouteProps> = ({ element, allowedRole }) => {
  const { user, userRole, loading } = useAuth();

  if (loading) {
    return (
      <div className="text-center py-20 text-xl text-gray-500">
        <FaSpinner className="inline animate-spin mr-2" /> Verificando permisos...
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (userRole !== allowedRole) {
    return <Navigate to="/" replace />;
  }

  return element;
};

export default RoleProtectedRoute;
