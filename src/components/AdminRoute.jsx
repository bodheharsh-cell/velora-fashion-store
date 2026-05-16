import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const AdminRoute = () => {
  const { user, profile, loading } = useAuth();
  const location = useLocation();

  console.log('[AdminRoute Debug] Auth State Evaluation:', {
    path: location.pathname,
    hasUser: !!user,
    userId: user?.id,
    hasProfile: !!profile,
    profileRole: profile?.role,
    isLoading: loading
  });

  if (loading) {
    console.log('[AdminRoute Debug] Deferring redirect. Auth state is currently loading...');
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-black mb-4"></div>
        <p className="text-sm font-semibold tracking-widest uppercase text-gray-500">Authenticating Access...</p>
      </div>
    );
  }

  // Double check: if user exists but profile is null, this is an error state, NOT a loading state.
  // We must not redirect immediately if it's supposed to be loading.
  if (user && !profile) {
    console.log('[AdminRoute Debug] CRITICAL: User exists but profile is missing. Denying access to prevent unsafe renders.');
    return <Navigate to="/" replace />;
  }

  if (!user) {
    console.log('[AdminRoute Debug] Access Denied: No authenticated user. Redirecting to login.');
    return <Navigate to="/login" replace />;
  }

  if (profile?.role !== 'admin') {
    console.log(`[AdminRoute Debug] Access Denied: User role is '${profile?.role}', requires 'admin'. Redirecting to homepage.`);
    return <Navigate to="/" replace />;
  }

  console.log('[AdminRoute Debug] Access Granted. Rendering admin outlet.');
  return <Outlet />;
};

export default AdminRoute;
