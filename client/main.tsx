import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import AdminWorkbench from '../admin/AdminWorkbench.tsx';
import LegacySunset from './LegacySunset.tsx';
import { I18nProvider } from './i18n/I18nProvider.tsx';
import './index.css';

const path = window.location.pathname;
const useAdminWorkbench = path.startsWith('/admin');
const useLegacy = path.startsWith('/legacy');

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <I18nProvider>
      {useAdminWorkbench ? <AdminWorkbench /> : useLegacy ? <LegacySunset /> : <App />}
    </I18nProvider>
  </StrictMode>,
);
