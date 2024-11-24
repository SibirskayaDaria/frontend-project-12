/* eslint no-param-reassign: ["error", { "props": true, "ignorePropertyModificationsFor": ["state"] }] */
import { createSlice } from '@reduxjs/toolkit';
import { actions as channelsActions } from './channelsSlice.js'; // Убедитесь, что путь правильный

const initialState = {
  messages: [],
};

const messagesSlice = createSlice({
  name: 'messages',
  initialState,
  reducers: {
    addMessage: (state, { payload }) => {
      state.messages.push(payload); // Добавляем новое сообщение в массив
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(channelsActions.fetchData.fulfilled, (state, { payload }) => {
        state.messages = payload.messages; // Заполняем состояние сообщениями из ответа
      });
  },
});

// Экспортируем действия и редьюсер
export const { addMessage } = messagesSlice.actions;
export default messagesSlice.reducer;