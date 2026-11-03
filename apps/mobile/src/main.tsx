import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import '@may_thet_htar_aung/lemonade-design-system/tokens.css';
import '@may_thet_htar_aung/lemonade-design-system/styles.css';
import './app.css';
import { App } from './App';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
