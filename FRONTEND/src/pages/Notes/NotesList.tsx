import useTitle from "../../hooks/useTitle.ts";
import {useGetNotesQuery} from "../../features/Note/notesApiSlice.ts";
import Loading from "../../components/Loading.tsx";
import {errTypo} from "../../Types/feature.auth.ts";
import SingleNoteRow from "./SingleNoteRow.tsx";
import '../../styles/pages/notes/note.css'
const NotesList = () => {
    useTitle('Notes List')

    const {
        data: notes,
        isLoading,
        isSuccess,
        isError,
        error
    } = useGetNotesQuery('notesList', {
        pollingInterval: 15000,
        refetchOnFocus: true,
        refetchOnMountOrArgChange: true
    })

    let content
    if (isLoading) {
        return <Loading/>
    }

    let errData
    if (isError) {
        const err = error as errTypo
        errData = <p>{err?.data?.message}</p>
    }

    if (isSuccess) {
        const {ids} = notes

        // typecast to array
        const filteredIds = [...ids]
        const tableContent = ids?.length &&
            filteredIds.map(noteId => <SingleNoteRow key={noteId} noteId={noteId}/>)

        if(filteredIds.length===0){
            return <p>You have currently no Notes</p>
        }
        content = (
            <div className={'note-list'}>
                <p>{errData}</p>
                {tableContent}
            </div>
        )
    }else{
        return <Loading/>
    }
    return content
}

export default NotesList