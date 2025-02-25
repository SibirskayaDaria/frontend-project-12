import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../slices/authSlice'; // Исправлен путь
import channelsReducer from '../slices/channelsSlice';
import apiSlice from '../slices/apiSlice';

const store = configureStore({
  reducer: {
    auth: authReducer,
    channels: channelsReducer,
    [apiSlice.reducerPath]: apiSlice.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(apiSlice.middleware),
});

export default store;
