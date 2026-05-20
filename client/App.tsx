/**
 * App shell (< 300 lines). Business UI lives in app/AppRoot.tsx and will be
 * incrementally split into views/components/hooks/stores per Phase G.
 */
import { ErrorBoundary } from './lib/errorBoundary';
import AppRoot from './app/AppRoot';

export default function App() {
  return (
    <ErrorBoundary>
      <AppRoot />
    </ErrorBoundary>
  );
}
