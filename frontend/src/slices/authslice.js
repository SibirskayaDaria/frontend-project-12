import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  token: localStorage.getItem('token') || null,
  username: localStorage.getItem('username') || null,  // Добавляем username
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login: (state, action) => {
      state.token = action.payload.token;
      state.username = action.payload.username;
      localStorage.setItem('token', action.payload.token);
      localStorage.setItem('username', action.payload.username); // Сохраняем username
      console.log('Сохраняем username в Redux:', action.payload.username);
    },
    logout: (state) => {
      state.token = null;
      state.username = null;
      localStorage.removeItem('token');
      localStorage.removeItem('username'); // Удаляем username
    },
  },
});

export const { login, logout } = authSlice.actions;
export default authSlice.reducer;

