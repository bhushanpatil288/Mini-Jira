// ============================================================
// PrivateRoute Component
// ============================================================
// A route guard that redirects unauthenticated users to the
// login page. Wraps protected routes in App.jsx.
// ============================================================

import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const PrivateRoute = ({ children }) => {
    const { token, loading } = useAuth();

    // Show nothing while checking localStorage on first render
    if (loading) return null;

    // If no token, redirect to login
    if (!token) return <Navigate to="/login" replace />;

    return children;
};

export default PrivateRoute;
