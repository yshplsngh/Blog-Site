import { apiSlice } from "../../App/API/apiSlice.ts";
import { resNotesArrayType, resType } from "@repo/types";
import { createEntityAdapter } from "@reduxjs/toolkit";

export const notesAdapter = createEntityAdapter();
export const notesInitialState = notesAdapter.getInitialState();

export const notesApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getNotes: builder.query({
      query: (email) => ({
        url: "note/getAllNotes",
        method: "POST",
        body: { email },
      }),
      transformResponse: (response: resType) => {
        const resArray = response.message as resNotesArrayType[];
        const newResponse = resArray.map((singlePost) => {
          singlePost.id = singlePost._id;
          return singlePost;
        });
        return notesAdapter.setAll(notesInitialState, newResponse);
      },
      providesTags: (result) => {
        if (result?.ids) {
          return [
            { type: "Note", id: "LIST" },
            ...result.ids.map((id) => ({ type: "Note" as const, id })),
          ];
        } else return [{ type: "Note", id: "LIST" }];
      },
    }),
    createNote: builder.mutation({
      query: (initialData) => ({
        url: "note/createNote",
        method: "POST",
        body: { ...initialData },
      }),
      invalidatesTags: () => [{ type: "Note", id: "LIST" }],
    }),
    updateNote: builder.mutation({
      query: (initialNote) => ({
        url: "note/updateNote",
        method: "PATCH",
        body: { ...initialNote },
      }),
      invalidatesTags: (arg) => [{ type: "Note", id: arg.id }],
    }),
    deleteNote: builder.mutation({
      query: ({ id }) => ({
        url: "note/deleteNote",
        method: "DELETE",
        body: { id },
      }),
      invalidatesTags: (arg) => [{ type: "Note", id: arg.id }],
    }),
  }),
});

export const {
  useGetNotesQuery,
  useCreateNoteMutation,
  useUpdateNoteMutation,
  useDeleteNoteMutation,
} = notesApiSlice;
