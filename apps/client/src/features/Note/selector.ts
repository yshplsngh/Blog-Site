import { createSelector } from "@reduxjs/toolkit";
import { RootState } from "../../App/store.ts";
import {
  notesAdapter,
  notesApiSlice,
  notesInitialState,
} from "./notesApiSlice.ts";

export const ownSelector = (email: string) => {
  console.log(email);
  const selectNotesResult = notesApiSlice.endpoints.getNotes.select(email);

  const selectNotesData = createSelector(
    selectNotesResult,
    (notesResult) => notesResult.data,
  );
  const {
    selectAll: selectAllNotes,
    selectById: selectNoteById,
    selectIds: selectNoteIds,
  } = notesAdapter.getSelectors(
    (state: RootState) => selectNotesData(state) ?? notesInitialState,
  );

  return { selectAllNotes, selectNoteById, selectNoteIds };
};
