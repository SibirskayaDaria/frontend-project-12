import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from './slices/store.js';
import AuthProvider from './contexts/AuthProvider.jsx';
import App from './App.jsx';
import i18next from 'i18next';
import { I18nextProvider, initReactI18next } from 'react-i18next';
import resources from './locations/index.js';
import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css';

// Проверяем, есть ли элемент root
const rootElement = document.getElementById('root');

const i18n = i18next.createInstance();
    await i18n
    .use(initReactI18next)
    .init({
      resources,
      fallbackLng: 'en',
    });


if (!rootElement) {
  console.error('Root element not found');
} else {
  // Рендеринг приложения
  ReactDOM.createRoot(rootElement).render(
    <I18nextProvider i18n={i18n}>
      <Provider store={store}>
        <AuthProvider>
          <BrowserRouter>
              <App />dsdsd
          </BrowserRouter>
        </AuthProvider>
      </Provider>
    </I18nextProvider>
  );
}