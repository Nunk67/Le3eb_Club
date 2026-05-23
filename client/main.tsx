import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import LegacySunset from './LegacySunset.tsx';
import { I18nProvider } from './i18n/I18nProvider.tsx';
import './index.css';

const useLegacy = window.location.pathname.startsWith('/legacy');

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <I18nProvider>
      {useLegacy ? <LegacySunset /> : <App />}
    </I18nProvider>
  </StrictMode>,
);
