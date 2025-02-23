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
  async (channelAddData, { rejectWithValue }) => {
    try {
      const response = await axios.post(routes.dataPath(), channelAddData.body, {
        headers: channelAddData.token
      });
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
      state.currentChannelId = payload.id;
    },
    addChannel: (state, { payload }) => {
      const existingChannel = state.channels.find(ch => ch.id === payload.id);
      if (!existingChannel) {
        state.channels.push(payload);
      }
    },    
    deleteChannel: (state, { payload }) => {
      state.channels = state.channels.filter((channel) => channel.id !== payload.id);
    },
    channelRename: (state, { payload }) => {
      const channel = state.channels.find((ch) => ch.id === payload.id);
      if (channel) {
        channel.name = payload.name;
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
    
        const exists = state.channels.some(ch => ch.id === payload.id);
        if (!exists) {
            state.channels.push(payload);
            state.currentChannelId = payload.id; // Сразу делаем новый канал текущим
        }
    });        
  },
});

const actions = {
  ...channelsSlice.actions,
  fetchData,
  fetchDataAddChannel
};
console.log('Экспортируем actions из channelsSlice:', {
  ...channelsSlice.actions,
  fetchData,
  fetchDataAddChannel
});

export { actions };
export default channelsSlice.reducer;