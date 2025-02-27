import { configureStore } from '@reduxjs/toolkit';
import rootReducer from './index.js';
import { apiSlice } from './apiSlice.js';

const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(apiSlice.middleware),
  devTools: true, // ✅ Включаем DevTools явно
});

export default store;
