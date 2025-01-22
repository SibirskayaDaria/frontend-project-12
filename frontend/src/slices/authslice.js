import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  token: localStorage.getItem('token') || null,  // Получаем токен из localStorage, если он есть
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login: (state, action) => {
      state.token = action.payload;
      localStorage.setItem('token', action.payload);  // Сохраняем токен в localStorage
    },
    logout: (state) => {
      state.token = null;
      localStorage.removeItem('token');  // Удаляем токен из localStorage
    },
  },
});

export const { login, logout } = authSlice.actions;
export default authSlice.reducer;
