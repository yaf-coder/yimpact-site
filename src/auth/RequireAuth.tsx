import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { Layout } from '../components/layout/Layout';
import { PendingLabel } from '../components/ui/Status';
import { useAuth } from './useAuth';

// A guard controls the reader experience only. Row Level Security is the real
// boundary. Refer to BUILD_SPEC.md, section 4.2.
export function RequireAuth() {
  const { status } = useAuth();
  const location = useLocation();

  // Wait for the session. Do not redirect here. A redirect during the wait
  // sends a refresh on a portal page to the login page.
  if (status === 'loading') {
    return <PortalWait />;
  }

  if (status === 'signedOut') {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  return <Outlet />;
}

export function PortalWait() {
  return (
    <Layout title="Portal · Yale Impact Expo" description="The Yale Impact Expo portal.">
      <div className="wrap py-24">
        <PendingLabel />
      </div>
    </Layout>
  );
}
