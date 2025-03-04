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
  tagTypes: ['Messages', 'Channels'], // Добавили теги для кеширования
  endpoints: (builder) => ({
    getChannels: builder.query({
      query: () => '/channels',
      providesTags: ['Channels'],
    }),
    addChannel: builder.mutation({
      query: (channel) => ({
        url: '/channels',
        method: 'POST',
        body: channel,
      }),
      invalidatesTags: ['Channels'],
    }),
    deleteChannel: builder.mutation({
      query: (channelId) => ({
        url: `/channels/${channelId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Channels'],
    }),
    renameChannel: builder.mutation({
      query: ({ id, name }) => ({
        url: `/channels/${id}`,
        method: 'PATCH',
        body: { name },
      }),
      invalidatesTags: ['Channels'],
    }),
    
    getMessages: builder.query({
      query: () => '/messages',
      providesTags: ['Messages'],
    }),
    sendMessage: builder.mutation({
      query: (message) => ({
        url: '/messages',
        method: 'POST',
        body: message,
      }),
      invalidatesTags: ['Messages'],
    }),
  }),
});

export const { 
  useGetChannelsQuery, 
  useAddChannelMutation, 
  useDeleteChannelMutation, 
  useRenameChannelMutation, 
  useGetMessagesQuery, 
  useSendMessageMutation 
} = apiSlice;
export { apiSlice };
