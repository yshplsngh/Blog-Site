import type { RootState } from "../store.ts";
import { BaseQueryApi, fetchBaseQuery } from "@reduxjs/toolkit/query";
import type {
  BaseQueryFn,
  FetchArgs,
  FetchBaseQueryError,
} from "@reduxjs/toolkit/query/react";
import { createApi } from "@reduxjs/toolkit/query/react";
import { MessageResponse } from "@repo/types";
import {
  logOut,
  resetError,
  setCredential,
} from "../../features/auth/authSlice.ts";

const baseQuery = fetchBaseQuery({
  baseUrl: "http://localhost:3500/api/v1/",
  credentials: "include",
  prepareHeaders: (headers: Headers, { getState }) => {
    const token: string | null = (getState() as RootState).auth.token;
    if (token) {
      headers.set("authorization", `Bearer ${token}`);
    }
    return headers;
  },
});

const baseQueryWithReAuth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args: string | FetchArgs, api: BaseQueryApi, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions);
  console.log(result);
  if (result.error && result?.error?.status == 403) {
    console.log("send refreshing route");
    const refreshResult = await baseQuery("auth/refresh", api, extraOptions);
    console.log(refreshResult);
    const fixRefreshResult = refreshResult.data
      ? { data: refreshResult.data as MessageResponse }
      : { error: refreshResult.error as FetchBaseQueryError };
    // console.log(fixRefreshResult);
    if (fixRefreshResult.data) {
      api.dispatch(setCredential(fixRefreshResult.data.message));
      result = await baseQuery(args, api, extraOptions);
    } else {
      console.log("wrong refresh");
      api.dispatch(logOut());
      api.dispatch(resetError());
      return fixRefreshResult;
    }
  }
  return result;
};

export const apiSlice = createApi({
  baseQuery: baseQueryWithReAuth,
  tagTypes: ["Note", "User"],
  endpoints: () => ({}),
});
