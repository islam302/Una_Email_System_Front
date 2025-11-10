import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { RootState as AppRootState } from "../../store";

export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "https://una-email-system-yvky.onrender.com/",
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as AppRootState).token.access;
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  endpoints: (builder) => ({
    refreshToken: builder.mutation({
      query: (refreshToken) => ({
        url: "auth/token/refresh/",
        method: "POST",
        body: refreshToken,
      }),
    }),
  }),
});

export const { useRefreshTokenMutation } = authApi;
