import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  user: null, // состояние пользователя (можно хранить данные, такие как ID, имя и т.д.)
  isAuthenticated: false, // флаг, показывающий, авторизован ли пользователь
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logIn: (state, action) => {
      state.user = action.payload; // сохраняем данные пользователя
      state.isAuthenticated = true; // устанавливаем флаг авторизации
    },
    logOut: (state) => {
      state.user = null; // сбрасываем данные пользователя
      state.isAuthenticated = false; // сбрасываем флаг авторизации
    },
  },
});

export const { logIn, logOut } = authSlice.actions;

export default authSlice.reducer;
