import { configureStore } from '@reduxjs/toolkit';
import authReducer from './features/authSlice'; // Импортируй созданный слайс

const store = configureStore({
  reducer: {
    auth: authReducer, // Добавь редюсер авторизации
  },
});

export default store;
