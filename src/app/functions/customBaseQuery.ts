/* eslint-disable @typescript-eslint/no-explicit-any */
import { fetchBaseQuery, BaseQueryFn } from "@reduxjs/toolkit/query/react";
import { FetchArgs } from "@reduxjs/toolkit/query";
import { toast } from "react-fox-toast";
import { logout, refreshAccessTokenThunk } from "./auth";

const customBaseQuery: BaseQueryFn<
  string | FetchArgs,
  unknown,
  unknown
> = async (args, api, extraOptions) => {
  const { getState, dispatch } = api;
  const state = getState() as any;
  const { access } = state.auth;

  const baseQuery = fetchBaseQuery({
    baseUrl: import.meta.env.VITE_BASE_URL,
    prepareHeaders: (headers) => {
      if (access) {
        headers.set("Authorization", `Bearer ${access}`);
      }
      return headers;
    },
  });

  // If `args` is a string, wrap it in an object to make it compatible
  const argsAsObject = typeof args === "string" ? { url: args } : args;

  // Make the API request
  let result = await baseQuery(argsAsObject, api, extraOptions);

  if (result.error && result.error.status === 401) {
    // console.log("Token expired or invalid. Attempting refresh...");
    dispatch(logout());

    // Attempt to refresh the token
    const refreshResult = await dispatch(refreshAccessTokenThunk());

    if (refreshResult.meta.requestStatus === "fulfilled") {
      const newToken = (getState() as any).auth.access;
      // console.log((getState() as any).auth.access === newToken);

      if (newToken) {
        // console.log("Token refreshed. Retrying original request...");
        // Retry the original request with the new token
        result = await baseQuery(
          {
            ...argsAsObject,
            headers: {
              ...argsAsObject.headers,
              Authorization: `Bearer ${newToken}`,
            },
          },
          api,
          extraOptions
        );
      }
    } else {
      // If refresh failed, log out the user
      // console.log("Refresh token failed. Logging out...");
      dispatch(logout());
    }
  }
  if (result.error && result.error.status === 400) {
    const errorsObj = result?.error?.data as { [key: string]: string[] };
    const resultError = Object.keys(errorsObj).map((key) => [
      `${key} ${errorsObj[key]}`,
    ]);
    resultError.forEach((element) => {
      toast.error(element[0]);
    });
  }

  return result;
};

export default customBaseQuery;
