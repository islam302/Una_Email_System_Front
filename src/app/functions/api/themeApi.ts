import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { RootState as AppRootState } from "../../store";

interface Theme {
  id: string;
  name: string;
  primary_color: string;
  secondary_color: string;
  accent_color: string;
  is_active?: boolean;
}

export const themeApi = createApi({
  reducerPath: "themeApi",
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
  tagTypes: ["Theme"],
  endpoints: (builder) => ({
    getThemes: builder.query<Theme[], void>({
      query: () => "control/theme/",
      providesTags: ["Theme"],
    }),
    getActiveTheme: builder.query<Theme, void>({
      query: () => "control/theme",
      providesTags: ["Theme"],
    }),
    addTheme: builder.mutation<Theme, Partial<Theme>>({
      query: (newTheme) => ({
        url: "control/theme/",
        method: "POST",
        body: newTheme,
      }),
      invalidatesTags: ["Theme"],
    }),
    updateTheme: builder.mutation<Theme, { id: string; data: Partial<Theme> }>({
      query: ({ id, data }) => ({
        url: `control/theme/${id}/`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["Theme"],
    }),
    deleteTheme: builder.mutation<void, string>({
      query: (id) => ({
        url: `control/theme/${id}/`,
        method: "DELETE",
      }),
      invalidatesTags: ["Theme"],
    }),
    activateTheme: builder.mutation<void, string>({
      query: (id) => ({
        url: `control/theme/${id}/activate/`,
        method: "POST",
      }),
      invalidatesTags: ["Theme"],
    }),
  }),
});

export const {
  useGetThemesQuery,
  useGetActiveThemeQuery,
  useAddThemeMutation,
  useUpdateThemeMutation,
  useDeleteThemeMutation,
  useActivateThemeMutation,
} = themeApi;
