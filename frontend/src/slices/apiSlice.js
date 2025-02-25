import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const apiSlice = createApi({
  reducerPath: 'api', // ✅ Должно совпадать с rootReducer
  baseQuery: fetchBaseQuery({
    baseUrl: '/api', // ✅ Используем прокси Vite
    prepareHeaders: (headers, { getState }) => {
      const token = getState()?.auth?.token;
      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  endpoints: (builder) => ({
    fetchData: builder.query({
      query: () => ({
        url: '/data',
        headers: { 'Content-Type': 'application/json' },
      }),
    }),
    sendMessage: builder.mutation({
      query: (message) => ({
        url: '/messages',
        method: 'POST',
        body: message,
        headers: { 'Content-Type': 'application/json' },
      }),
    }),
  }),
});

export const { useFetchDataQuery, useSendMessageMutation } = apiSlice;
export default apiSlice;
