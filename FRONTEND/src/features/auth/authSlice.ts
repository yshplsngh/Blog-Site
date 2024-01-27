import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface AuthState {
    token: string | null;
}

const authSlice = createSlice({
    name: "auth",
    initialState: { token: null } as AuthState,
    reducers: {
        setCredential: (state, action: PayloadAction<{ accessToken: string }>):void => {
            const { accessToken} = action.payload;
            state.token = accessToken;
        },
        logOut: (state):void => {
            state.token = null;
        },
    },
});

export const { setCredential, logOut } = authSlice.actions;
export default authSlice.reducer;
export const selectCurrentToken = (state: { auth: AuthState }) => state.auth.token;
