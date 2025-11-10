import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { RootState as AppRootState } from "../../store";

interface RecipientList {
  id: string;
  name: string;
}

export const emailTemplatesApi = createApi({
  reducerPath: "emailTemplatesApi",
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
    getEmailTemplate: builder.query<RecipientList[], void>({
      query: () => "email_forms/",
    }),
  }),
});

export const { useGetEmailTemplateQuery } = emailTemplatesApi;
