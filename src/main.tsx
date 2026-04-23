import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import AdminWorkbench from './AdminWorkbench.tsx';
import './index.css';

const useAdminWorkbench = window.location.pathname.startsWith('/admin');

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    {useAdminWorkbench ? <AdminWorkbench /> : <App />}
  </StrictMode>,
);
