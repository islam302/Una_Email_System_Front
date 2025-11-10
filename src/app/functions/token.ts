import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { IToken } from "../../interfaces";
import { RootState } from "../store";
import Cookies from "universal-cookie";

interface TokenState {
  access: string | null;
  username: string | null;
  role: string | null;
}

const cookie = new Cookies();

const initialState: TokenState = {
  access: cookie.get("userLoggedES")?.access || null,
  username: cookie.get("userLoggedES")?.username || null,
  role: cookie.get("userLoggedES")?.role || null,
};

const tokenSlice = createSlice({
  name: "token",
  initialState,
  reducers: {
    setToken: (state, action: PayloadAction<IToken>) => {
      state.access = action.payload.access;
      state.username = action.payload.username;
      state.role = action.payload.role;
    },
    clearToken: (state) => {
      state.access = null;
      state.username = null;
      state.role = null;
    },
  },
});

export const { setToken, clearToken } = tokenSlice.actions;

export const tokenSelector = (state: RootState) => state.token;

export default tokenSlice.reducer;
