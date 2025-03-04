import axios from 'axios';
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import routes from '../routes.js';

console.log('routes:', routes);
console.log('routes.channelPath:', routes.channelPath);



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
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
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

const fetchDataDeleteChannel = createAsyncThunk(
  'channels/fetchDataDeleteChannel',
  async ({ id, token }, { rejectWithValue }) => {
    try {
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      await axios.delete(routes.channelPath(id), { headers });
      return id;
    } catch (error) {
      return rejectWithValue({
        message: error.message,
        status: error.response?.status || 'Unknown',
      });
    }
  },
);

const fetchDataRenameChannel = createAsyncThunk(
  'channels/fetchDataRenameChannel',
  async ({ id, name, token }, { rejectWithValue }) => {
    try {
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      await axios.patch(routes.channelPath(id), { name }, { headers });
      return { id, name };
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
      .addCase(fetchDataAddChannel.fulfilled, (state, { payload }) => {
        state.channels.push(payload);
        state.currentChannelId = payload.id;
      })
      .addCase(fetchDataDeleteChannel.fulfilled, (state, { payload }) => {
        state.channels = state.channels.filter((channel) => channel.id !== payload);
      })
      .addCase(fetchDataRenameChannel.fulfilled, (state, { payload }) => {
        const channel = state.channels.find((ch) => ch.id === payload.id);
        if (channel) {
          channel.name = payload.name;
        }
      });
  },
});

export const { setCurrentChannel } = channelsSlice.actions;
export { fetchData, fetchDataAddChannel, fetchDataDeleteChannel, fetchDataRenameChannel };
export default channelsSlice.reducer;