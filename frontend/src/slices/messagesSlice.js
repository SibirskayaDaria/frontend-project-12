/* eslint no-param-reassign: ["error", { "props": true, "ignorePropertyModificationsFor": ["state"] }] */
import { createSlice } from '@reduxjs/toolkit';
import { actions as channelsActions } from './channelsSlice.js'; 

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
export const { actions } = messagesSlice;
export const { addMessage } = messagesSlice;
export default messagesSlice.reducer;