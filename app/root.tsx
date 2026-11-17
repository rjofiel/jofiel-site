import { createRoot, hydrateRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router';
import './app.css';
import { AppRoutes } from './App';

const container = document.getElementById('root')!;
const app = (
  <BrowserRouter>
    <AppRoutes />
  </BrowserRouter>
);

// Built pages arrive prerendered (vite/prerender.ts); the dev server serves an empty root.
if (container.hasChildNodes()) hydrateRoot(container, app);
else createRoot(container).render(app);
