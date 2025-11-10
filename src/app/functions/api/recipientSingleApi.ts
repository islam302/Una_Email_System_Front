import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { RootState as AppRootState } from "../../store";

interface RecipientList {
  id: string;
  name: string;
}

export const recipientSingleApi = createApi({
  reducerPath: "recipientSingleApi",
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
    getRecipientSingle: builder.query<RecipientList[], void>({
      query: () => "recipients/",
    }),
  }),
});

export const { useGetRecipientSingleQuery } = recipientSingleApi;
