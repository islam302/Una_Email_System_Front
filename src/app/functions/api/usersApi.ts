import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { RootState as AppRootState } from "../../store";

interface User {
  id: string;
  username: string;
}

export const usersApi = createApi({
  reducerPath: "usersApi",
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
    getUsers: builder.query<User[], void>({
      query: () => "auth/users/",
    }),
    getUserStatus: builder.query({
      query: () => ({
        url: "auth/user-status",
      }),
    }),
  }),
});

export const { useGetUsersQuery, useGetUserStatusQuery } = usersApi;
