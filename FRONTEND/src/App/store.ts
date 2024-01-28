//incompelete

import { configureStore } from '@reduxjs/toolkit'
import {setupListeners} from "@reduxjs/toolkit/query";
import authReducer from "../features/auth/authSlice";
import {apiSlice} from "./API/apiSlice.ts";


const store = configureStore({
    reducer: {
        auth:authReducer,
        [apiSlice.reducerPath]:apiSlice.reducer,
    },
    middleware:getDefaultMiddleware => getDefaultMiddleware().concat(apiSlice.middleware),
    devTools:true
})

export type RootState = ReturnType<typeof store.getState>

setupListeners(store.dispatch)
