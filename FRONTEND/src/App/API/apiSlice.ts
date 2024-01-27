//incompelete

import {fetchBaseQuery} from "@reduxjs/toolkit/query";
import type {RootState} from "../store.ts";


const baseQuery = fetchBaseQuery({
    baseUrl:'http://localhost:3500/api/v1/',
    credentials:'include',
    prepareHeaders:(headers:Headers,{getState})=>{
        const token = (getState() as RootState).auth.token

        if(token){
            headers.set("authorization",`Bearer ${token}`)
        }
        return headers
    }
});

export default baseQuery;