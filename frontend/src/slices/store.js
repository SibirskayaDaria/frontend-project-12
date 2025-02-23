import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authslice';
import messagesReducer from './messagesSlice'; // ✅ Импорт messagesSlice

const store = configureStore({
  reducer: {
    auth: authReducer,
    messages: messagesReducer, // ✅ Добавлено
  },
});

export default store;
