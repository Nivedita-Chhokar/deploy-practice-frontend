import { Navigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';

const PrivateRoute = ({ children, requiredRole = null }) => {
  const { user, loading } = useAuth();

  // If still loading auth state, show nothing
  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  // If not logged in, redirect to login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // If role is required and user doesn't have it, redirect to home
  if (requiredRole && (!user.roles || !user.roles.includes(requiredRole))) {
    return <Navigate to="/" replace />;
  }

  // Otherwise, show the children
  return children;
};

export default PrivateRoute;