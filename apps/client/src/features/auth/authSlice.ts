import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../../App/store.ts";

export interface initialAuthState {
  token: string | null;
  globalError: string | null;
}

const authSlice = createSlice({
  name: "auth",
  initialState: {
    token: null,
    globalError: null,
  } as initialAuthState,

  reducers: {
    setCredential: (
      state,
      action: PayloadAction<{ accessToken: string }>,
    ): void => {
      const { accessToken } = action.payload;
      state.token = accessToken;
    },
    logOut: (state) => {
      state.token = null;
    },
    setError: (state, action): void => {
      const { errMsg } = action.payload;
      state.globalError = errMsg;
    },
    resetError: (state) => {
      state.globalError = null;
    },
  },
});

export const { setCredential, logOut, setError, resetError } =
  authSlice.actions;

// export const selectCurrentToken = (state:{auth:initialAuthState})=>state.auth.token;
export const selectCurrentToken = (state: RootState) => state.auth.token;
export const selectGlobalError = (state: RootState) => state.auth.globalError;
export default authSlice.reducer;
