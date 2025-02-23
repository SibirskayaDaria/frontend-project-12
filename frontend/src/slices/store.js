import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authslice';
import messagesReducer from './messagesSlice';
import apiSlice from './slices/apiSlice'; // ✅ Импорт API Slice

const store = configureStore({
  reducer: {
    auth: authReducer,
    messages: messagesReducer,
    [apiSlice.reducerPath]: apiSlice.reducer, // ✅ Добавляем RTK Query в редюсер
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(apiSlice.middleware), // ✅ Добавляем middleware RTK Query
});

export default store;
