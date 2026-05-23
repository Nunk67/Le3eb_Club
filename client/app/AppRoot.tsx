import { AppProvider } from './AppContext';
import { AdminRoute } from './AdminRoute';
import { AppShell } from './AppShell';

const isAdminPath = typeof window !== 'undefined' && window.location.pathname.startsWith('/admin');

export default function AppRoot() {
  return (
    <AppProvider>
      {isAdminPath ? <AdminRoute /> : <AppShell />}
    </AppProvider>
  );
}
