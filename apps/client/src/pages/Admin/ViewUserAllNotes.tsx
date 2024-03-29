import "../../styles/pages/notes/note.css";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../../App/store.ts";
import { selectUserById } from "../../features/admin/adminApiSlice.ts";
import { resUsersArrayType, errTypo } from "@repo/types";
import { useGetNotesQuery } from "../../features/Note/notesApiSlice.ts";
import Loading from "../../components/Loading.tsx";
import { ownSelector } from "../../features/Note/selector.ts";
import SingleNoteRow from "../Notes/SingleNoteRow.tsx";

const ViewUserAllNotes = () => {
  const { userId } = useParams();
  // console.log(userId)

  const user = useSelector((state: RootState) =>
    selectUserById(state, String(userId)),
  ) as resUsersArrayType;

  const { isSuccess, isLoading, isError, error } = useGetNotesQuery(
    user.email,
    {
      pollingInterval: 15000,
      refetchOnFocus: true,
      refetchOnMountOrArgChange: true,
    },
  );

  const { selectNoteIds } = ownSelector(user.email);
  const ids = useSelector((state: RootState) => selectNoteIds(state));

  let content;

  if (isSuccess) {
    const tableContent =
      ids?.length &&
      ids.map((noteId) => (
        <SingleNoteRow key={noteId} noteId={noteId} email={user.email} />
      ));
    if (ids.length === 0) {
      content = <p>No Users Notes</p>;
    } else {
      content = <div className={"note-list"}>{tableContent}</div>;
    }
  } else if (isLoading) {
    content = <Loading />;
  } else if (isError) {
    const err = error as errTypo;
    content = err?.data?.message;
  }
  return content;
};
export default ViewUserAllNotes;
