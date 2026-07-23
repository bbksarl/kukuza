import React from 'react';
import { createRoot } from 'react-dom/client';
import App, { AppErrorBoundary } from './App';
import { AppProviders } from '@/providers/AppProviders';
import '@/design-system/app.css';

const container = document.getElementById('root');

if (!container) {
  throw new Error('KUKUZA root element is missing');
}

createRoot(container).render(
  <React.StrictMode>
    <AppProviders>
      <AppErrorBoundary>
        <App />
      </AppErrorBoundary>
    </AppProviders>
  </React.StrictMode>
);

window.addEventListener('error', (event) => {
  if (event.error) {
    // Keep the fallback observable without exposing credentials or request bodies.
    console.error('[kukuza] unhandled UI error', event.error);
  }
});
