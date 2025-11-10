import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../store";
import axios, { AxiosError } from "axios";

export interface User {
  username: string;
  organization: string;
  email: string;
  role: string;
  remaining_quota: number;
}

interface AuthState {
  user: User | null;
  access: string | null;
  refresh: string | null;
}

const initialState: AuthState = {
  user: localStorage.getItem("user")
    ? JSON.parse(localStorage.getItem("user") ?? "")
    : null,
  access: localStorage.getItem("access")
    ? localStorage.getItem("access")
    : null,
  refresh: localStorage.getItem("refresh")
    ? localStorage.getItem("refresh")
    : null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loginSuccess: (state, action: PayloadAction<AuthState>) => {
      const { user, access, refresh } = action.payload;
      state.user = user;
      state.access = access;
      state.refresh = refresh;

      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("access", `${access}`);
      localStorage.setItem("refresh", `${refresh}`);
    },
    logout: (state) => {
      state.user = null;
      state.access = null;
      state.refresh = null;

      localStorage.clear();
    },
    updateAccessToken: (state, action: PayloadAction<string>) => {
      state.access = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(refreshAccessTokenThunk.fulfilled, (state, action) => {
      state.access = action.payload.access;
      localStorage.setItem("access", action.payload.access);
    });
  },
});

export const refreshAccessTokenThunk = createAsyncThunk(
  "auth/refreshToken",
  async (_, { rejectWithValue, getState }) => {
    try {
      const state = getState() as { auth: AuthState };
      const response = await axios.post(
        "https://una-email-system-yvky.onrender.com/auth/token/refresh/",
        {
          refresh: state.auth.refresh,
        }
      );

      localStorage.setItem("access", response.data.access);
      return response.data; // Assuming the new token is in response.data
    } catch (error) {
      return rejectWithValue((error as AxiosError).response?.data);
    }
  }
);

export const { loginSuccess, logout, updateAccessToken } = authSlice.actions;
export const authSelector = (state: RootState) => state.auth;
export const authReducer = authSlice.reducer;
export default authSlice.reducer;
