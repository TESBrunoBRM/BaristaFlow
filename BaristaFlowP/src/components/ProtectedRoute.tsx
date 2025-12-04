// src/components/ProtectedRoute.tsx
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FaSpinner } from 'react-icons/fa'; // Icono de carga

interface ProtectedRouteProps {
  element: React.ReactElement;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ element }) => {
  // Obtenemos el usuario y el estado de carga
  const { user, loading } = useAuth();

  // 1. Mostrar un cargador mientras Firebase verifica el estado (loading: true)
  if (loading) {
    return <div className="text-center py-20 text-xl text-gray-500">
      <FaSpinner className="inline animate-spin mr-2" /> 
      Verificando autenticación...
    </div>;
  }

  // 2. Si no hay usuario (y la carga terminó), redirige a la página de login
  if (!user) {
    // Usamos 'replace' para evitar que el usuario pueda volver con el botón de atrás
    return <Navigate to="/login" replace />; 
  }

  // 3. Si hay usuario y la carga terminó, muestra el componente solicitado (ProfilePage)
  return element;
};

export default ProtectedRoute;