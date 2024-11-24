import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit'; // Импортируем configureStore
import rootReducer from './slices'; // Импортируйте ваш корневой редьюсер из папки slices
import App from './components/App'; // Импортируйте основной компонент приложения
import './index.css'; // Импортируйте глобальные стили

// Создание Redux store
const store = configureStore({
  reducer: rootReducer,
});

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