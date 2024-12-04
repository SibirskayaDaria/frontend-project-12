import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { io } from 'socket.io-client';
import App from './components/App';
import rootReducer from './slices';
import './index.css';

// store
const store = configureStore({
  reducer: rootReducer,
});

// Создание подключения к WebSocket
const socket = io(); // Укажите адрес вашего сервера WebSocket
export const SocketContext = React.createContext(socket); // Экспорт контекста

// Проверка наличия элемента root перед рендерингом
const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error('Root element not found');
}


ReactDOM.createRoot(rootElement).render(
  <Provider store={store}>
    <SocketContext.Provider value={socket}> {/* Передаём сокет через контекст */}
      <React.StrictMode>
        <App />
      </React.StrictMode>
    </SocketContext.Provider>
  </Provider>
);
