import { useApp } from './AppContext';

/** Shared destructure for ViewRouter / AppShell so JSX can keep bare identifiers. */
export function useAppBindings() {
  const app = useApp();
  return app;
}
