import useTitle from "../../hooks/useTitle.ts";
import {useGetNotesQuery} from "../../features/Note/notesApiSlice.ts";
import Loading from "../../components/Loading.tsx";
import {errTypo} from "../../Types/feature.auth.ts";
import SingleNoteRow from "./SingleNoteRow.tsx";
import '../../styles/pages/notes/note.css'
import {useSelector} from "react-redux";
import {selectGlobalError} from "../../features/auth/authSlice.ts";
import useAuth from "../../hooks/useAuth.ts";
import {RootState} from "../../App/store.ts";
import {ownSelector} from "../../features/Note/selector.ts";

const NotesList = () => {
    useTitle('Notes List')

    const {useAuthEmail: email} = useAuth()
    const {
        isLoading,
        isSuccess,
        isError,
        error
    } = useGetNotesQuery(email,{
        pollingInterval: 15000,
        refetchOnFocus: true,
        refetchOnMountOrArgChange: true
    })

    const {selectNoteIds} = ownSelector(email)

    const ids = useSelector((state:RootState)=>selectNoteIds(state))

    const msg = useSelector(selectGlobalError)
    let content


    if (isSuccess) {
        // const {entities} = notes
        // const filteredNotes = Object.values(entities)

        // const tableContent = ids?.length && filteredNotes.map((SingleNote)=>{
        //     const {email,id:noteId} = SingleNote as resNotesArrayType
        //     return <SingleNoteRow key={noteId} noteId={noteId} email={email}/>
        // })
        const tableContent = ids?.length && ids.map((noteId)=> <SingleNoteRow key={noteId} noteId={noteId} email={email}/>)

        if (ids.length === 0) {
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
    else if (isLoading) {
        content = <Loading/>
    }
    else if(isError) {
        const err = error as errTypo
        content = err?.data?.message
    }
    else{
        content = <h1>Notes found | something went wrong</h1>
    }

    return content
}

export default NotesList