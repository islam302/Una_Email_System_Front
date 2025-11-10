import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { RootState as AppRootState } from "../../store";

interface GroupList {
  id: string;
  name: string;
  recipient_lists: string[];
}

export const groupListsApi = createApi({
  reducerPath: "groupListsApi",
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
    getGroupLists: builder.query<GroupList[], void>({
      query: () => "recipients/recipient-groups/",
    }),
  }),
});

export const { useGetGroupListsQuery } = groupListsApi;
