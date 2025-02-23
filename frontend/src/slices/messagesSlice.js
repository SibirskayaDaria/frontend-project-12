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
      state.messages.push(payload);
    },
  },
  extraReducers: (builder) => {
    builder.addCase(channelsActions.fetchData.fulfilled, (state, { payload }) => {
      state.messages = payload.messages ?? [];
    });
  },
});

// ✅ Экспортируем `addMessage` отдельно
export const { addMessage } = messagesSlice.actions;
export const actions = messagesSlice.actions;
export default messagesSlice.reducer;
