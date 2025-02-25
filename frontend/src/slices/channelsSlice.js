import axios from 'axios';
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import routes from '../routes.js';

const fetchData = createAsyncThunk(
  'channels/fetchData',
  async (authHeader, { rejectWithValue }) => {
    try {
      const response = await axios.get(routes.dataPath(), { headers: authHeader });
      return response.data;
    } catch (error) {
      return rejectWithValue({
        message: error.message,
        status: error.response?.status || 'Unknown',
      });
    }
  },
);

const fetchDataAddChannel = createAsyncThunk(
  'channels/fetchDataAddChannel',
  async ({ body, token }, { rejectWithValue }) => {
    try {
      const headers = {};
      if (token) {
        headers.Authorization = `Bearer ${token}`;
      }
      const response = await axios.post(routes.dataPath(), body, { headers });
      return response.data;
    } catch (error) {
      return rejectWithValue({
        message: error.message,
        status: error.response?.status || 'Unknown',
      });
    }
  },
);

const initialState = {
  loading: false,
  channels: [],
  currentChannelId: null,
  error: null,
};

const channelsSlice = createSlice({
  name: 'channels',
  initialState,
  reducers: {
    setCurrentChannel: (state, { payload }) => {
      state.currentChannelId = payload;
    },
    addChannel: (state, { payload }) => {
      if (payload?.id && !state.channels.some((ch) => ch.id === payload.id)) {
        state.channels.push(payload);
        state.currentChannelId = payload.id;
      }
    },
    deleteChannel: (state, { payload }) => {
      state.channels = state.channels.filter((channel) => channel.id !== payload);
    },
    channelRename: (state, { payload }) => {
      const channel = state.channels.find((ch) => ch.id === payload?.id);
      if (channel && payload?.name) {
        channel.name = payload.name;
      }
    },
    addMessage: (state, { payload }) => {
      const channel = state.channels.find((ch) => ch.id === payload.channelId);
      if (channel) {
        channel.messages = channel.messages || [];
        channel.messages.push(payload.message);
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchData.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.channels = payload;
        if (!state.currentChannelId && payload.length > 0) {
          state.currentChannelId = payload[0].id;
        }
      })
      .addCase(fetchData.rejected, (state, { payload }) => {
        state.loading = false;
        state.error = payload ? payload.message : 'Ошибка загрузки данных';
      })
      .addCase(fetchDataAddChannel.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDataAddChannel.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.error = null;
        if (payload?.id && !state.channels.some((ch) => ch.id === payload.id)) {
          state.channels.push(payload);
          state.currentChannelId = payload.id;
        }
      })
      .addCase(fetchDataAddChannel.rejected, (state, { payload }) => {
        state.loading = false;
        state.error = payload ? payload.message : 'Ошибка добавления канала';
      });
  },
});

export const { addChannel, setCurrentChannel, deleteChannel, channelRename, addMessage } = channelsSlice.actions;
export { fetchData, fetchDataAddChannel };
export default channelsSlice.reducer;
