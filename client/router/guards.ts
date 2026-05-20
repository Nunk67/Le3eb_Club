import { PROTECTED_VIEWS, type View } from './routes';

/** Whether navigating to this view requires an authenticated session. */
export function viewRequiresAuth(view: View, data?: { focusInput?: boolean }): boolean {
  return PROTECTED_VIEWS.has(view) || (view === 'POST_DETAIL' && Boolean(data?.focusInput));
}
