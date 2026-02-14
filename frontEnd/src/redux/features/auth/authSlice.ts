// auth state

import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { User } from "../users/usersTypes";

type AuthState = {
  userInfo: User | null;
};

const InitialState: AuthState = {
  userInfo: localStorage.getItem("userInfo")
    ? JSON.parse(localStorage.getItem("userInfo")!)
    : null,
};

const authSlice = createSlice({
  name: "auth",
  initialState: InitialState,
  reducers: {
    setCredentials: (state, action: PayloadAction<User | null>) => {
      state.userInfo = action.payload;
      localStorage.setItem("userInfo", JSON.stringify(action.payload));
    },
    logout: (state) => {
      state.userInfo = null;
      localStorage.removeItem("userInfo");
    },
  },
});

export const { setCredentials, logout } = authSlice.actions;
export default authSlice.reducer;
