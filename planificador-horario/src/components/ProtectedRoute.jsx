import { Navigate, Outlet } from 'react-router-dom';

export const ProtectedRoute = ({ user, requiredRole }) => {
  // Si no hay usuario o token, redirige al login
  if (!user || !user.token) {
    return <Navigate to="/login" replace />;
  }

  // Si hay un rol requerido y no coincide, redirige a no autorizado
  if (requiredRole && user.role !== requiredRole) {
    return <Navigate to="/unauthorized" replace />;
  }

  // Si todo está OK, muestra la ruta hija
  return <Outlet />;
};
