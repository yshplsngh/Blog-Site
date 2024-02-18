import {selectNoteById, useDeleteNoteMutation} from "../../features/Note/notesApiSlice.ts";
import {useSelector} from "react-redux";
import {RootState} from "../../App/store.ts";
import {resNotesArrayType} from "../../Types/feature.note.ts";
import {useNavigate} from "react-router-dom";
import {memo} from "react";
import {errTypo} from "../../Types/feature.auth.ts";
import Loading from "../../components/Loading.tsx";

interface ty {
    noteId: string | number;
}

const SingleNoteRow = memo(({noteId}: ty) => {
    const navigate = useNavigate();
    const [deleteNote,
        {isError, error, isLoading}
    ] = useDeleteNoteMutation()

    let errContent:string=''
    const note = useSelector((state: RootState) => selectNoteById(state, String(noteId))) as resNotesArrayType;
    if (note as resNotesArrayType) {
        const created = new Date(note.createdAt).toLocaleString('en-US', {day: 'numeric', month: 'long'});
        const updated = new Date(note.updatedAt).toLocaleString('en-US', {day: 'numeric', month: 'long'});

        const handleEdit = () => navigate(`/dash/notes/edit/${noteId}`);
        const handleView = () => navigate(`/dash/notes/view/${noteId}`);

        if (isError) {
            const err = error as errTypo
            errContent = err.data.message
        }
        if (isLoading) {
            return <Loading/>
        }
        const handleDelete = async () => {
            await deleteNote({id:noteId})
        }
        return (
            <div className={'single-note'}>
                <p className="error-message">{errContent}</p>
                <p className={'note__created'}>created:{created}</p>
                <p className={"note__updated"}>updated:{updated}</p>
                <p className={"note__title"}>title:{note.title}</p>
                <p className={"note__username"}>use email:{note.email}</p>
                <div style={{display: 'flex'}}>
                    <p>
                        <button onClick={handleView}>View note</button>
                    </p>
                    <p>
                        <button onClick={handleEdit}>edit note</button>
                    </p>
                    <p>
                        <button onClick={handleDelete}>Delete note</button>
                    </p>
                </div>
            </div>
        );
    } else return null;
});

export default SingleNoteRow;
