import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authslice'; // Импортируем редуктор из authSlice

const store = configureStore({
  reducer: {
    auth: authReducer, // Добавляем редуктор авторизации
  },
});

export default store;
