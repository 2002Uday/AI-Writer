import { Navigate, Outlet } from 'react-router-dom';
import Cookies from 'js-cookie';

// For protecting authenticated routes (Dashboard, etc.)
export const ProtectedRoute = () => {
  const token = Cookies.get('token');
  
  if (!token) {
    // Redirect to login if there's no token
    return <Navigate to="/login" />;
  }
  
  // Render the protected route
  return <Outlet />;
};

// For protecting auth routes (Login, Register) from authenticated users
export const AuthRoute = () => {
  const token = Cookies.get('token');
  
  if (token) {
    // Redirect to dashboard if user is already logged in
    return <Navigate to="/dashboard" />;
  }
  
  // Render the auth route
  return <Outlet />;
};