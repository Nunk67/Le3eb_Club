import { AppProvider } from './AppContext';
import { AppShell } from './AppShell';

export default function AppRoot() {
  return (
    <AppProvider>
      <AppShell />
    </AppProvider>
  );
}
