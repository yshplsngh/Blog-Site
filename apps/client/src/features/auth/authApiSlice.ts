import { apiSlice } from "../../App/API/apiSlice.ts";
import { logOut, resetError, setCredential } from "./authSlice.ts";

export const authApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (credentials) => ({
        url: "auth/login",
        method: "POST",
        body: { ...credentials },
      }),
    }),

    signup: builder.mutation({
      query: (initialUserData) => ({
        url: "/auth/signup",
        method: "POST",
        body: { ...initialUserData },
      }),
    }),

    refresh: builder.mutation({
      query: () => ({
        url: "auth/refresh",
        method: "GET",
      }),
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          console.log("refsre" + arg);
          const { data } = await queryFulfilled;
          const accessToken = data.message.accessToken;
          dispatch(setCredential({ accessToken }));
        } catch (err) {
          console.log(err + "refresh");
        }
      },
    }),

    sendLogOut: builder.mutation({
      query: () => ({
        url: "/auth/logOut",
        method: "POST",
      }),
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
          dispatch(logOut());
          dispatch(resetError());
          setTimeout(() => {
            dispatch(apiSlice.util.resetApiState());
          }, 1000);
        } catch (err) {
          console.log(err);
        }
      },
    }),
  }),
});

export const { useLoginMutation, useSignupMutation, useSendLogOutMutation } =
  authApiSlice;
