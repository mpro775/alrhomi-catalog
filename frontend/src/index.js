// src/index.jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import reportWebVitals from './reportWebVitals';
import './i18n'; // Import i18n configuration
import './index.css';
import './App.css';

import { ThemeProvider } from './contexts/ThemeContext';
import { AuthProvider } from './contexts/AuthContext';
import { BrowserRouter } from 'react-router-dom';
import { CacheProvider } from '@emotion/react';
import createCache from '@emotion/cache';
import { prefixer } from 'stylis';
import rtl from 'stylis-rtl';
import { HelmetProvider } from 'react-helmet-async';
import App from './App';

// Set RTL direction and language on HTML element
document.documentElement.setAttribute('dir', 'rtl');
document.documentElement.setAttribute('lang', 'ar');

// Create rtl cache with correct plugin order
const cacheRtl = createCache({
  key: 'muirtl',
  stylisPlugins: [prefixer, rtl],
  prepend: true,
});

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <HelmetProvider>
      <CacheProvider value={cacheRtl}>
        <BrowserRouter>
          <ThemeProvider>
            <AuthProvider>
              <App />
            </AuthProvider>
          </ThemeProvider>
        </BrowserRouter>
      </CacheProvider>
    </HelmetProvider>
  </React.StrictMode>
);

reportWebVitals();
