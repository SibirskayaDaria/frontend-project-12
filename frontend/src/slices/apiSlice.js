import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl: '/api/v1', // 🔥 Добавил `/v1`, как в документации API
    prepareHeaders: (headers, { getState }) => {
      const token = getState()?.auth?.token;
      if (token) headers.set('Authorization', `Bearer ${token}`);
      return headers;
    },
  }),
  endpoints: (builder) => ({
    getChannels: builder.query({
      query: () => '/channels', // ✅ Теперь путь `/api/v1/channels`
    }),
    addChannel: builder.mutation({
      query: (channel) => ({
        url: '/channels',
        method: 'POST',
        body: channel,
      }),
    }),
    getMessages: builder.query({
      query: () => '/messages', // ✅ Теперь путь `/api/v1/messages`
    }),
    sendMessage: builder.mutation({
      query: (message) => ({
        url: '/messages',
        method: 'POST',
        body: message,
      }),
    }),
  }),
});

export const { useGetChannelsQuery, useAddChannelMutation, useGetMessagesQuery, useSendMessageMutation } = apiSlice;
export { apiSlice }; 
