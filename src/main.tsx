import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './styles/main.css';
import { App } from './app/App';
import { AppProviders } from './app/AppProviders';

const root = document.querySelector('#app');
if (!root) throw new Error('Application root is missing.');

createRoot(root).render(
  <StrictMode>
    <AppProviders>
      <App />
    </AppProviders>
  </StrictMode>,
);
