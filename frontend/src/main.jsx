import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from './slices/store.js';
import AuthProvider from './contexts/AuthProvider.jsx';
import App from './App.jsx';
import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css';

// Проверяем, есть ли элемент root
const rootElement = document.getElementById('root');

if (!rootElement) {
  console.error('Root element not found');
} else {
  // Рендеринг приложения
  ReactDOM.createRoot(rootElement).render(
    <Provider store={store}>
      <AuthProvider>
        <BrowserRouter>
          <React.StrictMode>
            <App />
          </React.StrictMode>
        </BrowserRouter>
      </AuthProvider>
    </Provider>
  );
}
