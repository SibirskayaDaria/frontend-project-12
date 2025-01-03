/* eslint no-param-reassign: ["error", { "props": true, "ignorePropertyModificationsFor": ["state"] }] */
import axios from 'axios';
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

import routes from '../routes.js';

const fetchData = createAsyncThunk(
  'channels/setInitialState',
  async (authHeader, { rejectWithValue }) => {
    try {
      const response = await axios.get(routes.dataPath(), { headers: authHeader });
      return response.data;
    } catch (error) {
      return rejectWithValue({ message: error.message, status: error.status });
    }
  },
);

const initialState = { loading: false, channels: [], currentChannelId: null };

const channelsSlice = createSlice({
  name: 'channels',
  initialState,
  reducers: {
    setCurrentChannel: (state, { payload }) => {
      state.currentChannelId = payload.id;
    },
    addChannel: (state, { payload }) => {
      state.channels.push(payload);
    },
    deleteChannel: (state, { payload }) => {
      state.channels = state.channels.filter((channel) => channel.id !== payload.id);
    },
    channelRename: (state, { payload }) => {
      const { id, name } = payload;
      const renamedChannel = state.channels.find((channel) => channel.id === id);
      renamedChannel.name = name;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchData.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchData.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.channels = payload;
        //state.currentChannelId = payload.currentChannelId;
      })
      .addCase(fetchData.rejected, (state) => {
        state.loading = false;
      });
  },
});

// Экспортируем редьюсер и действия
const actions = {
    ...channelsSlice.actions,
    fetchData,
  };
  
  export { actions };
  export default channelsSlice.reducer;