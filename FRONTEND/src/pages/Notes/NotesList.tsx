import useTitle from "../../hooks/useTitle.ts";
import {
    notesAdapter,
    notesApiSlice,
    notesInitialState,
    useGetNotesQuery
} from "../../features/Note/notesApiSlice.ts";
import Loading from "../../components/Loading.tsx";
import {errTypo} from "../../Types/feature.auth.ts";
import SingleNoteRow from "./SingleNoteRow.tsx";
import '../../styles/pages/notes/note.css'
import {useSelector} from "react-redux";
import {selectGlobalError} from "../../features/auth/authSlice.ts";
import {createSelector, EntityId} from "@reduxjs/toolkit";
import {RootState} from "../../App/store.ts";
import useAuth from "../../hooks/useAuth.ts";

const NotesList = () => {
    useTitle('Notes List')
    const {useAuthEmail: email} = useAuth()
    const {
        isLoading,
        isSuccess,
        isError,
        error
    } = useGetNotesQuery(email, {
        pollingInterval: 15000,
        refetchOnFocus: true,
        refetchOnMountOrArgChange: true
    })

    const selectNotesResult = notesApiSlice.endpoints.getNotes.select(email);
    const selectNotesData = createSelector(
        selectNotesResult,
        (notesResult) => notesResult.data
    )
    const {
        selectIds: selectDummy,
        selectAll: selectAllNotesDummy,
    } = notesAdapter.getSelectors((state: RootState) => selectNotesData(state) ?? notesInitialState)

    const dummy: EntityId[] = useSelector((state: RootState) => selectDummy(state))
    console.log(dummy)
    const dummy2 = useSelector((state: RootState) => selectAllNotesDummy(state))
    console.log(dummy2)

    const msg = useSelector(selectGlobalError)
    let content
    if (isLoading) {
        content = <Loading/>
    }

    if (isError) {
        const err = error as errTypo
        content = err?.data?.message
    }

    if (isSuccess) {
        // const {ids} = notes

        // typecast to array
        // const filteredIds = [...ids]

        const tableContent = dummy?.length &&
            dummy.map(noteId => <SingleNoteRow key={noteId} noteId={noteId}/>)

        if (dummy.length === 0) {
            content = <p>You have currently no Notes</p>
        } else {
            content = (
                <div className={'note-list'}>
                    <p className="error-message">{msg}</p>
                    {tableContent}
                </div>
            )
        }

    }
    return content
}

export default NotesList