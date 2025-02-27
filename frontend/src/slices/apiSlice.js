import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl: '/api/v1',
    prepareHeaders: (headers, { getState }) => {
      const token = getState()?.auth?.token;
      if (token) headers.set('Authorization', `Bearer ${token}`);
      return headers;
    },
  }),
  tagTypes: ['Messages'], // 🔥 Добавили теги для кеша
  endpoints: (builder) => ({
    getChannels: builder.query({
      query: () => '/channels',
    }),
    addChannel: builder.mutation({
      query: (channel) => ({
        url: '/channels',
        method: 'POST',
        body: channel,
      }),
    }),
    getMessages: builder.query({
      query: () => '/messages',
      providesTags: ['Messages'], // ✅ Помечаем кеш как `Messages`
    }),
    sendMessage: builder.mutation({
      query: (message) => ({
        url: '/messages',
        method: 'POST',
        body: message,
      }),
      invalidatesTags: ['Messages'], // 🔥 Обнуляем кеш после отправки
    }),
  }),
});

export const { useGetChannelsQuery, useAddChannelMutation, useGetMessagesQuery, useSendMessageMutation } = apiSlice;
export { apiSlice };
