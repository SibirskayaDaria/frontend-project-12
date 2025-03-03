import { configureStore } from '@reduxjs/toolkit';
import { apiSlice } from './apiSlice';
import authReducer from './authSlice'; // ✅ Импортируем authSlice
import channelsReducer from './channelsSlice';

const store = configureStore({
  reducer: {
    auth: authReducer, // ✅ Добавляем auth в store
    channelsInfo: channelsReducer,
    [apiSlice.reducerPath]: apiSlice.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(apiSlice.middleware),
});

export default store;
