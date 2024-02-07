import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface initialAuthState {
    token: string | null;
}

const authSlice = createSlice({
    name: "auth",
    initialState: { token: null } as initialAuthState,
    reducers: {
        setCredential: (state, action: PayloadAction<{ accessToken: string }>):void => {
            const { accessToken} = action.payload;
            state.token = accessToken;
        },
        logOut:(state)=>{
            state.token = null;
        }
    },
});

export const { setCredential,logOut} = authSlice.actions;
export default authSlice.reducer;
export const selectCurrentToken = (state:{auth:initialAuthState})=>state.auth.token;
