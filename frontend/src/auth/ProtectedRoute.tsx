import { Navigate, Outlet } from 'react-router-dom';
import { Role } from '../api/types';
import { useAuth } from './AuthContext';

export function ProtectedRoute({ role }: { role?: Role }) {
  const { user, loading } = useAuth();
  if (loading) return <div className="p-8 text-muted">Memuat sesi...</div>;
  if (!user) return <Navigate to="/login" replace />;
  if (role && user.role !== role) return <Navigate to="/" replace />;
  return <Outlet />;
}
