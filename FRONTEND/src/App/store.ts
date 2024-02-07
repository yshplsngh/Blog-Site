import {persistStore, persistReducer} from 'redux-persist';
import {combineReducers, configureStore} from '@reduxjs/toolkit'
import {setupListeners} from "@reduxjs/toolkit/query";
import authReducer from "../features/auth/authSlice";
import {apiSlice} from "./API/apiSlice.ts";
import storage from 'redux-persist/lib/storage';

const persistConfig = {
    key: 'root',
    storage,
    version:1
}
const rootReducer = combineReducers({
    auth: authReducer,
    [apiSlice.reducerPath]: apiSlice.reducer,
})
const persistedReducer = persistReducer(persistConfig, rootReducer)

export const store = configureStore({
    reducer: persistedReducer,

    middleware: getDefaultMiddleware => getDefaultMiddleware({serializableCheck: false}).concat(apiSlice.middleware),
    devTools: true
})

export type RootState = ReturnType<typeof store.getState>
export const persistor = persistStore(store)
setupListeners(store.dispatch)
