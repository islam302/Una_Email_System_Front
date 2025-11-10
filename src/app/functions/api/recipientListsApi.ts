/* eslint-disable @typescript-eslint/no-explicit-any */
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { RootState as AppRootState } from "../../store";

interface RecipientList {
  id: string;
  name: string;
  recipients: {
    id: string;
    name: string;
    email: string;
  }[];
}

export const recipientListsApi = createApi({
  reducerPath: "recipientListsApi",
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
    getRecipientLists: builder.query<RecipientList[], void>({
      query: () => "recipients/list/",
    }),
    getSenderFrom: builder.query<any, void>({
      query: () => "send/sender-emails/",
    }),
    refetchRecipientLists: builder.mutation<void, void>({
      queryFn: () => ({ data: void 0 }),
    }),
  }),
});

export const {
  useGetRecipientListsQuery,
  useRefetchRecipientListsMutation,
  useGetSenderFromQuery,
} = recipientListsApi;
