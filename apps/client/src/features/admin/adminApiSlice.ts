import { apiSlice } from "../../App/API/apiSlice.ts";
import { resType, resUsersArrayType } from "@repo/types";
import { createEntityAdapter, createSelector } from "@reduxjs/toolkit";
import { RootState } from "../../App/store.ts";

const admin_UsersAdapter = createEntityAdapter();
const initialAdmin_UsersState = admin_UsersAdapter.getInitialState();

export const adminApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getUsers: builder.query({
      query: () => ({
        url: "admin/users",
        method: "GET",
      }),
      transformResponse: (response: resType) => {
        const resArray = response.message as resUsersArrayType[];
        const newResponse = resArray.map((singleUser) => {
          singleUser.id = singleUser._id;
          return singleUser;
        });
        return admin_UsersAdapter.setAll(initialAdmin_UsersState, newResponse);
      },
      providesTags: (result) => {
        if (result?.ids) {
          return [
            { type: "User", id: "LIST" },
            ...result.ids.map((id) => ({ type: "User" as const, id })),
          ];
        } else return [{ type: "User", id: "LIST" }];
      },
    }),
    deleteUser: builder.mutation({
      query: ({ id }) => ({
        url: "admin/users",
        method: "DELETE",
        body: { id },
      }),
      invalidatesTags: (arg) => [{ type: "User", id: arg.id }],
    }),
  }),
});

export const { useGetUsersQuery, useDeleteUserMutation } = adminApiSlice;

const selectUsersResult = adminApiSlice.endpoints.getUsers.select("usersList");

const selectUsersData = createSelector(
  selectUsersResult,
  (usersResult) => usersResult.data,
);

export const {
  selectAll: selectAllUsers,
  selectById: selectUserById,
  selectIds: selectUserIds,
} = admin_UsersAdapter.getSelectors<RootState>(
  (state: RootState) => selectUsersData(state) ?? initialAdmin_UsersState,
);
