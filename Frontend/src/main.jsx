import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { MaterialUIControllerProvider } from './context';
import App from './App.jsx';
import theme from 'assets/theme';
import './index.css';

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <MaterialUIControllerProvider>
          <App />
        </MaterialUIControllerProvider>
      </ThemeProvider>
    </BrowserRouter>
  </React.StrictMode>
);

