import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import App from './App.jsx';
import rootReducer from './slices';
import apiSlice from './slices/apiSlice'; // ✅ Импортируем apiSlice
import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css';

// Создание Redux Store
const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(apiSlice.middleware), // ✅ Добавляем middleware API
});

// Добавляем API middleware в store (необязательно, но полезно)
store.dispatch(apiSlice.util.prefetch('fetchData', undefined, { force: true }));

// Проверка наличия элемента root перед рендерингом
const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error('Root element not found');
}

// Рендеринг приложения
ReactDOM.createRoot(rootElement).render(
  <Provider store={store}>
    <React.StrictMode>
      <App />
    </React.StrictMode>
  </Provider>
);
