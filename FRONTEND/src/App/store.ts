//incompelete

import { configureStore } from '@reduxjs/toolkit'
import {setupListeners} from "@reduxjs/toolkit/query";
import authReducer from "../features/auth/authSlice";

const store = configureStore({
    reducer: {
        auth:authReducer
    },
    middleware:getDefaultMiddleware => getDefaultMiddleware().concat(),
    devTools:true
})

export type RootState = ReturnType<typeof store.getState>

setupListeners(store.dispatch)
