
import type {RootState} from "../store.ts";
import { fetchBaseQuery } from '@reduxjs/toolkit/query'
import type {BaseQueryFn, FetchArgs,FetchBaseQueryError,} from '@reduxjs/toolkit/query/react'
// import {setCredential,logOut} from '../../features/auth/authSlice.ts'
import {createApi} from "@reduxjs/toolkit/query/react";

const baseQuery = fetchBaseQuery({
    baseUrl:'http://localhost:3500/api/v1/',
    credentials:'include',
    prepareHeaders:(headers:Headers,{getState})=>{
        const token:string|null = (getState() as RootState).auth.token
        if(token){
            headers.set("authorization",`Bearer ${token}`)
        }
        return headers
    }
});

const baseQueryWithReauth: BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError> = async (args, api, extraOptions) => {
    const result = await baseQuery(args, api, extraOptions)
    console.log(result);
    // if (result.error && result.error.status === 401) {

        // try to get a new token
        // const refreshResult = await baseQuery('/refreshToken', api, extraOptions)
        // if (refreshResult.data) {
        //     // store the new token
        //     // api.dispatch(tokenReceived(refreshResult.data))
        //     // retry the initial query
        //     result = await baseQuery(args, api, extraOptions)
        // } else {
        //     api.dispatch(loggedOut())
        // }
    // }
    return result
}


export const apiSlice = createApi({
    baseQuery:baseQueryWithReauth,
    tagTypes:['Note','User'],
    endpoints:() => ({})
})
